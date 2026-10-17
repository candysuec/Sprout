# Sprout KinCare OS: Master Transition Dossier & New-Thread Handover

**Generated:** 2026-10-17  
**Founder:** Candy Chevalier  
**System:** Sprout KinCare OS — Vermont Kinship & Placement Command Center  

---

## 1. Executive Summary: Where the Program Was vs. Where It Is Now

| Area | Previous State (Windows OneDrive) | Current State (WSL Ubuntu + Docker) |
| :--- | :--- | :--- |
| **Physical Location** | `c:\Users\candy\...\Davis & VTDCF Shared Folder` (OneDrive) | `/home/gemi/projects/Sprout` on WSL Ubuntu 24.04 (`\\wsl.localhost\Ubuntu\home\gemi\projects\Sprout`) |
| **Execution Environment** | Unmanaged background Windows Python processes with port collisions (8080, 8081, 5000) | Isolated, health-checked Docker container `sprout-app:canonical` on port **5858** |
| **Database Stability** | OneDrive sync file locks triggering `sqlite3.OperationalError: database is locked` | High-performance ext4 Linux SQLite storage (`sprout_state.db`) with zero lock contention |
| **Git Repositories** | Fragmented branches, untracked OneDrive sync conflicts | Canonical Git repo at `https://github.com/candysuec/Sprout.git`, clean on `wsl-main` & `main` |
| **UI First-Load Experience** | 7 stacked horizontal bars, duplicate buttons, auto-locking Sarah Jenkins, screen-blocking floating pill | Single-row navigation, unified Child Cockpit, clean 4-Act Training Launchpad, zero occluding pills |
| **Verification Baseline** | Manual testing, frequent regressions | **243 / 243 automated tests passing (100%)** across 7 regression and security suites |

---

## 2. Infrastructure & Docker Specifications

* **Canonical Project Directory:** `/home/gemi/projects/Sprout`
* **Windows UNC Path:** `\\wsl.localhost\Ubuntu\home\gemi\projects\Sprout`
* **Python Virtual Environment:** `/home/gemi/projects/Sprout/.venv` (Python 3.14/3.11)
* **Docker Container:**
  * **Name:** `sprout-app`
  * **Image:** `sprout-app:canonical`
  * **Network Port:** `http://127.0.0.1:5858` (Healthy, serving local & offline)
  * **Command:** `python app/server.py`
  * **Healthcheck:** Verified via `curl -f http://127.0.0.1:5858/ || exit 1`
* **Documentation Mirror:**
  * Windows path: `c:\Users\candy\OneDrive\Documents\01_PERSONAL_&_FAMILY\Davis & VTDCF Shared Folder\docs`
  * Automatically mirrored from WSL `/home/gemi/projects/Sprout/docs/`

---

## 3. The 4-Layer Training Architecture

The user interface and state machine are strictly organized around Candy's 4 training curriculum pillars:

1. **Act 1: Day 0 Setup (Clean Slate / Add New Person)**
   * **Purpose:** For trainees or caregivers setting up Sprout for the first time with zero pre-existing records.
   * **Implementation:** `openGuidedOnboardingModal(role)` (`app.js`) and `POST /api/onboarding/walkthrough` (`server.py`).
   * **Workflow:** 4-step wizard: Role selection (Foster, Kinship, Respite, Parent), child intake, urgent allergy verification, and Day 1 priority.
2. **Act 2: Day 1 Baseline (Foster Care — Liam Brooks)**
   * **Purpose:** Minimal intake baseline showing how Sprout protects a caregiver on Day 1.
   * **Implementation:** Dataset A (`/api/sample-dataset/reset?dataset=a`).
   * **Core Tools:** 1-page printable emergency & daily care summary (`openEmergencyHandoffCard()`) and 15-second daily routine note (`openRecordModal()`).
3. **Act 3: Day 90 Established Household (Dataset B)**
   * **Purpose:** Demonstrates long-term stability: historical pediatrician logs, dental visits, school IEP notes, and court-ready documentation.
   * **Implementation:** Dataset B toggle (`toggleDatasetModeHeader()`).
4. **Act 4: 15 Model Households Gallery**
   * **Purpose:** Realistic scenarios across all Vermont care situations: Kinship grandparents (Eleanor & Arthur), 48-hour Respite (Samantha Price), and Bio-Parent reunification (Angela Davis).
   * **Implementation:** `openCaregiverProfilesModal()` loading from `/api/sample-dataset`.

---

## 4. UI Streamlining & Component Archiving

Per the Founder Directive to eliminate the 7-band visual fatigue without losing code:
* **Archived Elements:**
  * Fast-Action Sub-Toolbar (Search Omnibar, quick sign, duplicate buttons)
  * Reference & Help Ribbon (Sprout Sphere indicator, redundant links)
  * Founder Floating Dock (`#founderFloatingDock` which previously covered page 2)
  * Redundant Mission Control Quick Action Dock (merged into the 4 Workspaces)
* **Archive Files & Safety Nets:**
  * Component Archive Register: `app/static/archive/ARCHIVED_ELEMENTS.html`
  * Pre-cleanup Backups: `app/static/index.html.bak-firstload`, `app/static/app.js.bak-firstload`
  * Git Recovery Branches: `backup-before-first-load-cleanup`, `archive-before-clean-frontdoor`
  * Zero-Regression Container: All archived elements are preserved in `#archivedElementsContainer` (`style="display:none;"`) so all legacy scripts and element lookups succeed.

---

## 5. Architectural Invariants & Governance Rules

1. **Non-Destructive Archiving Invariant:**  
   No code, component, or documentation may be deleted without first archiving the full snippet into `app/static/archive/` and logging the rationale in `docs/`.
2. **Deterministic Browser Invariant:**  
   Root HTML and JS assets must be served with `Cache-Control: no-store, no-cache, must-revalidate, max-age=0` and dynamic timestamp query strings to prevent browser cache drift.
3. **Single Source of Truth:**  
   The canonical codebase is `/home/gemi/projects/Sprout` on `wsl-main`. The Windows OneDrive folder is strictly a user-facing documentation mirror.
4. **Zero-Regression Release Gate:**  
   All 7 test suites must pass 100% prior to pushing to `main`:
   * `test_guided_onboarding.py` (4/4 roles verified)
   * `test_trainer_two_datasets.py` (34/34 tests passing)
   * `test_operational_readiness.py` (29/29 tests passing)
   * `test_parent_workspace_integration.py` (30/30 tests passing)
   * `test_browser_determinism.py` (22/22 tests passing)
   * `test_phase13b_governance.py` (46/46 tests passing)
   * `test_e2e_flows.py` (78/78 tests passing)

---

## 6. Key Documentation Reference List

* `docs/FIRST_LOAD_ENHANCEMENT_LOG.md`: Detailed record of the navigation cleanup and launchpad transformation.
* `docs/DOCKER_OFFICIAL_SPECIFICATION.md`: Official container commands, ports, and environment specifications.
* `docs/CONCEPT_GOVERNANCE_REGISTER.md`: System terminology, mental models, and state dictionary.
* `docs/FOUNDER_ORIENTATION_DASHBOARD.md`: Milestone history and founder directives.
* `app/static/archive/ARCHIVED_ELEMENTS.html`: Full markup of all archived toolbars and docks with restore instructions.
