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

