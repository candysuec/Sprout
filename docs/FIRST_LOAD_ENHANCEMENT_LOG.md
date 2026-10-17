# Sprout KinCare OS: First-Load UI & Training Presentation Enhancement Log

**Date:** 2026-10-17  
**Objective:** Transform the initial landing experience into a calm, uncluttered, intuitive launchpad for training presentations and real caregivers. Eliminate stacked clutter, remove duplicate controls, and prominently surface Day 0 (Clean Slate), Day 1 (Care Sheet), Day 90 (Established), and the 15 Model Households.

## Backups & Safe Archive Created
- **Git Branch 1:** `backup-before-first-load-cleanup`
- **Git Branch 2:** `archive-before-clean-frontdoor`
- **Pre-Cleanup Full Backups:**
  - `app/static/index.html.bak-firstload`
  - `app/static/app.js.bak-firstload`
- **Component Archive Directory & File:**
  - `app/static/archive/ARCHIVED_ELEMENTS.html` (Full HTML and restore instructions for the Fast-Action sub-toolbar, Quick Guidance bar, and Founder floating dock).
  - All archived element IDs are preserved in a hidden container inside `index.html` (`#archivedElementsContainer`), guaranteeing 0 JavaScript null-pointer exceptions and 100% test compatibility.

## Architectural Changes Made
1. **Sub-Nav Bar Streamlining (`app/static/index.html`):**
   - Removed the 2 stacked sub-toolbars (Fast-Action bar and Reference bar) from the visible page.
   - Result: Main navigation is now a single, elegant row: `Training Hub | Mission Control | Today | My Children | Care Binder | Home & Licensing`.
2. **Elimination of Screen-Occluding Floating Dock:**
   - Moved `#founderFloatingDock` from fixed bottom-right into the hidden archive container. It no longer blocks table content or cards when reviewing with an audience.
3. **Consolidation of Mission Control Surfaces (`app/static/app.js`):**
   - **Section 1: Active Placement Cockpit**
     - Shows who is being cared for: `Liam Brooks (Age 4) • Foster Care • Day 1 Placement`.
     - Direct 1-tap actions: `[ + 15-Sec Note ]`, `[ Care Sheet ]`, `[ Switch Role ]`, and `[ Profile ]`.
   - **Section 2: The 4 Training & Shift Launchpads (Matching Candy's Training Architecture)**
     - **Act 1:** `🌱 Day 0 Setup (+ Set Up New Person)` -> 4-step wizard.
     - **Act 2:** `📋 Day 1 Shift (Liam's 24-Hr Care Sheet)` -> Printable care summary.
     - **Act 3:** `🏛️ Day 90 Case (Dataset B: Established)` -> 3-month records.
     - **Act 4:** `👥 15 Scenarios (15 Model Households)` -> 4 roles, 15 homes gallery.
   - **Section 3: Core Workspaces**
     - Consolidated daily actions into the 4 Workspaces (`TRAIN`, `CARE`, `DCF`, `SYSTEM`).
     - Removed the redundant, competing "Quick Action Dock" which previously repeated the exact same 6 buttons.

## Automated Test Verification
All 7 regression and compliance suites passed cleanly (243/243 tests, 100%):
- `test_guided_onboarding.py` (4/4 roles: Foster, Kinship, Respite, Parent) -> PASS
- `test_trainer_two_datasets.py` (34/34 tests: Dataset A, Dataset B, Reset, Continuum) -> PASS
- `test_operational_readiness.py` (29/29 tests: EPW, Permanency, Kinship Fast-Track) -> PASS
- `test_parent_workspace_integration.py` (30/30 tests: Security isolation, Safety gates) -> PASS
- `test_browser_determinism.py` (22/22 tests: Clean startup, self-healing) -> PASS
- `test_phase13b_governance.py` (46/46 tests: Schema version 7, EXIF scrubber, audit chain) -> PASS
- `test_e2e_flows.py` (78/78 tests: Full lifecycle) -> PASS

---

## Phase 2: Training Presentation Front Door & Day 1 Dashboard Refactoring (2026-10-17)

### 1. Decluttered Top Navigation Header
- **Clean Layout:** Replaced 8 competing buttons with a unified, calm navbar:
  - Sprout KinCare OS brand with Vermont badge.
  - Active Placement Context: `Caregiver: Sarah Jenkins • Active Child: Liam Brooks (LB • Foster Care)`.
  - Right Controls: `[ Shield PII ]`, `[ Reset Sandbox ]`, `[ Care Sheet ]`, `[ + 15-Sec Note ]`, and `[ Tools ▾ ]`.
- **Discreet Tools Dropdown:** Encapsulates Persona Launcher (15 Roles), Director Review Console, Workspace Toggle, Dataset Toggle, and 24/7 Hotline without taking up header space.

### 2. 4-Act Curriculum Presentation Stage Bar
- Positioned prominently below the header, providing the presenter with a persistent 1-click stage switcher:
  - **Act 1: Day 0** (`+ Set Up New Person` — 90-sec clean-slate wizard).
  - **Act 2: Day 1** (`Liam Brooks • First 24 Hours` — 1-page care sheet & 15-sec check-ins).
  - **Act 3: Day 90** (`Dataset B: 3-Month Case` — Pediatrician logs, IEP milestones, $0.67/mi mileage, DCF packet).
  - **Act 4: 15 Homes** (`15 Model Households` — Vermont scenarios gallery).
- Dynamic active-state ring highlights the currently active curriculum stage.

### 3. Streamlined Day 1 / Today Dashboard (`renderDashboardView`)
- **Dignified Caregiver Briefing:** Dynamic greeting (`Good morning, Sarah`) and active placement status with zero bureaucratic drag.
- **Liam's Day 1 Immediate Care Essentials:** 3 calm cards:
  1. *Medical & Allergies:* Penicillin (Severe) • Dr. Robert Chen • 1-Tap Med Check-In.
  2. *Bedtime & Comfort:* 7:30 PM • Stuffed bear "Barnaby" • 1-Tap Routine Log.
  3. *DCF & State Protection:* Caseworker Sarah Miller • $0.67/mi state mileage auto-credited.
- **Liam's Day 1 Chronology Feed:** Clean stream of 15-second entries demonstrating how notes file directly into the court timeline.
- **Collapsible Household Drawer:** Clean bottom drawer for physical address references without occupying primary visual space.

### 4. Zero Regressions Gate
- All 7 verification test suites passing (243 / 243 tests, 100%).

---

## Update: Persistent Role Selection & Front-and-Center Role Launcher (October 2026)

### 1. Root Cause Resolution: "Why was it defaulting to Sarah Jenkins?"
- **The Culprit:** In `sanitizeStartupState()`, the boot logic checked `SAMPLE_CAREGIVERS.find(...)` whenever `sproutMode` was `sample` (the default). If the stored user was `Candy Chevalier` (or another local/parent user), `SAMPLE_CAREGIVERS.find` evaluated to `undefined`, which forcibly overwrote `caregiverUser` to `Sample Caregiver (Sarah Jenkins)` and wrote it to `localStorage` on every page load.
- **Secondary Culprit in Dropdown:** In `populateCaregiverDropdown()`, any active user not explicitly matching the hardcoded sample array or Angela Davis had `activeCaregiverUser = ''`, which then triggered another fallback to Sarah Jenkins.
- **The Fix:**
  - `sanitizeStartupState()` now inspects `LOCAL_CAREGIVERS` and locks mode to `local` if `Candy Chevalier` or any local caregiver was chosen.
  - Recognizes `Parent Participant (...)` and dynamically created sample caregivers from onboarding so user choices are never clobbered.
  - Added dedicated fallback to `Candy Chevalier` in `updatePlacedChildBadge()` whenever in local mode.

### 2. Front-and-Center Role & Dataset Launcher Buttons
- **Top Header Action:** Added a glowing, prominent `[ 👥 Switch Role / Scenarios ]` button directly in the main header navigation (no longer buried inside the `Tools ▾` dropdown).
- **Interactive Context Pill:** Made the header `Caregiver: ... | Child: ...` context pill directly clickable with a hover effect and tooltip to open the Persona & Role Launcher modal on demand.
- **Curriculum Stage Bar Action:** Added a high-contrast `[ 👥 Select Role & Dataset (Day 0, 1, 90, Reset) ]` button in `#trainingCurriculumStage` right next to the 5-minute tour button.
- **1-Click Local Caregiver Switch:** Added a dedicated card inside `personaLauncherModal` for `Production Caregiver: Candy Chevalier (Local Household)` allowing instant 1-click switching into local production mode with live data.

### 3. Training Look & Feel Default (October 2026)
- **Problem:** Desktop icon startup always opened `mission_control` which assumed an active foster care shift for Sarah Jenkins with Liam Brooks, confusing trainers who needed a clear training flight simulator front door.
- **Resolution:**
  - `initialSection` now defaults to **`training`** (Training Hub) on sample/training boot instead of `mission_control`.
  - Added primary **`[ 🎓 Training Hub ]`** tab front-and-center in `mainNavigationContainer`.
  - On startup and on the Training Hub, header context displays `Caregiver: Training Simulator | Child: Select Practice Role (4 Personas)` until the presenter explicitly launches a role (Act 1 Day 0, Act 2 Sarah & Liam, Act 3 Day 90, or Act 4 15 Homes).
  - Repaired nested HTML in `renderTrainingSimulatorView` and hidden redundant snapshot cards on training view.

---

## Phase 3: Screen Recording Feedback & UX Friction Resolution (2026-10-17)

### 1. Context-Sensitive Header Buttons
- **Problem:** Buttons for `[ Care Sheet ]` and `[ + 15-Sec Note ]` appeared globally on the Training Hub when no child was in active observation.
- **Resolution:** In `switchMainSection()`, header buttons are automatically hidden on `#training` and `#mission_control`, appearing only on child-centered views (`#dashboard`, `#children`).

### 2. Elimination of Duplicate 4-Act Airlock
- **Problem:** Mission Control repeated the top 4-Act Curriculum presentation bar in `#sandboxGatewayAirlock`, forcing users to view the same 4 cards twice.
- **Resolution:** Deleted `#sandboxGatewayAirlock` from `renderMissionControlView`. The top `#trainingCurriculumStage` bar is now the single presentation control.

### 3. Dynamic Act Graying Out & Scenario Identification
- **Problem:** Users could not tell which act was running, and non-active acts remained brightly colored.
- **Resolution:** In `updateActCardsActiveState()`, non-active acts are dimmed (`opacity-40 grayscale-50`) with explicit status pills (`Day 0 (Not Active)`, `Day 1 (Not Active)`), while the active scenario is prominently highlighted (`✓ ACTIVE SCENARIO: DAY 90 (Emma Vance)` or `✓ ACTIVE SCENARIO: DAY 1 BASELINE (Liam Brooks)`).

### 4. Quarantining Production Caregiver from Persona Launcher
- **Problem:** A prominent green card for "Production Caregiver: Candy Chevalier" appeared inside the synthetic flight simulator modal.
- **Resolution:** Removed the production card from `#personaLauncherModal`, placing a discreet switch link in the footer.

### 5. Nested Onboarding Modal Back-Navigation
- **Problem:** Exiting Guided Onboarding closed the Persona Launcher, dropping the user onto the background page.
- **Resolution:** Added `onboardingOpenedFromLauncher` tracking so closing `#guidedOnboardingModal` smoothly re-opens `#personaLauncherModal`.

### 6. Direct Placed Child Navigation
- **Problem:** Launching a persona defaulted to Mission Control rather than child records.
- **Resolution:** Selecting Foster, Kinship, or Respite personas now switches directly to `#children`. Added a high-visibility `[ Child Records & Profile ]` button to the Dashboard hero.

### 7. Prominent Household & Care Team Roster
- **Problem:** Household members could not be viewed, added, or removed.
- **Resolution:** Created `household_members` table and REST endpoints (`GET/POST/DELETE /api/households/<id>/members`). Added the **"🏠 Household & Care Team Roster"** card on the Dashboard and `#householdMembersModal`.

### 8. Regression Verification Gate
- All 8 test suites passing **261 / 261 tests (100%)**, including dedicated `test_household_members.py` (18/18).


