import os
import re
import json
import sqlite3
import datetime
import hashlib

# Child data lives OUTSIDE the OneDrive-synced project folder so it is never
# uploaded to the cloud. Override with the CCC_DATA_DIR environment variable.
DATA_ROOT = os.environ.get("CCC_DATA_DIR") or os.path.join(
    os.environ.get("LOCALAPPDATA") or os.path.expanduser("~"), "CaregiverCommandCenter"
)
DATA_DIR = os.path.join(DATA_ROOT, "data")
UPLOAD_DIR = os.path.join(DATA_ROOT, "uploads")
EXPORT_DIR = os.path.join(DATA_ROOT, "exports")
BACKUP_DIR = os.path.join(DATA_ROOT, "backups")
for _d in (DATA_DIR, UPLOAD_DIR, EXPORT_DIR, BACKUP_DIR):
    os.makedirs(_d, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "foster_binder.db")


def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ---------------------------------------------------------------------------
# Schema migrations
#
# The schema version lives in SQLite's PRAGMA user_version. A brand-new
# database and an upgraded older database both end up with the same schema.
# Before any migration touches an existing database, a backup copy is saved
# to BACKUP_DIR.
# ---------------------------------------------------------------------------

def _has_column(c, table, column):
    return any(r[1] == column for r in c.execute(f"PRAGMA table_info({table})"))


def _add_column(c, table, column, ddl):
    if not _has_column(c, table, column):
        c.execute(f"ALTER TABLE {table} ADD COLUMN {column} {ddl}")


def _migration_1_baseline(c):
    """Original tables plus every column added during the pilot."""
    # Children table
    c.execute("""
    CREATE TABLE IF NOT EXISTS children (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        preferred_name TEXT,
        dob TEXT,
        placement_date TEXT,
        gender TEXT,
        status TEXT DEFAULT 'Active Placement',
        permanency_goal TEXT DEFAULT 'Reunification',
        school TEXT,
        grade TEXT,
        medicaid_number TEXT,
        allergies TEXT,
        photo_url TEXT,
        emergency_notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Contacts table (Tab 2 & Child links)
    c.execute("""
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER,
        role_type TEXT NOT NULL, -- 'DCF Worker', 'GAL', 'CASA', 'Attorney', 'Doctor', 'Therapist', 'Parent', 'Relative', 'School', 'Other'
        full_name TEXT NOT NULL,
        organization TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        is_emergency INTEGER DEFAULT 0,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(child_id) REFERENCES children(id) ON DELETE CASCADE
    )
    """)

    # Universal Timeline & Records Table
    # Single entry maps to categories:
    # 'emergency', 'legal', 'medical', 'behavioral', 'education', 'daily', 'early_childhood',
    # 'communication', 'family_time', 'incident', 'financial', 'belongings', 'life_book', 'teen'
    c.execute("""
    CREATE TABLE IF NOT EXISTS timeline_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        sub_type TEXT,
        title TEXT NOT NULL,
        event_date TEXT NOT NULL,
        location TEXT,
        participants TEXT,
        summary TEXT,
        details TEXT, -- JSON payload for form-specific rich fields
        follow_up_needed INTEGER DEFAULT 0,
        follow_up_notes TEXT,
        follow_up_due_date TEXT,
        is_completed INTEGER DEFAULT 0,
        attachment_path TEXT,
        attachment_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(child_id) REFERENCES children(id) ON DELETE CASCADE
    )
    """)

    # Licensing table (Home-level, not tied to single child)
    c.execute("""
    CREATE TABLE IF NOT EXISTS licensing_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        record_type TEXT NOT NULL, -- 'Training', 'Home Safety', 'Fire Drill', 'Water Test', 'Compliance Checklist'
        title TEXT NOT NULL,
        record_date TEXT NOT NULL,
        hours REAL DEFAULT 0,
        provider TEXT,
        status TEXT DEFAULT 'Completed',
        notes TEXT,
        expiry_date TEXT,
        attachment_path TEXT,
        attachment_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Columns added after the first pilot build (no-ops on an up-to-date DB)
    _add_column(c, "timeline_records", "severity", "TEXT DEFAULT 'Routine'")
    _add_column(c, "timeline_records", "author", "TEXT")
    _add_column(c, "timeline_records", "dcf_draft_generated", "INTEGER DEFAULT 0")
    _add_column(c, "timeline_records", "dcf_draft_text", "TEXT")
    _add_column(c, "timeline_records", "gal_draft_text", "TEXT")
    _add_column(c, "timeline_records", "communication_status", "TEXT DEFAULT 'None'")  # 'None', 'Draft Ready', 'Sent', 'Dismissed'
    _add_column(c, "children", "child_code", "TEXT")


def _initials(*parts):
    out = ""
    for p in parts:
        m = re.search(r"[A-Za-z0-9]", p or "")
        if m:
            out += m.group(0).upper()
    return out


def _migration_2_foundation(c):
    """Households, alias/legal-name split, internal child IDs, audit log."""
    c.execute("""
    CREATE TABLE IF NOT EXISTS households (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)
    c.execute("INSERT INTO households (label) SELECT 'Primary Household' WHERE NOT EXISTS (SELECT 1 FROM households)")

    # alias = the only name shown in the app (initials, e.g. CD).
    # legal_name_enc is reserved for the encrypted legal name; nothing writes
    # to it until encryption is built (phase 9).
    _add_column(c, "children", "alias", "TEXT")
    _add_column(c, "children", "legal_name_enc", "TEXT")
    _add_column(c, "children", "household_id", "INTEGER")

    default_household = c.execute("SELECT MIN(id) FROM households").fetchone()[0]
    c.execute("UPDATE children SET household_id = ? WHERE household_id IS NULL", (default_household,))

    for row in c.execute("SELECT id, first_name, last_name FROM children WHERE alias IS NULL OR alias = ''").fetchall():
        alias = _initials(row[1], row[2]) or "X"
        # Reduce stored names to the alias so no full name is kept in plain text.
        c.execute("UPDATE children SET alias = ?, first_name = ?, last_name = '' WHERE id = ?", (alias, alias, row[0]))

    # Internal child ID. 'VT-001245' was a placeholder copied from the design
    # prompt, not a real identifier, so it is replaced with an internal ID.
    c.execute("""
    UPDATE children SET child_code = printf('CCC-%06d', id)
    WHERE child_code IS NULL OR child_code = '' OR child_code = 'VT-001245'
    """)

    _add_column(c, "contacts", "preferred_method", "TEXT DEFAULT 'email'")

    # Tamper-evident audit log: each row stores a hash chained to the previous row.
    c.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entity_id INTEGER,
        child_id INTEGER,
        changes TEXT,
        reason TEXT,
        prev_hash TEXT,
        row_hash TEXT NOT NULL
    )
    """)
    c.execute("CREATE INDEX IF NOT EXISTS idx_audit_child ON audit_log(child_id, id)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_timeline_child_date ON timeline_records(child_id, event_date)")


def _migration_3_care_relationships(c):
    """Care relationships and care episodes attached to each child profile."""
    # Canonical relationship types:
    # 'Primary Placement', 'Kinship Placement', 'Temporary Respite', 'Emergency Respite', 'Former Placement', 'Inactive Relationship'
    _add_column(c, "children", "relationship_type", "TEXT DEFAULT 'Primary Placement'")
    _add_column(c, "children", "episode_status", "TEXT DEFAULT 'Active'")
    _add_column(c, "children", "episode_start_date", "TEXT")
    _add_column(c, "children", "episode_end_date", "TEXT")
    _add_column(c, "children", "food_preferences", "TEXT")
    _add_column(c, "children", "behavioral_supports", "TEXT")
    _add_column(c, "children", "comfort_items", "TEXT")
    _add_column(c, "children", "care_routines", "TEXT")

    # Migrate legacy labels to canonical categories
    c.execute("UPDATE children SET relationship_type = 'Kinship Placement' WHERE relationship_type = 'Kinship Care'")
    c.execute("UPDATE children SET relationship_type = 'Primary Placement' WHERE relationship_type = 'Foster Care' OR relationship_type IS NULL OR relationship_type = ''")
    c.execute("UPDATE children SET relationship_type = 'Temporary Respite' WHERE relationship_type = 'Respite Care'")
    c.execute("UPDATE children SET relationship_type = 'Emergency Respite' WHERE relationship_type = 'Emergency Placement'")
    c.execute("UPDATE children SET episode_status = 'Active' WHERE episode_status IS NULL OR episode_status = ''")


def _migration_4_households_candy(c):
    """Real caregiver households: 41 Elmwood Dr (Active care residence) & 22 E Parkside (License expired)."""
    _add_column(c, "households", "address", "TEXT")
    _add_column(c, "households", "status", "TEXT DEFAULT 'Active'")
    _add_column(c, "households", "license_status", "TEXT")
    _add_column(c, "households", "primary_caregiver", "TEXT")
    _add_column(c, "households", "secondary_caregiver", "TEXT")
    _add_column(c, "households", "home_owner", "TEXT")

    # Clear old placeholder household and seed Candy's actual homes
    c.execute("DELETE FROM households WHERE label = 'Primary Household' OR label = 'Davis & Chevalier Household'")
    
    # 1. 41 Elmwood Drive, West Berlin VT (Current care residence with Robin Davis & Mallory Wheeler)
    c.execute("""
    INSERT INTO households (label, address, status, license_status, primary_caregiver, secondary_caregiver, home_owner, notes)
    VALUES (
        '41 Elmwood Drive Household',
        '41 Elmwood Dr, West Berlin, VT',
        'Active Care Residence',
        'New Application Submitted',
        'Candy Chevalier',
        'Mallory Wheeler',
        'Robin Davis',
        'Candy residing here for care of incoming child. Mallory Wheeler secondary applicant. Robin Davis household owner and care resource.'
    )
    """)
    active_hh_id = c.lastrowid

    # 2. 22 E Parkside, Barre, VT (Candy's previous licensed home - license expired)
    c.execute("""
    INSERT INTO households (label, address, status, license_status, primary_caregiver, secondary_caregiver, home_owner, notes)
    VALUES (
        '22 E Parkside Residence',
        '22 E Parkside, Barre, VT',
        'Prior Licensed Home',
        'License Expired',
        'Candy Chevalier',
        '',
        'Candy Chevalier',
        'Candy previously licensed here. License expired. May file new form for relicensing as done in the past.'
    )
    """)

    # Link all children to the active 41 Elmwood Drive household
    if active_hh_id:
        c.execute("UPDATE children SET household_id = ? WHERE household_id IS NULL OR household_id = 1", (active_hh_id,))


def _migration_5_caregiver_enhancements(c):
    """Compliance checklist, mileage tracking, RPPS decisions, and kinship pathways."""
    # 1. Compliance items table for VT DCF FS-221A tracking
    c.execute("""
    CREATE TABLE IF NOT EXISTS compliance_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        household_id INTEGER,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        target_date TEXT,
        completed_date TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (household_id) REFERENCES households(id)
    )
    """)

    # 2. Mileage & Reimbursement tracker
    _add_column(c, "timeline_records", "mileage", "REAL DEFAULT 0")
    _add_column(c, "timeline_records", "reimbursement_status", "TEXT DEFAULT 'None'")
    _add_column(c, "timeline_records", "rpps_category", "TEXT")
    _add_column(c, "timeline_records", "rpps_decision", "TEXT")

    # Seed baseline compliance checklist items for 41 Elmwood Drive
    hh = c.execute("SELECT id FROM households WHERE address LIKE '%Elmwood%' LIMIT 1").fetchone()
    hh_id = hh[0] if hh else 2

    existing = c.execute("SELECT COUNT(*) FROM compliance_items WHERE household_id = ?", (hh_id,)).fetchone()[0]
    if existing == 0:
        compliance_tasks = [
            ('Licensure Step', 'Fingerprint Background Checks (90-day deadline)', 'Pending', '2027-01-07', 'Candy Chevalier & Mallory Wheeler scheduled'),
            ('Licensure Step', 'VCIC Criminal Record Check', 'Submitted', '2026-10-09', 'Submitted with FS-221A application'),
            ('Safety Inspection', 'Smoke & CO Detectors Tested on all living floors', 'Completed', '2026-10-09', 'Passed, detectors active on 1st & 2nd floors'),
            ('Safety Inspection', 'Kitchen Fire Extinguisher (ABC-type inspected)', 'Completed', '2026-10-09', 'Present and charged in kitchen'),
            ('Safety Inspection', 'Bedroom 2 Exits Verified & Second Room Setup', 'In Progress', '2026-11-01', 'Room sharing temporary; second room being finished'),
            ('Training', 'VCWTP Pre-Service / Kincare Orientation Hours', 'Completed', '2026-10-10', 'Prior kincare credit + ongoing hours logged'),
            ('Health & Safety', 'Well Water / Environmental Safety Check', 'Pending', '2026-11-15', 'To be reviewed during DCF worker home visit')
        ]
        for cat, title, stat, t_date, notes in compliance_tasks:
            c.execute("""
                INSERT INTO compliance_items (household_id, category, title, status, target_date, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (hh_id, cat, title, stat, t_date, notes))


def _migration_6_vermont_policy_suite(c):
    """Vermont DCF policy suite: Plan of Safe Care (POSC), Benefit Claims, CHINS Court flow, Self-Regulation."""
    # 1. Plan of Safe Care & Early Intervention table
    c.execute("""
    CREATE TABLE IF NOT EXISTS posc_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER NOT NULL,
        infant_specialty_clinic TEXT DEFAULT 'NeoMed Clinic / Community Pediatrics',
        nurse_home_visiting TEXT DEFAULT 'Strong Families Vermont / VNA',
        cis_contact TEXT DEFAULT 'Children''s Integrated Services (CIS) Early Intervention',
        help_me_grow_notes TEXT DEFAULT 'Contact 2-1-1 ext. 6 for developmental milestones',
        feeding_method TEXT DEFAULT 'Enfamil Gentlease 4oz every 3 hrs',
        safe_sleep_plan TEXT DEFAULT 'Alone, on Back, in separate Crib / Bassinet',
        soothing_techniques TEXT DEFAULT 'Swaddle, white noise, rhythmic rocking',
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id)
    )
    """)

    # 2. Benefit Claims & Financial Support table
    c.execute("""
    CREATE TABLE IF NOT EXISTS benefit_claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER,
        benefit_type TEXT NOT NULL,
        amount_claimed REAL DEFAULT 0,
        amount_approved REAL DEFAULT 0,
        status TEXT DEFAULT 'Eligible',
        filed_date TEXT,
        decision_date TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id)
    )
    """)

    # 3. CHINS Juvenile Court Proceedings Flowchart table
    c.execute("""
    CREATE TABLE IF NOT EXISTS chins_proceedings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER NOT NULL,
        stage_name TEXT NOT NULL,
        statutory_timeline TEXT NOT NULL,
        hearing_date TEXT,
        status TEXT DEFAULT 'Upcoming',
        caregiver_report_due TEXT,
        court_docket TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id)
    )
    """)

    # 4. Caregiver Self-Regulation Plan table
    c.execute("""
    CREATE TABLE IF NOT EXISTS self_regulation_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caregiver_name TEXT NOT NULL,
        stress_triggers TEXT,
        warning_signs TEXT,
        calming_strategies TEXT,
        support_contacts TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Seed baseline self-regulation plan for Candy
    c.execute("""
    INSERT INTO self_regulation_plans (caregiver_name, stress_triggers, warning_signs, calming_strategies, support_contacts)
    VALUES (
        'Candy Chevalier',
        'Overlapping medical appointments, unexpected caseworker schedule changes, prolonged infant crying',
        'Tight shoulders, racing thoughts, urge to multi-task frantically',
        'Step outside for 5 deep breaths, tag-team with Mallory or Robin, listen to quiet instrumental music, take a short walk',
        'Robin Davis: (802) 227-2923 | Mallory Wheeler: (802) 595-1457 | VKAP Peer Helpline: (802) 871-5104'
    )
    """)

    # Seed initial benefit eligibility for CD
    ch = c.execute("SELECT id FROM children LIMIT 1").fetchone()
    if ch:
        ch_id = ch[0]
        # Seed POSC for child
        c.execute("INSERT INTO posc_plans (child_id) VALUES (?)", (ch_id,))

        # Seed initial benefit tracking items
        benefits = [
            ('Initial $100 Clothing Voucher', 100.00, 100.00, 'Claimed', '2026-10-10', 'Issued by Barre DCF district office upon placement'),
            ('Family Support Fund (Annual)', 350.00, 0.00, 'Drafting Request', '', 'Annual discretionary fund for non-reimbursed infant bed / gear'),
            ('WIC Infant Formula Benefits', 0.00, 0.00, 'Active', '2026-10-10', 'Monthly formula prescription loaded on Vermont eWIC card'),
            ('Foundations $100 Training Incentive', 100.00, 0.00, 'In Progress', '', 'Eligible upon completing online Foundations pre-service modules'),
            ('ESD Child-Only Reach Up Assistance', 420.00, 0.00, 'Pending ESD Review', '2026-10-11', 'Application submitted to DCF Economic Services Division')
        ]
        for b_type, claimed, approved, stat, f_date, notes in benefits:
            c.execute("""
                INSERT INTO benefit_claims (child_id, benefit_type, amount_claimed, amount_approved, status, filed_date, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (ch_id, b_type, claimed, approved, stat, f_date, notes))

        # Seed CHINS Juvenile Court Proceedings Flowchart for child
        chins_stages = [
            ('72-Hour Temporary Care Hearing', 'Within 72 hrs of custody', '2026-10-14', 'Scheduled', '2026-10-13', 'Emergency custody review hearing'),
            ('15-Day Pre-Trial Conference', 'Within 15 days of petition', '2026-10-28', 'Upcoming', '2026-10-25', 'Status conference with Family Court Judge'),
            ('Merits Hearing', 'Within 60 days of petition', '2026-12-10', 'Pending', '2026-12-01', 'Adjudication on CHINS status'),
            ('Disposition Hearing & Case Plan', 'Within 90 days (30d after merits)', '2027-01-12', 'Pending', '2027-01-05', 'Formal case plan approval and permanency direction')
        ]
        for stage, timeline, h_date, stat, r_due, notes in chins_stages:
            c.execute("""
                INSERT INTO chins_proceedings (child_id, stage_name, statutory_timeline, hearing_date, status, caregiver_report_due, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (ch_id, stage, timeline, h_date, stat, r_due, notes))


MIGRATIONS = [
    (1, _migration_1_baseline),
    (2, _migration_2_foundation),
    (3, _migration_3_care_relationships),
    (4, _migration_4_households_candy),
    (5, _migration_5_caregiver_enhancements),
    (6, _migration_6_vermont_policy_suite),
]


def _backup_before_migration(conn, from_version):
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    dest_path = os.path.join(BACKUP_DIR, f"foster_binder_pre-v{from_version}_{stamp}.db")
    dest = sqlite3.connect(dest_path)
    try:
        conn.backup(dest)
    finally:
        dest.close()
    return dest_path


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.isolation_level = None  # manage transactions explicitly
    try:
        current = conn.execute("PRAGMA user_version").fetchone()[0]
        pending = [(v, fn) for v, fn in MIGRATIONS if v > current]
        if not pending:
            return
        has_data = conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='children'"
        ).fetchone()
        if has_data:
            _backup_before_migration(conn, current)
        for version, fn in pending:
            conn.execute("BEGIN")
            try:
                fn(conn.cursor())
                conn.execute(f"PRAGMA user_version = {int(version)}")
                conn.execute("COMMIT")
            except Exception:
                conn.execute("ROLLBACK")
                raise
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Audit log helpers
# ---------------------------------------------------------------------------

def _norm(v):
    return "" if v is None else str(v)


def diff_fields(old_row, new_values):
    """Return {field: [old, new]} for fields whose value actually changed."""
    changes = {}
    for key, new in new_values.items():
        old = old_row[key] if key in old_row.keys() else None
        if _norm(old) != _norm(new):
            changes[key] = [old, new]
    return changes


def _hash_row(prev_hash, fields):
    payload = json.dumps(fields, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256((prev_hash + payload).encode("utf-8")).hexdigest()


def audit(conn, actor, action, entity, entity_id=None, child_id=None, changes=None, reason=""):
    """Append an audit entry on the caller's connection (commit with the change itself)."""
    ts = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")
    last = conn.execute("SELECT row_hash FROM audit_log ORDER BY id DESC LIMIT 1").fetchone()
    prev_hash = last["row_hash"] if last else ""
    changes_json = json.dumps(changes, sort_keys=True, ensure_ascii=False) if changes else ""
    fields = {
        "ts": ts, "actor": actor, "action": action, "entity": entity,
        "entity_id": entity_id, "child_id": child_id,
        "changes": changes_json, "reason": reason or "",
    }
    row_hash = _hash_row(prev_hash, fields)
    conn.execute(
        """INSERT INTO audit_log (ts, actor, action, entity, entity_id, child_id, changes, reason, prev_hash, row_hash)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (ts, actor, action, entity, entity_id, child_id, changes_json, reason or "", prev_hash, row_hash),
    )


def verify_audit_chain(conn):
    """Return (ok, first_bad_id). Detects edited, deleted, or reordered audit rows."""
    prev_hash = ""
    for r in conn.execute("SELECT * FROM audit_log ORDER BY id ASC"):
        fields = {
            "ts": r["ts"], "actor": r["actor"], "action": r["action"], "entity": r["entity"],
            "entity_id": r["entity_id"], "child_id": r["child_id"],
            "changes": r["changes"] or "", "reason": r["reason"] or "",
        }
        if r["prev_hash"] != prev_hash or r["row_hash"] != _hash_row(prev_hash, fields):
            return False, r["id"]
        prev_hash = r["row_hash"]
    return True, None


if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
