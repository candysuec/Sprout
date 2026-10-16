# CONCEPT GOVERNANCE REGISTER
**Initiative:** Sprout • Child & Family Success Operating System  
**Phase:** Concept Governance Review  
**Status:** Authoritative Standard  
**Date:** October 2026  
**Governing Principle:** Zero Concept Drift • Semantic Integrity • Self-Teaching Design  
**Founder OS Motto:** *"Never make Candy become the Integration Layer, Memory Layer, Orchestration Layer, Prompt Engineering Layer, Approval Clerk, Detective, or Debugger when the system can do that work instead."*

---

## 1. EXECUTIVE MANDATE & THE FOUNDER QUESTION

### "Are We Using Words Correctly?"
During the post-freeze Founder Walkthrough, an essential insight emerged:
> *"The architecture is correct. The mental model is mostly correct. The visual hierarchy is still fighting the mental model. The child is not yet the undeniable center of gravity. Review Console still competes with operations. Gateway language still mixes training and evaluation concepts. We keep resolving visual and navigation issues but continue discovering terminology drift. This indicates the problem is no longer UI architecture. The problem is Concept Drift."*

When words drift, software drifts. When an **Audience** (e.g., *Legislator*) is called a **Role**, the user interface mistakenly invents an operational dashboard for someone who never logs daily infant feeds. When a **Tool** (e.g., *Review Mode*) is called a **Workspace**, it visually expands to compete with daily caregiver routines. When a **Workflow** (e.g., *Emergency Placement*) is labeled a **Role**, the human caregiver disappears.

This document establishes the **authoritative semantic dictionary** for Sprout. The vocabulary of Sprout is now as strictly governed as its SQLite schema and cryptographic audit chains.

---

## 2. THE 7 CANONICAL CONCEPT CATEGORIES

Every noun, phrase, screen title, button label, and persona in Sprout belongs to **exactly one** of the following seven categories. Overlap is strictly prohibited.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE 7 CANONICAL CATEGORIES                                      │
├─────────────────┬─────────────────────────────────────────────────┬─────────────────────────────┤
│ Category        │ Plain-English Definition                         │ The Diagnostic Test         │
├─────────────────┼─────────────────────────────────────────────────┼─────────────────────────────┤
│ 1. ROLE         │ An authentic human actor providing/receiving    │ "Does this person log data, │
│                 │ care in child welfare.                          │ care for a child, or have   │
│                 │                                                 │ legal case standing?"       │
├─────────────────┼─────────────────────────────────────────────────┼─────────────────────────────┤
│ 2. AUDIENCE     │ An external observer, evaluator, funder, or     │ "Does this person inspect,  │
│                 │ instructor assessing or teaching Sprout.        │ audit, teach, or fund       │
│                 │                                                 │ Sprout without daily care?" │
├─────────────────┼─────────────────────────────────────────────────┼─────────────────────────────┤
│ 3. TOOL         │ A software utility, modal dialog, wizard, or    │ "Is this a software action  │
│                 │ widget that accomplishes a discrete task.       │ or dialog that I open?"     │
├─────────────────┼─────────────────────────────────────────────────┼─────────────────────────────┤
│ 4. WORKSPACE    │ A primary software domain surface or dashboard   │ "Is this a primary working  │
│                 │ environment dedicated to an operational domain. │ desktop that I enter?"      │
├─────────────────┼─────────────────────────────────────────────────┼─────────────────────────────┤
│ 5. WORKFLOW     │ A multi-step sequence of goal-oriented actions   │ "Is this a step-by-step     │
│                 │ achieving a child welfare milestone.            │ process with an outcome?"   │
├─────────────────┼─────────────────────────────────────────────────┼─────────────────────────────┤
│ 6. PURPOSE      │ The high-level intent or mode of human          │ "Why is the user in the     │
│                 │ engagement with Sprout at this moment.          │ system right now?"          │
├─────────────────┼─────────────────────────────────────────────────┼─────────────────────────────┤
│ 7. STATE        │ A discrete system configuration, environment     │ "Is this a technical flag   │
│                 │ mode, legal lifecycle status, or record flag.   │ or database condition?"     │
└─────────────────┴─────────────────────────────────────────────────┴─────────────────────────────┘
```

---

### Category 1: ROLE
* **Definition:** A specific human participant with legal, operational, or biological standing in a child's care episode who directly operates Sprout to log observations, review needs, or manage care.
* **Governing Rule:** If an entity does not have physical custody, parental rights, caregiving responsibility, or direct state case jurisdiction over a placed child, **it is NOT a Role**.
* **Exhaustive Master List:**
  1. **Foster Caregiver (Primary Caregiver):** State-licensed foster parent with temporary physical custody (e.g., *Sarah Jenkins*).
  2. **Kinship Caregiver (Relative / Fictive Kin):** Grandparent, aunt/uncle, or close adult providing kinship care (e.g., *Eleanor & Arthur Vance*).
  3. **Parent Participant (Biological Parent):** Mother or father working an active court-approved reunification case plan (e.g., *Angela Davis*).
  4. **Respite Provider (Temporary Caregiver):** Licensed caregiver providing short-term 24–72 hour weekend or crisis care (e.g., *Samantha Price*).
  5. **Secondary Caregiver (Co-Caregiver):** Adult partner or household member assisting primary care (e.g., *Jordan Taylor*, *Arthur Vance*).
  6. **Adoptive Placement Parent (Permanency Provider):** Pre-adoptive family transitioning toward legal finalization (e.g., *David & Emily Miller*).
  7. **DCF Caseworker (Family Services Worker):** State caseworker with legal case jurisdiction who receives official caregiver documentation.

---

### Category 2: AUDIENCE
* **Definition:** An external stakeholder, decision-maker, policymaker, auditor, or educator who inspects, demonstrates, evaluates, or funds Sprout.
* **Governing Rule:** An Audience evaluates whether Sprout works. An Audience **never** operates Sprout to feed an infant, log a temperature, or administer medication. They must never be given an operational caregiver role in the UI.
* **Exhaustive Master List:**
  1. **Founder / Candy (Systems Architect & Quality Director):** Evaluates end-to-end cognitive friction, system integrity, and adherence to operating principles.
  2. **Legislator / Policymaker:** Evaluates Vermont Title 33 compliance, family retention ROI, and state budget impact.
  3. **Philanthropic Foundation / Grant Funder:** Evaluates child welfare outcomes, community impact metrics, and expansion viability.
  4. **State IT / AHS Security Auditor:** Evaluates zero-cloud local containment, SQLite cryptography, and PII shielding compliance.
  5. **DCF District Supervisor:** Evaluates caregiver documentation quality, audit consistency, and FS-334B reimbursement validity.
  6. **VCWTP Instructor / State Trainer:** Evaluates caregiver cohort understanding, delivers formal training modules, and runs simulations.
  7. **External Evaluator / Evaluator Guest:** Evaluates software usability, cognitive load, and navigation friction.

---

### Category 3: TOOL
* **Definition:** A discrete software mechanism, dialog window, guided wizard, or background utility that a user invokes to perform an operational or evaluation function.
* **Governing Rule:** A Tool is executed by a Role or an Audience. A Tool is **not** an environment you live in (that is a Workspace), and **not** a human being (that is a Role or Audience).
* **Exhaustive Master List:**
  1. **Director Review Console (`#reviewModeConsoleModal`):** Meta-evaluation console with test verification, SHA-256 auditor, and sandbox reset.
  2. **Persona Launcher (`#personaLauncherModal`):** Simulator rig for atomically switching active caregiver hat and canonical child.
  3. **Sandbox Gateway Airlock (`#sandboxGatewayAirlock`):** Safety declaration banner and 3-doorway entry router.
  4. **Mission Control Quick Action Dock (`#missionControlQuickDock`):** 6-button immediate 1-tap launcher for daily care actions.
  5. **Emergency Placement Wizard (`#emergencyPlacementWizardModal`):** 5-step rapid intake wizard creating child, meds, and contacts.
  6. **Permanency & Handover Wizard (`#permanencyHandoverWizardModal`):** 5-step placement closure, Lifebook generator, and archive tool.
  7. **Kinship Fast-Track Guide (`#kinshipFastTrackModal`):** 5-tab plain-English guide (immediate triage, cash benefits, jargon decoder).
  8. **Emergency Care & Safety Sheet (`#emergencyHandoffModal`):** Print-ready babysitter / crisis summary generated in <30 seconds.
  9. **Sandbox Info Dialog (`#sandboxInfoModal`):** In-app narrative card for tours, system maps, and decision trees.
  10. **Founder Feedback Modal (`#founderFeedbackModal`):** Local SQLite qualitative feedback capture utility.
  11. **Presentation Privacy Shield (`applyPrivacyBlurState`):** 1-tap PII obscuration filter for live screensharing.
  12. **Word Document Generator (`exportMonthlyReportDocx`):** Official Vermont DCF Court Summary report compiler.

---

### Category 4: WORKSPACE
* **Definition:** A primary visual desktop, dashboard, or operational territory in Sprout where a specific Role lives, works, and manages an entire domain of care.
* **Governing Rule:** A Workspace provides a complete operational context. You navigate *into* a Workspace and remain there to complete daily work.
* **Exhaustive Master List:**
  1. **Mission Control (Caregiver Home Base):** Operational home base anchored on the active placed child, daily priorities, and quick actions.
  2. **Daily Cockpit / Dashboard (Daily Care Desk):** Today's operational schedule, active medication MAR, and pending follow-ups.
  3. **Child Workspace (My Children):** Deep 12-tab developmental profile, legal case cards, and health records for placed children.
  4. **Care Binder (Vermont 20-Folder Archive):** Official state folder hierarchy for compliance, schooling, medical, and legal files.
  5. **Parent Workspace (Reunification Portal):** Isolated, dignity-first portal for biological parents (goals, visit check-in, moments feed).
  6. **Training Hub (Caregiver Flight School):** Formal VCWTP curriculum catalog, practice scenario library, and 15 model homes.
  7. **DCF Reports Center (Compliance Command):** Court briefs, Title 33 progress reports, and FS-334B state mileage ledger.
  8. **System Settings & Audit (Director Control Room):** Local SQLite cryptographic ledger, backup utilities, and privacy controls.

---

### Category 5: WORKFLOW
* **Definition:** A structured, multi-step sequence of user actions that transforms an entry trigger into an official child welfare outcome.
* **Governing Rule:** A Workflow has a beginning, a sequence of decisions/inputs, and a permanent state change.
* **Exhaustive Master List:**
  1. **15-Second Routine Observation:** Entering daily care notes, milestones, or feeding logs without friction.
  2. **Emergency Placement Intake:** 11:00 PM rapid intake capturing child vitals, allergies, medications, and caseworkers in 5 clicks.
  3. **Care & Safety Babysitter Handoff:** Generating and verifying emergency instructions before leaving child with respite/sitter.
  4. **Kinship Emergency Triage:** Navigating the first 72 hours, applying for the $350 immediate grant, and establishing legal consent.
  5. **Title 33 Court Preparation:** Reviewing 30-day timeline observations, scrubbing private notes, and compiling official `.docx` brief.
  6. **State Mileage Reimbursement (FS-334B):** Logging trip purpose, calculating mileage at $0.67/mi, and producing signed claim.
  7. **Placement Closure & Permanency Handoff:** Creating keepsake Lifebook, transitioning parent access, and archiving records.
  8. **Parent Visit On-Time Check-In:** Biological parent verifying scheduled visit arrival with 1 click.

---

### Category 6: PURPOSE
* **Definition:** The high-level intent, mode of operation, or governing objective that explains *why* the user is interacting with Sprout.
* **Governing Rule:** Purpose governs the active permissions, data visibility, and UI tone. Purpose answers: *"What is the user trying to achieve?"*
* **Exhaustive Master List:**
  1. **Operations:** Managing real or simulated daily care, medications, court schedules, and child well-being.
  2. **Training:** Practicing workflows in a consequence-free simulator to achieve VCWTP competency.
  3. **Demonstration:** Presenting Sprout's friction-free workflows to peer caregivers, cohorts, or agency directors.
  4. **Evaluation:** Assessing whether Sprout eliminates caregiver burden, satisfies state policy, and safeguards privacy.
  5. **Validation:** Formally verifying that running code matches architectural specifications, governance rules, and test suites.

---

### Category 7: STATE
* **Definition:** A discrete system condition, database variable, technical configuration, or lifecycle phase.
* **Governing Rule:** State is an attribute or property. State can never take an action, open a dialog, or navigate a screen.
* **Exhaustive Master List:**
  1. **Environment State:**
     - `sample`: Practice Sandbox (100% synthetic models, safe for demonstration and trial).
     - `local`: Real Working Family Sphere (sealed physical SQLite database with live legal records).
  2. **Child Episode Placement State:**
     - `Active Placement`: Placed in household care with active legal custody.
     - `Potential Kinship Placement`: Intake pending, background check active, not yet placed.
     - `Former / Reunified`: Episode closed, family reunified, records archived.
  3. **Parent Access Lifecycle State:**
     - `PROVISIONAL_ACCESS`: 30-day orientation, preliminary goals active.
     - `ACTIVE_ENGAGED`: Active case plan, verified milestone evidence, visit check-in.
     - `RESTRICTED_ACCESS`: High-conflict mode active, address and visit location masked.
     - `GRADUATED`: Case successfully closed, placement reunified, permanent access granted.
     - `REVOKED`: Access terminated under court order, records sealed under Legal Hold.
  4. **Record Classification State:**
     - `legacy_unreviewed`: Pre-existing notes awaiting privacy categorization.
     - `private`: Strictly personal caregiver reflections; never exported.
     - `working`: Everyday household routines; visible to co-caregivers.
     - `official`: Verified legal records for DCF and court submission.
     - `shared_family`: Dignity-filtered milestones shared with biological parents.
  5. **Record Retention State:**
     - `Active`: Visible in daily chronological feeds.
     - `Archived`: Soft-archived post-permanency closure.
     - `Legal Hold`: Immutable forensic lock.

---

## 3. THE PERMANENT CONCEPT INVARIANT RULES

To prevent future concept drift, the following five structural invariants are established as permanent governance laws:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               THE 5 CONCEPT INVARIANT LAWS                                      │
├────────────────────────────┬────────────────────────────────────────────────────────────────────┤
│ Invariant Rule             │ Mandate                                                            │
├────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 1. Audience ≠ Role         │ An Audience (Legislator, Evaluator, Trainer, Candy) must NEVER be  │
│                            │ labeled, selected, or presented as an operational Caregiver Role. │
├────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 2. Role ≠ Tool             │ A Role (Foster Parent, Respite Provider) must NEVER be conflated  │
│                            │ with the Tool used to switch it (Persona Launcher).               │
├────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 3. Tool ≠ Workspace        │ A Tool (Review Console, Wizard) must NEVER visually balloon into a │
│                            │ Workspace that competes with the caregiver's daily desktop.        │
├────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 4. Workspace ≠ Purpose     │ A Workspace (Training Hub, Mission Control) is a physical screen;  │
│                            │ it must not be confused with the Purpose (Training vs Operations). │
├────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ 5. Workflow ≠ Role         │ A Workflow (Emergency Placement, Case Closure) must NEVER be      │
│                            │ labeled as a user type or human persona.                           │
└────────────────────────────┴────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **THE PERMANENT CATEGORY-ASSIGNMENT RULE:**  
> Before any future report, document, screen, button, or code component is introduced into Sprout, every term must be explicitly assigned to one of the 7 Canonical Categories. If the category cannot be definitively identified, **the term cannot be introduced into the system**.

---

## 4. CONCEPT DRIFT AUDIT & FINDINGS

Below is the complete audit of terminology drift identified in Sprout's current documentation and UI, with the exact required corrections:

---

### Finding CD-01: "Founder Overview" Treated as a Training Persona
* **Term:** `Founder Overview`
* **Current Usage:** Listed as Card #1 in the Persona Launcher (`#founderReviewModal`) and Training Hub (`#trainingPersonaLauncher`) alongside Foster and Kinship parents. Clicking it switched the database to `local`.
* **Current Erroneous Category:** `ROLE`
* **Correct Classification:** `AUDIENCE` perspective using a `TOOL` (Director Review Console) for the `PURPOSE` of Evaluation.
* **Source Locations:**
  - `app/static/index.html` (Lines 1618–1635)
  - `app/static/app.js` (Lines 6017–6037, 8490–8501)
  - `docs/SANDBOX_ORIENTATION_REPORT.md` (Section 3.1)
  - `docs/TRAINING_VALIDATION_REPORT.md` (Role #1)
* **Why It Creates Drift:** Candy is the Systems Architect and Evaluator. Children in care are never placed with "The Founder." Treating Founder as a training persona confuses trainees, conflates evaluation with household care, and caused a critical boundary leak into real family data.
* **Required Correction:** Remove "Founder Overview" from all Persona Launchers and Training Catalogs. Relocate Founder tools exclusively to the Director Review Console (`#reviewModeConsoleModal`) under the label `Executive Overview & System Audit`.

---

### Finding CD-02: "Legislator" Categorized as a Role or User Journey
* **Term:** `Legislator` / `Legislator View`
* **Current Usage:** Described as "Role 3: Legislator / Stakeholder" in journey mapping and walkthrough guides.
* **Current Erroneous Category:** `ROLE`
* **Correct Classification:** `AUDIENCE` evaluating Sprout for the `PURPOSE` of Policy Evaluation.
* **Source Locations:**
  - `docs/SANDBOX_JOURNEY_MAP.md` (Section 2, Role 3)
  - `docs/SANDBOX_ORIENTATION_REPORT.md` (Section 2.1)
* **Why It Creates Drift:** A legislator does not operate Sprout, log daily notes, or care for children. Calling a legislator a "Role" creates the expectation of a "Legislator Dashboard" with specialized operational buttons, distracting from Sprout's caregiver mission.
* **Required Correction:** Reclassify Legislator as an **Audience**. In the Sandbox Gateway, provide an Evaluator Doorway (`Door A: 5-Minute Tour & Policy Overview`) rather than a fictional "Legislator Role."

---

### Finding CD-03: "Trainer / Instructor" Categorized as an Operating Role
* **Term:** `State Trainer / Instructor`
* **Current Usage:** Pinned on Mission Control as "Role 5: State Trainer / Instructor" inside the "Which Experience Applies to You?" grid.
* **Current Erroneous Category:** `ROLE`
* **Correct Classification:** `AUDIENCE` utilizing a `WORKSPACE` (Training Hub) for the `PURPOSE` of Cohort Training.
* **Source Locations:**
  - `app/static/app.js` (Lines 7400–7405)
  - `docs/SANDBOX_JOURNEY_MAP.md` (Section 2, Role 1)
  - `docs/TRAINING_VALIDATION_REPORT.md` (Role #8)
* **Why It Creates Drift:** Trainers do not have foster children placed in their personal custody. When a trainer is labeled a "Role," users expect them to have a daily medication schedule and school IEP records, confusing the daily desktop.
* **Required Correction:** Remove "Trainer" from caregiver role grids. Position Trainer as an **Audience** that accesses the **Training Hub Workspace** and uses the **Demonstration Launcher Tool**.

---

### Finding CD-04: "DCF Supervisor" Categorized as an Operating Role
* **Term:** `DCF Supervisor`
* **Current Usage:** Displayed as "Role 6: DCF Caseworker / Supervisor" on Mission Control's role selector.
* **Current Erroneous Category:** `ROLE`
* **Correct Classification:** `AUDIENCE` inspecting official records for the `PURPOSE` of Compliance Audit.
* **Source Locations:**
  - `app/static/app.js` (Lines 7407–7412)
  - `docs/TRAINING_VALIDATION_REPORT.md` (Role #7)
* **Why It Creates Drift:** Sprout is a caregiver-held operating system. It is not state DCF enterprise software. DCF Supervisors receive `.docx` reports and audit summaries compiled by caregivers; they do not log into Sprout to manage daily child routines.
* **Required Correction:** Reclassify DCF Supervisor as an **Audience**. Reference them as recipients of official exports from the **DCF Reports Center Workspace**, not as an in-app operational user role.

---

### Finding CD-05: "Emergency Placement" Categorized as a Role
* **Term:** `Emergency Placement`
* **Current Usage:** Displayed on Mission Control as "Role 7: Emergency Placement (11:00 PM Rapid Child Profile)" alongside Foster and Kinship parents.
* **Current Erroneous Category:** `ROLE`
* **Correct Classification:** `WORKFLOW` executed by a `ROLE` (Foster or Kinship Caregiver) using a `TOOL` (Emergency Placement Wizard).
* **Source Locations:**
  - `app/static/app.js` (Lines 7414–7419)
  - `docs/TRAINING_VALIDATION_REPORT.md` (Section 4.7)
* **Why It Creates Drift:** An "Emergency Placement" is not a person. It is an urgent care event. Labeling an event as a role blurs the human identity of the caregiver and creates severe category confusion in navigation.
* **Required Correction:** Remove "Emergency Placement" from all role lists. Present it strictly as an urgent **Workflow** on the **Quick Action Dock** and in scenario training catalogs.

---

### Finding CD-06: "New User" and "Demo User" Categorized as Roles
* **Term:** `New User` / `Demo User`
* **Current Usage:** Evaluated as "Role 9: New User" and "Role 10: Demo/Sandbox User" in training validation reports.
* **Current Erroneous Category:** `ROLE`
* **Correct Classification:** `STATE` (Novice Experience Level) or `AUDIENCE` (Guest Evaluator) engaging with Sprout for the `PURPOSE` of Evaluation.
* **Source Locations:**
  - `docs/TRAINING_VALIDATION_REPORT.md` (Roles 9 & 10)
* **Why It Creates Drift:** "New User" describes how familiar someone is with the software, not who they are in child welfare. Fusing experience state with role creates redundant personas that dilute the authentic needs of foster, kinship, and biological parents.
* **Required Correction:** Treat "New User" strictly as a **User State** governed by onboarding orientation pathways (e.g., Door A 5-Minute Tour), never as a training persona.

---

### Finding CD-07: "Review Mode" Conflated as a Workspace
* **Term:** `Review Mode`
* **Current Usage:** Used interchangeably as a screen title, a workspace mode, an environment toggle, and a modal utility. Styled with bright glowing gradients that compete with daily care buttons.
* **Current Erroneous Category:** `WORKSPACE` / `PURPOSE`
* **Correct Classification:** `TOOL` (Director Review Console) serving the `PURPOSE` of System Evaluation.
* **Source Locations:**
  - `app/static/index.html` (Lines 1887–1892)
  - `app/static/app.js` (Lines 7140–7143)
  - `docs/FOUNDER_ORIENTATION_DASHBOARD.md` (Section 1)
* **Why It Creates Drift:** When a meta-tool is called "Review Mode" and styled like a primary workspace, everyday caregivers wonder if they are in the wrong place or if they must click it to do their daily logging.
* **Required Correction:** Rename all UI instances to **Director Review Console** or **Review Console Tool**. Demote its visual styling to a discrete, quiet administrative utility.

---

### Finding CD-08: "Persona Launcher" Conflated as Training Hub
* **Term:** `Persona Launcher`
* **Current Usage:** Embedded as a massive 5-card section at the top of the Training Hub screen (`#trainingPersonaLauncher`), duplicating the global modal.
* **Current Erroneous Category:** `WORKSPACE`
* **Correct Classification:** `TOOL` (Simulator Rig) used for the `PURPOSE` of Role Simulation.
* **Source Locations:**
  - `app/static/app.js` (Lines 6017–6153)
  - `docs/SANDBOX_MENTAL_MODEL_DECISION.md` (Section 3)
* **Why It Creates Drift:** Trainees opening the Training Hub saw two competing persona pickers stacked on top of each other, obscuring the actual curriculum modules and competency assessments.
* **Required Correction:** Restrict the Persona Launcher to a single modal **Tool** (`#personaLauncherModal`). In the Training Hub Workspace, provide a clean link to this tool rather than embedding a redundant 5-card duplicate stack.

---

### Finding CD-09: "Sprout Spheres" Used Ambiguously
* **Term:** `Sprout Spheres`
* **Current Usage:** Used ambiguously to mean: (1) Environment mode (`local` vs `sample`), (2) Data domains (`child`, `case`, `parent`), (3) Household context, and (4) Circles of Care stakeholder tiers.
* **Current Erroneous Category:** Uncontrolled Metaphor
* **Correct Classification:** Segregate into explicit canonical terms:
  - Technical Environment &rarr; `STATE` (`Dev Sandbox` vs `Live Family Data`)
  - Data Governance &rarr; `DOMAIN` (`child`, `case`, `caregiver`, `parent`)
  - Stakeholder Network &rarr; `TOOL` (`Circles of Care`)
* **Source Locations:**
  - `app/static/index.html` (Lines 273, 1391–1405)
  - `app/static/app.js` (Lines 140–154)
* **Why It Creates Drift:** Overloaded metaphorical jargon prevents users from understanding where their data actually lives and whether their actions are consequence-free.
* **Required Correction:** Replace ambiguous "Sphere" terminology with plain-English technical labels: **Practice Sandbox** (Synthetic State) vs **Real Family Workspace** (Local Physical State).

---

### Finding CD-10: Mission Control Acting as an Orientation Gateway
* **Term:** `Mission Control`
* **Current Usage:** Positioned as the caregiver's daily home, but cluttered with marketing slogans (*"Protect Children. Reduce Burden."*), generic orientation tours, 35+ quadrant buttons, and role pathway cards.
* **Current Erroneous Category:** `TOOL` (Gateway) + `PURPOSE` (Marketing)
* **Correct Classification:** `WORKSPACE` (Daily Care Cockpit).
* **Source Locations:**
  - `app/static/app.js` (Lines 7095–7430)
  - `docs/MENTAL_MODEL_ENFORCEMENT_BACKLOG.md` (Ticket MME-03)
* **Why It Creates Drift:** A foster mother logging breakfast for an infant should not have to scroll past state marketing slogans and 35 navigation choices to find her child's medication schedule.
* **Required Correction:** Reclaim Mission Control strictly as the **Caregiver Daily Cockpit**. Move initial orientation and safety grounding to a single-line or dismissible **Gateway Airlock Tool**, anchoring the placed child as the undeniable visual center of gravity.

---

## 5. MASTER CROSS-REFERENCE TAXONOMY MATRIX

The following table is the definitive reference for every core term in Sprout:

| Term | Canonical Category | Parent Entity | Allowed Usage | Prohibited Misclassifications |
| :--- | :--- | :--- | :--- | :--- |
| **Foster Caregiver** | **ROLE** | Child Placement | Operational actor managing daily foster care | ❌ Tool, Audience, Purpose |
| **Kinship Caregiver** | **ROLE** | Child Placement | Relative actor managing kinship placement | ❌ Tool, Audience, Purpose |
| **Parent Participant** | **ROLE** | Reunification Plan | Biological parent working case roadmap | ❌ Tool, Audience, Workspace |
| **Respite Provider** | **ROLE** | Child Placement | Short-term weekend care provider | ❌ Tool, Audience, Purpose |
| **Founder / Candy** | **AUDIENCE** | Evaluation Meta-Layer | Evaluator auditing software friction & integrity | ❌ Role, Training Persona |
| **Legislator** | **AUDIENCE** | State Stakeholders | Evaluator assessing policy & budget outcomes | ❌ Role, Operating Persona |
| **State IT Auditor** | **AUDIENCE** | Agency of Human Services| Auditor evaluating offline SQLite security | ❌ Role, Operating Persona |
| **VCWTP Instructor** | **AUDIENCE** | Child Welfare Training | Educator teaching cohort competencies | ❌ Role, Daily Caregiver |
| **Director Review Console**| **TOOL** | Meta-Layer | Modal utility for system verification & audit | ❌ Workspace, Role, Purpose |
| **Persona Launcher** | **TOOL** | Simulator Rig | Modal utility for switching active practice hat| ❌ Workspace, Role, Purpose |
| **Gateway Airlock** | **TOOL** | Entry Router | Safety declaration banner & 3 doorway cards | ❌ Workspace, Daily Cockpit |
| **Quick Action Dock** | **TOOL** | Mission Control | 6-button immediate execution dock | ❌ Navigation Bar, Role Picker |
| **Mission Control** | **WORKSPACE**| Daily Care Desktop | Daily operational desktop for active placed child| ❌ Gateway, Marketing Billboard|
| **Parent Workspace** | **WORKSPACE**| Reunification Domain | Isolated dignity portal for biological parents | ❌ Tool, Role, Workflow |
| **Training Hub** | **WORKSPACE**| Education Domain | Flight school curriculum & scenario drills | ❌ Tool, Role Switcher |
| **Emergency Intake** | **WORKFLOW** | Crisis Operations | 5-step rapid intake wizard at 11:00 PM | ❌ Role, Persona, Audience |
| **Title 33 Court Prep**| **WORKFLOW** | DCF Compliance | Compiling verified timeline into court brief | ❌ Tool, Workspace, Role |
| **Operations** | **PURPOSE** | System Engagement | Providing daily child care & routine logging | ❌ Workspace, Role, Tool |
| **Training** | **PURPOSE** | System Engagement | Building caregiver skill via simulated practice| ❌ Workspace, Role, Tool |
| **Evaluation** | **PURPOSE** | System Engagement | Assessing usability, privacy, and burden | ❌ Role, Tool, Workspace |
| **Practice Sandbox** | **STATE** | Environment Mode | `sample` mode with 100% synthetic models | ❌ Workspace, Role, Sphere |
| **Real Family Data** | **STATE** | Environment Mode | `local` mode with physical SQLite database | ❌ Workspace, Role, Sphere |
| **Active Placement** | **STATE** | Child Status | Child physically placed in home | ❌ Role, Workflow, Purpose |
| **High-Conflict Mode**| **STATE** | Household/Child Safety| Safety flag masking addresses & E911 coords | ❌ Role, Tool, Workspace |

---

## 6. PRE-PUBLICATION CONCEPT LINTING CHECKLIST

Before any future document, report, commit message, or code change is generated, verify the following 5 checkpoints:

1. **[ ] Role Integrity:** Does every "Role" represent an authentic child welfare participant with direct care or legal standing? (Zero audiences or workflows labeled as roles).
2. **[ ] Audience Demarcation:** Are Legislators, Foundations, State Auditors, Trainers, and Candy classified strictly as Audiences evaluating or teaching Sprout?
3. **[ ] Tool Proportionality:** Are Review Console, Persona Launcher, and Guided Wizards classified as Tools? Do they remain discrete utilities without bloating into workspaces?
4. **[ ] Workspace Sanctity:** Is Mission Control dedicated exclusively to the placed child and daily caregiver operations? (Zero gateway bloat or marketing slogans on the operational desktop).
5. **[ ] Child Centricity:** Is the placed child (Liam / Emma) referenced as the human center of gravity rather than a technical software attribute?

---
*Governed and approved under Sprout OS Operating Principles. Concept drift is officially sealed.*
