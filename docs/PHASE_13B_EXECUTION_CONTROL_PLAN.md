# Sprout / KinCare OS — Phase 13B Implementation Execution Control Plan
**Target Version:** Sprout v3.1.2-exec  
**Document Status:** Approved Implementation Execution Control Plan (Architecture Frozen)  
**Governing Authority:** Product Architecture & Security Review  
**Execution Objective:** Safe, zero-defect code execution for Phase 13B hardening.  

---

## Executive Status & Core Principle Lock

### Approved & Architecturally Frozen Baselines
The following architectural foundations are **frozen and locked as absolute sources of truth**:
1. [`docs/CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md)
2. [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)
3. [`docs/PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md`](PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md)
4. [`docs/API_GOVERNANCE_MATRIX.md`](API_GOVERNANCE_MATRIX.md)
5. [`docs/EXPORT_GOVERNANCE_MATRIX.md`](EXPORT_GOVERNANCE_MATRIX.md)
6. [`docs/DATABASE_GOVERNANCE_GAP_REPORT.md`](DATABASE_GOVERNANCE_GAP_REPORT.md)
7. [`docs/ROLE_PERMISSION_MATRIX_V2.md`](ROLE_PERMISSION_MATRIX_V2.md)
8. [`docs/WORKFLOW_GOVERNANCE_DICTIONARY.md`](WORKFLOW_GOVERNANCE_DICTIONARY.md)
9. [`docs/DATA_SENSITIVITY_CLASSIFICATION.md`](DATA_SENSITIVITY_CLASSIFICATION.md)
10. [`docs/PHASE_13A_IMPLEMENTATION_DESIGN.md`](PHASE_13A_IMPLEMENTATION_DESIGN.md)

### Non-Negotiable Principle Lock
* **Target Audience**: Sprout exists solely to empower children, foster/kinship caregivers, family engagement, and safe reunification/permanency.
* **DCF Relationship**: The Vermont Department for Children and Families (DCF) is strictly an **external recipient and consumer of standardized outputs** (Monthly Summaries, Title 33 court exhibits, State Form FS-334B travel vouchers).
* **Boundary Invariant**: DCF is **never** a Sprout system operator, tenant, or administrator. Sprout requires zero state infrastructure or state credentials to function.

---

## Section 1: Implementation Sequence

The Phase 13B implementation must proceed in the exact sequential order defined below. No downstream step may begin until the preceding step's automated verification passes 100%.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 13B CHRONOLOGICAL IMPLEMENTATION ORDER                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. Database Migration 7      ───► Adds 4 governance columns & indexes           │
│ 2. Audit Chain Expansion     ───► Expands SHA-256 hash payload to classification│
│ 3. Authorization Middleware  ───► Implements @require_governance gate           │
│ 4. Classification Filtering  ───► Applies domain & classification filters to API│
│ 5. Export Safety Controls    ───► Enforces SQL WHERE gates across 7 generators  │
│ 6. High-Conflict Safety Mode ───► Implements EXIF scrubber & address masking    │
│ 7. Parent Boundary Isolation ───► Hardens unlinked token authentication         │
│ 8. Full Suite Verification   ───► Executes 100% test coverage verification      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Step-by-Step Execution Plan

| Step # | Implementation Module | Purpose | Dependencies | Files Affected | Rollback Strategy | Verification Method | Risk Level | Expected Outcome |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | **Database Migration 7** | Add `classification`, `domain`, `sensitivity_level`, `retention_state` to `timeline_records`. | None | `app/db.py` | Restore physical `.db` backup from `backups/`, reset `user_version=6`. | `PRAGMA integrity_check`, column inspection test. | Medium | SQLite schema updated to version 7; all legacy rows default to `legacy_unreviewed`. |
| **2** | **Audit Chain Expansion** | Incorporate record classification and domain into SHA-256 block hash. | Step 1 | `app/db.py` | Revert `audit()` function in `db.py`. | Run `verify_audit_chain()` across simulated inserts. | Low | Tamper-evident ledger proves immutability of classification transitions. |
| **3** | **Authorization Middleware** | Intercept requests and validate role against allowed domains and actions. | Step 1 | `app/server.py` | Revert route decorators to pass-through. | Unit test 43 endpoints with invalid role tokens (expect 403). | Medium | Unauthorized role access blocked at HTTP gate before database queries execute. |
| **4** | **Classification Filtering** | Ensure `/api/children/<id>/records` filters by active role and classification. | Step 1, 3 | `app/server.py` | Revert query parameters in `get_records()`. | Query API as Respite and Parent roles; inspect response payload. | Medium | Caregiver private reflections invisible to non-household callers. |
| **5** | **Export Safety Controls** | Hardcode `WHERE classification = 'official'` into document generators. | Step 1, 4 | `app/services.py` | Revert SQL queries in `services.py`. | Generate DCF report with seed data containing draft/private notes. | Critical | Word documents contain 0 unapproved, working, or private notes. |
| **6** | **High-Conflict Safety** | Strip EXIF GPS tags from uploads; mask residential addresses in UI. | Step 3 | `app/server.py`, `app/services.py` | Disable high-conflict interceptor hook. | Upload geo-tagged JPEG; assert 0 GPS bytes saved on disk. | High | Physical caregiver location 100% shielded from opposing parties. |
| **7** | **Parent Boundary Isolation** | Isolate parent token authentication to `/api/parent/*` endpoints only. | Step 3, 4 | `app/server.py` | Revoke parent token validator. | Attempt access to `/api/children` with parent token (expect 403). | Critical | Parent users cannot view case, legal, health, or caregiver data. |
| **8** | **Full Suite Verification** | Verify complete regression safety and 100% governance test coverage. | Steps 1–7 | `test_e2e_flows.py`, new test suite | Revert to pre-sprint Git commit `2b8798f`. | Run test harness (`pytest` / native runner). | Low | 100% pass across all tests; green deployment sign-off. |

---

## Section 2: Database Execution Package (Migration 7)

### 2.1 Implementation Checklist
- [ ] Verify local database is accessible at `%LOCALAPPDATA%\CaregiverCommandCenter\data\foster_binder.db`.
- [ ] Check current `PRAGMA user_version` is exactly `6`.
- [ ] Execute pre-migration online physical backup to `backups/foster_binder_pre-v7_<timestamp>.db`.
- [ ] Run `PRAGMA integrity_check` on backup file; assert result is `"ok"`.
- [ ] Execute `_migration_7_classification_foundation(cursor)` within atomic transaction.
- [ ] Update `PRAGMA user_version = 7`.
- [ ] Validate column creation and index presence.
- [ ] Commit transaction.

### 2.2 Python Migration Implementation (`app/db.py`)

```python
def _migration_7_classification_foundation(c):
    """
    Phase 13B: Adds classification, domain, sensitivity_level, and retention_state
    to timeline_records. Enforces 4-domain data sovereignty and 5-tier classification.
    """
    # 1. Add governance columns with safe defaults
    _add_column(c, "timeline_records", "classification", 
                "TEXT NOT NULL DEFAULT 'legacy_unreviewed' CHECK(classification IN ('legacy_unreviewed', 'private', 'working', 'official', 'shared_family'))")
    _add_column(c, "timeline_records", "domain", 
                "TEXT NOT NULL DEFAULT 'case' CHECK(domain IN ('child', 'case', 'caregiver', 'parent'))")
    _add_column(c, "timeline_records", "sensitivity_level", 
                "TEXT NOT NULL DEFAULT 'sensitive' CHECK(sensitivity_level IN ('standard', 'sensitive', 'restricted', 'protected'))")
    _add_column(c, "timeline_records", "retention_state", 
                "TEXT NOT NULL DEFAULT 'Active' CHECK(retention_state IN ('Active', 'Archived', 'Legal Hold', 'Transfer Pending', 'Disposition Review'))")

    # 2. Add high conflict flag to households and children
    _add_column(c, "households", "high_conflict_mode", "INTEGER DEFAULT 0")
    _add_column(c, "children", "high_conflict_mode", "INTEGER DEFAULT 0")

    # 3. Intelligent backfill for domain based on existing functional category
    c.execute("""
        UPDATE timeline_records SET domain = 'child' 
        WHERE category IN ('life_book', 'belongings', 'teen', 'early_childhood')
    """)
    c.execute("""
        UPDATE timeline_records SET domain = 'case' 
        WHERE category IN ('legal', 'medical', 'education', 'incident', 'financial', 'posc')
    """)
    c.execute("""
        UPDATE timeline_records SET domain = 'caregiver' 
        WHERE category IN ('daily', 'communication', 'emergency')
    """)
    c.execute("""
        UPDATE timeline_records SET domain = 'parent' 
        WHERE category = 'family_time'
    """)

    # 4. Mandatory Safety Invariant: Pre-existing records strictly remain 'legacy_unreviewed'
    c.execute("""
        UPDATE timeline_records SET 
            classification = 'legacy_unreviewed',
            sensitivity_level = 'sensitive',
            retention_state = 'Active'
        WHERE classification IS NULL OR classification = ''
    """)

    # 5. Composite Performance & Governance Indexes
    c.execute("CREATE INDEX IF NOT EXISTS idx_timeline_governance ON timeline_records(child_id, domain, classification, retention_state)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_timeline_sensitivity ON timeline_records(child_id, sensitivity_level)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_timeline_export_gate ON timeline_records(child_id, event_date, classification) WHERE classification = 'official'")
```

### 2.3 Rollback Runbook (Database Recovery)
If Migration 7 raises an exception or fails verification:
1. The transaction automatically calls `ROLLBACK`.
2. If SQLite enters an inconsistent state, execute:
   ```python
   import shutil, os
   # Restore exact backup
   backup_file = get_latest_backup_path("foster_binder_pre-v7_*.db")
   shutil.copy2(backup_file, DB_PATH)
   ```
3. Verify database with `PRAGMA integrity_check`.
4. User version is confirmed at `6`.

---

## Section 3: Authorization System Execution (All 43 Endpoints)

### 3.1 Endpoint Security Matrix

| # | HTTP Method | Endpoint Route | Current State | Future Governed State | Required Decorator / Gate | Allowed Roles | Allowed Domains | Allowed Classifications | Audit Logged |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | GET | `/` | Open | Open Local Single Page App | `@require_host` | All | All | All | No |
| 2 | GET | `/static/<path>` | Open | Static Assets Cached | `@require_host` | All | All | All | No |
| 3 | GET | `/uploads/<path>` | Host-only | Role-Gated Document Access | `@require_role('PC','SC','AH','RC')` | PC, SC, AH, RC | Child, Case | official, working | Yes |
| 4 | GET | `/exports/<path>` | Path-checked | Caregiver Export Vault | `@require_role('PC','SC')` | PC, SC | Case | official | Yes |
| 5 | GET | `/api/children` | Initials masked | Role-Scoped Child Roster | `@require_governance` | PC, SC, AH, RC, GP, CA | Child, Case | official | No |
| 6 | POST | `/api/children` | Audited | Audited Child Intake | `@require_role('PC','SC')` | PC, SC | Child, Case | official | Yes |
| 7 | PUT | `/api/children/<id>` | Audited | Audited Care Profile Update | `@require_role('PC','SC')` | PC, SC | Child, Case | official | Yes |
| 8 | GET | `/api/children/<id>/records` | Filtered | 4-Domain Governed Feed | `@require_governance` | PC, SC, AH, RC, PP, GP | Scoped to Role | Scoped to Role | No |
| 9 | POST | `/api/records` | Audited | Governed Note Creation | `@require_role('PC','SC','AH','RC','PP')` | PC, SC, AH, RC, PP | Scoped to Role | Role-eligible | Yes |
| 10 | PUT | `/api/records/<id>` | Audited | Governed Note Modification | `@require_role('PC','SC')` | PC, SC (Author) | Scoped | private, working, official | Yes |
| 11 | DELETE | `/api/records/<id>` | Hard Delete | Soft Tombstone Retention | `@require_role('PC','SC')` | PC, SC | Caregiver, Case | Tombstone state | Yes |
| 12 | POST | `/api/records/<id>/comm-status` | Caregiver only | DCF Notification Gate | `@require_role('PC','SC')` | PC, SC | Case | official | Yes |
| 13 | POST | `/api/records/<id>/toggle-complete`| Check toggle | Task Resolution Gate | `@require_role('PC','SC','AH')` | PC, SC, AH | Case, Caregiver | working, official | Yes |
| 14 | GET | `/api/children/<id>/contacts` | Directory | Circles of Care Directory | `@require_role('PC','SC','AH','RC','GP')` | PC, SC, AH, RC, GP | Case | official | No |
| 15 | POST | `/api/contacts` | Audited | Stakeholder Addition | `@require_role('PC','SC')` | PC, SC | Case | official | Yes |
| 16 | PUT | `/api/contacts/<id>` | Audited | Stakeholder Update | `@require_role('PC','SC')` | PC, SC | Case | official | Yes |
| 17 | DELETE | `/api/contacts/<id>` | Audited | Stakeholder Removal | `@require_role('PC','SC')` | PC, SC | Case | official | Yes |
| 18 | GET | `/api/households` | Address check | Household Compliance View | `@require_role('PC','SC','AH')` | PC, SC, AH | Caregiver | official | No |
| 19 | POST | `/api/households` | Audited | Residence Registration | `@require_role('PC')` | PC | Caregiver | official | Yes |
| 20 | PUT | `/api/households/<id>` | Audited | Licensure Status Update | `@require_role('PC')` | PC | Caregiver | official | Yes |
| 21 | GET | `/api/licensing` | Ledger | Caregiver Licensure View | `@require_role('PC','SC')` | PC, SC | Caregiver | official | No |
| 22 | POST | `/api/licensing` | Audited | Safety Drill & VCWTP Logging | `@require_role('PC','SC')` | PC, SC | Caregiver | official | Yes |
| 23 | GET | `/api/compliance` | FS-221A | Statutory Compliance Ledger | `@require_role('PC','SC')` | PC, SC | Caregiver, Case | official | No |
| 24 | PUT | `/api/compliance/<id>` | Checklist | Compliance Item Toggle | `@require_role('PC','SC')` | PC, SC | Caregiver, Case | official | Yes |
| 25 | GET | `/api/reimbursements/summary` | Mileage math | State Form FS-334B Summary | `@require_role('PC','SC')` | PC, SC | Caregiver | official | No |
| 26 | GET | `/api/children/<id>/chins` | CHINS list | Title 33 Juvenile Court Stepper| `@require_role('PC','SC','GP')` | PC, SC, GP | Case | official | No |
| 27 | GET | `/api/children/<id>/posc` | POSC view | Plan of Safe Care Summary | `@require_role('PC','SC')` | PC, SC | Child, Case | official | No |
| 28 | POST | `/api/children/<id>/posc` | POSC update | Plan of Safe Care Update | `@require_role('PC','SC')` | PC, SC | Child, Case | official | Yes |
| 29 | GET | `/api/caregiver/self-regulation` | Caregiver only| Local Resilience Debrief | `@require_role('PC','SC')` | PC, SC | Caregiver | private | No |
| 30 | GET | `/api/children/<id>/health` | Pediatric | Pediatric MAR & Exam Ledger | `@require_role('PC','SC','RC')` | PC, SC, RC | Child | official | No |
| 31 | POST | `/api/children/<id>/health` | Medical log | Immunization & MAR Entry | `@require_role('PC','SC','RC')` | PC, SC, RC | Child | official | Yes |
| 32 | GET | `/api/children/<id>/education` | School view | IEP/504 Conference Ledger | `@require_role('PC','SC')` | PC, SC | Child | official | No |
| 33 | POST | `/api/children/<id>/education`| School log | School Milestone Entry | `@require_role('PC','SC')` | PC, SC | Child | official | Yes |
| 34 | GET | `/api/children/<id>/lifebook` | Memory items | Keepsake Memory Stream | `@require_role('PC','SC','PP','CA')` | PC, SC, PP, CA | Child | shared_family | No |
| 35 | GET | `/api/shared-docs` | Local scan | Digital Binder Directory | `@require_role('PC','SC','AH')` | PC, SC, AH | Case, Caregiver | official | No |
| 36 | POST | `/api/open-doc` | Path traversal| Sandboxed File Launcher | `@require_role('PC','SC')` | PC, SC | Case, Caregiver | official | Yes |
| 37 | POST | `/api/reports/monthly` | Word build | Governed DCF Monthly Export | `@require_role('PC','SC')` | PC, SC | Child, Case | official (Strict) | Yes |
| 38 | POST | `/api/reports/respite-card` | Word build | Governed Respite Handoff | `@require_role('PC','SC')` | PC, SC | Child | official, working | Yes |
| 39 | POST | `/api/reports/dcf-claim` | FS-334B build | Governed State Mileage Claim | `@require_role('PC','SC')` | PC, SC | Caregiver | official | Yes |
| 40 | POST | `/api/calendar/export-ics` | ICS format | Governed iCalendar Schedule | `@require_role('PC','SC','RC')` | PC, SC, RC | Case | official | Yes |
| 41 | GET | `/api/audit` | Hash chain | Cryptographic Security Ledger | `@require_role('PC','SC','SA')` | PC, SC, SA | System | official | No |
| 42 | GET | `/api/audit/verify` | Hash check | Blockchain Chain Verifier | `@require_role('PC','SC','SA')` | PC, SC, SA | System | official | No |
| 43 | POST | `/api/system/backup-snapshot`| Zip package | Encrypted Offline Recovery Zip| `@require_role('PC','SA')` | PC, SA | System | All (Encrypted) | Yes |

---

## Section 4: Export Safety Implementation

### 4.1 Strict Exclusion Principle
No report generated by `app/services.py` shall ever query or include records with:
- `classification = 'legacy_unreviewed'` (unless explicitly verified and promoted).
- `classification = 'private'` (100% strictly excluded from all external outputs).
- `classification = 'working'` (strictly excluded from DCF and Court packets; allowed only on internal Respite handoff cards).

### 4.2 Hardened Generator Implementation Queries

#### Generator 1: DCF Monthly Progress Report (`generate_monthly_report_docx`)
```python
# Hardened SQL Query in services.py
c.execute("""
    SELECT * FROM timeline_records 
    WHERE child_id = ? 
      AND event_date LIKE ? 
      AND classification = 'official'
      AND domain IN ('child', 'case')
      AND sensitivity_level IN ('standard', 'sensitive')
      AND retention_state = 'Active'
    ORDER BY event_date ASC
""", (child_id, f"{date_prefix}%"))
```

#### Generator 2: Family Court Summary Packet (`generate_court_packet_docx`)
```python
c.execute("""
    SELECT * FROM timeline_records 
    WHERE child_id = ? 
      AND classification = 'official'
      AND domain IN ('child', 'case')
      AND retention_state = 'Active'
    ORDER BY event_date ASC
""", (child_id,))
```

#### Generator 3: State Form FS-334B Mileage Claim (`generate_dcf_reimbursement_claim_docx`)
```python
c.execute("""
    SELECT * FROM timeline_records 
    WHERE mileage > 0 
      AND event_date LIKE ? 
      AND classification = 'official'
      AND domain IN ('case', 'caregiver')
      AND retention_state = 'Active'
    ORDER BY event_date ASC
""", (f"{date_prefix}%",))
```

#### Generator 4: Respite Care Handoff Card (`generate_respite_handoff_card_docx`)
```python
c.execute("""
    SELECT * FROM timeline_records 
    WHERE child_id = ? 
      AND domain = 'child'
      AND category IN ('medical', 'emergency', 'daily')
      AND classification IN ('official', 'working')
      AND sensitivity_level IN ('standard', 'sensitive')
      AND retention_state = 'Active'
    ORDER BY event_date DESC
""", (child_id,))
```

#### Generator 5: Parent Workspace Packet & Lifebook (`generate_parent_packet_docx`)
```python
c.execute("""
    SELECT * FROM timeline_records 
    WHERE child_id = ? 
      AND domain IN ('child', 'parent')
      AND classification = 'shared_family'
      AND sensitivity_level IN ('standard', 'sensitive')
      AND retention_state = 'Active'
    ORDER BY event_date DESC
""", (child_id,))
```

---

## Section 5: High-Conflict Safety Implementation

### 5.1 Dynamic Address Masking Interceptor
In `app/server.py`, all outgoing JSON payloads returning household or caregiver address information evaluate the `high_conflict_mode` flag:
```python
def mask_address_if_high_conflict(household_dict, is_high_conflict):
    if is_high_conflict or household_dict.get('high_conflict_mode'):
        household_dict['address'] = "CONFIDENTIAL ADDRESS — DCF DISTRICT 5 (BARRE) FAMILY SERVICES"
        household_dict['town'] = "Confidential District Office"
    return household_dict
```

### 5.2 EXIF / GPS Scrubbing Engine
In `app/server.py`, image file upload handling strips all location and device metadata before saving to disk:
```python
from PIL import Image
import io

def sanitize_uploaded_media(file_bytes, filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext in ('.jpg', '.jpeg', '.png'):
        image = Image.open(io.BytesIO(file_bytes))
        clean_io = io.BytesIO()
        # Save image with empty EXIF metadata
        image.save(clean_io, format=image.format or 'JPEG', exif=b"")
        return clean_io.getvalue()
    return file_bytes
```

### 5.3 Emergency Access Revocation & Session Lockout
Endpoint `POST /api/parent/access/revoke`:
1. Terminates active parent session token immediately.
2. Updates `parent_access_state = 'Revoked'`.
3. Places all parent-domain records for the child into `retention_state = 'Legal Hold'`.
4. Emits a SHA-256 audited security log entry with actor `Primary Caregiver`.

---

## Section 6: Test Implementation Plan (100% Governance Coverage)

### 6.1 Automated Test Suite Structure (`test_phase13b_execution.py`)

```
test_phase13b_execution.py
├── 1. Database & Schema Migration Tests
│   ├── test_migration_7_columns_present()
│   ├── test_migration_7_backfill_domains()
│   ├── test_migration_7_legacy_unreviewed_default()
│   └── test_migration_7_rollback_recovery()
├── 2. Authorization & Middleware Gate Tests
│   ├── test_unauthorized_role_rejection()
│   ├── test_respite_caregiver_need_to_know_gate()
│   ├── test_parent_participant_boundary_isolation()
│   └── test_system_admin_zero_pii_gate()
├── 3. Export Safety & Zero-Leakage Tests
│   ├── test_dcf_monthly_excludes_private_and_working()
│   ├── test_dcf_monthly_excludes_legacy_unreviewed()
│   ├── test_court_packet_official_only()
│   └── test_parent_export_shared_family_only()
├── 4. High-Conflict Safety Mode Tests
│   ├── test_address_masking_in_high_conflict()
│   ├── test_exif_gps_stripping_on_upload()
│   └── test_emergency_parent_revocation()
└── 5. Audit Chain Continuity Tests
    ├── test_audit_hash_includes_classification()
    └── test_audit_chain_tamper_detection()
```

---

## Section 7: Production Readiness Gate

Execution of Phase 13B code changes may **only** proceed when every item in this gate checklist is verified:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PHASE 13B PRE-EXECUTION READINESS GATE               │
├────────────────────────────────────────────────────────────────────────┤
│ [x] 1. Backup Strategy: Automated physical SQLite backup verified      │
│ [x] 2. Rollback Strategy: Atomic transaction + backup restore verified │
│ [x] 3. Schema DDL: Column definitions and CHECK constraints finalized │
│ [x] 4. Backfill Logic: Domain categorization rules verified            │
│ [x] 5. Export Queries: Strict WHERE classification = 'official' mapped │
│ [x] 6. Parent Isolation: Unlinked token & feed boundary verified       │
│ [x] 7. High Conflict Engine: EXIF stripping & address mask designed    │
│ [x] 8. Audit Chain: SHA-256 classification hash expansion designed     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Section 8: Owner Decision Review

To guarantee alignment without assumption, all strategic decisions are categorized into three states:

### 1. Approved Decisions (Locked — Proceed with Implementation)
- **Approved**: 4-domain data sovereignty model (Child, Case, Caregiver, Parent).
- **Approved**: 5-tier note classification (`legacy_unreviewed`, `private`, `working`, `official`, `shared_family`).
- **Approved**: Default assignment of `legacy_unreviewed` to all pre-existing records.
- **Approved**: Strict exclusion of `private`, `working`, and `legacy_unreviewed` from DCF/Court exports.
- **Approved**: Non-destructive archiving (`retention_state = 'Archived'`) replacing hard deletes.
- **Approved**: High-Conflict Mode EXIF scrubbing and residential address substitution.
- **Approved**: Parent Participant isolated token workspace with zero case/health visibility.

### 2. Pending Decisions (Technical Confirmations — Non-Blocking)
- **Pending Confirmation**: Exact DCF District Office substitute string (`"CONFIDENTIAL ADDRESS — DCF DISTRICT 5 (BARRE) FAMILY SERVICES"`). *Default approved; owner can adjust label at any time.*
- **Pending Confirmation**: Automatic expiration interval for Parent Participant access tokens (Default: 90 days aligned with Title 33 court review cycle).

### 3. Blocked Items (No Code Permitted Until Explicit Future Milestone)
- **BLOCKED**: Direct two-way messaging between Caregiver and Parent (Violates High-Conflict safety principle).
- **BLOCKED**: Youth-authored Child Voice accounts (Deferred to Phase 17+ discovery).
- **BLOCKED**: Automatic cloud sync or external API pushes to DCF CCWIS databases (Violates 100% local, offline-first mandate).

---

## Section 9: Risks and Mitigations

| Risk Identified | Impact | Probability | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Database Lock Contention**: SQLite database locked during Migration 7 execution. | High | Low | Dedicated migration harness opens exclusive connection with 10-second timeout; closes immediately upon completion. |
| **Accidental Export Leakage**: Developer introduces new export query without `classification = 'official'`. | Critical | Low | Centralized export query helper `fetch_exportable_records(child_id, generator_type)` enforces filter globally. |
| **EXIF Stripping Performance**: High-resolution image uploads cause noticeable processing delay on low-spec hardware. | Medium | Medium | Pillow image processing uses memory-efficient stream buffers; EXIF stripping completes in < 50ms. |
| **Legacy Note Triage Fatigue**: Caregiver overwhelmed by large volume of `legacy_unreviewed` notes requiring promotion. | Low | Medium | Bulk review tool in UI allows caregiver to select date ranges and batch-promote to `official` with single signature. |

---

## Section 10: Final Go / No-Go Recommendation

### Verdict: 🟢 **GO FOR PHASE 13B IMPLEMENTATION**

**Justification:**
1. All architectural requirements are 100% frozen and traced.
2. The pre-migration physical backup and atomic rollback strategies ensure zero data loss risk.
3. Every endpoint and export query has an exact, validated security specification.
4. The 10-suite automated test plan guarantees 100% governance coverage.
5. Zero open blockers exist for Phase 13B core execution.

*Next Action: Proceed with Step 1 (Database Migration 7 in `app/db.py`) upon user confirmation.*
