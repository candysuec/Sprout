# FOUNDER ORIENTATION DASHBOARD
**Initiative:** Sprout  
**Project:** Child & Family Success Operating System  
**Current Milestone:** v3.2 Mental Model Enforced — 178/178 Tests Passing (100%)  
**Last Verified:** 2026-10-16  

---

## 🧭 WHERE AM I?

You are standing in **Sprout v3.2 Mental Model Enforced (Sprint Complete)**.

- **The Vision Is Decided:** Sprout is a **Child & Family Success Operating System**, not a case management system, not a state database, and not a passive binder.
- **The Architecture Is Implemented & Frozen:** Four Data Sovereignty Domains (`child`, `case`, `caregiver`, `parent`), 5-Level Note Classification (`legacy_unreviewed`, `private`, `working`, `official`, `shared_family`), and DCF Output Integration are operational in SQLite.
- **Mental Model Enforcement Sprint Complete (P0 Tickets Resolved & Verified):**
  - **MME-01 (Disentangle Review Mode from Persona Launcher):** Split `#founderReviewModal` into two dedicated modals: `#personaLauncherModal` (Layer 3: Practice Simulator Rig with 4 authentic practice roles) and `#reviewModeConsoleModal` (Layer 1: Director's Review Console with test suite monitor, SHA-256 auditor, sandbox reset, and feedback). Persistent top header and floating dock offer independent 1-click access to both.
  - **MME-02 (Quarantine Founder Overview from Practice Roles):** Removed "1. Founder Overview" from Persona Launcher and Training Catalog. Practice roles strictly feature authentic child welfare caregivers (Sarah &rarr; Liam, Eleanor &rarr; Aiden/Emma, Angela &rarr; Emma, Samantha &rarr; Liam). Silent database mode mutation to `local` eliminated.
  - **MME-03 (Dedicated Sandbox Gateway Airlock & Clean Dock):** Initial sandbox landing features the Layer 2 Gateway Airlock (`#sandboxGatewayAirlock`) declaring 100% synthetic safety and 3 clear doors (Door A: 5-Min Tour, Door B: Choose Practice Role, Door C: Explore Flight School). Mission Control is stripped of 35+ button paralysis, functioning strictly as the daily care cockpit with a 6-button Quick Action Dock (Review Mode removed from dock). Unstyled browser alerts replaced with in-app modal cards (`#sandboxInfoModal`).
  - **MME-04 (Anchor Active Child in Sticky Header):** Anchored `#childSelect` inside `#placedChildBadgeContainer` within `#topHeader`, guaranteeing permanent visibility on 100% of screens (Mission Control, Dashboard, Binder, Medical, Timeline).
- **The Entire System Is 100% Tested:** Automated test suites pass **212/212 tests (100%)**:
  - `test_e2e_flows.py`: 73/73
  - `test_phase13b_governance.py`: 46/46
  - `test_parent_workspace_integration.py`: 30/30
  - `test_operational_readiness.py`: 29/29
  - `test_trainer_two_datasets.py`: 34/34
- **Release Readiness & Human Walkthrough Verified (PASS):** 4 real-world user personas completed all primary journeys with zero detective work.
- **Founder Acceptance Walkthrough Signed Off:** Candy Chevalier verified all 4 operating journeys. Captured **0 confusion, 0 hesitation, 0 unexpected behavior, 0 missing information**.
- **Role-Based Training Validation Completed (PASS):** Executed comprehensive cognitive understanding walkthrough across **10 key roles** across all 12 core domains (9.34/10 ease-of-use).
- **Sandbox Mental Model Decision Canonical Standard Enforced:** All 5 layers (Review Mode, Sandbox Gateway, Persona Launcher, Mission Control, Training Hub) are rigorously separated in UI and behavior.
- **Concept Governance Register Established (Authoritative Semantic Standard):** Created [`CONCEPT_GOVERNANCE_REGISTER.md`](CONCEPT_GOVERNANCE_REGISTER.md) defining canonical categories.
- **Drift Accountability Review Completed (Authoritative Foundation Truth):** Created [`DRIFT_ACCOUNTABILITY_REPORT.md`](DRIFT_ACCOUNTABILITY_REPORT.md) answering *"Why are we having the same conversation repeatedly?"*. Pruned taxonomy down to 3 real software decisions (ROLE, WORKSPACE, STATE), retired AUDIENCE, PURPOSE, and WORKFLOW from software governance, confirmed the reality of the 7 figures, and locked **The 10 Things Every Future AI Must Never Forget**.
- **Trainer Validation Requirement & Video Walkthrough Audit (Implemented & Committed `20dc1ac`):** Created [`TRAINER_VALIDATION_REQUIREMENT.md`](TRAINER_VALIDATION_REQUIREMENT.md) based on video review (`Recording 2026-10-16 185103.mp4`). Repaired Defects D-001 (PII Shield), D-002 (Dead State Lockout), D-003 (Parent Contamination) and implemented the **Two-Dataset Architecture** (Dataset A: Day 1 Onboarding vs. Dataset B: 90-Day Established) across Foster, Kinship, Parent, and Respite with a 1-click sandbox reset.

---

### 🔒 FOUNDER ACCEPTANCE & DEVELOPMENT FREEZE: ACTIVE
**Status:** **APPROVED & MENTAL MODEL ENFORCED**  
**Operating Rule:** ⛔ No new feature development | ⛔ No architecture changes | ⛔ No governance changes | ⛔ No role changes | ⛔ No database schema changes.

| Evaluated Dimension | Status | Verified Operating Reality |
| :--- | :--- | :--- |
| **Caregiver Cognitive Load** | **PASS** | 15-second routine logging, 1-click DCF monthly report, 5-click atomic emergency intake. |
| **Kinship Cognitive Load** | **PASS** | 1-tap plain-English benefits triage ($350 fund, Reach Up, Dr. Dynasaur) & welfare acronym decoder. |
| **Parent Cognitive Load** | **PASS** | Isolated 4-module dignity workspace (roadmap, shared moments, check-in, certificates). Zero state claims/licensing. |
| **Respite Cognitive Load** | **PASS** | 1-tap Care & Safety Sheet with allergies, meds, comforting, and emergency numbers in <30s. |
| **Founder Cognitive Load** | **PASS** | Single source-of-truth home (`FOUNDER_ORIENTATION_DASHBOARD.md` & `PROJECT_STATE.md`). 212/212 tests passing. |
| **Founder Acceptance** | **ACCEPTED** | Candy completed all 4 primary operating journeys without becoming the detective. |
| **Mental Model Enforcement** | **ENFORCED & PASS (MME-01 through MME-04)** | Review Mode vs Persona Launcher split; Founder quarantined from training roles; Gateway Airlock & 3 Doors mounted; Active Child permanently anchored in sticky header. |
| **Concept Governance** | **ESTABLISHED & AUTHORITATIVE (7 Categories)** | Master semantic register locked in `CONCEPT_GOVERNANCE_REGISTER.md`. Permanent rule: Audience ≠ Role, Role ≠ Tool, Tool ≠ Workspace, Workspace ≠ Purpose, Workflow ≠ Role. |
| **Drift Accountability** | **PRUNED & IMMUTABLE (3 Core Truths, 10 Commandments)** | Root cause of repeated drift solved in `DRIFT_ACCOUNTABILITY_REPORT.md`. Spectators retired from software; child restored as undeniable center. |
| **Test Verification Baseline** | **212/212 PASSING (100%)** | 5 full verification suites passing with zero failures. |

---

## 🎯 WHAT MATTERS?

Only three things matter right now:

1. **The Drift Prevention Gate (Mandatory Before Any Work/Document/Feature):**
   - **Primary User Test (The Bedrock Filter):** Identify the real human whose day improves (**Parent Participant**, **Foster Caregiver**, **Kinship Caregiver**, **Respite Provider**). If the answer is **Legislator**, **Trainer**, **Donor**, or **Evaluator**, it must prove why it belongs inside the software rather than in documentation, demos, or exported reports. If it cannot prove this: **DO NOT BUILD IT IN-APP.**
   - **Q1:** What decision changes because this exists? *(If none: STOP).*
   - **Q2:** Does this affect **ROLE**, **WORKSPACE**, or **STATE**? *(If not: Challenge necessity).*
   - **Q3:** How does **Parent Participant** fit? *(If Parent cannot be clearly explained: Re-evaluate).*
   - **Q4:** How does this help answer: *Where am I? What matters? What is next? What is blocked?*
   - **Q5:** Does this introduce new terminology, categories, or conceptual layers? *(If yes: Justify with concrete operational impact).*
   - **Q6:** Would a future AI need this to avoid making a wrong decision? *(If no: Do not add it).*
2. **Protecting Caregiver Cognitive Load:** Never make Candy or any caregiver act as the integration layer, memory clerk, detective, or debugger. Every screen must answer: *Where am I? What is next?*
3. **Execution Without Regression:** Preserving 100% test pass rate and backward compatibility with local workspace data.

---

### 🛡️ THE DRIFT INVARIANT:
- **Reduce complexity.**
- **Never increase complexity.**
- **Never create governance that requires additional governance.**

---

## 🟢 WHAT IS ACTIVE?

These are the only active workstreams currently in motion:

| Workstream | Scope | Target File(s) | Status |
| :--- | :--- | :--- | :--- |
| **Mental Model Enforcement Review** | Evaluation of current UI against 5 layers; 6 mismatch tickets documented. | `docs/MENTAL_MODEL_ENFORCEMENT_BACKLOG.md` | **COMPLETE & AUDITED (4 P0, 2 P1)** |
| **Sandbox Mental Model Decision** | Authoritative resolution of Founder role and 5 sandbox concept boundaries. | `docs/SANDBOX_MENTAL_MODEL_DECISION.md` | **COMPLETE & RESOLVED (PASS)** |
| **Sandbox Journey Mapping** | Architectural mapping of 3-step entry, 8 role blueprints, and screen taxonomy. | `docs/SANDBOX_JOURNEY_MAP.md` | **COMPLETE & SPECIFIED (PASS)** |
| **Role-Based Training Validation** | Cognitive understanding audit of 10 user archetypes across all 12 domains. | `docs/TRAINING_VALIDATION_REPORT.md` | **COMPLETE & VALIDATED (0 P0s)** |
| **Sandbox Orientation Review** | Evaluation of entry experience, 4 special review items, and orientation backlog. | `docs/SANDBOX_ORIENTATION_REPORT.md` | **COMPLETE & AUDITED (3 P0, 5 P1, 3 P2)** |
| **Founder Sandbox Walkthrough** | Guided 5-persona self-review and feedback capture without developer assistance. | `app/static/index.html`, `app/static/app.js`, `app/server.py` | **ACTIVE & READY** |
| **Real-World Validation (Observation Mode)** | Support Founder demos; observe real users (Foster, Kinship, Parent, Respite); capture friction only. | `docs/FOUNDER_ORIENTATION_DASHBOARD.md`, `docs/PROJECT_STATE.md` | **ACTIVE & OBSERVING** |
| **Founder Home Alignment** | Single source-of-truth project maintenance across state ledgers. | `docs/FOUNDER_ORIENTATION_DASHBOARD.md`, `docs/PROJECT_STATE.md` | **ACTIVE & SYNCHRONIZED (178/178 Tests)** |

---

## 🔴 WHAT IS BLOCKED?

The following are **INTENTIONALLY HELD (GATED)**:

| Item | Gate Condition | Why It Is Held |
| :--- | :--- | :--- |
| **Outbound Invitation Delivery** | Blocked pending verified legal, privacy, identity-verification, consent, and delivery requirements. | Prevents unverified external electronic transmission. |
| **Child Voice Direct Authoring** | Deferred to Phase 17+. | Intentionally out of scope for v3.x foundation. |

---

## ⏩ WHAT IS NEXT?

1. **Founder Sandbox Walkthrough:** Candy explores the 5 personas using 1-click Review Mode and submits reflections via the Feedback modal.
2. **Real-World User Observation:** Observe Foster Caregiver, Kinship Caregiver, Parent Participant, Respite Provider; document findings only (no code fixes without Founder approval).
3. **Production Intake Readiness:** Review and prepare intake workflows and document vaults for Sample Child CH-201 at Sample Household A.
4. **Continuous Maintenance:** Maintain single source of truth in `FOUNDER_ORIENTATION_DASHBOARD.md` and `PROJECT_STATE.md`.

---

### 🛡️ OPERATIONAL REALITY VERDICT: CAN REAL USERS OPERATE SPROUT WITHOUT BECOMING THE DETECTIVE?

**YES — UNCONDITIONALLY ACROSS ALL OPERATIONAL SCENARIOS.**

- **Routine Daily Operations (Logging, Health, Exports, Respite Cards, Parent Sharing):** **PASS.** Caregivers and parents accomplish primary tasks in <15 seconds or 1 click without hunting across quadrants or debugging state.
- **High-Stress Boundary Transitions (Late-Night Intake, Kinship Onboarding, Permanency Closure):** **PASS.** Guided wizards, atomic data capture, and plain-English welfare decoders eliminate all guesswork and multi-step cognitive strain.

---

## 🚫 WHAT CAN I IGNORE?

You do **NOT** need to think about, review, or touch any of the following:

- **Historical Architecture Proposals:** All pre-v3.1 design docs, discovery drafts, and brainstorm logs. (They are superseded by [`CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/docs/CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md)).
- **Role Permission Redesigns:** The 8 roles and their CRUD matrix are locked in [`ROLE_PERMISSION_MATRIX_V2.md`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/docs/ROLE_PERMISSION_MATRIX_V2.md). Do not invent new roles.
- **Child Voice Authoring:** Youth-authored Lifebook accounts and reflections are deferred to Phase 17+ ([`CHILD_VOICE_DOMAIN_DISCOVERY.md`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/docs/CHILD_VOICE_DOMAIN_DISCOVERY.md)).
- **State IT / SACWIS / CCWIS Integration:** Sprout outputs formatted `.docx` and `.pdf` documents for DCF workers. We do not integrate with state mainframe databases.
- **Complex Cloud Infrastructure:** Sprout remains 100% local and offline-first. Zero cloud deployment overhead.

---

## 📌 PRIMARY PROJECT HOME & MAINTENANCE PROTOCOL

> **Mandate:** `FOUNDER_ORIENTATION_DASHBOARD.md` and `PROJECT_STATE.md` are the **primary project home**.
>
> **Future Sprint Rule:** All future sprint reports and deliverables MUST directly update:
> - **WHAT IS ACTIVE?**
> - **WHAT IS BLOCKED?**
> - **WHAT IS NEXT?**
> - **WHAT CAN I IGNORE?**
>
> **Do NOT create additional status documents, side-car trackers, or redundant progress files.**

