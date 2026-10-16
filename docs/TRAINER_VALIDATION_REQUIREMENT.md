# TRAINER VALIDATION REQUIREMENT & REALITY RECONCILIATION

**Initiative:** Sprout • Child & Family Success Operating System  
**Phase:** Trainer Validation & Reality Reconciliation (Video Validated)  
**Status:** Authoritative Training Architecture Standard  
**Date:** October 2026  
**Source Evidence:** Walkthrough Video `Recording 2026-10-16 185103.mp4` (8m 22s audio narration)

---

## 1. OPERATING RULE: REALITY RECONCILIATION

* **Actual user experience overrides reports.**
* **Actual user experience overrides assumptions.**
* **Actual user experience overrides documentation.**

If documentation claims a feature is passing, but Founder walkthrough reveals friction or failure, the **walkthrough becomes the governing source of truth**.

---

## 2. PART A: DEFECTS (DISCOVERED IN VIDEO WALKTHROUGH)

### DEFECT D-001: PII SHIELD FAILURE
* **Evidence:** In `Recording 2026-10-16 185103.mp4` (timestamp 2:15), Founder activated `Shield PII`. The badge turned orange and blurred child DOB and placement dates in the upper card, but the child's full name `Jackson Miller (JM)` remained completely unblurred in the main container below.
* **Reproduction Steps:**
  1. Open Mission Control or Today screen.
  2. Click `Shield PII` toggle in top header.
  3. Observe that only fields with class `.privacy-sensitive` are blurred.
  4. Observe that full child names, nicknames, and photos lack `.privacy-sensitive` and remain in plain text.
* **Root Cause:** In `app/static/app.js`, `.privacy-sensitive` was applied only to 10 isolated metadata spans (DOB, dates), and was never added to child name templates (`child.preferred_name`, `child.alias`, headers).
* **Repair Recommendation:** Apply `.privacy-sensitive` consistently to all child names, aliases, photos, and household physical addresses across all client view templates.

---

### DEFECT D-002: DEAD STATE LOCKOUT (`No Caregiver`, `None Placed`)
* **Evidence:** In `Recording 2026-10-16 185103.mp4` (timestamp 5:00), switching through the top header dropdown led to a state where `Active Caregiver` displayed blank (`[CC]`), and `Placed Child` showed `None Placed`. All child-dependent API calls failed, locking the user out of actions.
* **Reproduction Steps:**
  1. Click `Active Caregiver` dropdown in top header.
  2. Select placeholder `-- Select Caregiver User --` or a household without active placements (e.g., `HH-115`).
  3. Observe that caregiver becomes empty string, child dropdown empties to `None Placed`, and dashboard actions fail.
* **Root Cause:** In `app/server.py` (`/api/children`), if `X-Caregiver` is empty or unplaced, it returns `[]`. In `app/static/app.js`, `onCaregiverUserChange()` does not atomically enforce canonical child pairings when using the native `<select>`, decoupling role from child.
* **Repair Recommendation:** Enforce the Atomic Persona Switch Rule on the header dropdown: selecting a caregiver must atomically bind their canonical child and never allow a blank or orphaned state.

---

### DEFECT D-003: PARENT WORKSPACE CONTAMINATION
* **Evidence:** In `Recording 2026-10-16 185103.mp4` (timestamp 7:30–8:22), Founder was in the Parent Workspace (Angela Davis). When selecting `Samantha Price & Jordan Taylor` (Respite) from the header dropdown, the UI did not exit the parent portal. Instead, it rendered `Welcome, Caregiver (Samantha Price & Jordan Taylor)` on the biological parent reunification portal with `None Placed`.
* **Reproduction Steps:**
  1. Open Persona Launcher and launch Parent Workspace (Angela Davis).
  2. With Parent Workspace active, click the top header `Active Caregiver` dropdown.
  3. Select any non-parent caregiver (e.g., Samantha Price).
  4. Observe that `renderParentParticipantView()` renders Samantha inside the biological parent portal.
* **Root Cause:** `onCaregiverUserChange()` lacked an exit guard: changing to a caregiver while `currentMainSection === 'parent'` updated `activeCaregiverUser` without re-routing `currentMainSection` back to `mission_control` and restoring `#mainNavigationContainer`.
* **Repair Recommendation:** Add strict boundary guard: any caregiver selection other than an authorized parent participant must forcefully call `exitParentWorkspace()`, restoring the main navigation bar and routing to Mission Control.

---

## 3. PART B: DESIGN FINDINGS (ANALYSIS ONLY)

### FINDING F-001: ROLE SWITCHING REDUNDANCY
* **Observation:** Founder noted *"Too much of the same thing everywhere."* Five competing controls allowed role switching (Top Header `Switch Role`, Floating Pill `Practice Roles`, Gateway `Door B`, Training Hub `Simulator Roles`, Header Dropdown).
* **Governing Rule:** Drift Prevention Gate Q1 & Q5.
* **User Impact:** Creates decision paralysis and confusion about which control is authoritative.
* **Recommendation Direction:** Consolidate to **one canonical launcher modal** triggered by the header `Switch Role` button and Gateway `Door B`. Retire or subordinate duplicate launcher triggers.

---

### FINDING F-002: CHILD VISIBILITY DUPLICATION
* **Observation:** Founder noted *"The child is listed here, here, and here."* The child appeared in sticky header, gateway banner, child snapshot card, and caregiver card simultaneously.
* **Governing Rule:** *The Child Is The Undeniable Center Of Gravity.*
* **User Impact:** Fragmented visual hierarchy where child data competes with itself.
* **Recommendation Direction:** Establish the sticky top header badge as the single authoritative child anchor. Suppress redundant repetitive child identity blocks in sub-views.

---

### FINDING F-003: DAY ONE ORIENTATION FAILURE
* **Observation:** Founder noted *"I need to know what Foster, Kinship, and Respite caregivers need to do first."* Instead of showing immediate Day 1 priorities, the screen greeted new users with curriculum, flight school, and system architecture.
* **Governing Rule:** Primary User Test (Who is helped? What improves their day?).
* **User Impact:** Caregivers feel overwhelmed by administrative chrome rather than guided through infant care.
* **Recommendation Direction:** Implement the Two-Dataset Architecture below.

---

## 4. THE TWO-DATASET ARCHITECTURE (DEMONSTRATION-READY HOUSEHOLDS)

Rather than maintaining a complex 20-stage matrix, Sprout will maintain **two clean, purpose-built datasets**:

### DATASET A: NEW TO SPROUT (DAY 1 ONBOARDING)
*Resettable clean slate for demonstrating initial login, intake, and immediate setup.*

1. **New Foster Caregiver (Sarah Jenkins & Liam Brooks - Infant):**
   * Clean timeline (0 prior notes).
   * Prominent first task: `+ Emergency Intake (15-Sec Essential Log)`.
   * Statutory 30-Day Health Clock: `Day 1 (30 Days Remaining)`.
2. **New Kinship Caregiver (Eleanor Vance & Emma Vance - Toddler):**
   * Days 1–3 Survival Triage card prominent.
   * Urgent task: Apply for $350 Emergency Family Support Fund & Dr. Dynasaur.
   * Welfare Acronym Decoder accessible in 1 tap.
3. **New Parent Participant (Danielle Miller & Noah Miller - Elementary):**
   * Status: `PROVISIONAL_ACCESS` (30-day invitation window).
   * 0 of 4 roadmap milestones verified (clean progress bar).
   * Upcoming task: Initial supervised family time visit.
4. **New Respite Provider (Samantha Price & Liam Brooks - Infant):**
   * 48-Hour Weekend Respite Intake.
   * 1-Tap Care & Safety Sheet with allergy alerts and soothing routines.
   * 0 doses logged; clean medication MAR ready for first administration.

---

### DATASET B: 90-DAY SPROUT USER (ESTABLISHED FULL POWER)
*Rich, realistic operational history demonstrating the compounding value of Sprout.*

1. **Established Foster Caregiver (Sarah Jenkins & Liam Brooks):**
   * 60+ routine logs across all 4 cognitive domains.
   * Completed 30-day EPSDT well-child exam on file with DCF.
   * 1-Click Export: Official DCF Monthly Progress Report (`.docx`) and State Mileage Claim (`FS-334B.docx`, $184.20).
2. **Established Kinship Caregiver (Eleanor Vance & Emma Vance):**
   * Cash benefits active: Reach Up child-only grant & CCFAP child care subsidy.
   * Pediatric dental and school IEP notes logged.
   * Permanency roadmap documented for relative legal guardianship.
3. **Established Parent Participant (Angela Davis & Emma Vance):**
   * Status: `ACTIVE_ENGAGED` (Day 90).
   * 3 of 4 milestones verified (75% complete roadmap).
   * 100% on-time attendance streak at Easterseals.
   * Evidence Vault: 3 verified court certificates (Parenting class, housing lease, wellness screen).
4. **Established Respite Provider (Samantha Price & Liam Brooks):**
   * 4 completed weekend respite stays documented.
   * 16 confirmed doses on medication MAR without incident.
   * Signed digital handoff vouchers stored in vault.

---

## 5. EXPANDED PARENT CONTINUUM (4 REALISTIC SCENARIOS)

To demonstrate the full biological parent reunification journey without taxonomy inflation:

1. **Day 1 (New / Provisional):** Danielle Miller — First invite, 0% complete, initial supervised visit.
2. **Day 30 (Active / Restricted):** Jason Vance — High-conflict address masking active, 30% complete, weekly visits.
3. **Day 90 (Progressing / Engaged):** Angela Davis — 75% complete, 3 verified certificates, on-time streak.
4. **Day 120+ (Near Graduation):** Maria Lin — 100% goals completed, unsupervised overnights unlocked, reunification plan ready for court.

---

## 6. SPRINT SUCCESS CRITERIA

A trainer can open the Persona Launcher, toggle between **Dataset A (Day 1)** and **Dataset B (Day 90)**, select any role (Foster, Kinship, Parent, Respite), and immediately begin training without narrative explanation, workarounds, or manual scenario construction.
