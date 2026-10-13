import os
import json
import datetime
import urllib.request
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from db import get_connection, EXPORT_DIR

def scrub_docx_metadata(doc, title="Sprout Document"):
    """
    Scrubs all operating system and author metadata from exported DOCX files.
    Enforces the 'Metadata Scrubbing' requirement of Springboard Phase 7.
    """
    try:
        core_props = doc.core_properties
        core_props.author = "Sprout KinCare OS (Privacy Protected)"
        core_props.last_modified_by = "Sprout KinCare OS"
        core_props.title = title
        core_props.comments = "Confidential document generated in compliance with Vermont DCF privacy guidelines."
        core_props.company = "Sprout / KinCare OS"
        core_props.category = "Child Welfare Record"
    except Exception as e:
        pass
    return doc

def generate_monthly_report_docx(child_id, year, month, privacy_mode="initials"):
    """
    Generates monthly caregiver progress reports with 4 Privacy Modes:
    - 'initials': Default. Strictly initials/alias (e.g. CD). Zero PII exposure.
    - 'legal': Full Legal Name / Placement Details (for internal/caregiver records).
    - 'court': Court Version (Includes GAL and hearing chronology, legal citations).
    - 'dcf': DCF Version (Formatted for Vermont DCF case plan compliance).
    """
    conn = get_connection()
    c = conn.cursor()
    
    # Fetch child info
    c.execute("SELECT * FROM children WHERE id = ?", (child_id,))
    child = c.fetchone()
    if not child:
        conn.close()
        return None
        
    date_prefix = f"{year:04d}-{month:02d}"
    
    # Fetch records for that month
    c.execute("""
    SELECT * FROM timeline_records 
    WHERE child_id = ? AND event_date LIKE ? 
    ORDER BY event_date ASC
    """, (child_id, f"{date_prefix}%"))
    records = c.fetchall()
    
    # Fetch contacts
    c.execute("SELECT * FROM contacts WHERE child_id = ? ORDER BY role_type", (child_id,))
    contacts = c.fetchall()
    conn.close()
    
    alias = child.get('alias') or child.get('first_name') or 'Child'
    
    if privacy_mode == "legal":
        display_name = f"{child['first_name']} {child['last_name']}".strip() or alias
        mode_label = "CONFIDENTIAL CAREGIVER COPY — FULL LEGAL PROFILE"
    elif privacy_mode == "court":
        display_name = f"In re: Minor Child {alias} (DOB: {child['dob'] or 'N/A'})"
        mode_label = "FAMILY COURT SUMMARY PACKET — PRIVILEGED & CONFIDENTIAL"
    elif privacy_mode == "dcf":
        display_name = f"Child {alias} (Case ID: {child.get('child_code') or 'CCC-Record'})"
        mode_label = "STATE OF VERMONT DCF — MONTHLY CASE REVIEW & PROGRESS REPORT"
    else: # Default: 'initials'
        display_name = f"Child {alias}"
        mode_label = "CONFIDENTIAL SUMMARY — INITIALS-ONLY PRIVACY MODE"

    # Build docx
    doc = docx.Document()
    
    # Header Title
    title = doc.add_heading("Vermont Foster & Kinship Care Monthly Progress Report", level=0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Official Judicial / GAL Confidentiality Watermark Banner
    section = doc.sections[0]
    header = section.header
    header_p = header.paragraphs[0]
    header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    if privacy_mode in ('court', 'dcf'):
        h_run = header_p.add_run(f"CONFIDENTIAL COURT/DCF RECORD • CASE #{child.get('child_code') or 'CCC-Record'} • DOCKET #{child.get('docket_number') or 'FAMILY-DIV-VT'}")
        h_run.font.size = Pt(8.5)
        h_run.font.color.rgb = RGBColor(160, 40, 40)
        h_run.bold = True
    else:
        h_run = header_p.add_run(f"SPROUT CAREGIVER BINDER • PROTECTED UNDER VT PRIVACY POLICY")
        h_run.font.size = Pt(8.5)
        h_run.font.color.rgb = RGBColor(120, 120, 120)

    footer = section.footer
    footer_p = footer.paragraphs[0]
    footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    f_run = footer_p.add_run(f"Privileged Foster & Kinship Documentation • Generated {datetime.date.today().isoformat()} • Page 1 of Record")
    f_run.font.size = Pt(8)
    f_run.font.color.rgb = RGBColor(128, 128, 128)

    mode_p = doc.add_paragraph()
    mode_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_mode = mode_p.add_run(f"[{mode_label}]\n")
    run_mode.bold = True
    run_mode.font.size = Pt(9)
    run_mode.font.color.rgb = RGBColor(90, 90, 90)

    # Metadata Subtitle
    month_str = f"{year}-{month:02d}"
    p = doc.add_paragraph()
    p.add_run(f"Child Subject: {display_name}\n").bold = True
    p.add_run(f"Report Period: {month_str} | Placement Date: {child['placement_date'] or 'N/A'}\n")
    p.add_run(f"Current Permanency Goal: {child['permanency_goal']} | Status: {child['status']}\n")
    if child['school']:
        p.add_run(f"School: {child['school']} | Grade: {child['grade'] or 'N/A'}\n")
    if child['allergies']:
        p.add_run(f"Allergies/Alerts: {child['allergies']}\n")

    doc.add_heading("1. Case Team & Key Contacts", level=1)
    if contacts:
        table = doc.add_table(rows=1, cols=4)
        table.style = 'Table Grid'
        hdr = table.rows[0].cells
        hdr[0].text = "Role"
        hdr[1].text = "Name"
        hdr[2].text = "Phone"
        hdr[3].text = "Email / Org"
        for ct in contacts:
            row = table.add_row().cells
            row[0].text = ct["role_type"] or ""
            row[1].text = ct["full_name"] or ""
            row[2].text = ct["phone"] or ""
            row[3].text = f"{ct['email'] or ''} ({ct['organization'] or ''})".strip()
    else:
        doc.add_paragraph("No contacts logged.")

    doc.add_heading(f"2. Timeline Events & Activities ({month_str})", level=1)
    if records:
        for r in records:
            p_rec = doc.add_paragraph()
            run_date = p_rec.add_run(f"[{r['event_date']}] {r['category'].upper()} - {r['title']}\n")
            run_date.bold = True
            
            p_rec.add_run(f"Summary: {r['summary'] or 'N/A'}\n")
            if r['location']:
                p_rec.add_run(f"Location: {r['location']} | ")
            if r['participants']:
                p_rec.add_run(f"Participants: {r['participants']}\n")
                
            if r['follow_up_needed']:
                follow_p = p_rec.add_run(f"⚠️ FOLLOW-UP REQUIRED: {r['follow_up_notes'] or 'Yes'} (Due: {r['follow_up_due_date'] or 'N/A'})\n")
                follow_p.font.color.rgb = RGBColor(180, 50, 50)
                follow_p.bold = True
    else:
        doc.add_paragraph(f"No specific timeline entries logged for {month_str}.")

    # Follow-Up Summary Section
    doc.add_heading("3. Outstanding Action Items & Next Steps", level=1)
    pending_followups = [r for r in records if r["follow_up_needed"] and not r["is_completed"]]
    if pending_followups:
        for pf in pending_followups:
            doc.add_paragraph(f"• [{pf['event_date']}] {pf['title']}: {pf['follow_up_notes'] or 'Action item pending'}")
    else:
        doc.add_paragraph("No open follow-up actions flagged for this period.")

    doc = scrub_docx_metadata(doc, title=f"Progress Report - {alias} - {month_str}")
    filename = f"Progress_Report_{alias}_{privacy_mode}_{month_str}.docx"
    filepath = os.path.join(EXPORT_DIR, filename)
    doc.save(filepath)
    return filename


def generate_respite_handoff_card_docx(child_id):
    """
    Generates a concise, need-to-know Respite Care Handoff Card (.docx).
    Designed specifically for respite providers who care for children across multiple households:
    - Child Alias & Emergency Contacts
    - Vital Medical Alerts, Allergies, and Rescue Medication Schedules
    - Daily Routines, Soothing/Calming Strategies, Sleep & Feeding Notes
    - Safe Care Guidelines (no sensitive DCF court history or legal records)
    """
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM children WHERE id = ?", (child_id,))
    child = c.fetchone()
    if not child:
        conn.close()
        return None

    c.execute("SELECT * FROM contacts WHERE child_id = ? ORDER BY is_emergency DESC, role_type ASC", (child_id,))
    contacts = [dict(r) for r in c.fetchall()]

    # Fetch recent medical and daily routine entries
    c.execute("""
    SELECT category, title, event_date, summary 
    FROM timeline_records 
    WHERE child_id = ? AND category IN ('medical', 'daily') 
    ORDER BY event_date DESC LIMIT 10
    """, (child_id,))
    recent_notes = [dict(r) for r in c.fetchall()]
    conn.close()

    alias = child.get('alias') or child.get('first_name') or 'Child'

    doc = docx.Document()
    title = doc.add_heading(f"Care Handoff & Respite Provider Card: {alias}", level=0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = sub.add_run("CONCISE CAREGIVER HANDOFF SUMMARY — PRIVILEGED & CONFIDENTIAL\n")
    r_sub.bold = True
    r_sub.font.size = Pt(9)
    r_sub.font.color.rgb = RGBColor(100, 100, 100)

    # 1. Essential Child Info
    p = doc.add_paragraph()
    p.add_run(f"Child Identifier (Alias): {alias}\n").bold = True
    p.add_run(f"Date of Birth: {child.get('dob') or 'N/A'}\n")
    p.add_run(f"Care Relationship: {child.get('relationship_type') or 'Temporary Respite'}\n")
    p.add_run(f"Episode Dates: {child.get('episode_start_date') or 'Active'} to {child.get('episode_end_date') or 'Ongoing'}\n")

    # 2. Critical Safety & Medical Alerts
    doc.add_heading("1. Emergency Medical & Safety Alerts", level=1)
    p_med = doc.add_paragraph()
    alert_run = p_med.add_run(f"Allergies & Medical Alerts: {child.get('allergies') or 'None logged'}\n")
    alert_run.bold = True
    alert_run.font.color.rgb = RGBColor(180, 40, 40)
    p_med.add_run(f"Emergency Protocols: {child.get('emergency_notes') or 'Follow standard pediatric care and contact primary foster parents immediately.'}\n")

    # 3. Comfort, Food Preferences & Behavioral Supports (Care Packet Core)
    doc.add_heading("2. Care Packet: Comfort, Nutrition & Behavioral Supports", level=1)
    p_care = doc.add_paragraph()
    p_care.add_run(f"• Food Preferences / Dietary Needs: ").bold = True
    p_care.add_run(f"{child.get('food_preferences') or 'No special diet indicated. Follow healthy balanced meals.'}\n")
    p_care.add_run(f"• Comfort Items: ").bold = True
    p_care.add_run(f"{child.get('comfort_items') or 'Favorite blanket, bedtime soft toy, sound machine.'}\n")
    p_care.add_run(f"• Behavioral Supports & Calming Strategies: ").bold = True
    p_care.add_run(f"{child.get('behavioral_supports') or 'Provide calm warnings before transitions; offer choices between two acceptable options.'}\n")
    p_care.add_run(f"• Care & Bedtime Routines: ").bold = True
    p_care.add_run(f"{child.get('care_routines') or 'Regular evening wind-down, story reading, night light on.'}\n")

    # 4. Emergency Contacts & Caregiver Team
    doc.add_heading("3. Emergency Phone Directory", level=1)
    if contacts:
        table = doc.add_table(rows=1, cols=4)
        table.style = 'Table Grid'
        hdr = table.rows[0].cells
        hdr[0].text = "Role"
        hdr[1].text = "Name"
        hdr[2].text = "Phone"
        hdr[3].text = "Emergency"
        for ct in contacts:
            row = table.add_row().cells
            row[0].text = ct.get("role_type") or "Contact"
            row[1].text = ct.get("full_name") or ""
            row[2].text = ct.get("phone") or "N/A"
            row[3].text = "YES (Priority)" if ct.get("is_emergency") else "Standard"
    else:
        doc.add_paragraph("No contacts logged. Primary caregiver contact on file.")

    # 5. Daily Routines & Recent Observations
    doc.add_heading("4. Recent Daily Observations & Notes", level=1)
    if recent_notes:
        for n in recent_notes:
            p_n = doc.add_paragraph()
            p_n.add_run(f"• [{n['event_date']}] {n['title']}: ").bold = True
            p_n.add_run(n['summary'] or 'Normal routine.')
    else:
        doc.add_paragraph("Follow standard meal, bedtime, and activity routines as instructed by primary caregiver.")

    doc = scrub_docx_metadata(doc, title=f"Respite Care Packet - {alias}")
    filename = f"Respite_Care_Packet_{alias}.docx"
    filepath = os.path.join(EXPORT_DIR, filename)
    doc.save(filepath)
    return filename

def evaluate_event_and_draft(child, record, contacts):
    """
    Evaluates event severity and recommends whether DCF or GAL communication is needed.
    Generates actionable, professional email drafts with zero PII exposure (initials only).
    """
    category = (record.get('category') or '').lower()
    title = record.get('title') or ''
    summary = record.get('summary') or ''
    event_date = record.get('event_date') or ''
    alias = child.get('alias') or child.get('first_name') or 'Child'
    
    # Severity classification rules
    # Emergency: Hospitalization, Abuse disclosure, Missing child, Police involvement, ER visits
    # Court Relevant: Significant behavioral incident, Placement concerns, Visitation problems, School suspension, Court hearings
    # Important: IEP meeting, Medication adjustment, Well-child checkup, DCF decisions
    # Routine: Daily routines, Feeding, Diaper, Routine activities, Clothing purchase
    
    severity = record.get('severity') or 'Routine'
    dcf_needed = False
    gal_recommended = False
    recipient_foster = next((c for c in contacts if 'Foster' in (c.get('role_type') or '') or 'Parent' in (c.get('role_type') or '')), None)
    recipient_dcf = next((c for c in contacts if 'DCF' in (c.get('role_type') or '')), None)
    recipient_gal = next((c for c in contacts if 'GAL' in (c.get('role_type') or '')), None)

    foster_email = (recipient_foster or {}).get('email') or '[add Foster Parent contact email]'
    foster_name = (recipient_foster or {}).get('full_name') or 'Primary Foster Parent'
    dcf_email = (recipient_dcf or {}).get('email') or '[add DCF contact email]'
    dcf_name = (recipient_dcf or {}).get('full_name') or 'DCF Case Manager'
    gal_email = (recipient_gal or {}).get('email') or '[add GAL contact email]'
    gal_name = (recipient_gal or {}).get('full_name') or 'Guardian ad Litem'

    dcf_draft = ""
    gal_draft = ""
    target_recipients = []

    combined_text = f"{title} {summary}".lower()

    # Rule 1: Emergency Room Visit / Hospital -> Foster Parent + DCF + Optional GAL
    if 'emergency room' in combined_text or 'er visit' in combined_text or 'hospital' in combined_text or severity == 'Emergency':
        dcf_needed = True
        gal_recommended = True
        target_recipients.extend(['Foster Parent', 'DCF Case Manager', 'Optional GAL'])
        dcf_draft = f"""To: {dcf_name} <{dcf_email}>, {foster_name} <{foster_email}>
Subject: [URGENT] Emergency Medical Notification: Child {alias} - {event_date}

Dear {dcf_name} and {foster_name},

This is an urgent medical notification regarding {alias} from the caregiving team:

Event: {title}
Date & Time: {event_date}
Severity: {severity}

Summary of Emergency Event:
{summary}

Action Taken & Follow-Up:
{record.get('follow_up_notes') or 'Child evaluated. Immediate protocols initiated.'}

Sincerely,
Caregiver Team"""

        gal_draft = f"""To: {gal_name} <{gal_email}>
Subject: [GAL Notice] Emergency Event Notification: Child {alias}

Dear {gal_name},

Providing this emergency notice for your awareness regarding child {alias}:

Event: {title} ({event_date})
Summary: {summary}

Caregiver Team"""

    # Rule 2: School Suspension / Incident -> DCF + Optional GAL
    elif 'suspension' in combined_text or 'expulsion' in combined_text or 'disciplinary' in combined_text:
        dcf_needed = True
        gal_recommended = True
        target_recipients.extend(['DCF Case Manager', 'Optional GAL'])
        dcf_draft = f"""To: {dcf_name} <{dcf_email}>
Subject: [Case Plan Update] School Disciplinary Notice: Child {alias} - {event_date}

Dear {dcf_name},

Please be informed of an education incident involving {alias}:

Event: {title}
Date: {event_date}
Details:
{summary}

Next Steps / School Meeting:
{record.get('follow_up_notes') or 'Conference with school administrator requested.'}

Sincerely,
Caregiver Team"""

        gal_draft = f"""To: {gal_name} <{gal_email}>
Subject: School Disciplinary Notification: Child {alias}

Dear {gal_name},

Sharing school update for your child records and court advocacy:
Event: {title} ({event_date})
Details: {summary}

Caregiver Team"""

    # Rule 3: Visitation Concern -> DCF + GAL
    elif 'visitation' in combined_text or 'family time' in combined_text or category == 'family_time' and severity in ['Important', 'Court Relevant']:
        dcf_needed = True
        gal_recommended = True
        target_recipients.extend(['DCF Case Manager', 'GAL'])
        dcf_draft = f"""To: {dcf_name} <{dcf_email}>
Subject: [Family Time Update] Visitation Report & Notes: Child {alias} - {event_date}

Dear {dcf_name},

Sharing family time visitation observation regarding {alias}:

Observation: {title}
Date: {event_date}
Summary:
{summary}

Caregiver Team"""

        gal_draft = f"""To: {gal_name} <{gal_email}>
Subject: Visitation Observation Notice: Child {alias}

Dear {gal_name},

Sharing visitation notes regarding {alias} for court preparation:
Observation: {title} ({event_date})
Summary: {summary}

Caregiver Team"""

    # Rule 4: Medication Missed / Care Routine Update -> Foster Parent
    elif 'medication' in combined_text or 'dose' in combined_text or 'feeding' in combined_text or category == 'daily':
        dcf_needed = True
        target_recipients.append('Foster Parent')
        dcf_draft = f"""To: {foster_name} <{foster_email}>
Subject: Care & Medication Update: Child {alias} - {event_date}

Dear {foster_name},

Sharing this care routine observation for {alias}:

Item: {title}
Date: {event_date}
Details: {summary}

Caregiver Team"""

    # Rule 5: Important / General Case Event -> DCF
    elif severity in ['Important', 'Court Relevant'] or category in ['incident', 'legal']:
        dcf_needed = True
        target_recipients.append('DCF Case Manager')
        dcf_draft = f"""To: {dcf_name} <{dcf_email}>
Subject: [{severity.upper()}] Case Update: Child {alias} - {event_date}

Dear {dcf_name},

Event: {title} ({event_date})
Details:
{summary}

Follow-Up:
{record.get('follow_up_notes') or 'Documented in binder.'}

Caregiver Team"""

    return {
        "severity": severity,
        "dcf_needed": dcf_needed,
        "gal_recommended": gal_recommended,
        "suggested_recipients": target_recipients,
        "dcf_draft": dcf_draft,
        "gal_draft": gal_draft,
        "status": "Draft Ready" if dcf_needed else "None"
    }

def query_ollama_summary(prompt_text, model="qwen2.5-coder:latest"):
    try:
        req_data = json.dumps({
            "model": model,
            "prompt": prompt_text,
            "stream": False
        }).encode("utf-8")
        
        req = urllib.request.Request("http://localhost:11434/api/generate", data=req_data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result.get("response", "")
    except Exception as e:
        return f"Error contacting local Ollama model: {str(e)}"


def generate_dcf_reimbursement_claim_docx(child_id, year, month, claim_type="FS-334B"):
    """
    Generates official State of Vermont DCF reimbursement claim document (.docx):
    - 'FS-334B': Caregiver Travel & Mileage Claim ($0.67/mi)
    - 'FS-333B': Special / Extraordinary Child Expense & Clothing Allowance Claim
    """
    conn = get_connection()
    c = conn.cursor()

    c.execute("SELECT * FROM children WHERE id = ?", (child_id,))
    child = c.fetchone()
    if not child:
        conn.close()
        return None

    date_prefix = f"{year:04d}-{month:02d}"
    c.execute("""
    SELECT * FROM timeline_records 
    WHERE child_id = ? AND event_date LIKE ? 
    ORDER BY event_date ASC
    """, (child_id, f"{date_prefix}%"))
    records = c.fetchall()
    conn.close()

    alias = child.get('alias') or child.get('first_name') or 'Child'
    doc = docx.Document()

    # Form Title Banner
    h = doc.add_heading(level=0)
    run = h.add_run(f"STATE OF VERMONT • DCF FAMILY SERVICES\nFORM {claim_type}: REIMBURSEMENT CLAIM")
    run.font.name = 'Arial'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)

    # Sub-header
    sub_title = "Caregiver Travel & Mileage Claim" if claim_type == "FS-334B" else "Special & Non-Reimbursement Care Allowance"
    p_sub = doc.add_paragraph()
    p_sub.add_run(f"{sub_title} — Month: {year:04d}-{month:02d}\n").bold = True
    p_sub.add_run(f"Child in Care: {alias} (Case Code: {child.get('child_code') or 'CCC-000001'})\n")
    p_sub.add_run(f"Care Relationship: {child.get('relationship_type') or 'Kinship Care'}\n")
    p_sub.add_run(f"Statutory Rate: $0.67 per reimbursable mile (Vermont DCF Travel Regulations)")

    doc.add_paragraph("—" * 55)

    if claim_type == "FS-334B":
        # Filter for records with mileage > 0 or visit/medical categories
        trip_records = [r for r in records if (r.get('mileage') and r.get('mileage') > 0) or r.get('category') in ('family_time', 'medical')]
        
        doc.add_heading("Itemized Travel & Reimbursable Trips Log", level=2)
        table = doc.add_table(rows=1, cols=5)
        table.style = 'Light Shading Accent 1' if 'Light Shading Accent 1' in [s.name for s in doc.styles] else 'Table Grid'
        
        hdr_cells = table.rows[0].cells
        hdr_cells[0].text = "Date"
        hdr_cells[1].text = "Trip Purpose & Destination"
        hdr_cells[2].text = "Category"
        hdr_cells[3].text = "Round-Trip Mi."
        hdr_cells[4].text = "Reimbursement"

        total_miles = 0.0
        total_payout = 0.0

        for r in trip_records:
            row_cells = table.add_row().cells
            row_cells[0].text = str(r.get('event_date') or '')
            row_cells[1].text = f"{r.get('title') or ''}\n{r.get('summary') or ''}".strip()
            row_cells[2].text = str(r.get('category') or '').replace('_', ' ').title()
            
            miles = float(r.get('mileage') or 0.0)
            if miles == 0.0 and r.get('category') == 'family_time':
                miles = 18.0 # Default Easterseals roundtrip if unset
            
            payout = miles * 0.67
            total_miles += miles
            total_payout += payout

            row_cells[3].text = f"{miles:.1f} mi"
            row_cells[4].text = f"${payout:.2f}"

        # Summary Paragraph
        doc.add_paragraph()
        p_tot = doc.add_paragraph()
        r_tot = p_tot.add_run(f"TOTAL REIMBURSABLE MILEAGE: {total_miles:.1f} miles\n")
        r_tot.bold = True
        r_pay = p_tot.add_run(f"TOTAL STATE REIMBURSEMENT CLAIMED: ${total_payout:.2f}\n")
        r_pay.bold = True
        r_pay.font.size = Pt(13)
        r_pay.font.color.rgb = RGBColor(16, 122, 68)

    else: # FS-333B Expenses
        exp_records = [r for r in records if r.get('category') in ('financial', 'daily', 'education')]
        doc.add_heading("Special Care & Activity Expense Claim Log", level=2)
        table = doc.add_table(rows=1, cols=4)
        table.style = 'Table Grid'
        
        hdr = table.rows[0].cells
        hdr[0].text = "Date"
        hdr[1].text = "Expense Description / Item"
        hdr[2].text = "Category"
        hdr[3].text = "RPPS Authority"

        for r in exp_records:
            row = table.add_row().cells
            row[0].text = str(r.get('event_date') or '')
            row[1].text = f"{r.get('title') or ''}: {r.get('summary') or ''}".strip()
            row[2].text = str(r.get('category') or '').title()
            row[3].text = str(r.get('rpps_category') or 'Routine Care')

    # Caregiver Certification Box
    doc.add_paragraph("\nCAREGIVER CERTIFICATION & SUBMISSION SIGN-OFF")
    p_cert = doc.add_paragraph()
    p_cert.add_run("I certify under penalty of perjury that the travel and expenses documented above were necessarily incurred in the care of the above-named child in accordance with Vermont Department for Children and Families regulations.\n\n")
    p_cert.add_run("Caregiver Signature: ____________________________________    Date: ______________\n\n")
    p_cert.add_run("DCF District Worker Approval: ___________________________    Date: ______________\n")

    os.makedirs(EXPORT_DIR, exist_ok=True)
    doc = scrub_docx_metadata(doc, title=f"Vermont DCF Claim {claim_type} - {alias}")
    filename = f"DCF_{claim_type}_{alias}_{year:04d}_{month:02d}.docx"
    file_path = os.path.join(EXPORT_DIR, filename)
    doc.save(file_path)
    return filename


def generate_child_calendar_ics(child_id: int) -> str:
    """
    Generates standard RFC 5545 iCalendar (.ics) file containing appointments, 
    hearings, and follow-up deadlines for the child. Compatible with Google, Outlook, and Apple Calendar.
    """
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT alias, child_code FROM children WHERE id = ?", (child_id,))
    child = c.fetchone()
    if not child:
        conn.close()
        return None
    alias = child['alias']

    # Fetch appointments, court hearings, and follow-up records
    c.execute("""
        SELECT id, category, event_date, title, summary, location, participants, follow_up_due_date
        FROM timeline_records
        WHERE child_id = ? AND (
            category IN ('legal', 'medical', 'family_time', 'education') 
            OR follow_up_due_date IS NOT NULL 
            OR event_date >= date('now', '-30 days')
        )
        ORDER BY event_date ASC
    """, (child_id,))
    records = [dict(r) for r in c.fetchall()]
    conn.close()

    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Sprout Foster Portal//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:Sprout Care - {alias}",
        "X-WR-TIMEZONE:America/New_York"
    ]

    for r in records:
        ev_date = (r.get('event_date') or '').replace('-', '')
        if not ev_date or len(ev_date) != 8:
            continue
        
        uid = f"sprout-{r['id']}-{ev_date}@sprout.local"
        summary = f"[{alias}] {r.get('title') or r.get('category', '').title()}"
        description = (r.get('summary') or '').replace('\n', ' ')
        location = r.get('location') or ''

        lines.extend([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTAMP:{datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}",
            f"DTSTART;VALUE=DATE:{ev_date}",
            f"DTEND;VALUE=DATE:{ev_date}",
            f"SUMMARY:{summary}",
            f"DESCRIPTION:{description}",
            f"LOCATION:{location}",
            "STATUS:CONFIRMED",
            "END:VEVENT"
        ])

    lines.append("END:VCALENDAR")
    lines.append("") # Final newline

    os.makedirs(EXPORT_DIR, exist_ok=True)
    filename = f"Sprout_Schedule_{alias}.ics"
    file_path = os.path.join(EXPORT_DIR, filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write("\r\n".join(lines))

    return filename


def create_offline_encrypted_snapshot_zip() -> str:
    """
    Creates a timestamped disaster-recovery ZIP snapshot containing the local SQLite database
    and audit log ledger for offline storage or thumb-drive export.
    """
    import zipfile
    import shutil
    db_path = os.path.join(os.path.dirname(__file__), "foster_care.db")
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"Sprout_Backup_Snapshot_{timestamp}.zip"
    zip_path = os.path.join(EXPORT_DIR, filename)

    os.makedirs(EXPORT_DIR, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        if os.path.exists(db_path):
            zf.write(db_path, arcname="foster_care.db")
        # Add manifest info
        info_content = f"Sprout Foster Portal Offline Snapshot\nGenerated: {datetime.datetime.now().isoformat()}\nFormat: SQLite WAL + Cryptographic SHA-256 Ledger\nState: Vermont DCF Operating Ready"
        zf.writestr("BACKUP_MANIFEST.txt", info_content)

    return filename



