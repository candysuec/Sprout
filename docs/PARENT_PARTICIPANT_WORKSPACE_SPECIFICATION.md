# Sprout / KinCare OS — Parent Participant Workspace Specification

**Document Version:** 3.1.0 (Governance Hardened Baseline)  
**Governing Document:** [`docs/CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md) & [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)  
**Authoritative Reference:** Sprout Child & Family Success OS  

---

## 1. Executive Purpose & Contributor Philosophy

The Parent Participant Workspace is a dedicated, dignity-affirming environment built specifically for biological parents and approved guardians working toward family reunification or positive family engagement.

Parents in Sprout are **Contributors**, not administrative collaborators. The workspace is engineered to help parents demonstrate tangible progress, build evidence portfolios, celebrate child milestones, and stay connected without creating safety vulnerabilities or administrative burden for caregivers.

---

## 2. Unlinked Self-Registration & Identity Safety Model

To prevent unauthorized access, harassment, or accidental breaches of protective orders, Sprout enforces an **Air-Gapped, Unlinked Self-Registration Model**:

```
[Parent Registers Account]
            │
            ▼
[State: Pending Verification (UNLINKED)]  <--- ZERO child names, initials, photos visible
            │
            ▼
[Identity Proof & Caseworker Info Submitted]
            │
            ▼
[Caregiver Validates Court Orders & Safety Plan]
            │
            ▼
[Caregiver Explicitly Links Account to Child ID]
            │
            ▼
[State: Active Standard Access]  <--- Scoped STRICTLY to linked child
```

1. **Blind Initial State:** Newly registered parent accounts see only an identity submission screen. No child information is exposed.
2. **Mandatory Caregiver Approval Gate:** No account can link to a child without active primary caregiver review and confirmation of court authorizations.
3. **Child-Scoped Permitting:** Parents never gain access to household records, sibling profiles, caregiver reflections, or unrelated children.
4. **Session Expiration:** Access expires after 90 days unless renewed.
5. **Instant Emergency Revocation:** Caregivers have a 1-tap `[Revoke Access]` switch that immediately terminates access.

---

## 3. Ten-State Parent Participant Access Lifecycle

Parent access is governed by an audited finite-state machine:

| Access State | Visibility / Capability | Transition Trigger |
| :--- | :--- | :--- |
| **1. Pending Verification** | Zero child data; identity upload only | Initial self-registration |
| **2. Pending Child Link** | Identity verified; relationship pending | Verification review pass |
| **3. Active Standard Access** | View goals, evidence upload, approved feed | Caregiver affirmative link |
| **4. Active Restricted Access**| View goals, evidence upload, view-only feed | Safety plan / supervised mandate |
| **5. Temporarily Suspended** | Access frozen (24-72 hr cool-off) | Caregiver manual flag |
| **6. Safety Suspension** | Instant security lock | Flagged boundary violation |
| **7. Court Restricted** | Formal judicial suspension | Court order entered |
| **8. Expired** | Session terminated | 90-day timeout reached |
| **9. Revoked** | Permanent administrative termination | Formal revocation action |
| **10. Archived Participant**| Read-only archive status | Case closed / permanency |

---

## 4. Parent Landing Experience: "My Family Success Portal"

The Parent Home Screen answers one essential question:
> **"What positive steps am I taking toward my family's success today?"**

### Primary UI Modules
1. **My Progress Header:**
   - Visual progress bar showing completion percentage across all assigned court and DCF case goals (e.g., 3 of 4 goals active).
   - Encouraging status message affirming progress.
2. **Upcoming Family Time Card:**
   - Countdown to next visit (Date, Time, Location).
   - Practical preparation checklist (snack reminder, favorite game notes, comfort routines).
3. **Goal Tracking & Evidence Locker:**
   - Categorized goal cards: Housing Stability, Parenting Education, Wellness & Recovery, Employment.
   - 1-Tap photo/document upload for certificates, lease agreements, and pay stubs.
4. **Structured Child Engagement Feed:**
   - Stream of caregiver-approved child milestones, artwork, and photos.
   - 5 structured response actions: `"Thank You"`, `"Add Memory"`, `"Upload Photo"`, `"Send Encouragement"`, `"Submit Goal Update"`.

---

## 5. Evidence Portfolio & Progress Packaging

Parents frequently struggle to prove compliance to caseworkers and courts because paper certificates get lost. Sprout provides:

* **1-Tap Certificate Capture:** Parents take a photo or upload a PDF of class certificates or drug screens.
* **Auto-Timestamped Verification:** Uploads are time-stamped and cataloged under the relevant case plan goal.
* **Parent Progress Packet Generator:** Generates a clean, professional summary of parent-submitted achievements that can be shared with the DCF worker or parent's attorney for case reviews.

---

## 6. High-Conflict & Safety Air-Gap Enforcement

The Parent Participant Workspace operates under an ironclad security barrier:
* **Zero Location Exposure:** Caregiver home address, town of residence, and neighborhood landmarks are completely invisible.
* **Zero Access to Private Notes:** Caregiver private reflections, working drafts, and internal household reminders cannot be accessed.
* **Zero Child Contamination:** Parents only see data for their specific child.
* **Sanitized Media:** All images in the feed have Exif and GPS metadata stripped prior to rendering.
