# Sprout / KinCare OS — Master Role & Permission Matrix (v2.0)
**Document Version:** 3.1.1 (Phase 13A Pre-Implementation Governance Review)  
**Status:** Approved Access Control Specification  
**Effective Date:** October 14, 2026  
**Governing Standard:** [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)  

---

## 1. Role Architecture & Authority Hierarchy

Sprout enforces strict Role-Based Access Control (RBAC) across 8 defined user roles. All roles operate under **Child-Scoped Permitting**: an identity possesses permissions strictly within the boundary of specifically assigned child records.

External contacts (DCF caseworkers, GALs, judges, pediatricians, teachers) are **Recipients of Structured Outputs**, not authenticated users.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             ROLE AUTHORITY TIERS                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│ TIER 1: Sovereign Caregiver Admins (Primary Caregiver, Secondary Caregiver)      │
│ TIER 2: Household & Operational Support (Additional Household, Respite Caregiver)│
│ TIER 3: Family Participants (Parent Participant, Guardian Participant)           │
│ TIER 4: Read-Only & Historical Viewers (Child Archive Viewer)                    │
│ TIER 5: Technical Infrastructure (System Administrator - No PII Access)          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Definitive Eight-Role Governance Matrix

| Role Code & Title | Can Read | Can Write (Create/Edit) | Can Export (Reports/Claims) | Can Archive (Retention Lifecycle) | Can Share (Structured Feed) | Can Approve (Link/Milestone) | Can Invite (Users/Roles) | Can Revoke (Access Termination) | Security Boundaries & Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PC: Primary Caregiver** | ✅ **Full Access:** All 4 domains (Child, Case, Caregiver, Parent) across all classifications. | ✅ **Full:** Children, notes, meds, visits, contacts, licensing. | ✅ **Full:** DCF monthly reports, court packets, FS-334B claims, Lifebooks, backup ZIP. | ✅ **Full:** Can transition child from `Active` to `Archived` or `Legal Hold`. | ✅ **Full:** Approves and posts items to Structured Family Feed. | ✅ **Full:** Approves parent account links, goal milestones, and reports. | ✅ **Full:** Can invite secondary, respite, and parent participants. | ✅ **Full:** 1-Tap emergency revocation across all linked roles. | Sovereign administrator of household data; ultimate human gatekeeper. |
| **SC: Secondary Caregiver** | ✅ **Full Access:** Identical to Primary Caregiver. | ✅ **Full:** Daily notes, MAR meds, visit logs, appointment updates. | ✅ **Full:** DCF reports, mileage claims, calendar exports. | ✅ **Co-Admin:** Can initiate archive transition with PC notification. | ✅ **Full:** Approves and posts items to Structured Family Feed. | ✅ **Full:** Can approve goal updates and routine records. | ✅ **Co-Admin:** Can invite respite and household assistants. | ✅ **Co-Admin:** Can revoke respite or parent access in emergencies. | Co-licensee in the home (e.g. partner, spouse, verified co-applicant). |
| **AH: Additional Household** | 🟡 **Operational:** View official records, schedules, routines, and contacts. | 🟡 **Operational:** Log routine notes, checklist completion, daily observations. | ❌ **No:** Cannot generate official state reports or claims. | ❌ **No:** No archive authority. | ❌ **No:** Cannot publish to parent feed. | ❌ **No:** Cannot approve legal or parent submissions. | ❌ **No:** No invitation rights. | ❌ **No:** No revocation rights. | Adult household residents (e.g. adult siblings, extended kin in home). `private` caregiver notes hidden. |
| **RC: Respite Caregiver** | 🟡 **Need-to-Know:** Medication schedules, allergies, soothing routines, bedtime plans. | 🟡 **Temporary:** Log medication doses given and incident notes during care window. | ❌ **No:** Cannot export official state documents. | ❌ **No:** No archive authority. | ❌ **No:** Cannot publish to parent feed. | ❌ **No:** No approval rights. | ❌ **No:** No invitation rights. | ❌ **No:** No revocation rights. | Weekend/hourly care providers. Zero access to legal history, biological family notes, or court orders. |
| **PP: Parent Participant** | 🟡 **Parent Portal Only:** View assigned goals, confirmed visit times, and approved `shared_family` feed. | 🟡 **Contributor:** Upload certificates, housing evidence, and submit structured reactions. | ❌ **No:** Cannot generate DCF reports or claims. | ❌ **No:** No archive authority. | ❌ **No:** Can only submit structured responses (`Thank You`, `Add Memory`). | ❌ **No:** Cannot approve records. | ❌ **No:** Cannot invite other users. | ❌ **No:** Cannot revoke access. | Biological parents. Unlinked by default. Strictly child-scoped. Caregiver address and private notes 100% air-gapped. |
| **GP: Guardian Participant** | 🟡 **Approved Case View:** View goals, approved health milestones, and public court hearing dates. | 🟡 **Contributor:** Upload legal or custody transition documentation. | ❌ **No:** Cannot export official state claims. | ❌ **No:** No archive authority. | ❌ **No:** Cannot publish to feed directly. | ❌ **No:** Cannot approve records. | ❌ **No:** Cannot invite other users. | ❌ **No:** Cannot revoke access. | Permanent guardians, pre-adoptive resources, or kin champions. |
| **CA: Child Archive Viewer** | 🟡 **Lifebook Only:** View personal Life Journey stories, artwork, photos, and positive milestones. | ❌ **No:** Read-only keepsake viewer. | 🟡 **Personal:** Can download personal Lifebook PDF album. | ❌ **No:** No archive authority. | ❌ **No:** Cannot share data. | ❌ **No:** Cannot approve records. | ❌ **No:** Cannot invite users. | ❌ **No:** Cannot revoke access. | Transitioned youth or adult former foster youth receiving their digital Lifebook keepsake. |
| **SA: System Administrator** | ❌ **Zero PII:** System health metrics, DB integrity status, and raw cryptographic hashes only. | ❌ **No:** Cannot write child or case records. | 🟡 **Technical:** Can export system error logs and disaster-recovery backup snapshots. | ❌ **No:** No domain archive authority. | ❌ **No:** Cannot share content. | ❌ **No:** Cannot approve case records. | ❌ **No:** Cannot link parent accounts. | ❌ **No:** Cannot revoke family access. | Technical support / developer role. Database encryption ensures zero visibility into confidential case data. |

---

## 3. High-Conflict Mode Role Restrictions

When High-Conflict / Protective Order Mode is active:
* **Parent Participants (PP):**
  * Address fields across all views are masked with `"CONFIDENTIAL / SEALED"`.
  * Phone numbers for caregivers and non-public contacts are masked.
  * Direct contact action buttons are disabled.
  * Milestone commenting is restricted to pre-set affirmations (`"Thank You"`).
* **Caregiver Safeguards:**
  * System alerts Primary Caregiver if a document being shared contains un-redacted location landmarks.
