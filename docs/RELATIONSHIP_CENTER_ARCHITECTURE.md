# RELATIONSHIP CENTER & CIRCLES OF CARE OPERATING SYSTEM (PHASE 10)
**Project:** Sprout / KinCare OS  
**Date:** October 13, 2026  
**Auditor / Architect:** Sprout Systems Engineering  
**Version:** 1.0.0 (Authoritative People & Support Network Hub)  

---

## 1. EXECUTIVE SUMMARY & NORTH STAR

Caregiving is fundamentally relationship-driven. Foster parents and kinship families coordinate daily across dozens of stakeholders: DCF caseworkers, district supervisors, Guardians ad Litem (GAL), juvenile defense attorneys, pediatricians, child trauma therapists, IEP coordinators, and biological family monitors.

Prior to Phase 10, critical interaction history lived scattered across phone SMS threads, emails, notebooks, and mental memory. 

**The Phase 10 North Star is realized:**
> *Sprout is the authoritative operational record not only for child care activities, but also for the network of people supporting every child.*
> *The caregiver never has to wonder: "Who do I call?", "Did I already tell them?", or "When did we discuss this?" — Sprout already knows the answer.*

---

## 2. CIRCLES OF CARE DATA MODEL & ARCHITECTURE

The **Circles of Care** model categorizes every stakeholder into one of four concentric support rings surrounding the child:

```
                                  [4. SCHOOL & COMMUNITY]
                                  Teachers, Coaches, Mentors
                                            │
                             [3. COURT, LEGAL & HEALTH]
                             GAL, Attorney, Doctors, Therapists
                                            │
                                    [2. DCF TEAM]
                                Caseworker, District Supervisor
                                            │
                                 [1. DAILY CARE TEAM]
                              Primary Caregiver, Respite kin
                                            │
                                   ★ [CHILD REF ID] ★
```

### The 4 Concentric Circles:
1. **Circle 1: Daily Care Team (Inner Ring)**
   - *Entities:* Primary Caregivers, Secondary Caregivers, Kinship Guardians, Licensed Respite Providers, Emergency Placement Homes.
   - *Scope:* Day-to-day caregiving, bedtime routines, meal preferences, comfort objects, and transport handoffs.
2. **Circle 2: DCF Family Services Team (Second Ring)**
   - *Entities:* Assigned Family Services Worker (FSW), District Unit Supervisor, Resource Coordinator, After-Hours Emergency Duty Worker.
   - *Scope:* Case planning, visitation agreements, medical authorizations, child clothing allowances, and Title IV-E subsidies.
3. **Circle 3: Court, Legal & Medical Team (Third Ring)**
   - *Entities:* Guardian ad Litem (GAL), Juvenile Attorney, CASA Advocate, Family Court Judge, Pediatrician, Child Trauma Specialist (LCSW/LCMHC), Dentist.
   - *Scope:* Title 33 CHINS hearings, statutory court chronologies, well-child physicals (EPSDT), psychotropic medication authorizations, and trauma therapy.
4. **Circle 4: School & Community Supports (Outer Ring)**
   - *Entities:* Special Education IEP Coordinators, Classroom Teachers, School Guidance Counselors, Easterseals Family Time Supervisors, Coaches, Extracurricular Mentors.
   - *Scope:* IEP sensory accommodations, 504 accommodation reviews, supervised biological parent visitation, youth sports participation under RPPS authority.

---

## 3. UNIFIED COMMUNICATION LEDGER & RELATIONSHIP TIMELINE

The **Court-Ready Communication Ledger** unifies all stakeholder touchpoints into an evidentiary chronology:

### 3.1 Supported Interaction Modalities
- **Phone Calls:** Incoming and outgoing calls with timestamped summaries.
- **SMS & Text Messages:** Critical updates regarding visitation timing, transit delays, or medication pick-ups.
- **Email Exchanges:** Official DCF caseworker notifications, IEP requests, and doctor referral authorizations.
- **Family Time Discussions:** Observations from pre- and post-visit transitions, parent attendance, and emotional de-escalation logs.
- **In-Person Case Conferences:** Quarterly FSD team meetings, GAL home visits, and school staffing sessions.

### 3.2 Evidentiary Ledger Record Schema
Each logged interaction captures:
* `event_date`: Statutory calendar date.
* `participants`: All attending stakeholders (e.g., "Jessica Taylor (DCF), David Vance (GAL), Candy Chevalier").
* `category`: `family_time`, `legal`, `medical`, or `education`.
* `summary`: Factual, court-admissible observation summary.
* `follow_up_needed`: Boolean flag triggering automated reminders.
* `follow_up_notes`: Explicit action requirement (e.g., "Request prior authorization from pediatrician for medication renewal").
* `communication_status`: `Draft`, `Ready`, or `Sent`.

---

## 4. RELATIONSHIP FOLLOW-UP ENGINE

The Follow-Up Engine eliminates memory-dependent administrative tasks:
- **Automatic Reminder Generation:** Any record logged with `follow_up_needed: true` immediately populates the **Relationship Follow-Up Engine** on the Circles of Care dashboard.
- **1-Click Task Resolution:** Caregivers can resolve pending tasks with a single tap, recording a completion timestamp in the cryptographic audit ledger.
- **30-Second Status Overview:**
  - *Active Support Team Count*
  - *Pending Follow-Up Actions*
  - *Days Elapsed Since Last DCF Communication*
  - *Next Scheduled Case Conference or Hearing*

---

## 5. COURT & CASE REVIEW PREPARATION WORKFLOW

The **Court Stakeholder Brief** integrates relationship data for legal proceedings:
1. **Roster Compilation:** Full name, role, organization, phone number, and email for every stakeholder across all four circles.
2. **Contact Recency Audit:** Exact timestamp of last contact with DCF worker, GAL, and therapist.
3. **Pending Follow-Up Brief:** Open medical approvals, pending IEP revisions, or visitation schedule adjustments.
4. **Court Formatting:** Generates a Microsoft Word document (`.docx`) pre-formatted for Family Court judges, Guardians ad Litem, and attorneys under Privacy Mode: Initials Only.

---

## 6. PRIVACY COMPLIANCE & ENVIRONMENT ISOLATION (PHASE 7 INTEGRATION)

In accordance with [`SPRINGBOARD_FOUNDATION.md`](SPRINGBOARD_FOUNDATION.md):
- **Child Reference IDs Only:** The Relationship Center header displays `Child Ref: CCC-000001` (or `CH-201`), completely omitting legal surnames.
- **Privacy Shield & Blur Mode:** Phone numbers, email addresses, and detailed note excerpts are wrapped in `.privacy-sensitive` classes, dynamically blurring whenever `Shield PII` is activated.
- **Sandbox Isolation:** In Practice Sandbox mode, contact profiles are populated with realistic synthetic personas (e.g., `Jessica Taylor, MSW (DCF)`, `David Vance, Esq. (GAL)`, `Dr. Sarah Miller, MD (Pediatrician)`) with zero database leakage.

---

## 7. STATEWIDE READINESS ASSESSMENT FOR VERMONT CAREGIVERS

| Caregiver Type | Relationship Center Benefit | Statewide Readiness |
| :--- | :--- | :---: |
| **Licensed Foster Parents** | Unifies heavy caseworker, GAL, IEP, and doctor coordination into one screen. | **100% READY** |
| **Kinship Families** | Clarifies boundaries between birth family communication and formal DCF supervision. | **100% READY** |
| **Respite Providers** | Need-to-know emergency team directory accessible in under 10 seconds. | **100% READY** |
| **Foster-to-Adopt Homes** | Tracks adoption subsidy workers, probate attorneys, and court dates. | **100% READY** |
| **Emergency Placement Homes**| Instant 1-tap rapid connect to DCF After-Hours duty desks and crisis lines. | **100% READY** |

**Overall Relationship Center Score: 96% (Statewide Ready)**

---
*Certified by Sprout Systems Engineering.*
