# Sprout / KinCare OS — Workflow Governance Dictionary
**Document Version:** 3.1.1 (Phase 13A Pre-Implementation Governance Review)  
**Status:** Approved Workflow Governance Specification  
**Effective Date:** October 14, 2026  
**Governing Standard:** [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)  

---

## 1. Executive Workflow Governance Architecture

Every operational lifecycle event in Sprout must execute within an audited workflow state boundary. No workflow may bypass:
1. **Permission Checkpoints:** Enforces verified role authority.
2. **Classification Checkpoints:** Mandates assignment of one of the 5 note classifications.
3. **Human Approval Gates:** Requires explicit human sign-off before state progression or data sharing.
4. **Audit Events:** Appends an immutable, forward-chained record to the `audit_log`.

---

## 2. Definitive Critical Workflow Registry

### 1. Child Creation (Emergency / Standard Placement Intake)
* **Input Data:** Alias (`CD`), approximate age/DOB, relationship type (Kinship, Foster, Respite), comfort items, food preferences, primary allergies.
* **Output Data:** New row in `children` table, auto-assigned Child Reference ID (`CCC-000001`), initial Caregiver Cockpit dashboard.
* **Ownership Domain:** **Case Domain** (demographics/status) & **Child Domain** (comforting/routines).
* **Permission Checkpoints:** `PC` (Primary Caregiver) or `SC` (Secondary Caregiver) role verified.
* **Classification Checkpoints:** Baseline record created as `official`. Comfort items and soothing preferences dual-tagged as `official` and `shared_family`.
* **Human Approval Gates:** Caregiver verifies placement paperwork (e.g. State Form FS-221A) before saving.
* **Audit Events:** `audit_log` event: `action='CREATE', entity='children', entity_id=ID, reason='Initial Placement Intake'`.

---

### 2. Parent Registration (Unlinked Self-Registration)
* **Input Data:** Parent full legal name, email address, password, phone number, relationship claim.
* **Output Data:** New row in `parent_users` with status `Pending Verification`. Account is strictly **UNLINKED**.
* **Ownership Domain:** **Parent Participant Domain**.
* **Permission Checkpoints:** Public registration gateway.
* **Classification Checkpoints:** N/A (User identity record).
* **Human Approval Gates:** Zero child data rendered. User sees only an onboarding greeting and evidence upload prompt.
* **Audit Events:** `audit_log` event: `action='REGISTER', entity='parent_users', actor='Self', reason='Parent Self-Registration'`.

---

### 3. Parent Linking (Caregiver Verification & Authorization Gate)
* **Input Data:** Parent applicant ID, target Child ID, caseworker verification confirmation, active court order review.
* **Output Data:** Status transition in `parent_users` from `Pending Verification` $\rightarrow$ `Active Standard Access` (or `Active Restricted Access`). Scoped link created in database.
* **Ownership Domain:** **Case Domain** & **Parent Participant Domain**.
* **Permission Checkpoints:** `PC` role only.
* **Classification Checkpoints:** Validates that linked parent role can only read notes tagged `shared_family`.
* **Human Approval Gates:** **Mandatory Caregiver Sign-Off:** Primary caregiver checks confirmation box affirming: *"I verify that court orders and DCF safety plans permit this parent to access child milestones."*
* **Audit Events:** `audit_log` event: `action='LINK_PARENT', entity='parent_users', actor=PC, reason='Court Order & Safety Plan Verified'`.

---

### 4. Goal Upload (Parent Participant Progress Submission)
* **Input Data:** Goal category (Housing, Parenting Class, Recovery, Employment), milestone title, certificate photo / PDF document.
* **Output Data:** New row in `parent_evidence` linked to `parent_goals`.
* **Ownership Domain:** **Parent Participant Domain**.
* **Permission Checkpoints:** `PP` (Parent Participant) with `Active Standard Access` or `Active Restricted Access`.
* **Classification Checkpoints:** Evidence flagged as `parent_submitted_unreviewed`.
* **Human Approval Gates:** Parent self-submits; awaiting caregiver acknowledgment or case review inclusion.
* **Audit Events:** `audit_log` event: `action='UPLOAD_EVIDENCE', entity='parent_evidence', actor=PP, reason='Goal Milestone Completion'`.

---

### 5. Goal Approval & Case Review Packaging
* **Input Data:** Parent submitted evidence, caregiver review, completion verification status.
* **Output Data:** Goal status updated to `Completed`; evidence included in Parent Progress Packet.
* **Ownership Domain:** **Parent Participant Domain** & **Case Domain**.
* **Permission Checkpoints:** `PC` or `SC`.
* **Classification Checkpoints:** Promoted to `official_parent_evidence`.
* **Human Approval Gates:** Caregiver verifies certificate legitimacy before including in caseworker packet.
* **Audit Events:** `audit_log` event: `action='APPROVE_GOAL', entity='parent_goals', actor=PC, reason='Verified Certificate'`.

---

### 6. Official Record Creation (15-Second Fast Logger)
* **Input Data:** Category (Medical, Visit, School, Behavioral, Incident), title, event date, summary, follow-up needed, optional mileage.
* **Output Data:** New row in `timeline_records` table with forward-chained SHA-256 hash.
* **Ownership Domain:** **Case Domain** (or **Caregiver Domain** if private).
* **Permission Checkpoints:** `PC`, `SC`, or `RC` (Respite).
* **Classification Checkpoints:** Caregiver explicitly selects classification: `official`, `working`, or `private`.
* **Human Approval Gates:** Instant local save; confirmation chip displayed.
* **Audit Events:** `audit_log` event: `action='CREATE', entity='timeline_records', actor=Author, prev_hash=HASH, row_hash=NEW_HASH`.

---

### 7. Shared Family Feed Creation (Milestone & Art Publishing)
* **Input Data:** Milestone title, positive accomplishment story, photo attachment.
* **Output Data:** Row in `timeline_records` assigned `classification='shared_family'`. Rendered in Parent Workspace feed.
* **Ownership Domain:** **Child Domain** & **Parent Participant Domain**.
* **Permission Checkpoints:** `PC` or `SC` only.
* **Classification Checkpoints:** Enforces `shared_family`. Pre-screened against clinical/case notes.
* **Human Approval Gates:** **5-Gate Sharing Hierarchy:** Clears Legal Order $\rightarrow$ Safety Plan $\rightarrow$ Metadata Stripping $\rightarrow$ Caregiver Selection $\rightarrow$ Human Preview.
* **Audit Events:** `audit_log` event: `action='PUBLISH_FEED', entity='timeline_records', actor=PC, reason='Shared Family Engagement'`.

---

### 8. DCF Report Generation (Monthly Case Summary)
* **Input Data:** Target month/year, child selection, included category checkboxes.
* **Output Data:** Compiled, metadata-scrubbed `.docx` or PDF document in `exports/` directory.
* **Ownership Domain:** **Case Domain**.
* **Permission Checkpoints:** `PC` or `SC` only.
* **Classification Checkpoints:** Strict filter query: `WHERE classification = 'official'`. All `private`, `working`, and `legacy_unreviewed` records hard-excluded.
* **Human Approval Gates:** **Export Safety Layer Preview:** Caregiver reviews side-by-side preview, validates recipient as DCF caseworker, and checks affirmative sign-off.
* **Audit Events:** `audit_log` event: `action='GENERATE_REPORT', entity='reports', actor=PC, reason='Monthly DCF Submission'`.

---

### 9. Court Packet Generation (Title 33 Hearing Brief)
* **Input Data:** Hearing stage (Merits, Disposition, Permanency), date range, verified visit attendance logs, medical summary.
* **Output Data:** Formatted Court Exhibit Brief with Legal Review Required notice and cryptographic audit seal.
* **Ownership Domain:** **Case Domain**.
* **Permission Checkpoints:** `PC` or `SC` only.
* **Classification Checkpoints:** Strict filter query: `WHERE classification = 'official'`.
* **Human Approval Gates:** Caregiver and legal review sign-off modal prior to export download.
* **Audit Events:** `audit_log` event: `action='GENERATE_COURT_BRIEF', entity='reports', actor=PC, reason='Hearing Exhibit Preparation'`.

---

### 10. Archive Transition (Case Closure & Retention Lifecycle)
* **Input Data:** Child ID, discharge reason (Reunified with Parent, Adopted, Guardianship, Aged Out), discharge date.
* **Output Data:** Child status updated from `Active Placement` $\rightarrow$ `Archived`. All linked records locked in read-only status.
* **Ownership Domain:** **Case Domain** & **Child Domain**.
* **Permission Checkpoints:** `PC` only.
* **Classification Checkpoints:** Records retain their historical classifications immutably.
* **Human Approval Gates:** Caregiver confirms discharge event. Prompts optional compilation of Child Lifebook Keepsake container.
* **Audit Events:** `audit_log` event: `action='ARCHIVE_CHILD', entity='children', actor=PC, reason='Discharge / Permanency Milestone'`.
