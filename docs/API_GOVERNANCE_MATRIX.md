# Sprout / KinCare OS — API Governance Matrix
**Document Version:** 3.1.1 (Phase 13A Pre-Implementation Governance Review)  
**Status:** Approved API Architecture & Security Specification  
**Effective Date:** October 14, 2026  
**Governing Standard:** [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)  
**Total Verified Local Endpoints:** 43 (39 REST API, 4 File/System Routes)  

---

## 1. API Governance Architecture & Security Posture

Every API endpoint in Sprout is bound to local loopback (`127.0.0.1:5858`), protected by DNS-rebinding guards (`guard_request()`), locked against cross-origin scripting, and governed by:
* **Domain Ownership:** Explicit assignment to Child, Case, Caregiver, or Parent domain.
* **Classification Filtering:** Enforces access rules for `legacy_unreviewed`, `private`, `working`, `official`, and `shared_family`.
* **Role Permissions:** RBAC matrix across the 8 verified roles (`PC`, `SC`, `AH`, `RC`, `PP`, `GP`, `CA`, `SA`).
* **Child & Parent Scope Enforcement:** Scoping queries by `child_id` and masking caregiver identity.
* **Output Package Eligibility:** Controlling eligibility for DCF reports, court exhibits, parent feeds, and lifebooks.

---

## 2. Complete Endpoint Governance Inventory

| # | Route | Method | Purpose | Owner Domain | Allowed Note Classifications | Role Permissions (C/R/U/D/Exp/Arc) | Visibility & Scoping Rules | Output Eligibility |
| :-: | :--- | :---: | :--- | :---: | :---: | :--- | :--- | :---: |
| **1** | `/` | GET | Single Page App Root | System | N/A | R: All roles | Local host only; no auth required for initial render | N/A |
| **2** | `/static/<path>` | GET | Static Assets (CSS, JS, icons) | System | N/A | R: All roles | Local static files only | N/A |
| **3** | `/uploads/<path>` | GET | Local Attachment File Server | Case / Child | All 5 | R: PC, SC, AH, RC, GP. PP: only if linked to `shared_family` | CSP: `sandbox`. Path traversal blocked. Exif stripped if served to PP | Attachments |
| **4** | `/exports/<path>` | GET | Generated Export File Server | Case | official | R: PC, SC | Path containment verified. File must exist inside `exports/` | Generated Files |
| **5** | `/api/shared-docs` | GET | 20-Folder Digital Binder Index | Case / Caregiver | official | R: PC, SC, AH. PP: Forbidden (403) | Sample mode returns synthetic templates only. Live mode lists local docs | Binder Explorer |
| **6** | `/api/open-doc` | POST | Native Desktop File Launcher | Case / Caregiver | official | C: PC, SC. PP: Forbidden (403) | Blocked in Sample mode (403). Validates path containment | Native OS Launch |
| **7** | `/api/households` | GET | List Caregiver Residences | Caregiver | official | R: PC, SC, AH, RC. PP: Forbidden | Returns active/expired homes. Scoped to verified addresses | DCF Summary |
| **8** | `/api/households` | POST | Register Household Address | Caregiver | official | C: PC, SC. PP: Forbidden | Writes to `households` table; audited in `audit_log` | Licensure Records |
| **9** | `/api/households/<id>` | PUT | Update Residence & License | Caregiver | official | U: PC, SC. PP: Forbidden | Updates capacity, licensing dates; audited | Licensure Records |
| **10**| `/api/compliance` | GET | FS-221A Compliance Tasks | Caregiver | official | R: PC, SC, AH, SA. PP: Forbidden | Scoped to active household ID | DCF Licensing Pack |
| **11**| `/api/compliance/<id>`| PUT | Toggle Compliance Milestone | Caregiver | official | U: PC, SC. PP: Forbidden | Updates status, target dates, completion dates | DCF Licensing Pack |
| **12**| `/api/reimbursements/summary`| GET | Mileage & Reimbursement Rollup | Case | official | R: PC, SC. PP: Forbidden | Aggregates allowable travel at $0.67/mi; excludes private notes | State Form FS-334B |
| **13**| `/api/children/<id>/posc` | GET | Plan of Safe Care (POSC) | Child / Case | official, shared_family | R: PC, SC, AH, RC, GP, PP | Child-scoped. PP sees soothing, safe sleep, clinic contacts | DCF & Court Exhibit |
| **14**| `/api/children/<id>/posc` | POST/PUT | Update POSC Milestones | Child / Case | official, shared_family | C/U: PC, SC. PP: Forbidden | Updates feeding routines, soothing protocols; audited | DCF & Court Exhibit |
| **15**| `/api/children/<id>/benefits` | GET | Benefit Claims & Grants | Case | official | R: PC, SC. PP: Forbidden | Child-scoped. Clothing vouchers, WIC, Reach Up | DCF Benefit Audit |
| **16**| `/api/benefits/<id>` | PUT | Update Benefit Claim Status | Case | official | U: PC, SC. PP: Forbidden | Updates filed date, approved amounts; audited | DCF Benefit Audit |
| **17**| `/api/children/<id>/chins` | GET | Title 33 Juvenile Court Stepper | Case | official | R: PC, SC, AH, GP. PP: Hearing dates/status only | Child-scoped. Caregiver private notes redacted for PP | Court Brief & DCF |
| **18**| `/api/caregiver/self-regulation`| GET | Caregiver Secondary Trauma Plan | Caregiver | private | R: PC, SC only. All others: Forbidden | 100% private to caregiver. Never shared or exported | Internal Only |
| **19**| `/api/children` | GET | List Children in Care | Case / Child | official, shared_family | R: PC, SC, AH, RC. PP: sees ONLY linked child | Shielded. Real names replaced with aliases (`CD`) and Ref IDs | Dashboard & Reports |
| **20**| `/api/children` | POST | Rapid Child Placement Intake | Case / Child | official | C: PC, SC. PP: Forbidden | Generates Child Ref ID (`CCC-xxxxxx`); audited | Case Initiation |
| **21**| `/api/children/<id>` | PUT | Update Routines & Preferences | Child | official, shared_family | U: PC, SC. PP: Forbidden | Child-scoped. Updates food, comforting, soothing | Care Handoff Cards |
| **22**| `/api/children/<id>/contacts`| GET | Child Circles of Care Directory | Case | official | R: PC, SC, AH, RC. PP: sees approved professionals only | Child-scoped. Caregiver address/phone redacted in High-Conflict | DCF & Court Packet |
| **23**| `/api/contacts` | POST | Add Case Contact | Case | official | C: PC, SC. PP: Forbidden | Creates contact; role validated; audited | Directory |
| **24**| `/api/contacts/<id>` | PUT | Update Contact Info | Case | official | U: PC, SC. PP: Forbidden | Updates phone, email, notes; audited | Directory |
| **25**| `/api/contacts/<id>` | DELETE | Remove Case Contact | Case | official | D: PC, SC. PP: Forbidden | Soft tombstone deletion with audit hash | Directory |
| **26**| `/api/children/<id>/records` | GET | Filterable Event Timeline | Case / Child / Caregiver | Scoped by Class | R: Scoped by role. PP sees ONLY `shared_family` | Child-scoped. `legacy_unreviewed` excluded from non-caregivers | DCF, Court, Feed |
| **27**| `/api/records` | POST | 15-Second Fast Logger | Case / Caregiver | All 5 | C: PC, SC, RC. PP: Forbidden | Validates category; enforces classification tag; audited | All Output Streams |
| **28**| `/api/records/<id>` | PUT | Edit Record / Notes | Case / Caregiver | All 5 | U: PC, SC. PP: Forbidden | Edits record; preserves prev_hash in audit_log | All Output Streams |
| **29**| `/api/records/<id>/comm-status`| POST | Toggle DCF/GAL Draft Status | Case | working, official | U: PC, SC. PP: Forbidden | Toggles 'Sent', 'Draft Ready', 'Dismissed'; audited | DCF Communications |
| **30**| `/api/records/<id>/toggle-complete`| POST| Resolve Checklist Task | Case | official | U: PC, SC, AH, RC. PP: Forbidden | Toggles boolean `is_completed`; audited | Task Tracking |
| **31**| `/api/records/<id>` | DELETE | Delete Record (Tombstone) | Case | All 5 | D: PC, SC. PP: Forbidden | Cryptographic tombstone record written to audit ledger | Audit Trail |
| **32**| `/api/audit` | GET | Query Cryptographic Audit Log | Case | official | R: PC, SC, SA. PP: Forbidden | Returns timestamped forward-chained ledger | Court Audit Addendum |
| **33**| `/api/audit/verify` | GET | Verify Hash Chain Integrity | Case | official | R: PC, SC, SA. PP: Forbidden | Recomputes SHA-256 chain from Genesis block | Technical Verification |
| **34**| `/api/upload` | POST | Upload Document / Photo | Case / Child | All 5 | C: PC, SC. PP: Evidence upload (Phase 14B) | Validates extension against `UPLOAD_EXTS`; strips GPS | Vault Storage |
| **35**| `/api/licensing` | GET | Training & Drill Ledger | Caregiver | official | R: PC, SC, AH, SA. PP: Forbidden | Scoped to caregiver training & home safety drills | DCF Annual Review |
| **36**| `/api/licensing` | POST | Log Training / Fire Drill | Caregiver | official | C: PC, SC. PP: Forbidden | Appends drill/training record; audited | DCF Annual Review |
| **37**| `/api/reports/monthly` | POST | Compile DCF Monthly Summary | Case | official only | Exp: PC, SC. PP: Forbidden | Excludes `private`, `working`, `legacy_unreviewed`. Scrubs author metadata | DCF Summary (.docx) |
| **38**| `/api/reports/respite-card`| POST | Compile 1-Page Care Card | Child | official, shared_family | Exp: PC, SC. PP: Forbidden | Meds, allergies, soothing, emergency contacts only | Babysitter Handoff |
| **39**| `/api/reports/dcf-claim` | POST | Generate State Form FS-334B | Case | official only | Exp: PC, SC. PP: Forbidden | Pre-fills mileage travel logs at $0.67/mi; audited | State Mileage Form |
| **40**| `/api/calendar/export-ics` | POST | RFC 5545 iCalendar Export | Case | official only | Exp: PC, SC. PP: Forbidden | Compiles hearings, visits, pediatric exams into .ics | External Calendar |
| **41**| `/api/system/backup-snapshot`| POST| Encrypted Disaster Recovery ZIP| Case / Caregiver | All | Exp/Arc: PC, SC. PP: Forbidden | Bundles SQLite DB and uploads into local encrypted ZIP | Disaster Recovery |
| **42**| `/api/ai/summarize-period` | POST | Local Private SLM Summary | Case / Caregiver | official, working | C: PC, SC. PP: Forbidden | Local Ollama SLM call only (127.0.0.1:11434). Zero cloud leak | Monthly Draft Prep |
| **43**| `/api/sample-dataset` | GET | Fetch Synthetic Flight Scenarios | System | sample | R: All roles | Static in-memory model homes; zero live DB access | Practice Sandbox |
