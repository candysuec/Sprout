# Vermont Foster Care Licensing Rules & Application (FS-221A) Gap Analysis
**Sprout KinCare OS — Regulatory Compliance & Household Safety Audit**
**Date:** October 2026  
**Governing Authorities:** 
* *Vermont Statutes Annotated Title 33 § 4905 & § 151*
* *Vermont DCF Family Services Division: Licensing Rules for Foster Homes in Vermont (Updated May 16, 2023)*
* *Vermont AHS / DCF-FSD Form FS-221A: Application for Care of Children in DCF Custody*

---

## Executive Summary

A comprehensive line-by-line review was conducted comparing Sprout KinCare OS (`households` and `licensing` modules) against Vermont's official foster home licensing regulations and the state application document (FS-221A). 

While Sprout currently excels at daily 15-second routine logging, Title 33 progress reports, and VCWTP training hour tracking, the underlying **Household & Licensing database models** lack several explicit statutory physical safety mandates, bedroom exit standards, capacity caps, and the 10 mandatory background clearance checks.

---

## 1. Statutory Capacity & Bedroom Limits (Rules 046–051 & 417–421)

| Requirement | Rule / Citation | Current Sprout State | What Must Be Added |
| :--- | :--- | :--- | :--- |
| **Foster Child Limit** | Rule 047 | Freeform text | Hard counter: Maximum 4 foster children allowed per home. |
| **Initial License Limit** | Rule 048 | Freeform text | Hard counter: Maximum 2 foster children for first-year licenses. |
| **Young Children Limit** | Rule 049 | None | Maximum 4 children under 6 years of age (including biological & foster). |
| **Infant / Toddler Limit** | Rule 050 | None | Maximum 2 children under 24 months living in or regularly cared for. |
| **Total Resident Child Cap** | Rule 051 | None | Maximum 6 total children residing in home (foster + bio + adopted). |
| **Commercial Childcare Ban** | Rule 052 & FS-221A | None | Mandatory affirmation: Foster parent shall not operate a paid childcare/daycare. |
| **Co-Sleeping Prohibitions** | Rule 418 & FS-221A | None | No foster child over 2 years of age may sleep in room with an adult; no infant bed-sharing. |
| **Opposite-Sex Separation** | Rule 419 | None | No child over 5 years of age may share a bedroom with a child of opposite sex. |
| **Max Beds Per Room** | Rule 420 | None | Maximum 4 children designated to sleep in a single bedroom. |
| **Prohibited Sleeping Spaces** | Rule 421 | None | Living rooms, dining rooms, and hallways cannot be regular sleeping rooms. |

---

## 2. Physical Facility & Environmental Safety (Rules 401–416 & Policy #225)

| Safety Mandate | Regulation | Required Compliance Check |
| :--- | :--- | :--- |
| **Smoke Detectors** | Rule 414 & Policy #225 | Functioning detector in basement, on every living floor, and in immediate vicinity of all bedrooms. |
| **Carbon Monoxide Detectors** | Policy #225 | Functioning CO detector on each floor and in immediate vicinity of all bedrooms. |
| **Kitchen Fire Extinguisher** | Rule 415 | Functional portable ABC-type fire extinguisher in cooking area. |
| **Two Accessible Exits Per Sleeping Level** | Rule 416 & Policy #225 | Primary door + secondary exit (ground door, balcony door, or rescue window $\le 20\text{ ft}$ off ground). |
| **Emergency Phone Postings** | Rule 409 | Fire, police, physician, poison control, and ambulance numbers posted conspicuously by telephone. |
| **Firearms & Ammunition Security** | Rule 407 & FS-221A | Firearms locked in safe/cabinet OR essential parts locked/incapacitated; ammunition locked separately. |
| **Water Hazards & Pools** | FS-221A Sec 1 | Inground/aboveground pools, hot tubs, and ponds must have perimeter safety fences and bolt locks. |
| **Second-Hand Smoke / Vaping Ban** | Rule 403 & FS-221A | Zero exposure to tobacco or electronic cigarette smoke in foster home or transport vehicles. |
| **Potable Drinking Water** | Rule 405 | Safe drinking water supply (municipal or certified private well potability test). |
| **Bathroom Privacy & Access** | Rules 406, 425, 426 | Minimum 1 bathroom with flush toilet & hot/cold bath; at least 1 bathroom accessible without entering a bedroom. |

---

## 3. Household Roster & 10 Mandatory Background Clearances (FS-221A Section 3)

Vermont DCF mandates formal checks across **10 distinct state and federal databases** for all applicants and household members age 16 and older:

1. **VCIC (Vermont Crime Information Center):** Criminal record history and subscription service for ongoing real-time conviction alerts.
2. **FSD Child Protection Databases:** Child abuse and neglect substantiations and historical family services involvement.
3. **OCS (Office of Child Support):** Arrearages and non-support payment tracking.
4. **DMV (Department of Motor Vehicles):** Moving violations, license suspensions, and vehicular safety history.
5. **Vermont Adult Abuse Registry:** Substantiations of abuse, neglect, or exploitation of vulnerable adults.
6. **DOC (Department of Corrections):** Supervision, probation, and parole records.
7. **VCAS (Vermont Case Access System):** State court dockets, criminal filings, Relief from Abuse (RFA) orders, and restraining orders.
8. **Bright Futures CDD Database:** Child Development Division history for registered childcare providers.
9. **Vermont Immunization Registry:** Verification of required family and child vaccinations.
10. **FBI Fingerprint Clearance:** Statutory requirement to complete fingerprint cards within **90 days** of initial placement.

*Additional requirement:* Identification of any member who resided outside of Vermont within the past 5 years (triggers interstate Adam Walsh background checks).

---

## 4. Emergency Evacuation Drills & Routine Safety Logs (Rules 413 & 415)

* **Written Evacuation Plan (Rule 413):** Documented floor plan describing two exit routes from each bedroom and designating a central outdoor meeting place.
* **Fire Evacuation Drills:** Periodic drill logging with date, time to evacuate (seconds/minutes), exits used, and notes on children requiring assistance (Rule 413.3).
* **Power-Driven Equipment (Rule 411):** Orientation and supervision logs for youth using lawnmowers, snowblowers, or tools.

---

## 5. Transportation Standards (Rules 431–434)

* **Vehicle Records:** Make, model, valid registration expiration date, state annual safety inspection sticker date, and comprehensive auto insurance policy verification.
* **Driver Validation:** Valid driver's licenses for all household drivers transporting foster youth.
* **Vermont Child Passenger Restraint Hierarchy (Rule 434):**
  * *Under 20 lbs / Under age 1:* Rear-facing, federally approved car seat (never in front of active airbag).
  * *20+ lbs / Age 1 through 7:* Child passenger restraint system (convertible seat or booster).
  * *Age 8 through 17:* Mandatory safety belt system.

---

## 6. Immediate Placement & Kinship Suitability (FS-221A Section 4)

For emergency intakes (Conditional Custody Orders - CCO, and District-Approved Unlicensed Placements), DCF requires a 10-category suitability evaluation:
* **10 Evaluation Domains:** Criminal History, DOC Supervision, RFA Orders, Child Abuse Substantiations, FSD History, Residency, Home Visit, Substance Misuse, Mental/Physical Health, Financial Stability, Relationship to Child, and Collaboration with DCF/Court.
* **Scoring Categories:** `SAFE`, `FURTHER ASSESSMENT NEEDED`, or `UNSAFE / DANGEROUS`.

---

## Recommended Action Plan for Sprout

1. **Household Profile Upgrade (`openHouseholdModal`):**
   - Add structured fields for bedrooms per floor, bedroom 2-exit status, bathroom count, smoke/CO detector status, fire extinguisher verification, and firearms lock confirmation.
2. **Licensing Module Upgrade (`renderCaregiverAndHouseholdsView`):**
   - Implement the **Vermont 10-Database Clearance Tracker** with status badges (`Pending`, `Cleared`, `Flagged`) and a 90-day fingerprint countdown.
3. **Vehicle & Car Seat Roster:**
   - Add vehicle registration/inspection expiration tracking and driver license validation.
4. **Fire Evacuation Drill Logger:**
   - 1-click drill recorder capturing evacuation time, exits tested, and outside meeting headcount.
