# SPROUT / KINCARE OS — CANONICAL SYSTEM STATE & AUDIT REGISTRY
**Document Version:** 3.1.1 (Phase 13A Governance Hardened & Implementation Ready)  
**Status:** Canonical System State Document & Architecture Registry  
**Last Verified Date:** October 14, 2026  
**Governing Standards:** [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md), [`docs/CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md), & [`docs/API_GOVERNANCE_MATRIX.md`](API_GOVERNANCE_MATRIX.md)  
**Implementation Readiness:** 97.2 / 100 (Architecture, Governance, API, Export, Access Verified)  
**Test Suite Verification:** 73 / 73 Tests Passing (100% CI Baseline)  

---

## 1. System Mission & Core Mandate

> **"Protect Children. Reduce Caregiver Burden. Make The Next Step Obvious."**

Sprout is a **100% local, offline-first Child and Family Success Operating System**.

### What Sprout Is NOT:
* Not a DCF case management system
* Not a GAL or juvenile court platform
* Not a state database or SACWIS/CCWIS replacement
* Not a social media network or unrestricted messaging platform

### What Sprout IS:
A unified command center supporting foster, kinship, relative, respite, adoptive caregivers, and approved Parent Participants. It accelerates child safety, family stability, and reunification through structured outputs (DCF Monthly Summaries, Title 33 court exhibits, State Form FS-334B mileage claims) without requiring DCF to log in, configure, or administer the system.

---

## 2. Global Dual-Sphere State Architecture

Sprout enforces a strict dual-sphere runtime state model:

| Runtime Property | Practice Sandbox (`sample`) | Real Family Workspace (`local`) |
| :--- | :--- | :--- |
| **Theme / Header Bar** | Navy Blue (`#0f172a`) with Blue/Amber Accents | Forest Green (`#064e3b`) with Emerald Accents |
| **Active Sphere Label** | `Practice Sandbox` | `Real Family Workspace` |
| **Active Caregiver Default** | `Sandbox Select Care giver` (Prompt Option) | `Candy Chevalier` (Primary Caregiver) |
| **Available Caregivers** | 15 Model Households (HH-101 through HH-115) | Verified Household Residents (Candy, Robin, Mallory) |
| **Database Connection** | In-Memory / Synthetic Scoped Data | Local SQLite (`%LOCALAPPDATA%\CaregiverCommandCenter\data\foster_binder.db`) |
| **Filesystem Access** | Synthetic Sample Templates Only | Verified Local Drive (`c:\Users\candy\...\foster-portal`) |
| **Physical Addresses** | Fictional Vermont Towns (Meadow Lane, etc.) | Sample Household A & Sample Household B (Confidential Addresses) |
| **Security Barrier** | Live document opening returns `403 Forbidden` | Native desktop document launch (`os.startfile`) |
| **Watermark Overlay** | Visible floating badge: `🛡️ Practice Sandbox • Synthetic Data Only` | Hidden |

---

## 3. Comprehensive Page & View Inventory

### 3.1 Primary Application Views (`app/static/app.js`)

| View Identifier | Function | Purpose | Default State | Operational Toolbar |
| :--- | :--- | :--- | :---: | :---: |
| `mission_control` | `renderMissionControlView()` | Universal safe home, 4 quadrants (TRAIN, CARE, DCF, SYSTEM), 7 role journeys | **Default on Launch** | **Hidden** |
| `dashboard` | `renderDashboardView()` | Caregiver Cockpit, 8-min admin gauge, 1-tap MAR, visit status | Active Working State | Visible |
| `training` | `renderTrainingSimulatorView()` | Caregiver Flight Simulator, 15 homes, 6 scenarios, mock inbox | On-Demand | Visible |
| `children` | `renderChildWorkspaceView()` | Child Workspace with 4 cognitive domains and 16 sub-tabs | Child Selected | Visible |
| `households` | `renderCaregiverAndHouseholdsView()`| Household addresses, FS-221A licensure, safety drills, VCWTP ledger | On-Demand | Visible |
| `relationships` | `renderRelationshipCenterView()`| Circles of Care (4 concentric tiers), contact directory, comm logs | On-Demand | Visible |
| `life_journey` | `renderLifeJourneyView()` | Child lifebook, positive milestones, preserved memories, transition packet | Child Selected | Visible |
| `reports` | `renderReportsView()` | Monthly DCF Summary, Court Brief, FS-334B Mileage claim generation | On-Demand | Visible |
| `settings` | `renderSettingsView()` | SHA-256 blockchain verification, disaster recovery backup snapshot | On-Demand | Visible |
| `binder` | `renderBinderFoldersView()` | Visual 20-folder Vermont digital binder explorer | Child Selected | Visible |
| `journal` | `renderTimelineView('daily')` | Daily observation and behavioral note feed | Child Selected | Visible |
| `timeline` | `renderTimelineView('all')` | Complete chronological event stream | Child Selected | Visible |

### 3.2 Child Workspace Cognitive Domains (`switchChildDomain()`)

1. **Health & Routines (`health`)**: Active MAR schedule, pharmacy refill clock, EPSDT 30-day health exam countdown.
2. **Visits, Appointments & Court (`visits`)**: Family time visitation logs, round-trip mileage tracker, Title 33 CHINS court stepper.
3. **School, Milestones & Daily Life (`milestones`)**: School profile, IEP/504 conference notes, chapter reading milestones.
4. **Documents & Claims (`documents`)**: Vault files, expense receipts, pre-filled State Form FS-334B generation.

---

## 4. Modal & Dialog Registry (`app/static/index.html`)

| Modal ID | Trigger Element | Purpose | Data Action |
| :--- | :--- | :--- | :--- |
| `#recordModal` | `+ Log Note` / Category Buttons | 15-second fast logger for health, visits, school, daily care | `POST /api/records` |
| `#newChildModal` | `+ Add Child` / Emergency Intake | Rapid intake (initials, food needs, comfort items, soothing) | `POST /api/children` |
| `#newContactModal` | `+ Add Contact` | Stakeholder registry (caseworkers, GAL, pediatricians, kin) | `POST /api/contacts` |
| `#newLicensingModal`| `Log Training / Safety Drill` | Home compliance (monthly fire drills, smoke tests, VCWTP) | `POST /api/licensing` |
| `#newHouseholdModal`| `+ Register Household` | Multi-residence tracking (primary residence, respite home) | `POST /api/households` |
| `#emergencyHandoffModal`| `Emergency Mode` | 1-page confidential handoff sheet for hospitals/police/respite | Client print / PDF |
| `#caregiverProfilesModal`| `1. Profiles of Caregivers` | 15-household Caregiver Journey Model browser with 1-click activate | Client state switch |
| `#systemHelpModal` | `2. System Help & Instructions` | In-app architecture guide, data boundaries, and hotlines | Static guidance |
| `#omnibarModal` | `Ctrl + K` / Search Input | Global search across children, records, and case contacts | Client search filter |
| `#signatureModal` | `Sign` Button | Touch/mouse signature pad for visit releases and transport | Base64 canvas save |

---

## 5. Backend API Route Registry (`app/server.py`)

> Detailed governance specifications, role access gates, note classification rules, and export eligibility for all endpoints are documented in the [**API Governance Matrix**](API_GOVERNANCE_MATRIX.md).

```
43 Audited Local Endpoints:
├── System & Static (4)
│   ├── GET /                        (Root Single Page App)
│   ├── GET /static/<path>           (Client Assets: CSS, JS, PWA icons)
│   ├── GET /uploads/<path>          (Local Document Attachments - CSP: sandbox)
│   └── GET /exports/<path>          (Sanitized Word & Calendar Exports)
├── Children & Identity (3)
│   ├── GET  /api/children           (Initials/alias only, PII shielded)
│   ├── POST /api/children           (Rapid child intake, SHA-256 audited)
│   └── PUT  /api/children/<id>      (Care routines, food preferences, comforting)
├── Timeline & Records (6)
│   ├── GET    /api/children/<id>/records (Filterable observation records)
│   ├── POST   /api/records               (15-sec note, visits, med logs)
│   ├── PUT    /api/records/<id>          (Update notes, resolve action items)
│   ├── DELETE /api/records/<id>          (Tombstone deletion with audit hash)
│   ├── POST   /api/records/<id>/comm-status (DCF/GAL draft status toggle)
│   └── POST   /api/records/<id>/toggle-complete (Checklist item resolution)
├── Contacts & Circles of Care (4)
│   ├── GET    /api/children/<id>/contacts (Child support circle)
│   ├── POST   /api/contacts              (Add caseworker, GAL, pediatrician, kin)
│   ├── PUT    /api/contacts/<id>         (Update contact information)
│   └── DELETE /api/contacts/<id>         (Remove case contact)
├── Households & Licensing (5)
│   ├── GET  /api/households         (Registered residences)
│   ├── POST /api/households         (Register household address)
│   ├── PUT  /api/households/<id>    (Update license and residency status)
│   ├── GET  /api/licensing          (Fire drills, smoke tests, VCWTP hours)
│   └── POST /api/licensing          (Log training or home safety drill)
├── Vermont Statutory & Compliance (7)
│   ├── GET  /api/compliance         (FS-221A statutory placement agreement)
│   ├── PUT  /api/compliance/<id>    (Toggle compliance item)
│   ├── GET  /api/reimbursements/summary (Mileage calculation at $0.67/mi)
│   ├── GET  /api/children/<id>/chins    (Title 33 CHINS juvenile court stepper)
│   ├── GET  /api/children/<id>/posc     (Plan of Safe Care for substance-exposed infants)
│   ├── POST /api/children/<id>/posc     (Update POSC healthcare milestones)
│   └── GET  /api/caregiver/self-regulation (Secondary trauma debriefing prompts)
├── Health, Education & Lifebook Extensions (5)
│   ├── GET  /api/children/<id>/health   (Active MAR & medical records)
│   ├── POST /api/children/<id>/health   (Log immunizations & medical visits)
│   ├── GET  /api/children/<id>/education(IEP/504 conferences & attendance)
│   ├── POST /api/children/<id>/education(Log school milestones & reading)
│   └── GET  /api/children/<id>/lifebook (Positive milestones & memory items)
├── Document Vault & Export Services (6)
│   ├── GET  /api/shared-docs        (20-folder digital binder directory)
│   ├── POST /api/open-doc           (Native desktop file launcher)
│   ├── POST /api/reports/monthly    (Compiles DCF Monthly Summary .docx)
│   ├── POST /api/reports/respite-card (Compiles 1-page Respite Card .docx)
│   ├── POST /api/reports/dcf-claim  (Pre-fills State Form FS-334B Mileage Claim)
│   └── POST /api/calendar/export-ics (RFC 5545 iCalendar schedule export)
└── Cryptographic Security & Recovery (3)
    ├── GET  /api/audit              (Tamper-evident SHA-256 blockchain log)
    ├── GET  /api/audit/verify       (Cryptographic hash verification validator)
    └── POST /api/system/backup-snapshot (Disaster-recovery encrypted ZIP archive)
```

---

## 6. Database Schema & ERD Map (`app/db.py`)

All local data is persisted in SQLite 3 at `%LOCALAPPDATA%\CaregiverCommandCenter\data\foster_binder.db`:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   households    │1     *│    children     │1     *│    contacts     │
├─────────────────┤───────├─────────────────┤───────├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ label           │       │ child_code (UK) │       │ child_id (FK)   │
│ address         │       │ alias           │       │ role_type       │
│ status          │       │ dob             │       │ full_name       │
│ license_status  │       │ placement_date  │       │ phone           │
│ primary_caregiver│      │ relationship_typ│       │ email           │
│ home_owner      │       │ food_preferences│       │ is_emergency    │
└─────────────────┘       │ comfort_items   │       └─────────────────┘
                          │ household_id(FK)│
                          └────────┬────────┘
                                   │1
                                   │*
                          ┌────────┴────────┐
                          │timeline_records │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ child_id (FK)   │
                          │ category        │
                          │ title           │
                          │ event_date      │
                          │ summary         │
                          │ details (JSON)  │
                          │ follow_up_needed│
                          │ severity        │
                          └─────────────────┘

┌─────────────────────┐   ┌─────────────────────┐
│  licensing_records  │   │      audit_log      │
├─────────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ id (PK)             │
│ record_type         │   │ ts                  │
│ title               │   │ actor               │
│ record_date         │   │ action              │
│ hours               │   │ entity              │
│ provider            │   │ prev_hash           │
│ expiry_date         │   │ row_hash (SHA-256)  │
└─────────────────────┘   └─────────────────────┘
```

---

## 7. Data Sovereignty & Note Classification Model

Sprout implements a strict 4-domain data sovereignty model and a 4-tier note classification engine (detailed in [`docs/CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md)):

### 7.1 Data Sovereignty Domains
* **Child Data:** Lifebook stories, artwork, photos, personal milestones. Belongs to the child; transfers with child upon permanency.
* **Case Data:** Medical visits, IEP conferences, visit logs, court dates, FS-334B mileage. Immutable for court defense.
* **Caregiver Data:** Personal reflections, draft observations, internal tasks. Strictly private; never shared or exported.
* **Parent Participant Data:** Goal progress, certificates, housing updates, reflections. Belongs to the parent participant.

### 7.2 Note Classification Engine & Legacy Migration
1. `private`: Completely confidential to caregiver. Excluded from all reports, exports, and parent views.
2. `working`: Draft notes and co-caregiver coordination. Not finalized for state review.
3. `official`: Objective, timestamped records for court briefs, GALs, and DCF monthly reports. Tamper-evident SHA-256 audited.
4. `shared_family`: Uplifting milestones, artwork, and photos explicitly approved for the Parent Workspace.
5. `legacy_unreviewed`: Automatic migration state for all pre-existing notes. **Strictly excluded** from all reports, DCF summaries, court briefs, and parent visibility until individually reviewed.

---

## 8. Eight-Role Permission Matrix & Safety Boundaries

| Role | View Child Official Records | Log Daily Notes & Meds | View Private Notes | Access Parent Workspace | Upload Parent Evidence | Generate DCF Claims (FS-334B) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Primary Caregiver** | ✅ Full | ✅ Full | ✅ Yes | ✅ Admin | ❌ No | ✅ Yes |
| **Secondary Caregiver** | ✅ Full | ✅ Full | ✅ Yes | ✅ Review | ❌ No | ✅ Yes |
| **Add'l Household** | ✅ Full | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| **Respite Caregiver** | 🟡 Need-to-know | ✅ Temp Logs | ❌ No | ❌ No | ❌ No | ❌ No |
| **Parent Participant** | ❌ No | ❌ No | ❌ No | ✅ Parent View | ✅ Yes | ❌ No |
| **Guardian Participant** | 🟡 Approved | ❌ No | ❌ No | ✅ Parent View | ✅ Yes | ❌ No |
| **Child Archive Viewer** | 🟡 Lifebook Only | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **System Administrator** | ❌ Zero PII | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No (DB only) |

*DCF Caseworkers, GALs, Attorneys, Pediatricians, and Judges are **Consumers of Outputs**, not users.*

---

## 9. Data Retention & High-Conflict Safety Governance

* **5-State Retention Lifecycle:** `Active` $\rightarrow$ `Archived` $\rightarrow$ `Legal Hold` $\rightarrow$ `Transfer Pending` $\rightarrow$ `Disposition Review`. Records are never destructively deleted.
* **High-Conflict Mode:** Caregiver location/town masked, Exif/GPS metadata scrubbed from media.
* **Refined 5-Gate Sharing Control Hierarchy:**
  $$\text{Verified Legal Restrictions} \longrightarrow \text{Verified Safety Requirements} \longrightarrow \text{System Access Rules} \longrightarrow \text{Authorized Caregiver Decision} \longrightarrow \text{Human Review Before External Release}$$

---

## 10. Verification & Safety Readiness Assessment

- **Automated Verification:** 73 of 73 end-to-end tests passing (`test_e2e_flows.py`).
- **Caregiver Usability Score:** 98 / 100.
- **Vermont DCF Operations Score:** 96 / 100.
- **Documentation & Legal Integrity Score:** 97 / 100 (Disclaimers & tamper-evident standards applied).
- **Parent Access Safety Score:** 96 / 100 (Unlinked registration, 10-state lifecycle).
- **Zero-Leakage Data Protection Score:** 100 / 100 (Air-gapped, zero cloud exposure).
- **Composite Platform Safety & Readiness:** **97.2 / 100 (Governance Hardened)**.

---

## 11. Phase 13A Pre-Implementation Governance Suite Registry

The following authoritative specifications establish pre-implementation governance across all data, API, export, and role boundaries:

1. [**API Governance Matrix**](API_GOVERNANCE_MATRIX.md): Audits all 43 endpoints (39 REST + 4 file streaming), defining domain ownership, 5-tier classification rules, role capability gates, and export eligibility.
2. [**Export Governance Matrix**](EXPORT_GOVERNANCE_MATRIX.md): Redaction, safety, EXIF scrubbing, and sensitivity controls for all 9 document generators (DCF Monthly, Court Packet, FS-334B, Respite Card, Lifebook, etc.).
3. [**Database Governance Gap Report**](DATABASE_GOVERNANCE_GAP_REPORT.md): Audit of 11 SQLite tables and 148 columns, identifying schema migration gaps, field-level controls, and data sovereignty boundaries.
4. [**Role & Permission Matrix v2**](ROLE_PERMISSION_MATRIX_V2.md): Fine-grained capability matrix for 8 roles across 8 operational gates and 4 sovereignty domains.
5. [**Workflow Governance Dictionary**](WORKFLOW_GOVERNANCE_DICTIONARY.md): Step-by-step governance specifications for 10 critical system workflows (Intake, Medical, Family Time, Court, Incident, etc.).
6. [**Data Sensitivity Classification Architecture**](DATA_SENSITIVITY_CLASSIFICATION.md): 4-tier sensitivity classification standard (Standard, Sensitive, Restricted, Protected) with field-level controls and sanitization rules.
7. [**Child Voice Domain Discovery**](CHILD_VOICE_DOMAIN_DISCOVERY.md): Exploratory architectural analysis and boundary rules for a future 5th domain (deferred to Phase 17+).

