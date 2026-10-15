# Sprout / KinCare OS — Child & Family Success Operating System
## Foundational Architecture & Strategic Constitution

**Document Status:** Approved Architectural Baseline (v3.1.0 Governance Hardened)  
**Effective Date:** October 14, 2026  
**Governing Standard:** Child Safety First, Caregiver Success First, Trauma-Informed Engagement  
**Repository Remote:** [github.com/candysuec/Sprout](https://github.com/candysuec/Sprout.git)  

> **LEGAL REVIEW REQUIRED:** Sprout is an independent documentation assistance tool designed to support caregiver organization, child welfare confidentiality, tamper-evident record keeping, and documentation integrity. Sprout does not provide legal advice, does not guarantee legal admissibility or court outcomes, and is not an official system of the Vermont Agency of Human Services or the Department for Children and Families. All reports, exhibits, and filings should be reviewed with legal counsel or the assigned caseworker prior to submission.

---

## 1. Core Platform Identity: What Sprout Is & Is Not

### What Sprout Is NOT
* **NOT** a DCF case management system
* **NOT** a Guardian ad Litem (GAL) platform
* **NOT** a court management platform
* **NOT** a state database or CCWIS/SACWIS replacement
* **NOT** a social media network
* **NOT** an unrestricted messaging or chat platform

### What Sprout IS
Sprout is a **Child and Family Success Operating System**.

Its singular mission is to empower:
* Foster caregivers
* Kinship & relative caregivers
* Respite caregivers
* Adoptive & pre-adoptive caregivers
* Approved Parent Participants
* Approved Legal Guardians

The platform exists to advance:
1. **Child Safety:** Safeguarding vulnerable youth through tamper-evident records and airtight medical routines.
2. **Child Stability:** Minimizing placement disruptions and cognitive distress.
3. **Family Engagement:** Supporting parents in achieving milestones and staying connected.
4. **Reunification When Appropriate:** Providing structured, healthy pathways toward reuniting families.
5. **Permanency:** Accelerating clear, documented paths to guardianship or adoption when reunification is not possible.
6. **Caregiver Success & Burnout Prevention:** Shrinking administrative overhead from 45+ minutes to under 8 minutes per day.
7. **Documentation Readiness:** Producing timestamped, auditable Title 33 briefs and FS-334B reimbursement claims with 1 click.

---

## 2. The DCF Principle: Integration Through Structured Outputs

Sprout recognizes that state child welfare workers operate under high caseloads and strict IT policies.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          THE DCF PRINCIPLE                             │
├────────────────────────────────────────────────────────────────────────┤
│ • DCF WILL NOT create accounts.                                        │
│ • DCF WILL NOT configure or administer the platform.                   │
│ • DCF WILL NOT provide technical support or undergo training.         │
│                                                                        │
│ Sprout integrates with DCF exclusively through OUTPUTS:                │
│ 1. Formal DCF Monthly Summaries (.docx / PDF)                          │
│ 2. Pre-filled State Form FS-334B Mileage Claims ($0.67/mi)             │
│ 3. Chronological Court Exhibit Briefs & EPSDT Medical Digests          │
│ 4. Email-ready caseworker communication summaries                      │
│                                                                        │
│ DCF gains immediate, organized value without ever logging into Sprout. │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The Homepage Principle: Attention Over Navigation

The system homepage shall **never** ask:
> *"Where do I want to navigate?"*

The system homepage shall **always** answer:
> **"What needs my attention today?"**

All UX design decisions prioritize:
* **Immediate Action:** Medication due times, visit logistics, and urgent tasks surfaced on card flight strips.
* **Low Cognitive Load:** Complex administrative workflows are collapsed until contextually needed.
* **Stress Reduction:** Calming color palettes (slate, emerald, indigo) and peaceful layout rhythms.
* **Clear Next Steps:** One-tap confirmation buttons for daily caregiving routines.

---

## 4. Four-Tier Data Ownership Model

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            SPROUT DATA DOMAINS                                   │
├────────────────────┬────────────────────┬───────────────────┬────────────────────┤
│ 1. CHILD DATA      │ 2. CASE DATA       │ 3. CAREGIVER DATA │ 4. PARENT DATA     │
├────────────────────┼────────────────────┼───────────────────┼────────────────────┤
│ • Lifebook stories │ • Visit logs       │ • Private notes   │ • Goal progress    │
│ • Keepsake photos  │ • Court hearings   │ • Draft reflections│ • Certificates    │
│ • Milestones & art │ • Medical / EPSDT  │ • Internal tasks  │ • Housing updates  │
│ • Comfort routines │ • Mileage (FS-334B)│ • Stress checks   │ • Class completion │
│ • Food preferences │ • School records   │ • Reminders       │ • Parent thoughts  │
├────────────────────┼────────────────────┼───────────────────┼────────────────────┤
│ Ownership:         │ Ownership:         │ Ownership:        │ Ownership:         │
│ Belongs to child;  │ Verified case log; │ Sole property of  │ Belongs to parent; │
│ transfers upon     │ immutable for court│ caregiver; NEVER  │ controlled sharing │
│ permanency/aging.  │ defense & audits.  │ auto-shared.      │ to case plan.      │
└────────────────────┴────────────────────┴───────────────────┴────────────────────┘
```

---

## 5. Four-Tier Note Classification & Legacy Migration Model

Every note or record created in Sprout carries one of four security classifications:

1. **Private Caregiver Notes (`private`):** Completely confidential personal observations, emotional reflections, and internal reminders. *Never shared with parents, never printed in reports, never transmitted.*
2. **Working Notes (`working`):** Draft observations, preparation questions for medical providers, and internal coordination notes between co-caregivers. Not finalized for court or state review.
3. **Official Records (`official`):** Factual, objective, timestamped entries (medical appointments, school conferences, family visits, behavioral incidents). Cryptographically anchored in the forward-chained SHA-256 tamper-evident audit ledger. Formatted for state and court review.
4. **Shared Family Content (`shared_family`):** Selected positive photos, child developmental milestones, school artwork, and celebration moments approved by the caregiver for the Parent Participant Workspace.

### 5.1 Legacy Migration Rule (`legacy_unreviewed`)
All pre-existing notes created prior to v3.1 are automatically assigned the state `legacy_unreviewed`.
* **Zero Output Exposure:** Any note tagged `legacy_unreviewed` is strictly excluded from all DCF Monthly Summaries, court exhibit briefs, parent feeds, and digital binders until reviewed.
* **Caregiver Reclassification:** The primary caregiver must review and affirmatively re-classify legacy notes to make them active.

---

## 6. High-Conflict / Protective Order Security Architecture

When a child's case involves domestic violence, protective orders, substance volatility, or safety risks, Sprout activates **High-Conflict / Protective Order Mode**:

* **Caregiver Location Hidden:** Physical addresses, town names, and street details are redacted across all parent-facing views.
* **Metadata & GPS Stripped:** All uploaded photos have Exif metadata, camera serial numbers, and geotags stripped automatically before storage or display.
* **Location Landmarks Masked:** School names, pediatric clinic names, and daycares are masked.
* **Refined 5-Gate Sharing Control Hierarchy:** Information sharing must clear all 5 sequential gates before release:
  $$\text{Gate 1: Verified Legal Restrictions} \longrightarrow \text{Gate 2: Verified Safety Requirements} \longrightarrow \text{Gate 3: System Access Rules} \longrightarrow \text{Gate 4: Authorized Caregiver Decision} \longrightarrow \text{Gate 5: Human Review Before External Release}$$

---

## 7. Structured Family Engagement Feed

Sprout replaces open chat channels with a **Structured Family Engagement Feed**:
* **Caregivers Share:** Photos, school accomplishments, and milestones.
* **Parents Respond With Structured Actions:**
  * `"Thank You"` (One-tap heart/acknowledgment)
  * `"Add Memory"` (Attaching a childhood memory)
  * `"Upload Related Photo"` (Attaching a family picture)
  * `"Send Encouragement"` (Curated uplifting note templates for the child)
  * `"Submit Goal Update"` (Linking milestone to personal parenting progress)

This prevents conflict, harassment, and evidentiary disputes while promoting positive parent-child bonds.

---

## 8. Eight-Role Permission Matrix

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             ROLE PERMISSION MATRIX                               │
├──────────────────────┬──────────┬──────────┬──────────┬──────────┬───────────────┤
│ Role                 │ Official │ Private  │ Parent   │ Evidence │ FS-334B Claim │
│                      │ Records  │ Notes    │ Feed     │ Upload   │ Generation    │
├──────────────────────┼──────────┼──────────┼──────────┼──────────┼───────────────┤
│ Primary Caregiver    │ ✅ Full  │ ✅ Yes   │ ✅ Admin │ ❌ No    │ ✅ Yes        │
│ Secondary Caregiver  │ ✅ Full  │ ✅ Yes   │ ✅ Admin │ ❌ No    │ ✅ Yes        │
│ Add'l Household      │ ✅ Full  │ ❌ No    │ ❌ No    │ ❌ No    │ ❌ No         │
│ Respite Caregiver    │ 🟡 Routine│ ❌ No    │ ❌ No    │ ❌ No    │ ❌ No         │
│ Parent Participant   │ ❌ No    │ ❌ No    │ ✅ View  │ ✅ Yes   │ ❌ No         │
│ Guardian Participant │ 🟡 Approved│ ❌ No   │ ✅ View  │ ✅ Yes   │ ❌ No         │
│ Child Archive Viewer │ 🟡 Lifebook│ ❌ No   │ ❌ No    │ ❌ No    │ ❌ No         │
│ System Administrator │ ❌ Zero PII│ ❌ No   │ ❌ No    │ ❌ No    │ ❌ No (DB only)│
└──────────────────────┴──────────┴──────────┴──────────┴──────────┴───────────────┘
```

---

## 9. Data Retention & Archive Governance Lifecycle

Sprout replaces "archive forever" with a structured **5-State Data Retention Lifecycle**:

1. **Active:** Daily logging active; child actively placed in home; full access across enabled cognitive domains.
2. **Archived:** Child discharged / case closed; records placed in read-only historical status; fully searchable; zero new daily entries.
3. **Legal Hold:** Explicit dispute or court flag; freezes disposition reviews; cryptographic hash locked; logs retained immutably.
4. **Transfer Pending:** Child transitioning to permanency or adulthood; Child Data staged for curated Lifebook export.
5. **Disposition Review:** Post-statutory milestone (e.g., 7 years post-age of majority); caregiver prompted to encrypt or offline archive locally.

---

## 10. Child-Scoped Access Boundaries

* All parent and caregiver permissions are scoped strictly to `(user_id, child_id)`.
* In multi-child foster and kinship homes, parents have zero access to sibling records or unrelated foster children.
* Household management records (fire drills, licensing, finances) are strictly segregated from child profiles.
