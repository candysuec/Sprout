# SPRINGBOARD FOUNDATION SPECIFICATION
## North Star, Architectural Boundaries & Design Constitution
**Project:** Sprout / KinCare OS  
**Date:** October 13, 2026  
**Auditor / Architect:** Sprout Systems Engineering  
**Version:** 1.0.0 (Foundation Lockdown)  

---

## 1. MISSION STATEMENT

Sprout / KinCare OS exists to protect children, empower foster and kinship families, and eliminate administrative chaos for Vermont caregivers navigating the Department for Children and Families (DCF) ecosystem. 

Sprout transforms complex child-welfare compliance into an intuitive, privacy-first caregiver copilot—ensuring caregivers remain organized, compliant, court-prepared, and emotionally available for the children in their care.

---

## 2. WHAT SPROUT IS VS. WHAT SPROUT IS NOT

```
+----------------------------------------------------------------------------------------------------+
|                                      PRODUCT BOUNDARY MATRIX                                       |
+----------------------------------------------------------------------------------------------------+
| WHAT SPROUT IS:                                   | WHAT SPROUT IS NOT:                            |
+---------------------------------------------------+------------------------------------------------+
| • A Caregiver Flight Instrument & Copilot         | • A generic baby-tracking or social app        |
| • A Vermont DCF & Court Documentation Shield      | • A state-owned surveillance or case-worker tool|
| • A Privacy-First Child Identity Vault            | • A public photo-sharing / family social feed  |
| • An Offline-First, Zero-Leakage Record System    | • A cloud-dependent multi-tenant SaaS silo    |
| • A VCWTP Training & Sandbox Simulator            | • A replacement for legal counsel or medical care|
| • A Structured Medication & Milestone Ledger      | • A high-friction administrative burden        |
+----------------------------------------------------------------------------------------------------+
```

### The Ecosystem Motto
> *"Never make Candy become the Integration Layer, Memory Layer, Orchestration Layer, Prompt Engineering Layer, Approval Clerk, Detective, or Debugger when the system can do that work instead."*

---

## 3. PRIMARY USERS & CAREGIVER JOURNEY PERSONAS

Sprout is engineered primarily for **Vermont Caregivers** across the full spectrum of child-welfare care:
1. **Kinship Caregivers & Grandfamilies:** Relatives stepping up during sudden crises who need clear guidance on stipends, custody orders, and family-time documentation.
2. **Licensed Foster Parents:** Caregivers managing complex multi-child routines, medication logs, school IEPs, and quarterly DCF reviews.
3. **Respite Providers:** Short-term caregivers needing instant 60-second handoff summaries, emergency contacts, allergy warnings, and bedtime routines.
4. **Foster-to-Adopt Caregivers:** Families preparing for permanency, termination of parental rights (TPR) proceedings, and post-adoption transition.
5. **Emergency Placement Caregivers:** Homes accepting 72-hour emergency intakes that require rapid clothing inventories, medical clearances, and trauma de-escalation logs.

---

## 4. CHILD PRIVACY & CHILD REFERENCE ID STANDARDS

Child privacy is Sprout's foundational bedrock. A screenshot or casual glance must never compromise a child's legal identity.

### 4.1 The Reference ID Standard
* **Format Structure:** `[Initials]-[MMDDYY]` (e.g., `CD-090926`) or Synthetic Sandbox ID `[Initials]-[Entity#]` (e.g., `CH-201`).
* **Display Hierarchy:** 
  - Primary UI, Headers, Flight Strips, Cards, and Search must **always** display the Child Reference ID first.
  - Legal surnames must **never** appear in unmasked top-level flight strips or header summaries.
* **Privacy Presentation Mode:** A 1-click toggle that instantly blurs all real names, Medicaid IDs, street addresses, and dates of birth across all open screens for demonstration or court review.
* **Metadata Scrubbing:** All exported documents (`.docx`, `.ics`, `.zip`) are automatically stripped of operating system author tags, file system user paths, and machine identifiers.

---

## 5. NON-NEGOTIABLE DESIGN PRINCIPLES

Every feature must conform to these eight core tenets:
1. **Protect Children First:** Privacy and psychological safety precede all technical convenience.
2. **Zero Memory Tax:** The system must remember appointments, refill dates, and court deadlines so the caregiver does not have to.
3. **60-Second Orientation:** When a caregiver opens Sprout, they must know where they are, what matters, what is complete, what is active, and what is next in under 60 seconds.
4. **Strict Environment Boundary:** `Welcome Mode ≠ Sample Sandbox ≠ Local Production`. No sample record may ever write to local storage; no local file may ever be accessed from the sandbox.
5. **Offline Resiliency:** Core features must function flawlessly without internet connectivity.
6. **Objective Documentation Standards:** All incident and contact prompts must enforce factual, non-judgmental, court-admissible language.
7. **Single-Source Record:** A single record entry should seamlessly populate the MAR, calendar, timeline, and monthly report without duplicate data entry.
8. **Cryptographic Auditability:** Every write operation is anchored with an immutable SHA-256 hash log to guarantee court evidentiary validity.

---

## 6. VERMONT DCF ALIGNMENT PRINCIPLES

Sprout aligns directly with Vermont Department for Children and Families (FSD) regulations:
* **DCF Reimbursement Forms:** Native support for State Forms `FS-334B` (Mileage at \$0.67/mile) and `FS-333B` (Caregiver Expense Claims).
* **CHINS Timelines:** Automatic tracking of 60-day initial reviews, 6-month permanency hearings, and annual court disposition schedules.
* **VCWTP Training Credit Hours:** Direct mapping to Vermont Child Welfare Training Partnership annual licensing quotas (15–20 hours/year).
* **Plan of Safe Care (POSC):** Standardized documentation protocols for substance-exposed infants in accordance with Vermont Title 33.

---

## 7. SUCCESS METRICS & DECISION-MAKING FRAMEWORK

### 7.1 Quantitative Success Metrics
* **Orientation Speed:** Caregiver understands daily tasks and emergency alerts within **10 seconds** of opening the app.
* **Daily Admin Time:** Reduced to **under 15 minutes per day** for all routine logging.
* **Zero PII Exposure:** 100% compliance across all exports and flight strips with zero accidental surname disclosures.
* **Audit Chain Integrity:** 100% verification pass on SHA-256 cryptographic audit logs.

### 7.2 The 8-Point Feature Gate (Decision Framework)
Before any pull request or enhancement is approved, it must pass at least one of these tests:
1. Does it protect children?
2. Does it reduce caregiver burden?
3. Does it improve documentation?
4. Does it improve compliance?
5. Does it improve communication?
6. Does it strengthen privacy?
7. Does it support Vermont DCF workflows?
8. Does it reduce caregiver stress?

*If the answer to all eight questions is NO, the feature is rejected.*

---
*Certified as Sprout's Permanent Foundation North Star.*
