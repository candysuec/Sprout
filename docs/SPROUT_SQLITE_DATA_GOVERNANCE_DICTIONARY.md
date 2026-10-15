# Sprout / KinCare OS — Master SQLite Data Governance Dictionary
## Field-by-Field Domain Ownership, Classification, Role Permissions & Output Scope

**Version:** 3.1.0  
**Status:** Canonical Data Governance Dictionary  
**Database File:** `%LOCALAPPDATA%\CaregiverCommandCenter\data\foster_binder.db`  
**Governing Baseline:** [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)  
**Total Tables Evaluated:** 11  

---

## 1. Governance Architecture Summary

Every field across all 11 SQLite tables is governed by four strict architectural parameters:

1. **Domain Ownership:**
   * **Child Data:** Belongs to the child's identity, soothing, developmental story, and memories. Transfers with the child upon permanency.
   * **Case Data:** Objective statutory, legal, educational, medical, and administrative records. Must remain historically accurate and immutable for court and audits.
   * **Caregiver Data:** Private reflections, household compliance, licensure, self-regulation, and internal coordination. Sole property of the caregiver; never shared or exported without consent.
   * **Parent Participant Data:** Goals, evidence, housing progress, certificates, and parenting reflections. Belongs to the parent participant.

2. **Classification Scope:**
   * `legacy_unreviewed`: Default state for all pre-existing records prior to review. Excluded from all reports and parent views.
   * `private`: Confidential to caregiver. Never shared, exported, or printed.
   * `working`: Drafts, unconfirmed observations, internal planning.
   * `official`: Factual, timestamped, tamper-evident records eligible for DCF and court compilation.
   * `shared_family`: Uplifting milestones, artwork, and photos explicitly approved for the Parent Workspace.

3. **Role Codes:**
   * `PC`: Primary Caregiver
   * `SC`: Secondary Caregiver
   * `AH`: Additional Household Caregiver
   * `RC`: Respite Caregiver
   * `PP`: Parent Participant
   * `GP`: Guardian Participant
   * `CA`: Child Archive Viewer
   * `SA`: System Administrator (Technical Maintenance Only)

4. **Output Channels:**
   * **DCF:** DCF Monthly Summary Report
   * **Court:** Court Exhibit Brief / Title 33 Packet
   * **Parent:** Parent Participant Workspace / Structured Feed
   * **Lifebook:** Child Life Journey Keepsake Export

---

## 2. Table-by-Table Field Governance Matrix

### TABLE 1: `children` (29 Fields)
*Stores child identity, demographic shielding, baseline soothing routines, and placement status.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Case | official | C: PC, SC \| R: PC, SC, AH, RC, SA \| E: None \| Exp: None \| Arc: PC, SC | None |
| `first_name` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Yes \| Lifebook: Yes |
| `last_name` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No (Shielded) \| Lifebook: No |
| `preferred_name` | TEXT | Child | official, shared_family | C: PC, SC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Yes \| Lifebook: Yes |
| `dob` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: Age only |
| `placement_date` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `gender` | TEXT | Child | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `status` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `permanency_goal`| TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Goal title \| Lifebook: No |
| `school` | TEXT | Child | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Redacted if High-Conflict \| Lifebook: Yes |
| `grade` | TEXT | Child | official, shared_family | C: PC, SC \| R: PC, SC, AH, RC, PP, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Yes \| Lifebook: Yes |
| `medicaid_number`| TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No (Confidential) \| Lifebook: No |
| `allergies` | TEXT | Child | official | C: PC, SC \| R: PC, SC, AH, RC, PP, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Yes (Health) \| Lifebook: Medical Card |
| `photo_url` | TEXT | Child | shared_family, official | C: PC, SC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Optional \| Court: No \| Parent: Yes (Scrubbed) \| Lifebook: Yes |
| `emergency_notes`| TEXT | Child | official, private | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `created_at` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: No \| Court: Audit Only \| Parent: No \| Lifebook: No |
| `updated_at` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: No \| Court: Audit Only \| Parent: No \| Lifebook: No |
| `child_code` | TEXT | Case | official | C: System \| R: All roles \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Ref ID \| Court: Ref ID \| Parent: Ref ID \| Lifebook: Keepsake ID |
| `alias` | TEXT | Child | official, shared_family | C: PC, SC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Yes \| Lifebook: Yes |
| `legal_name_enc` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Sealed \| Court: Sealed \| Parent: No \| Lifebook: No |
| `household_id` | INTEGER FK | Caregiver | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: Internal \| Court: Internal \| Parent: No \| Lifebook: No |
| `relationship_type`| TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `episode_status` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `episode_start_date`| TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `episode_end_date`| TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `food_preferences`| TEXT | Child | official, shared_family | C: PC, SC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Care Routine \| Court: No \| Parent: Yes \| Lifebook: Favorites page |
| `behavioral_supports`| TEXT | Child | working, official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Clinical Summary \| Court: Yes \| Parent: Approved Only \| Lifebook: No |
| `comfort_items` | TEXT | Child | official, shared_family | C: PC, SC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Care Routine \| Court: No \| Parent: Yes \| Lifebook: Keepsake page |
| `care_routines` | TEXT | Child | official, working | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Care Plan \| Court: No \| Parent: Care routines \| Lifebook: Keepsake page |

---

### TABLE 2: `contacts` (12 Fields)
*Professional, medical, educational, and family support directory.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Case | official | C: PC, SC \| R: All roles \| E: None \| Exp: None \| Arc: PC, SC | None |
| `child_id` | INTEGER FK | Case | official | C: PC, SC \| R: All roles \| E: None \| Exp: None \| Arc: PC, SC | Scope Filter Only |
| `role_type` | TEXT | Case | official | C: PC, SC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Approved Contacts \| Lifebook: Friends page |
| `full_name` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Approved Only \| Lifebook: Selected |
| `organization` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Approved Only \| Lifebook: No |
| `phone` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Redacted if High-Conflict \| Lifebook: No |
| `email` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Approved Only \| Lifebook: No |
| `address` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Strictly Redacted \| Lifebook: No |
| `is_emergency` | INTEGER | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Emergency contacts \| Lifebook: No |
| `notes` | TEXT | Case | private, working, official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official notes only \| Court: Official only \| Parent: No \| Lifebook: No |
| `created_at` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `preferred_method`| TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: No \| Parent: No \| Lifebook: No |

---

### TABLE 3: `timeline_records` (28 Fields)
*Universal operational event stream: health, visits, school, behavioral observations, mileage, and legal proceedings.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Case | official | C: System \| R: All roles \| E: None \| Exp: None \| Arc: PC, SC | None |
| `child_id` | INTEGER FK | Case | official | C: PC, SC, RC \| R: All roles \| E: None \| Exp: None \| Arc: PC, SC | Scope Filter Only |
| `category` | TEXT | Case | official, shared_family | C: PC, SC, RC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: Milestones only \| Lifebook: Lifebook category |
| `sub_type` | TEXT | Case | official, working | C: PC, SC, RC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `title` | TEXT | Case | All 5 classifications | C: PC, SC, RC \| R: Scoped by Class \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official only \| Court: Official only \| Parent: Shared Family only \| Lifebook: Selected |
| `event_date` | TEXT | Case | All 5 classifications | C: PC, SC, RC \| R: Scoped by Class \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official only \| Court: Official only \| Parent: Shared Family only \| Lifebook: Yes |
| `location` | TEXT | Case | official, private | C: PC, SC, RC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official only \| Court: Official only \| Parent: Redacted if High-Conflict \| Lifebook: Selected |
| `participants` | TEXT | Case | official, working | C: PC, SC, RC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official only \| Court: Official only \| Parent: First names only \| Lifebook: Selected |
| `summary` | TEXT | Case / Child / Caregiver | All 5 classifications | C: PC, SC, RC \| R: Scoped by Class \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official only \| Court: Official only \| Parent: Shared Family only \| Lifebook: Story text |
| `details` (JSON) | TEXT | Case / Caregiver | All 5 classifications | C: PC, SC, RC \| R: Scoped by Class \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Form fields (Official) \| Court: Form fields \| Parent: No \| Lifebook: Milestones only |
| `follow_up_needed`| INTEGER | Case | working, official | C: PC, SC, RC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes (Action items) \| Court: Follow-ups \| Parent: No \| Lifebook: No |
| `follow_up_notes` | TEXT | Caregiver | working, private | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `follow_up_due_date`|TEXT | Case | working, official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `is_completed` | INTEGER | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Yes \| Court: Yes \| Parent: No \| Lifebook: No |
| `attachment_path`| TEXT | Case / Child | All 5 classifications | C: PC, SC \| R: Scoped by Class \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official PDFs \| Court: Exhibits \| Parent: Scrubbed Photos \| Lifebook: Photos/Art |
| `attachment_name`| TEXT | Case / Child | All 5 classifications | C: PC, SC \| R: Scoped by Class \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official only \| Court: Official only \| Parent: Display title \| Lifebook: Caption |
| `created_at` | TEXT | Case | official | C: System \| R: All roles \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: Timestamp audit \| Parent: Relative date \| Lifebook: No |
| `updated_at` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: Audit trail \| Parent: No \| Lifebook: No |
| `severity` | TEXT | Case | official, working | C: PC, SC, RC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Incidents only \| Court: Incidents \| Parent: No \| Lifebook: No |
| `author` | TEXT | Caregiver | official, working | C: System \| R: PC, SC, AH, RC \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Caregiver Initials \| Court: Attribution \| Parent: No \| Lifebook: No |
| `dcf_draft_generated`|INTEGER| Case | working | C: System \| R: PC, SC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: Internal status \| Court: No \| Parent: No \| Lifebook: No |
| `dcf_draft_text` | TEXT | Case | working | C: System/PC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Draft body \| Court: No \| Parent: No \| Lifebook: No |
| `gal_draft_text` | TEXT | Case | working | C: System/PC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: No \| Court: GAL memo draft \| Parent: No \| Lifebook: No |
| `communication_status`|TEXT | Case | working, official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Internal status \| Court: Status \| Parent: No \| Lifebook: No |
| `mileage` | REAL | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-334B Claim (\$0.67/mi) \| Court: Travel logs \| Parent: No \| Lifebook: No |
| `reimbursement_status`|TEXT| Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-334B Summary \| Court: No \| Parent: No \| Lifebook: No |
| `rpps_category` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: RPPS Report \| Court: Title 33 RPPS \| Parent: Normalcy updates \| Lifebook: Milestone |
| `rpps_decision` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: RPPS Report \| Court: Title 33 RPPS \| Parent: No \| Lifebook: No |

---

### TABLE 4: `licensing_records` (12 Fields)
*Home compliance, safety inspections, fire drills, and training hours.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Caregiver | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | None |
| `record_type` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Licensing audit \| Court: No \| Parent: No \| Lifebook: No |
| `title` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Licensing audit \| Court: No \| Parent: No \| Lifebook: No |
| `record_date` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Licensing audit \| Court: No \| Parent: No \| Lifebook: No |
| `hours` | REAL | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: VCWTP ledger \| Court: No \| Parent: No \| Lifebook: No |
| `provider` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: VCWTP ledger \| Court: No \| Parent: No \| Lifebook: No |
| `status` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Licensing audit \| Court: No \| Parent: No \| Lifebook: No |
| `notes` | TEXT | Caregiver | official, private | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official notes only \| Court: No \| Parent: No \| Lifebook: No |
| `expiry_date` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: License clock \| Court: No \| Parent: No \| Lifebook: No |
| `attachment_path`| TEXT | Caregiver | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Certificates \| Court: No \| Parent: No \| Lifebook: No |
| `attachment_name`| TEXT | Caregiver | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Certificate name \| Court: No \| Parent: No \| Lifebook: No |
| `created_at` | TEXT | Caregiver | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |

---

### TABLE 5: `households` (12 Fields)
*Caregiver residences, physical addresses, licensing capacity, and co-applicants.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Caregiver | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | None |
| `label` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Home label \| Court: No \| Parent: No \| Lifebook: No |
| `notes` | TEXT | Caregiver | private, working | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `created_at` | TEXT | Caregiver | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `address` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official license \| Court: Sealed if protective \| Parent: Strictly Redacted \| Lifebook: No |
| `status` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: License status \| Court: No \| Parent: No \| Lifebook: No |
| `license_status`| TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-221A tracking \| Court: Verification \| Parent: No \| Lifebook: No |
| `primary_caregiver`|TEXT| Caregiver | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Licensee name \| Court: Caregiver name \| Parent: First name only \| Lifebook: "Mom/Dad" |
| `secondary_caregiver`|TEXT| Caregiver | official | C: PC, SC \| R: PC, SC, AH, RC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Co-licensee \| Court: Co-caregiver \| Parent: First name only \| Lifebook: Name |
| `home_owner` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Property owner \| Court: No \| Parent: No \| Lifebook: No |
| `mailing_address`|TEXT | Caregiver | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official mail \| Court: Sealed \| Parent: Strictly Redacted \| Lifebook: No |
| `e911_address` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: E911 verified \| Court: Sealed \| Parent: Strictly Redacted \| Lifebook: No |

---

### TABLE 6: `audit_log` (11 Fields)
*Forward-chained SHA-256 tamper-evident integrity log.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | None |
| `ts` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Audit review \| Court: Tamper audit \| Parent: No \| Lifebook: No |
| `actor` | TEXT | Case / Caregiver | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Audit review \| Court: Attribution \| Parent: No \| Lifebook: No |
| `action` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Audit review \| Court: Action verified \| Parent: No \| Lifebook: No |
| `entity` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Audit review \| Court: Target table \| Parent: No \| Lifebook: No |
| `entity_id` | INTEGER | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Audit review \| Court: Target row \| Parent: No \| Lifebook: No |
| `child_id` | INTEGER | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Scoped audit \| Court: Child scope \| Parent: No \| Lifebook: No |
| `changes` | TEXT (JSON) | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Redacted audit \| Court: Evidence integrity \| Parent: No \| Lifebook: No |
| `reason` | TEXT | Case | official | C: System/User \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Audit review \| Court: Edit reason \| Parent: No \| Lifebook: No |
| `prev_hash` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Cryptographic audit \| Court: Hash link \| Parent: No \| Lifebook: No |
| `row_hash` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: PC, SC \| Arc: PC, SC | DCF: Cryptographic audit \| Court: SHA-256 seal \| Parent: No \| Lifebook: No |

---

### TABLE 7: `compliance_items` (9 Fields)
*State Form FS-221A licensure milestones, criminal record checks, environmental water checks.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Caregiver | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | None |
| `household_id` | INTEGER FK | Caregiver | official | C: PC, SC \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | Scope Filter Only |
| `category` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-221A checklist \| Court: Compliance \| Parent: No \| Lifebook: No |
| `title` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-221A checklist \| Court: Compliance \| Parent: No \| Lifebook: No |
| `status` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-221A checklist \| Court: Compliance \| Parent: No \| Lifebook: No |
| `target_date` | TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-221A deadlines \| Court: Compliance \| Parent: No \| Lifebook: No |
| `completed_date`| TEXT | Caregiver | official | C: PC, SC \| R: PC, SC, AH, SA \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: FS-221A sign-off \| Court: Compliance \| Parent: No \| Lifebook: No |
| `notes` | TEXT | Caregiver | official, working | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official notes only \| Court: No \| Parent: No \| Lifebook: No |
| `created_at` | TEXT | Caregiver | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |

---

### TABLE 8: `posc_plans` (10 Fields)
*Vermont Plan of Safe Care for substance-exposed infants & Children's Integrated Services (CIS).*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Child / Case | official | C: System \| R: All roles \| E: None \| Exp: None \| Arc: PC, SC | None |
| `child_id` | INTEGER FK | Case | official | C: PC, SC \| R: All roles \| E: None \| Exp: None \| Arc: PC, SC | Scope Filter Only |
| `infant_specialty_clinic`|TEXT| Child | official | C: PC, SC \| R: PC, SC, AH, RC, PP, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: POSC Report \| Court: POSC Exhibit \| Parent: Yes (Clinic info) \| Lifebook: Medical Card |
| `nurse_home_visiting`|TEXT| Child | official | C: PC, SC \| R: PC, SC, AH, RC, PP, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: POSC Report \| Court: POSC Exhibit \| Parent: Yes (Provider) \| Lifebook: No |
| `cis_contact` | TEXT | Child | official | C: PC, SC \| R: PC, SC, AH, RC, PP, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: POSC Report \| Court: POSC Exhibit \| Parent: Yes (Provider) \| Lifebook: No |
| `help_me_grow_notes`|TEXT | Child | official, working | C: PC, SC \| R: PC, SC, AH, RC, PP, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: POSC Report \| Court: No \| Parent: Developmental guide \| Lifebook: No |
| `feeding_method` | TEXT | Child | official, shared_family | C: PC, SC, RC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Care Routine \| Court: Care Plan \| Parent: Yes (Formula/routine) \| Lifebook: Baby care page |
| `safe_sleep_plan` | TEXT | Child | official | C: PC, SC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: POSC Sleep Plan \| Court: Safe Sleep verified \| Parent: Safe Sleep guide \| Lifebook: No |
| `soothing_techniques`|TEXT| Child | official, shared_family | C: PC, SC, RC \| R: All roles \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Soothing protocol \| Court: No \| Parent: Yes (Comfort guide) \| Lifebook: Keepsake page |
| `updated_at` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |

---

### TABLE 9: `benefit_claims` (9 Fields)
*Clothing allowances,Reach Up child-only grants, formula benefits, and foundations training stipends.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | None |
| `child_id` | INTEGER FK | Case | official | C: PC, SC \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | Scope Filter Only |
| `benefit_type` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Benefit Claim \| Court: Maintenance support \| Parent: No \| Lifebook: No |
| `amount_claimed`| REAL | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Claim sheet \| Court: Financial ledger \| Parent: No \| Lifebook: No |
| `amount_approved`| REAL | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Approval ledger \| Court: Financial ledger \| Parent: No \| Lifebook: No |
| `status` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Financial ledger \| Court: Financial ledger \| Parent: No \| Lifebook: No |
| `filed_date` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Claim audit \| Court: Filing dates \| Parent: No \| Lifebook: No |
| `decision_date` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Claim audit \| Court: Decisions \| Parent: No \| Lifebook: No |
| `notes` | TEXT | Caregiver | private, working | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Claim explanation \| Court: No \| Parent: No \| Lifebook: No |
| `created_at` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |

---

### TABLE 10: `chins_proceedings` (9 Fields)
*Title 33 juvenile court stages (72hr Temporary Care, Pre-Trial, Merits, Disposition).*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | None |
| `child_id` | INTEGER FK | Case | official | C: PC, SC \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | Scope Filter Only |
| `stage_name` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Court tracking \| Court: Title 33 Stepper \| Parent: Stage name (No notes) \| Lifebook: No |
| `statutory_timeline`|TEXT| Case | official | C: PC, SC \| R: PC, SC, AH, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Court tracking \| Court: Statutory clock \| Parent: Next hearing timeline \| Lifebook: No |
| `hearing_date` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, GP, PP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Hearing calendar \| Court: Hearing calendar \| Parent: Hearing date/time \| Lifebook: No |
| `status` | TEXT | Case | official | C: PC, SC \| R: PC, SC, AH, GP \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Status \| Court: Procedural status \| Parent: Status \| Lifebook: No |
| `caregiver_report_due`|TEXT| Caregiver | official, working | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Report reminder \| Court: Report deadline \| Parent: No \| Lifebook: No |
| `court_docket` | TEXT | Case | official | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Court docket \| Court: Case number \| Parent: Docket number \| Lifebook: No |
| `notes` | TEXT | Caregiver | private, working | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: PC, SC \| Arc: PC, SC | DCF: Official brief only \| Court: Caregiver brief \| Parent: No (Confidential) \| Lifebook: No |
| `created_at` | TEXT | Case | official | C: System \| R: PC, SC, SA \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |

---

### TABLE 11: `self_regulation_plans` (7 Fields)
*Secondary trauma management, stress triggers, tag-team calming strategies for caregivers.*

| Field Name | Type | 1. Domain Ownership | 2. Allowed Classifications | 3. Role Permissions (Create / Read / Edit / Export / Archive) | 4. Output Scope (DCF / Court / Parent / Lifebook) |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `id` | INTEGER PK | Caregiver | private | C: System \| R: PC, SC \| E: None \| Exp: None \| Arc: PC, SC | None |
| `caregiver_name`| TEXT | Caregiver | private | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `stress_triggers`| TEXT | Caregiver | private | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `warning_signs` | TEXT | Caregiver | private | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `calming_strategies`|TEXT| Caregiver | private | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `support_contacts`| TEXT | Caregiver | private | C: PC, SC \| R: PC, SC \| E: PC, SC \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |
| `updated_at` | TEXT | Caregiver | private | C: System \| R: PC, SC \| E: None \| Exp: None \| Arc: PC, SC | DCF: No \| Court: No \| Parent: No \| Lifebook: No |

---

## 3. Data Governance Summary & Redaction Rules

1. **Self-Regulation Isolation:** `self_regulation_plans` is 100% Caregiver domain, permanently classified as `private`. It can NEVER be exported, displayed in reports, or accessed by parent roles.
2. **High-Conflict Redaction Rule:** When High-Conflict Mode is active, all `address`, `phone`, `school`, and location fields in `children`, `households`, `contacts`, and `timeline_records` are strictly masked for parent roles.
3. **Legacy Migration Safeguard:** Any field in `timeline_records` where classification is `legacy_unreviewed` is completely barred from appearing in DCF reports, Court packets, Parent feeds, or Lifebooks until affirmative caregiver classification.
