import os
import re
import json
import datetime
from bottle import Bottle, request, response, static_file, run, abort
from db import (get_connection, init_db, UPLOAD_DIR, audit, diff_fields,
                verify_audit_chain)
from services import (generate_monthly_report_docx, generate_respite_handoff_card_docx,
                generate_dcf_reimbursement_claim_docx, query_ollama_summary, EXPORT_DIR)

app = Bottle()

PORT = 5858
ALLOWED_HOSTS = {f"127.0.0.1:{PORT}", f"localhost:{PORT}"}
ALLOWED_ORIGINS = {f"http://127.0.0.1:{PORT}", f"http://localhost:{PORT}"}
ALIAS_RE = re.compile(r"^[A-Z][A-Z0-9]{0,3}$")
SEVERITIES = ("Routine", "Important", "Court Relevant", "Emergency")
COMM_STATUSES = ("Sent", "Dismissed", "Draft Ready")
UPLOAD_EXTS = {".pdf", ".docx", ".doc", ".xlsx", ".jpg", ".jpeg", ".png", ".heic",
               ".gif", ".txt", ".mp3", ".m4a", ".wav"}

BASE_DIR = os.path.dirname(__file__)
STATIC_DIR = os.path.join(BASE_DIR, "static")
SHARED_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))


def json_res(data, status=200):
    response.content_type = 'application/json'
    response.status = status
    return json.dumps(data)


def _actor(data=None):
    name = request.headers.get('X-Caregiver') or (data or {}).get('author') or 'Unknown'
    return str(name)[:80]


# --- SECURITY HOOKS (no CORS: only this page may talk to this API) ---
@app.hook('before_request')
def guard_request():
    # Blocks DNS-rebinding: the Host header must be our own local address.
    if (request.headers.get('Host') or '') not in ALLOWED_HOSTS:
        abort(403, "Forbidden host")
    if request.method in ('POST', 'PUT', 'DELETE'):
        origin = request.headers.get('Origin')
        if origin is not None and origin not in ALLOWED_ORIGINS:
            abort(403, "Forbidden origin")


@app.hook('after_request')
def security_headers():
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'no-referrer'
    if request.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    if request.path.startswith('/uploads/'):
        response.headers['Content-Security-Policy'] = 'sandbox'


@app.route('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, root=STATIC_DIR)


@app.route('/uploads/<filename:path>')
def serve_uploads(filename):
    return static_file(filename, root=UPLOAD_DIR)


@app.route('/exports/<filename:path>')
def serve_exports(filename):
    return static_file(filename, root=EXPORT_DIR, download=True)


@app.route('/')
def serve_index():
    return static_file('index.html', root=STATIC_DIR)


# --- CAREGIVER TEAM & SHARED DOCUMENTS API ---
BINDER_CATEGORY_KEYWORDS = {
    'DCF Forms & Plans': ['dcf', 'case plan', 'agreement', 'placement', 'foster', 'form', 'mandate'],
    'Medical & Health': ['medical', 'health', 'immunization', 'doctor', 'pediatric', 'dental', 'allergy'],
    'Court & Legal': ['court', 'hearing', 'order', 'gal', 'legal', 'petition', 'attorney'],
    'Education & School': ['school', 'iep', 'report card', 'grade', 'education', 'teacher', 'enrollment'],
    'Financial & Receipts': ['receipt', 'mileage', 'financial', 'stipend', 'expense', 'invoice', 'copay'],
    'Licensing & Safety': ['license', 'licensing', 'training', 'drill', 'safety', 'fire', 'inspection', 'policy']
}


def _classify_doc_category(filename, folder_name):
    lower_target = f"{filename} {folder_name}".lower()
    for cat, keywords in BINDER_CATEGORY_KEYWORDS.items():
        if any(kw in lower_target for kw in keywords):
            return cat
    return 'General Guides & Resources'


@app.route('/api/shared-docs', method=['GET'])
def get_shared_docs():
    sprout_mode = (request.headers.get('X-Sprout-Mode') or 'local').strip().lower()
    caregiver = (request.headers.get('X-Caregiver') or '').strip()
    is_sample = ('Sample' in caregiver) or (sprout_mode == 'sample')
    
    # ZERO-LEAKAGE PRIVACY ENFORCEMENT:
    # Real disk documents in the OneDrive folder belong ONLY to Candy Chevalier, Robin Davis, and Mallory Wheeler.
    # When in Sample Sandbox mode, real files are completely hidden, returning only fictional sample guide templates.
    if is_sample:
        return json_res([
            {
                "name": "FS-221A_Sample_Foster_Care_Application_Guide.pdf",
                "folder": "Sample Guides & DCF Forms",
                "category": "DCF Forms & Plans",
                "rel_path": "sample/FS-221A_Sample_Guide.pdf",
                "ext": ".pdf"
            },
            {
                "name": "Vermont_Kinship_Caregiver_Resource_Handbook_Sample.pdf",
                "folder": "Sample Guides & DCF Forms",
                "category": "General Guides & Resources",
                "rel_path": "sample/Kinship_Handbook_Sample.pdf",
                "ext": ".pdf"
            },
            {
                "name": "EPSDT_30_Day_Well_Child_Exam_Template.docx",
                "folder": "Sample Medical & Health",
                "category": "Medical & Health",
                "rel_path": "sample/EPSDT_Template.docx",
                "ext": ".docx"
            }
        ])

    folder_filter = request.query.folder
    docs = []
    try:
        for root, dirs, files in os.walk(SHARED_ROOT):
            if 'foster-portal' in root or '.git' in root or 'node_modules' in root:
                continue
            for f in files:
                if f.lower().endswith(('.pdf', '.docx', '.xlsx', '.jpg', '.jpeg', '.png', '.heic', '.txt')):
                    rel = os.path.relpath(os.path.join(root, f), SHARED_ROOT)
                    folder_name = os.path.basename(root) if root != SHARED_ROOT else 'General Guides'
                    cat = _classify_doc_category(f, folder_name)
                    if folder_filter and folder_filter != 'all' and cat != folder_filter:
                        continue
                    docs.append({
                        "name": f,
                        "folder": folder_name,
                        "category": cat,
                        "rel_path": rel.replace('\\', '/'),
                        "ext": os.path.splitext(f)[1].lower()
                    })
    except Exception as e:
        print("Error walking shared folder:", e)
    return json_res(docs)


@app.route('/api/open-doc', method=['POST'])
def open_local_doc():
    sprout_mode = (request.headers.get('X-Sprout-Mode') or 'local').strip().lower()
    caregiver = (request.headers.get('X-Caregiver') or '').strip()
    if ('Sample' in caregiver) or (sprout_mode == 'sample'):
        return json_res({"error": "Opening live personal documents is disabled in Sample Dev Sandbox."}, 403)

    data = request.json or {}
    rel_path = data.get('rel_path', '')
    root = os.path.realpath(SHARED_ROOT)
    full_path = os.path.realpath(os.path.join(root, rel_path))
    if os.path.commonpath([root, full_path]) != root:
        return json_res({"error": "Path not allowed"}, 403)
    if os.path.isfile(full_path):
        os.startfile(full_path)
        return json_res({"success": True})
    return json_res({"error": "File not found"}, 404)


@app.route('/api/households', method=['GET'])
def get_households():
    caregiver = (request.headers.get('X-Caregiver') or '').strip()
    sprout_mode = (request.headers.get('X-Sprout-Mode') or '').strip().lower()
    
    # UNSELECTED GUARD: When opening Sprout fresh or when no caregiver is selected, return zero records
    if not sprout_mode or not caregiver:
        return json_res([])

    is_sample = ('Sample' in caregiver) or (sprout_mode == 'sample')
    
    if not is_sample:
        # Real Working Sphere: Candy, Robin, and Mallory only operate out of 41 Elmwood Dr & 22 East Parkside
        conn = get_connection()
        db_rows = conn.execute("SELECT * FROM households WHERE address LIKE '%Elmwood%' OR address LIKE '%Parkside%' ORDER BY id ASC").fetchall()
        rows = []
        for r in db_rows:
            d = dict(r)
            d['name'] = d.get('label') or d.get('name') or ''
            rows.append(d)
        conn.close()
        return json_res(rows)

    # Sample Caregiver Sandbox:
    # Return the specific synthetic household assigned to the selected sample caregiver
    import sample_dataset as sd
    selected_hh_id = None
    for adm in sd.ADULT_MEMBERS:
        if adm['Name'] in caregiver:
            selected_hh_id = adm['HouseholdID']
            break
    if not selected_hh_id:
        return json_res([])

    sample_hh_list = []
    for h in sd.HOUSEHOLDS:
        if h['HouseholdID'] == selected_hh_id:
            # Gather adult caregivers for this home
            caregivers = [adm for adm in sd.ADULT_MEMBERS if adm['HouseholdID'] == selected_hh_id]
            primary = next((c['Name'] for c in caregivers if c['Role'] == 'Primary Caregiver'), caregivers[0]['Name'] if caregivers else 'Sample Caregiver')
            secondary = next((c['Name'] for c in caregivers if c['Role'] != 'Primary Caregiver'), '')
            
            # Caregiver Journey Model fields
            structure = h.get("HouseholdStructure") or (caregivers[0]['RelationshipCategory'] if caregivers else 'Single Adult')
            stage = h.get("CaregiverStage") or 'Established (1-3 Years)'
            approvals = h.get("Approvals") or lics
            years_dcf = h.get("YearsWorkingWithDCF", 0.0)
            completed_placements = h.get("PlacementsCompleted", 0)
            adoptions = h.get("AdoptionFinalizations", 0)
            certifications = h.get("SpecialCertifications", [])

            sample_hh_list.append({
                "id": int(h['HouseholdID'].replace('HH-', '')),
                "name": f"{h['HouseholdName']} ({h['HouseholdID']})",
                "label": h['HouseholdName'],
                "address": h['Address'],
                "e911_address": h['Address'],
                "mailing_address": h['Address'],
                "status": f"{h['Status']} ({h['Capacity']} Beds: {h['OccupiedBeds']} Placed, {h['OpenBeds']} Open)",
                "license_status": lic_str,
                "primary_caregiver": primary,
                "secondary_caregiver": secondary,
                "home_owner": primary,
                "household_structure": structure,
                "caregiver_stage": stage,
                "approvals": approvals,
                "years_working_with_dcf": years_dcf,
                "placements_completed": completed_placements,
                "adoption_finalizations": adoptions,
                "special_certifications": certifications,
                "notes": f"Structure: {structure} • Stage: {stage} • DCF Tenure: {years_dcf} yrs"
            })

    return json_res(sample_hh_list)


@app.route('/api/households', method=['POST'])
def add_household():
    data = request.json or {}
    name = (data.get('name') or data.get('label') or '').strip()
    if not name:
        return json_res({"error": "Household name or address required."}, 400)
    conn = get_connection()
    try:
        c = conn.cursor()
        c.execute("""
            INSERT INTO households (
                label, address, e911_address, mailing_address, status, license_status, primary_caregiver,
                secondary_caregiver, home_owner, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            name,
            data.get('address', ''),
            data.get('e911_address', data.get('address', '')),
            data.get('mailing_address', data.get('address', '')),
            data.get('status', 'Active Care Residence'),
            data.get('license_status', 'New Application Submitted'),
            data.get('primary_caregiver', 'Candy Chevalier'),
            data.get('secondary_caregiver', ''),
            data.get('home_owner', ''),
            data.get('notes', '')
        ))
        new_id = c.lastrowid
        conn.commit()
    finally:
        conn.close()
    return json_res({"id": new_id, "message": "Household created successfully"})


@app.route('/api/households/<hh_id:int>', method=['PUT'])
def update_household(hh_id):
    data = request.json or {}
    conn = get_connection()
    try:
        fields = ['label', 'address', 'e911_address', 'mailing_address', 'status', 'license_status', 'primary_caregiver', 'secondary_caregiver', 'home_owner', 'notes']
        updates = {}
        if 'name' in data and 'label' not in data:
            data['label'] = data['name']
        for f in fields:
            if f in data:
                updates[f] = data[f]
        if updates:
            sets = ", ".join(f"{k} = ?" for k in updates)
            conn.execute(f"UPDATE households SET {sets} WHERE id = ?", list(updates.values()) + [hh_id])
            conn.commit()
    finally:
        conn.close()
    return json_res({"message": "Household updated successfully"})


# --- COMPLIANCE CHECKLIST API ---
@app.route('/api/compliance', method=['GET'])
def get_compliance_items():
    caregiver = (request.headers.get('X-Caregiver') or '').strip()
    sprout_mode = (request.headers.get('X-Sprout-Mode') or 'local').strip().lower()
    is_sample = ('Sample' in caregiver) or (sprout_mode == 'sample')
    
    if is_sample:
        if not caregiver:
            return json_res([])
        import sample_dataset as sd
        selected_hh_id = None
        for adm in sd.ADULT_MEMBERS:
            if adm['Name'] in caregiver:
                selected_hh_id = adm['HouseholdID']
                break
        if not selected_hh_id:
            selected_hh_id = "HH-101"
        return json_res(sd.SAMPLE_COMPLIANCE.get(selected_hh_id, sd.SAMPLE_COMPLIANCE.get("DEFAULT", [])))

    conn = get_connection()
    rows = [dict(r) for r in conn.execute("SELECT * FROM compliance_items ORDER BY id ASC")]
    conn.close()
    return json_res(rows)


@app.route('/api/compliance/<item_id:int>', method=['PUT'])
def update_compliance_item(item_id):
    data = request.json or {}
    conn = get_connection()
    try:
        fields = ['status', 'completed_date', 'notes']
        updates = {f: data[f] for f in fields if f in data}
        if updates:
            sets = ", ".join(f"{k} = ?" for k in updates)
            conn.execute(f"UPDATE compliance_items SET {sets} WHERE id = ?", list(updates.values()) + [item_id])
            conn.commit()
    finally:
        conn.close()
    return json_res({"message": "Compliance item updated successfully"})


@app.route('/api/reimbursements/summary', method=['GET'])
def get_reimbursement_summary():
    sprout_mode = (request.headers.get('X-Sprout-Mode') or 'local').strip().lower()
    if sprout_mode == 'sample':
        return json_res([
            {"month": "2026-03", "trip_count": 4, "total_miles": 78.5, "estimated_reimbursement": 52.60},
            {"month": "2026-02", "trip_count": 2, "total_miles": 42.0, "estimated_reimbursement": 28.14}
        ])

    conn = get_connection()
    rows = conn.execute("""
        SELECT 
            strftime('%Y-%m', event_date) as month,
            COUNT(*) as trip_count,
            SUM(COALESCE(mileage, 0)) as total_miles,
            SUM(COALESCE(mileage, 0) * 0.67) as estimated_reimbursement
        FROM timeline_records
        WHERE mileage > 0
        GROUP BY month
        ORDER BY month DESC
    """).fetchall()
    conn.close()
    return json_res([dict(r) for r in rows])


# --- PLAN OF SAFE CARE (POSC) API ---
@app.route('/api/children/<child_id:int>/posc', method=['GET'])
def get_child_posc(child_id):
    conn = get_connection()
    posc = conn.execute("SELECT * FROM posc_plans WHERE child_id = ? ORDER BY id DESC LIMIT 1", (child_id,)).fetchone()
    conn.close()
    if not posc:
        return json_res({})
    return json_res(dict(posc))


@app.route('/api/children/<child_id:int>/posc', method=['POST', 'PUT'])
def save_child_posc(child_id):
    data = request.json or {}
    conn = get_connection()
    try:
        existing = conn.execute("SELECT id FROM posc_plans WHERE child_id = ?", (child_id,)).fetchone()
        if existing:
            conn.execute("""
                UPDATE posc_plans SET 
                    infant_specialty_clinic = ?, nurse_home_visiting = ?, cis_contact = ?,
                    help_me_grow_notes = ?, feeding_method = ?, safe_sleep_plan = ?,
                    soothing_techniques = ?, updated_at = CURRENT_TIMESTAMP
                WHERE child_id = ?
            """, (
                data.get('infant_specialty_clinic', ''),
                data.get('nurse_home_visiting', ''),
                data.get('cis_contact', ''),
                data.get('help_me_grow_notes', ''),
                data.get('feeding_method', ''),
                data.get('safe_sleep_plan', ''),
                data.get('soothing_techniques', ''),
                child_id
            ))
        else:
            conn.execute("""
                INSERT INTO posc_plans (
                    child_id, infant_specialty_clinic, nurse_home_visiting, cis_contact,
                    help_me_grow_notes, feeding_method, safe_sleep_plan, soothing_techniques
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                child_id,
                data.get('infant_specialty_clinic', ''),
                data.get('nurse_home_visiting', ''),
                data.get('cis_contact', ''),
                data.get('help_me_grow_notes', ''),
                data.get('feeding_method', ''),
                data.get('safe_sleep_plan', ''),
                data.get('soothing_techniques', '')
            ))
        conn.commit()
    finally:
        conn.close()
    return json_res({"success": True})


# --- BENEFIT CLAIMS & FINANCIAL ASSISTANT API ---
@app.route('/api/children/<child_id:int>/benefits', method=['GET'])
def get_child_benefits(child_id):
    conn = get_connection()
    rows = [dict(r) for r in conn.execute("SELECT * FROM benefit_claims WHERE child_id = ? ORDER BY id ASC", (child_id,))]
    conn.close()
    return json_res(rows)


@app.route('/api/benefits/<claim_id:int>', method=['PUT'])
def update_benefit_claim(claim_id):
    data = request.json or {}
    conn = get_connection()
    try:
        fields = ['status', 'amount_claimed', 'amount_approved', 'decision_date', 'notes']
        updates = {f: data[f] for f in fields if f in data}
        if updates:
            sets = ", ".join(f"{k} = ?" for k in updates)
            conn.execute(f"UPDATE benefit_claims SET {sets} WHERE id = ?", list(updates.values()) + [claim_id])
            conn.commit()
    finally:
        conn.close()
    return json_res({"success": True})


# --- CHINS COURT TIMELINE API ---
@app.route('/api/children/<child_id:int>/chins', method=['GET'])
def get_child_chins(child_id):
    conn = get_connection()
    rows = [dict(r) for r in conn.execute("SELECT * FROM chins_proceedings WHERE child_id = ? ORDER BY id ASC", (child_id,))]
    conn.close()
    return json_res(rows)


# --- CAREGIVER SELF-REGULATION API ---
@app.route('/api/caregiver/self-regulation', method=['GET'])
def get_self_regulation_plan():
    conn = get_connection()
    plan = conn.execute("SELECT * FROM self_regulation_plans ORDER BY id DESC LIMIT 1").fetchone()
    conn.close()
    if not plan:
        return json_res({})
    return json_res(dict(plan))



# --- CHILDREN API ---
CHILD_FIELDS = ['preferred_name', 'dob', 'placement_date', 'gender', 'status',
                'permanency_goal', 'school', 'grade', 'medicaid_number',
                'allergies', 'photo_url', 'emergency_notes',
                'relationship_type', 'episode_status', 'episode_start_date', 'episode_end_date',
                'food_preferences', 'behavioral_supports', 'comfort_items', 'care_routines']


def _derive_alias(data):
    """Prefer an explicit alias; else initials from the supplied first/last. Names are never stored."""
    alias = (data.get('alias') or '').strip().upper().replace('.', '').replace(' ', '')
    if alias:
        return alias
    first = (data.get('first_name') or '').strip()
    last = (data.get('last_name') or '').strip()
    return ((first[:1] + last[:1]).upper().replace('.', ''))


@app.route('/api/children', method=['GET'])
def get_children():
    caregiver = (request.headers.get('X-Caregiver') or '').strip()
    sprout_mode = (request.headers.get('X-Sprout-Mode') or '').strip().lower()

    # UNSELECTED GUARD: When opening Sprout fresh or when no caregiver is selected, return zero records
    if not sprout_mode or not caregiver:
        return json_res([])

    is_sample = ('Sample' in caregiver) or (sprout_mode == 'sample')
    
    if not is_sample:
        # Real Working Sphere (Candy Chevalier, Robin Davis, Mallory Wheeler):
        # NO children currently in care; CD is strictly a Potential Kinship Placement at 41 Elmwood
        conn = get_connection()
        all_rows = [dict(r) for r in conn.execute("SELECT * FROM children WHERE alias = 'CD' ORDER BY alias ASC")]
        conn.close()
        clean_rows = []
        for r in all_rows:
            r.pop('legal_name_enc', None)
            r['status'] = 'Potential Placement (Intake Pending)'
            r['relationship_type'] = 'Potential Kinship Placement'
            r['episode_status'] = 'Intake Pending (Not Yet Placed)'
            clean_rows.append(r)
        return json_res(clean_rows)

    # Sample Caregiver Sandbox:
    # Tie fictional children STRICTLY to the selected sample caregiver's household
    import sample_dataset as sd

    selected_hh_id = None
    for adm in sd.ADULT_MEMBERS:
        if adm['Name'] in caregiver:
            selected_hh_id = adm['HouseholdID']
            break
    
    if not selected_hh_id:
        return json_res([])

    # Find placements in this household
    hh_placements = [p for p in sd.PLACEMENTS if p['HouseholdID'] == selected_hh_id]
    placed_child_ids = [p['ChildID'] for p in hh_placements]

    # Build response records matching this specific household's placed children
    sample_children = []
    for ch in sd.CHILDREN:
        if ch['ChildID'] in placed_child_ids:
            pl = next((p for p in hh_placements if p['ChildID'] == ch['ChildID']), {})
            sample_children.append({
                "id": int(ch['ChildID'].replace('CH-', '')),
                "alias": ch['Initials'],
                "first_name": ch['FullName'].split()[0],
                "last_name": ch['FullName'].split()[-1],
                "preferred_name": f"{ch['FullName']} ({ch['Initials']})",
                "dob": ch['DOB'],
                "gender": ch['Gender'],
                "status": f"Active ({pl.get('PlacementType', 'Foster Care')})",
                "relationship_type": pl.get('PlacementType', 'Foster Care'),
                "episode_status": "Active Episode",
                "permanency_goal": ch['PermanencyGoal'],
                "household_id": selected_hh_id,
                "notes": pl.get('SpecialScenario', '')
            })

    return json_res(sample_children)


@app.route('/api/children', method=['POST'])
def add_child():
    data = request.json or {}
    alias = _derive_alias(data)
    if not ALIAS_RE.match(alias):
        return json_res({"error": "Alias must be 1-4 capital letters/digits (initials, e.g. CD)."}, 400)
    conn = get_connection()
    try:
        hh = conn.execute("SELECT id FROM households ORDER BY id LIMIT 1").fetchone()
        c = conn.cursor()
        c.execute("""
        INSERT INTO children (
            first_name, last_name, alias, household_id, preferred_name, dob, placement_date,
            gender, status, permanency_goal, school, grade, medicaid_number,
            allergies, photo_url, emergency_notes, relationship_type, episode_status,
            episode_start_date, episode_end_date, food_preferences, behavioral_supports,
            comfort_items, care_routines
        ) VALUES (?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            alias, alias, hh['id'] if hh else None,
            data.get('preferred_name') or alias,
            data.get('dob', ''), data.get('placement_date', ''),
            data.get('gender', ''), data.get('status', 'Active Placement'),
            data.get('permanency_goal', 'Reunification'), data.get('school', ''),
            data.get('grade', ''), data.get('medicaid_number', ''),
            data.get('allergies', ''), data.get('photo_url', ''),
            data.get('emergency_notes', ''),
            data.get('relationship_type', 'Primary Placement'),
            data.get('episode_status', 'Active'),
            data.get('episode_start_date', ''),
            data.get('episode_end_date', ''),
            data.get('food_preferences', ''),
            data.get('behavioral_supports', ''),
            data.get('comfort_items', ''),
            data.get('care_routines', '')
        ))
        new_id = c.lastrowid
        c.execute("UPDATE children SET child_code = ? WHERE id = ?", (f"CCC-{new_id:06d}", new_id))
        audit(conn, _actor(data), 'create', 'child', new_id, new_id, {
            "alias": alias,
            "relationship_type": data.get('relationship_type', 'Primary Placement'),
            "episode_status": data.get('episode_status', 'Active')
        })
        conn.commit()
    finally:
        conn.close()
    return json_res({"id": new_id, "message": "Child profile created successfully"})


@app.route('/api/children/<child_id:int>', method=['PUT'])
def update_child(child_id):
    data = request.json or {}
    conn = get_connection()
    try:
        old = conn.execute("SELECT * FROM children WHERE id = ?", (child_id,)).fetchone()
        if not old:
            return json_res({"error": "Child not found"}, 404)
        new = {k: data[k] for k in CHILD_FIELDS if k in data}
        if 'alias' in data:
            alias = str(data['alias']).strip().upper()
            if not ALIAS_RE.match(alias):
                return json_res({"error": "Alias must be 1-4 capital letters/digits."}, 400)
            new['alias'] = alias
            new['first_name'] = alias
        if not new:
            return json_res({"message": "Nothing to update"})
        changes = diff_fields(old, new)
        sets = ", ".join(f"{k} = ?" for k in new)
        conn.execute(f"UPDATE children SET {sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                     list(new.values()) + [child_id])
        if changes:
            audit(conn, _actor(data), 'update', 'child', child_id, child_id, changes,
                  data.get('reason', ''))
        conn.commit()
    finally:
        conn.close()
    return json_res({"message": "Child updated"})


# --- CONTACTS API (contacts are recipients, never users) ---
CONTACT_FIELDS = ['role_type', 'full_name', 'organization', 'phone', 'email',
                  'address', 'is_emergency', 'notes', 'preferred_method']
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _clean_contact(data):
    out = {k: data[k] for k in CONTACT_FIELDS if k in data}
    if 'is_emergency' in out:
        out['is_emergency'] = 1 if out['is_emergency'] else 0
    return out


@app.route('/api/children/<child_id:int>/contacts', method=['GET'])
def get_contacts(child_id):
    conn = get_connection()
    rows = [dict(r) for r in conn.execute(
        "SELECT * FROM contacts WHERE child_id = ? ORDER BY is_emergency DESC, role_type ASC",
        (child_id,))]
    conn.close()
    return json_res(rows)


@app.route('/api/contacts', method=['POST'])
def add_contact():
    data = request.json or {}
    vals = _clean_contact(data)
    if vals.get('email') and not EMAIL_RE.match(vals['email']):
        return json_res({"error": "Email address looks invalid."}, 400)
    conn = get_connection()
    try:
        if not conn.execute("SELECT 1 FROM children WHERE id = ?", (data.get('child_id'),)).fetchone():
            return json_res({"error": "Child not found"}, 404)
        vals.setdefault('role_type', 'Contact')
        cols = ['child_id'] + list(vals)
        c = conn.execute(
            f"INSERT INTO contacts ({', '.join(cols)}) VALUES ({', '.join('?' * len(cols))})",
            [data['child_id']] + list(vals.values()))
        new_id = c.lastrowid
        audit(conn, _actor(data), 'create', 'contact', new_id, data['child_id'],
              {"role": vals.get('role_type'), "name": vals.get('full_name', '')})
        conn.commit()
    finally:
        conn.close()
    return json_res({"id": new_id, "message": "Contact added"})


@app.route('/api/contacts/<contact_id:int>', method=['PUT'])
def update_contact(contact_id):
    data = request.json or {}
    vals = _clean_contact(data)
    if vals.get('email') and not EMAIL_RE.match(vals['email']):
        return json_res({"error": "Email address looks invalid."}, 400)
    conn = get_connection()
    try:
        old = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
        if not old:
            return json_res({"error": "Contact not found"}, 404)
        if not vals:
            return json_res({"message": "Nothing to update"})
        changes = diff_fields(old, vals)
        sets = ", ".join(f"{k} = ?" for k in vals)
        conn.execute(f"UPDATE contacts SET {sets} WHERE id = ?", list(vals.values()) + [contact_id])
        if changes:
            audit(conn, _actor(data), 'update', 'contact', contact_id, old['child_id'], changes)
        conn.commit()
    finally:
        conn.close()
    return json_res({"message": "Contact updated"})


@app.route('/api/contacts/<contact_id:int>', method=['DELETE'])
def delete_contact(contact_id):
    conn = get_connection()
    try:
        old = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
        if not old:
            return json_res({"error": "Contact not found"}, 404)
        conn.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
        audit(conn, _actor(), 'delete', 'contact', contact_id, old['child_id'], dict(old))
        conn.commit()
    finally:
        conn.close()
    return json_res({"message": "Contact deleted"})


# --- TIMELINE & UNIVERSAL RECORDS API ---
RECORD_FIELDS = ['category', 'sub_type', 'title', 'event_date', 'location', 'participants',
                 'summary', 'follow_up_needed', 'follow_up_notes', 'follow_up_due_date',
                 'is_completed', 'severity', 'dcf_draft_text', 'communication_status']
DRAFT_TRIGGERS = ('severity', 'summary', 'title', 'follow_up_needed', 'follow_up_notes')


@app.route('/api/children/<child_id:int>/records', method=['GET'])
def get_records(child_id):
    category = request.query.category
    severity = request.query.severity
    since = request.query.since
    search = request.query.search

    caregiver = (request.headers.get('X-Caregiver') or 'Candy Chevalier').strip()
    sprout_mode = (request.headers.get('X-Sprout-Mode') or 'local').strip().lower()
    is_sample = ('Sample' in caregiver) or (sprout_mode == 'sample')

    if is_sample:
        import sample_dataset as sd
        records = [r for r in sd.SAMPLE_RECORDS if r.get('child_id') == child_id]
        if not records:
            # Fallback for other synthetic children: generic realistic note
            records = [
                {
                    "id": 9000 + child_id,
                    "child_id": child_id,
                    "category": "daily",
                    "sub_type": "Daily Routine",
                    "title": "Positive Daily Routine & Engagement",
                    "event_date": "2026-04-01",
                    "location": "Home",
                    "participants": "Caregiver & Youth",
                    "summary": "Youth completed evening homework routines and bedtime schedules on time with calm transitions.",
                    "follow_up_needed": 0,
                    "follow_up_notes": "",
                    "follow_up_due_date": "",
                    "severity": "Routine",
                    "dcf_draft_generated": 0,
                    "dcf_draft_text": "",
                    "communication_status": "Sent"
                }
            ]
        if category and category != 'all':
            records = [r for r in records if r.get('category') == category]
        if severity and severity != 'all':
            records = [r for r in records if r.get('severity') == severity]
        if search:
            s_low = search.lower()
            records = [r for r in records if s_low in r.get('title', '').lower() or s_low in r.get('summary', '').lower()]
        return json_res(records)

    conn = get_connection()
    query = "SELECT * FROM timeline_records WHERE child_id = ?"
    params = [child_id]
    if category and category != 'all':
        query += " AND category = ?"
        params.append(category)
    if severity and severity != 'all':
        query += " AND severity = ?"
        params.append(severity)
    if since:
        query += " AND event_date >= ?"
        params.append(since)
    if search:
        query += " AND (title LIKE ? OR summary LIKE ? OR participants LIKE ? OR location LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])
    query += " ORDER BY event_date DESC, id DESC"
    rows = [dict(r) for r in conn.execute(query, params)]
    conn.close()
    return json_res(rows)


@app.route('/api/records', method=['POST'])
def add_record():
    data = request.json or {}
    if data.get('severity') and data['severity'] not in SEVERITIES:
        return json_res({"error": "Invalid severity"}, 400)
    conn = get_connection()
    try:
        child = conn.execute("SELECT * FROM children WHERE id = ?", (data.get('child_id'),)).fetchone()
        if not child:
            return json_res({"error": "Child not found"}, 404)
        child = dict(child)
        contacts = [dict(r) for r in conn.execute(
            "SELECT * FROM contacts WHERE child_id = ?", (child['id'],))]

        from services import evaluate_event_and_draft
        eval_res = evaluate_event_and_draft(child, data, contacts)
        actor = _actor(data)

        c = conn.execute("""
        INSERT INTO timeline_records (
            child_id, category, sub_type, title, event_date, location, participants,
            summary, details, follow_up_needed, follow_up_notes, follow_up_due_date,
            attachment_path, attachment_name, severity, author, dcf_draft_generated,
            dcf_draft_text, gal_draft_text, communication_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            child['id'],
            data.get('category', 'daily'), data.get('sub_type', ''),
            data.get('title', 'Entry'), data.get('event_date', ''),
            data.get('location', ''), data.get('participants', ''),
            data.get('summary', ''), json.dumps(data.get('details', {})),
            1 if data.get('follow_up_needed') else 0,
            data.get('follow_up_notes', ''), data.get('follow_up_due_date', ''),
            data.get('attachment_path', ''), data.get('attachment_name', ''),
            eval_res['severity'], actor,
            1 if eval_res['dcf_needed'] else 0,
            eval_res['dcf_draft'], eval_res['gal_draft'], eval_res['status']
        ))
        new_id = c.lastrowid
        audit(conn, actor, 'create', 'record', new_id, child['id'],
              {"title": data.get('title', 'Entry'), "category": data.get('category', 'daily'),
               "severity": eval_res['severity']})
        conn.commit()
    finally:
        conn.close()
    return json_res({"id": new_id, "message": "Timeline record added", "eval_res": eval_res})


@app.route('/api/records/<record_id:int>', method=['PUT'])
def update_record(record_id):
    data = request.json or {}
    if data.get('severity') and data['severity'] not in SEVERITIES:
        return json_res({"error": "Invalid severity"}, 400)
    if data.get('communication_status') and data['communication_status'] not in COMM_STATUSES:
        return json_res({"error": "Invalid communication status"}, 400)
    conn = get_connection()
    try:
        old = conn.execute("SELECT * FROM timeline_records WHERE id = ?", (record_id,)).fetchone()
        if not old:
            return json_res({"error": "Record not found"}, 404)
        new = {k: data[k] for k in RECORD_FIELDS if k in data}
        for k in ('follow_up_needed', 'is_completed'):
            if k in new:
                new[k] = 1 if new[k] else 0

        # Regenerate drafts if the content that drives them changed (never overwrite a sent one)
        trigger = any(k in new and diff_fields(old, {k: new[k]}) for k in DRAFT_TRIGGERS)
        if trigger and old['communication_status'] != 'Sent' and 'dcf_draft_text' not in new:
            child = dict(conn.execute("SELECT * FROM children WHERE id = ?", (old['child_id'],)).fetchone())
            contacts = [dict(r) for r in conn.execute(
                "SELECT * FROM contacts WHERE child_id = ?", (old['child_id'],))]
            merged = dict(old)
            merged.update(new)
            from services import evaluate_event_and_draft
            ev = evaluate_event_and_draft(child, merged, contacts)
            new['dcf_draft_text'] = ev['dcf_draft']
            new['gal_draft_text'] = ev['gal_draft']
            new['dcf_draft_generated'] = 1 if ev['dcf_needed'] else 0
            if old['communication_status'] != 'Dismissed':
                new['communication_status'] = ev['status']

        if not new:
            return json_res({"message": "Nothing to update"})
        changes = diff_fields(old, new)
        sets = ", ".join(f"{k} = ?" for k in new)
        conn.execute(f"UPDATE timeline_records SET {sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                     list(new.values()) + [record_id])
        if changes:
            for k in ('dcf_draft_text', 'gal_draft_text'):
                changes.pop(k, None)  # drafts are derived; keep the log readable
            audit(conn, _actor(data), 'update', 'record', record_id, old['child_id'], changes,
                  data.get('reason', ''))
        conn.commit()
    finally:
        conn.close()
    return json_res({"message": "Record updated successfully"})


@app.route('/api/records/<record_id:int>/comm-status', method=['POST'])
def update_comm_status(record_id):
    data = request.json or {}
    new_status = data.get('status', 'Sent')
    if new_status not in COMM_STATUSES:
        return json_res({"error": "Invalid status"}, 400)
    conn = get_connection()
    try:
        old = conn.execute("SELECT child_id, communication_status FROM timeline_records WHERE id = ?",
                           (record_id,)).fetchone()
        if not old:
            return json_res({"error": "Record not found"}, 404)
        conn.execute("UPDATE timeline_records SET communication_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                     (new_status, record_id))
        audit(conn, _actor(data), 'communication', 'record', record_id, old['child_id'],
              {"communication_status": [old['communication_status'], new_status]})
        conn.commit()
    finally:
        conn.close()
    return json_res({"status": new_status, "message": "Communication status updated"})


@app.route('/api/records/<record_id:int>/toggle-complete', method=['POST'])
def toggle_record_complete(record_id):
    conn = get_connection()
    try:
        row = conn.execute("SELECT child_id, is_completed FROM timeline_records WHERE id = ?",
                           (record_id,)).fetchone()
        if not row:
            return json_res({"error": "Record not found"}, 404)
        new_state = 0 if row["is_completed"] else 1
        conn.execute("UPDATE timeline_records SET is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                     (new_state, record_id))
        audit(conn, _actor(), 'update', 'record', record_id, row['child_id'],
              {"is_completed": [row['is_completed'], new_state]})
        conn.commit()
    finally:
        conn.close()
    return json_res({"is_completed": new_state, "message": "Task status updated"})


@app.route('/api/records/<record_id:int>', method=['DELETE'])
def delete_record(record_id):
    conn = get_connection()
    try:
        old = conn.execute("SELECT * FROM timeline_records WHERE id = ?", (record_id,)).fetchone()
        if not old:
            return json_res({"error": "Record not found"}, 404)
        snapshot = {k: old[k] for k in old.keys()
                    if k not in ('dcf_draft_text', 'gal_draft_text')}
        conn.execute("DELETE FROM timeline_records WHERE id = ?", (record_id,))
        audit(conn, _actor(), 'delete', 'record', record_id, old['child_id'], snapshot)
        conn.commit()
    finally:
        conn.close()
    return json_res({"message": "Record deleted"})


# --- AUDIT API (read-only) ---
@app.route('/api/audit', method=['GET'])
def get_audit():
    try:
        limit = max(1, min(int(request.query.limit or 200), 1000))
    except ValueError:
        limit = 200
    conn = get_connection()
    q = "SELECT id, ts, actor, action, entity, entity_id, child_id, changes, reason FROM audit_log"
    params = []
    if request.query.child_id:
        q += " WHERE child_id = ?"
        params.append(int(request.query.child_id))
    q += " ORDER BY id DESC LIMIT ?"
    params.append(limit)
    rows = [dict(r) for r in conn.execute(q, params)]
    conn.close()
    return json_res(rows)


@app.route('/api/audit/verify', method=['GET'])
def verify_audit():
    conn = get_connection()
    ok, bad = verify_audit_chain(conn)
    conn.close()
    return json_res({"ok": ok, "first_bad_id": bad})


# --- FILE UPLOAD API ---
@app.route('/api/upload', method=['POST'])
def upload_file():
    upload = request.files.get('file')
    if not upload:
        return json_res({"error": "No file uploaded"}, 400)

    safe = re.sub(r"[^A-Za-z0-9._ -]", "_", os.path.basename(upload.raw_filename or "").replace("\\", "/").split("/")[-1])
    safe = safe.strip(" .") or "upload"
    base, ext = os.path.splitext(safe)
    if ext.lower() not in UPLOAD_EXTS:
        return json_res({"error": f"File type '{ext}' is not allowed."}, 400)

    filename = safe
    save_path = os.path.join(UPLOAD_DIR, filename)
    counter = 1
    while os.path.exists(save_path):
        filename = f"{base}_{counter}{ext}"
        save_path = os.path.join(UPLOAD_DIR, filename)
        counter += 1

    upload.save(save_path)
    return json_res({
        "url": f"/uploads/{filename}",
        "filename": filename,
        "message": "File uploaded successfully"
    })


# --- LICENSING & HOME COMPLIANCE API ---
@app.route('/api/licensing', method=['GET'])
def get_licensing():
    caregiver = (request.headers.get('X-Caregiver') or '').strip()
    sprout_mode = (request.headers.get('X-Sprout-Mode') or 'local').strip().lower()
    is_sample = ('Sample' in caregiver) or (sprout_mode == 'sample')

    if is_sample:
        # If no caregiver is selected yet in sandbox, return empty list
        if not caregiver:
            return json_res([])
        return json_res([
            {
                "id": 101,
                "record_type": "Training",
                "title": "VCWTP Module 1: Foundations of Trauma-Informed Foster Care",
                "record_date": "2026-01-20",
                "hours": 6.0,
                "provider": "Vermont Child Welfare Training Partnership",
                "status": "Completed",
                "notes": "Core prerequisite training credit.",
                "expiry_date": "2027-01-20"
            },
            {
                "id": 102,
                "record_type": "Training",
                "title": "VCWTP Module 2: Managing Secondary Traumatic Stress",
                "record_date": "2026-02-15",
                "hours": 3.0,
                "provider": "UVM Child Welfare",
                "status": "Completed",
                "notes": "Caregiver resilience and self-regulation.",
                "expiry_date": "2027-02-15"
            },
            {
                "id": 103,
                "record_type": "Inspection",
                "title": "Annual Fire Safety Evacuation Drill & Smoke Alarm Check",
                "record_date": "2026-03-01",
                "hours": 1.0,
                "provider": "Local Fire Warden",
                "status": "Completed",
                "notes": "Passed all detector tests and 2-exit drill.",
                "expiry_date": "2027-03-01"
            }
        ])

    conn = get_connection()
    rows = [dict(r) for r in conn.execute("SELECT * FROM licensing_records ORDER BY record_date DESC")]
    conn.close()
    return json_res(rows)


@app.route('/api/licensing', method=['POST'])
def add_licensing():
    data = request.json or {}
    conn = get_connection()
    try:
        c = conn.execute("""
        INSERT INTO licensing_records (record_type, title, record_date, hours, provider, status, notes, expiry_date, attachment_path, attachment_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get('record_type', 'Training'),
            data.get('title', ''),
            data.get('record_date', ''),
            float(data.get('hours', 0) or 0),
            data.get('provider', ''),
            data.get('status', 'Completed'),
            data.get('notes', ''),
            data.get('expiry_date', ''),
            data.get('attachment_path', ''),
            data.get('attachment_name', '')
        ))
        new_id = c.lastrowid
        audit(conn, _actor(data), 'create', 'licensing', new_id, None, {"title": data.get('title', '')})
        conn.commit()
    finally:
        conn.close()
    return json_res({"id": new_id, "message": "Licensing record added"})


# --- REPORT GENERATION (WORD DOCX) ---
@app.route('/api/reports/monthly', method=['POST'])
def create_monthly_report():
    data = request.json or {}
    child_id = data.get('child_id')
    year = int(data.get('year', datetime.date.today().year))
    month = int(data.get('month', datetime.date.today().month))
    privacy_mode = data.get('privacy_mode', 'initials')
    if privacy_mode not in ('initials', 'legal', 'court', 'dcf'):
        privacy_mode = 'initials'

    filename = generate_monthly_report_docx(child_id, year, month, privacy_mode)
    if not filename:
        return json_res({"error": "Failed to generate report for child"}, 400)

    return json_res({
        "download_url": f"/exports/{filename}",
        "filename": filename,
        "message": "Monthly report document generated"
    })


@app.route('/api/reports/respite-card', method=['POST'])
def create_respite_card():
    data = request.json or {}
    child_id = data.get('child_id')
    filename = generate_respite_handoff_card_docx(child_id)
    if not filename:
        return json_res({"error": "Failed to generate respite handoff card"}, 400)

    return json_res({
        "download_url": f"/exports/{filename}",
        "filename": filename,
        "message": "Respite care handoff card generated"
    })


@app.route('/api/reports/dcf-claim', method=['POST'])
def create_dcf_claim():
    data = request.json or {}
    child_id = data.get('child_id')
    year = int(data.get('year', datetime.date.today().year))
    month = int(data.get('month', datetime.date.today().month))
    claim_type = data.get('claim_type', 'FS-334B')
    if claim_type not in ('FS-334B', 'FS-333B'):
        claim_type = 'FS-334B'

    filename = generate_dcf_reimbursement_claim_docx(child_id, year, month, claim_type)
    if not filename:
        return json_res({"error": f"Failed to generate {claim_type} claim form"}, 400)

    return json_res({
        "download_url": f"/exports/{filename}",
        "filename": filename,
        "message": f"State of Vermont Form {claim_type} generated"
    })


# --- OLLAMA LOCAL AI SUMMARY ---
@app.route('/api/ai/summarize-period', method=['POST'])
def ai_summarize_period():
    data = request.json or {}
    child_id = data.get('child_id')
    try:
        days = max(1, min(int(data.get('days', 30)), 365))
    except (TypeError, ValueError):
        days = 30
    since = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()

    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM children WHERE id = ?", (child_id,))
    child = c.fetchone()
    if not child:
        conn.close()
        return json_res({"error": "Child not found"}, 404)

    c.execute("""
    SELECT category, sub_type, title, event_date, summary, follow_up_needed, follow_up_notes 
    FROM timeline_records 
    WHERE child_id = ? AND event_date >= ?
    ORDER BY event_date DESC 
    LIMIT 60
    """, (child_id, since))
    events = [dict(r) for r in c.fetchall()]
    conn.close()

    if not events:
        return json_res({"summary": f"No entries were logged for this child in the last {days} days."})

    events_text = "\n".join([
        f"- Date: {e['event_date']} | Type: {e['category'].upper()} ({e['title']})\n  Summary: {e['summary']}\n  Action Required: {e['follow_up_notes'] if e['follow_up_needed'] else 'None'}"
        for e in events
    ])

    prompt = f"""You are an assistant helping a Vermont foster/kinship caregiver summarize their own notes.
Child (initials only): {child['alias'] or child['first_name']}
Current Placement Status: {child['status']}
Goal: {child['permanency_goal']}

Review these entries from the caregiver's binder for the last {days} days:
{events_text}

Write a concise, factual summary that answers:
1. Overview: how the child is doing, based only on the entries above.
2. What happened (medical, education, family time, DCF contacts).
3. What needs follow-up.
4. What is coming next.

Use only information in the entries. Do not add details, diagnoses, or opinions that are not written there. If something is not documented, say it is not documented. Keep a neutral, professional tone suitable for a DCF caseworker."""

    ai_response = query_ollama_summary(prompt)
    return json_res({"summary": ai_response})


# --- COMPLETE NORMALIZED SAMPLE DATASET API FOR TESTING & DEMONSTRATIONS ---
@app.route('/api/sample-dataset', method=['GET'])
def get_full_sample_dataset():
    import sample_dataset as sd
    return json_res({
        "disclaimer": "⚠ SAMPLE DATA ONLY - FOR TRAINING, TESTING, AND DEMONSTRATION PURPOSES. NO REAL INDIVIDUALS ARE REPRESENTED.",
        "households": sd.HOUSEHOLDS,
        "adult_members": sd.ADULT_MEMBERS,
        "licenses": sd.LICENSES,
        "capabilities": sd.CAPABILITIES,
        "children": sd.CHILDREN,
        "placements": sd.PLACEMENTS,
        "validation_matrix": sd.get_validation_matrix(),
        "capacity_report": sd.get_capacity_report(),
        "licensing_summary": sd.get_licensing_summary(),
        "placement_summary": sd.get_placement_type_summary(),
        "program_summary": sd.get_program_participation_summary(),
        "permanency_summary": sd.get_permanency_goal_summary()
    })


if __name__ == "__main__":
    init_db()
    print(f"Serving Caregiver Command Center on http://127.0.0.1:{PORT}")
    run(app, host='127.0.0.1', port=PORT, quiet=False)
