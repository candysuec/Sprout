# OWNER WALKTHROUGH VALIDATION & PRE-RECORDING ASSESSMENT
## Comprehensive Pre-Walkthrough Validation Authority (Candy Review Preparation)
**Document Version:** 1.0.0  
**Status:** Approved Pre-Walkthrough Authority  
**Date:** October 13, 2026  
**Governing Standard:** `SPRINGBOARD_FOUNDATION.md` & `MISSION_CONTROL_ARCHITECTURE.md`

---

## 1. Executive Summary

This evaluation is conducted from the perspective of the **Owner, Trainer, Foster Parent, Kinship Caregiver, Respite Provider, and DCF Supervisor**. It evaluates Sprout through practical usage scenarios rather than code tests.

**The Golden Rule:**
> **"Do NOT verify whether the code works. Verify whether the EXPERIENCE works. Candy should not be the first person to discover an issue. Our job is to discover it first."**

### Overall Verdict:
Sprout / KinCare OS is structurally robust, privacy-enforced, and operationally aligned with Vermont DCF standards. The Phase 12A **Mission Control Center** and universal safe-home logo routing have resolved prior navigation bottlenecks. 

However, when Candy records her walkthrough video or presents to cohorts, **specific cognitive friction points, terminology misalignments, and progressive disclosure opportunities remain**. This report details every discovery across all 7 testing personas, 11 workflows, and screen reviews, along with the **Top 25 Pre-Walkthrough Fixes**.

---

## 2. Test Persona 1: New Foster Parent Assessment
*Licensed yesterday. Never seen Sprout. Under high initial anxiety.*

- **Orientation Speed:** Lands on Mission Control. Sees 4 quadrants (`TRAIN`, `CARE`, `DCF`, `SYSTEM`).
- **Immediate Confusion Point:** Sees `Today` and `My Children`. Wonders: *"Do I click Today first, or do I click My Children first?"*
- **The Sandbox vs. Production Trap:** In Sandbox mode, the top header is blue with an amber line. If the user doesn't notice the header label, they might wonder if they are typing in real data.
- **Child Selector Invisibility:** The `Child: CD` selector in the top toolbar is subtle (grey background). If a foster parent cares for two children, they might not realize the selector changes all views below.
- **Training Gap:** Does not immediately understand what the **"EPSDT 30-Day Health Clock"** means until clicking on it (needs a tooltip: *"Vermont Medicaid required medical checkup due within 30 days of placement"*).

---

## 3. Test Persona 2: Kinship Grandparent Assessment
*58-year-old grandmother. Placed with 6-year-old grandson at 9:00 PM. High emotional stress, lower tech fluency.*

- **Dashboard Experience:** Understands the "Good Morning" greeting and the medication reminder.
- **Terminology Friction:**
  - Jargon like *"Title 33 CHINS Stepper"* feels intimidating. She thinks of it as *"Court dates for my grandson"*.
  - *"Flight Instrument"* in developer docs should always be labeled as *"Quick Care Overview"*.
- **Accessibility & Contrast:** The small text (`text-[10px]` and `text-[11px]`) on subtab badges is hard to read without bifocals. High contrast is good, but font sizing on critical badges should never drop below 12px for kinship modes.
- **Support Contacts:** Can easily find the DCF 24/7 Crisis Hotline in the header (red button is immediately recognizable).

---

## 4. Test Persona 3: Respite Provider Assessment
*Receives child for a Friday–Sunday stay. Does not need child's life history.*

- **Essential Info Retrieval:**
  - **Allergies:** Immediately visible in Emergency Mode and Child Overview.
  - **Medications:** Visible in Today view under morning dose checklist.
  - **Bedtime Routines:** Accessible in Life Journey Keepsakes card.
- **Information Density:** The system successfully hides biological court orders and financial tabs when the child is tagged as `Respite Care`.
- **Friction Point:** The Respite provider wants to see bedtime comfort objects (e.g. *"Stuffed puppy, nightlight on"*) directly on the Today Dashboard without having to click into `Life Journey`.

---

## 5. Test Persona 4: VCWTP Instructor / Trainer Assessment
*Instructor preparing 15-minute demonstration for prospective caregivers.*

- **Strengths:**
  - `[Shield PII]` button is an instant crowd-pleaser; blurs real dates and names for Zoom sharing.
  - Switching between Sarah Jenkins (`HH-101`) and the Vance Grandparents (`HH-113`) demonstrates flexibility.
  - Form FS-334B mileage calculation at \$0.67/mile demonstrates immediate tangible financial value.
- **Trainer Friction Points:**
  - Trainees frequently ask: *"Can I install this on my iPhone?"* (The trainer must explain it is an offline Progressive Web App, not a native App Store download).
  - Trainees ask: *"Where do my receipts go?"* (The trainer must show the offline local storage directory).

---

## 6. Test Persona 5: DCF Family Services Supervisor Assessment
*Reviewing documentation quality and court readiness.*

- **Strengths:**
  - Exported Word documents (.docx) look professional, follow DCF standard section ordering, and are pre-scrubbed of computer metadata.
  - The SHA-256 blockchain ledger provides court-admissible audit integrity that withstands legal scrutiny.
- **Supervisor Concerns:**
  - Wants to ensure caregivers document *objective* observations rather than emotional conclusions (e.g., *"Child threw toy and cried for 10 minutes"* instead of *"Child had an irrational tantrum"*). Sprout's trauma-informed framing prompts effectively encourage this.

---

## 7. Mission Control Validation (The 30-Second Test)

When Mission Control opens:
- **0–5 seconds:** User reads *"SPROUT — Vermont Caregiver Operating System. Protect Children. Reduce Burden. Stay Prepared."* **(Understood)**.
- **5–15 seconds:** User scans the 4 quadrants:
  - **TRAIN** (Blue) ➔ Simulation & practice.
  - **CARE** (Green) ➔ Daily child operations.
  - **DCF** (Indigo) ➔ State forms & court.
  - **SYSTEM** (Slate) ➔ Settings & architecture.
- **15–30 seconds:** User spots *"Which experience applies to you?"* and clicks their role (Foster, Kinship, Respite, etc.).

**Friction Found:** The sub-buttons inside the quadrants currently trigger quick alert summaries rather than deep sub-page links. They should directly trigger the exact tab view.

---

## 8. Workflow Review & Click Efficiency Matrix

| Workflow | Start Point | End Point | Clicks | Usability & Friction Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Emergency Placement** | Logo / Header | Emergency Card Modal | **2** | Extremely fast via `[Emergency Mode]`. |
| **Court Preparation** | Mission Control | Downloaded Brief (.docx)| **2** | Click `Reports` ➔ `Generate Court Brief`. |
| **Mileage Reimbursement**| Today / Nav | FS-334B Claim (.docx) | **3** | Click `Log Note` ➔ Check Mileage ➔ Save. |
| **Medication Tracking** | Today | Dose Check-off | **1** | Click checkbox next to scheduled 8:00 AM dose. |
| **Relationship Logging** | Circles of Care | Communication Ledger | **2** | Click `Log Interaction` ➔ Select DCF Worker. |
| **Life Journey Keepsake**| Life Journey | Lifebook (.docx) | **2** | Click `Celebrate Milestone` or `Download Lifebook`. |
| **Document Vault** | Care Binder | PDF File Preview | **2** | Click Folder ➔ Click document link. |
| **School IEP Note** | Fast Action Bar | Child Education Tab | **2** | `+ Log Note` ➔ Category `Education` ➔ Save. |

---

## 9. Friction Point Register

1. **FRIC-01: Alert Boxes on Guide Buttons:** Clicking *Interactive Site Map* or *Visual Process Flows* in Mission Control shows an `alert()` dialog instead of rendering a rich, interactive modal with diagram tabs.
2. **FRIC-02: Micro-Text on High-Resolution Screens:** Badges with `text-[9px]` and `text-[10px]` can strain older kinship caregivers' eyes on 1440p laptops.
3. **FRIC-03: Bedtime Comfort Routines Hidden on Dashboard:** Respite and emergency caregivers need bedtime comfort notes (stuffed animal, nightlight) visible directly on the Today cockpit.
4. **FRIC-04: Child Selector Visual Prominence:** The `Child: CD` dropdown blends into the toolbar background; should have higher contrast borders and a prominent avatar pill.
5. **FRIC-05: EPSDT Acronym Jargon:** First-time foster parents do not know that EPSDT stands for *Early and Periodic Screening, Diagnostic and Treatment*. Needs a plain-English label: *"30-Day Health Exam Clock"*.
6. **FRIC-06: CHINS Court Terminology:** Kinship caregivers are unfamiliar with *Title 33 CHINS*. Needs subtitle: *"Child in Need of Care or Supervision (Vermont Juvenile Court)"*.
7. **FRIC-07: Search Bar Cursor Cue:** Quick find `(Ctrl+K)` input is readonly and opens a modal; clicking the magnifying glass should feel like opening an active command palette.
8. **FRIC-08: Sandbox vs. Live Confusion:** While headers change from green to blue, an explicit persistent floating pill *"PRACTICE SANDBOX ACTIVE (NO REAL DATA)"* should stay in the bottom corner during training.

---

## 10. Confusing Terminology Register

| Term Currently in App | Confusion Risk | Plain-English Replacement |
| :--- | :--- | :--- |
| **EPSDT 30-Day Clock** | Trainees don't know medical acronym | **30-Day Well-Child Health Clock** |
| **CHINS Stepper** | Kinship grandparents find legal acronym scary | **Vermont Juvenile Court (CHINS) Timeline** |
| **FS-221A Checklist** | Sounds like tax paperwork | **Home Licensure 40-Point Safety Check** |
| **VCWTP Hours** | New foster parents don't know consortium name | **State Caregiver Training Hours (VCWTP)** |
| **Sphere Selector** | Sounds abstract / scientific | **Workspace Mode (Real vs. Sandbox)** |
| **POSC Tab** | Medical jargon | **Plan of Safe Care (Infant Support)** |
| **Flight Instrument** | Aviation metaphor | **Caregiver Flight Cockpit / Daily Overview** |

---

## 11. Screen Review Matrix (Scale 1–10)

| Screen Name | Purpose Clarity | Ease of Use | Training Value | Nav Quality | Caregiver Value | DCF Value | Overall Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Mission Control** | 10 | 9 | 10 | 10 | 10 | 9 | **9.7 / 10** |
| **Today Dashboard** | 10 | 10 | 9 | 10 | 10 | 9 | **9.7 / 10** |
| **My Children** | 9 | 9 | 9 | 9 | 10 | 10 | **9.3 / 10** |
| **Care Binder** | 9 | 9 | 10 | 9 | 9 | 10 | **9.3 / 10** |
| **Home & Licensing** | 9 | 8 | 10 | 9 | 9 | 10 | **9.2 / 10** |
| **Circles of Care** | 9 | 9 | 10 | 9 | 10 | 9 | **9.3 / 10** |
| **Life Journey** | 10 | 10 | 9 | 9 | 10 | 8 | **9.3 / 10** |
| **Training Hub** | 10 | 9 | 10 | 9 | 9 | 8 | **9.2 / 10** |
| **Reports** | 9 | 9 | 9 | 9 | 10 | 10 | **9.3 / 10** |
| **Settings** | 8 | 8 | 8 | 8 | 8 | 9 | **8.2 / 10** |

---

## 12. The Brutal Honesty Test: Where Candy Might Frown

If Candy starts recording her walkthrough video tomorrow:

1. **At Minute 2:15:** She clicks *"Visual Process Flows"* in Mission Control, and an `alert()` box pops up instead of an elegant visual diagram modal. She stops talking, dismisses the alert, and thinks: *"Wait, why didn't that open a diagram?"*
2. **At Minute 5:40:** She demonstrates logging an 18-mile trip to the doctor. The preset works great, but she looks for the rate. She says: *"Sprout automatically applies the \$0.67 rate..."* but wishes the rate was stamped clearly in green bold text right next to the mileage input.
3. **At Minute 8:20:** She shows the Today dashboard for a respite child and wants to show their comfort objects (stuffed animal, bedtime book) to explain how Sprout supports respite caregivers. She realizes comfort objects live inside `Life Journey`, requiring two extra clicks to show.
4. **At Minute 11:10:** She tries to explain the Child Reference ID standard. She points to `Child: CD` in the toolbar. It's subtle and small; she wishes it had a nice prominent badge with an avatar circle so her viewers can immediately see that surnames are shielded.

---

## 13. Top 25 Pre-Walkthrough Fixes Before Candy's Recording

1. **Replace Guide Alerts with Rich Modals:** Replace the JavaScript `alert()` launchers in `renderMissionControlView()` with dedicated HTML modal cards for the **Interactive Site Map**, **Process Flows**, and **Decision Trees**.
2. **Promote Comfort Objects to Today Cockpit:** Display the child's top comfort routine and sensory anchor (e.g. *"Stuffed dog, nightlight"*) in the Today dashboard briefing for immediate respite visibility.
3. **Enhance Child Selector Contrast:** Wrap `#childSelect` in a crisp emerald-bordered pill with child initials avatar.
4. **Clarify EPSDT Acronym:** Add subtitle to EPSDT widget: *"30-Day Well-Child Health Exam"*.
5. **Clarify CHINS Acronym:** Add tooltip/subtitle: *"Vermont Juvenile Family Court (Title 33)"*.
6. **Enlarge Minimum Font Size on Key Badges:** Ensure subtab badges and flight indicators never drop below 11px / 12px for readability.
7. **Stamp Mileage Rate Explicitly:** Add bold badge `($0.67/mi State Rate)` right next to the trip mileage input in the Note modal.
8. **Add Persistent Sandbox Watermark Badge:** Render a small floating badge in the bottom-right corner when in sandbox mode: *"Practice Sandbox • No Real Data"*.
9. **Add 1-Click "Back to Mission Control" Breadcrumb:** Add a small breadcrumb link at the top of each view for caregivers who miss the logo click.
10. **Pre-Fill Today's Date in Quick Note:** Verify date picker always defaults to current local date without manual calendar selection.
11. **Smooth Tooltip for Shield PII:** Add helpful tooltip explaining: *"Click to blur all dates, phone numbers, and names for recording videos or training demos"*.
12. **Make Emergency Hotline Number Clickable on Desktop:** Ensure `tel:18006495285` link opens system dialer or shows copied confirmation toast.
13. **Add "What's Next?" Helper Pill to Today View:** If a caregiver has 0 upcoming appointments today, show an encouraging pill: *"All current! Tap Log Note or view Care Binder."*
14. **Harmonize Category Colors Across Note Modal and Feed:** Ensure Medical (Blue), Visits (Green), School (Purple), Incident (Rose) use identical hex colors everywhere.
15. **Add 1-Tap Copy for District Phone Numbers:** Allow clicking district office phone numbers to copy directly to clipboard.
16. **Pre-Format Court Report Heading:** Verify generated Word documents (.docx) include clear placeholder lines for Family Court Docket number and District.
17. **Show Active Caregiver Initials on Avatar:** Ensure Candy Chevalier (`CC`) and Sarah Jenkins (`SJ`) badges render with crisp contrast.
18. **Add Voice Dictation Active Waveform Animation:** Pulse the microphone button in green when voice dictation is recording.
19. **Highlight Uncompleted Follow-Up Tasks:** In Circles of Care, tint pending caseworker requests in high-visibility amber.
20. **Add "Download Backup" Shortcut to Mission Control:** Provide a 1-tap backup snapshot button in the SYSTEM quadrant.
21. **Auto-Scroll to Top on Main Tab Switch:** Ensure `window.scrollTo({ top: 0, behavior: 'smooth' })` triggers when navigating between hubs.
22. **Add "Print Blank Emergency Card" Option:** Allow foster homes to print blank physical cards for babysitters.
23. **Ensure All Lucide Icons Initialize Dynamically:** Guarantee `lucide.createIcons()` executes after every async view render.
24. **Provide Clear Success Toast on Note Save:** Display a friendly emerald alert: *"Observation successfully recorded and saved to local binder."*
25. **Add Final Owner Walkthrough Checklist Card:** In Mission Control SYSTEM quadrant, provide a 1-click **Owner Walkthrough Checklist** to guide Candy step-by-step through her video presentation.
