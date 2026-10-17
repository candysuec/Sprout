# Sprout KinCare OS: Authoritative Technical Briefing & Architecture Dossier

**Generated:** October 17, 2026  
**System:** Sprout KinCare OS (Child & Family Success Operating System)  
**Product Owner / Founder:** Candy Chevalier  
**Primary Language Stack:** Python 3.11 (Bottle WSGI) + Vanilla JavaScript (ES2022) + TailwindCSS CDN + SQLite3  
**Container Infrastructure:** Docker on WSL2 (Ubuntu 24.04 LTS)  
**Host Port / Container Port:** `5858:5858`  
**Current Milestone:** v3.3.1 (Screen Recording UX Enhancements & Household Members Engine)  
**Git Remote:** `https://github.com/candysuec/Sprout.git` (`main` & `wsl-main` at commit `c9e897f`)  
**Automated Verification:** **261 / 261 Tests Passing (100%)** across 8 test suites  

---

## 1. Master System Purpose & Architectural Boundaries

Sprout is a **100% local, offline-first Child & Family Success Operating System** built specifically for kinship grandparents, foster caregivers, respite providers, and biological parents.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WHAT SPROUT IS & IS NOT                           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│               WHAT IT IS             │             WHAT IT IS NOT           │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Trauma-informed daily cockpit      │ • NOT a State DCF database           │
│ • 15-second daily routine logger     │ • NOT a caseworker management portal │
│ • 1-page printable emergency sheet   │ • NOT a court case management system │
│ • State compliance & mileage tracker │ • NOT a clunky digital file binder   │
│ • Bridge supporting reunification    │ • NOT a cloud-dependent SaaS web app │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Repository & File System Topology

```
/home/gemi/projects/Sprout (Canonical Git Root in WSL2)
├── app/
│   ├── server.py              # Main backend application (Bottle WSGI, 46 REST routes)
│   ├── db.py                  # SQLite connection manager, schema version 7, migrations
│   ├── sample_dataset.py      # 15 synthetic households, 26 children, Dataset A & B
│   ├── services.py            # DOCX Lifebook & PDF state document generator
│   └── static/
│       ├── index.html         # Single-Page App shell, modals, curriculum stage
│       ├── app.js             # Client state machine, controllers, DOM renderers
│       ├── style.css          # Custom styling, print media rules, animations
│       └── archive/
│           └── ARCHIVED_ELEMENTS.html # Preserved UI components (Zero code loss)
├── docs/                      # Master Documentation Catalog (83 markdown files)
│   ├── MASTER_WSL_DOCKER_HANDOVER_DOSSIER.md
│   ├── DOCKER_OFFICIAL_SPECIFICATION.md
│   ├── LAST_KNOWN_GOOD_STATE_RECOVERY.md
│   ├── RECORDING_FEEDBACK_RESOLUTION_REPORT.md
│   ├── FIRST_LOAD_ENHANCEMENT_LOG.md
│   ├── PROJECT_STATE.md
│   ├── PROJECT_MANAGEMENT_BOARD.md
│   └── SPROUT_SYSTEM_HANDOVER_DOSSIER.md
├── shared_docs/               # Official Vermont DCF state forms (FS-221A, FS-334B)
├── backups/                   # Automated SQLite database snapshot storage
├── test_browser_determinism.py          # 22 tests: Cache-control, tri-state identity
├── test_trainer_two_datasets.py        # 34 tests: Dataset A vs B, reset API
├── test_e2e_flows.py                   # 73 tests: 15 homes, 12 subtabs, audit chain
├── test_parent_workspace_integration.py# 30 tests: 5 parent scenarios, safety gates
├── test_phase13b_governance.py         # 46 tests: Schema version 7, EXIF scrubber
├── test_operational_readiness.py       # 29 tests: EPW wizard, lifebook, kinship guide
├── test_guided_onboarding.py           # 9 tests: 4-step wizard across 4 roles
├── test_household_members.py           # 18 tests: household_members CRUD & isolation
├── Dockerfile                 # Multi-stage container definition (Python 3.11-slim)
└── docker-compose.yml         # Container configuration & persistent volume mounts
```

---

## 3. Infrastructure & Runtime Topology

| Layer | Path / Parameter | Role / Invariant |
| :--- | :--- | :--- |
| **WSL Project Root** | `/home/gemi/projects/Sprout` | Canonical ext4 Linux filesystem |
| **Windows UNC Access** | `\\wsl.localhost\Ubuntu\home\gemi\projects\Sprout` | Direct access for VS Code / IDE |
| **Windows Mirror** | `C:\Users\candy\OneDrive\...\Davis & VTDCF Shared Folder\docs` | Offline synced markdown copy |
| **Docker Container** | `sprout-app` (`sprout-app:canonical`) | Isolated Python runtime on port 5858 |
| **Internal / Host Port** | `5858` / `http://127.0.0.1:5858` | Zero collision with 8080, 8081, 5000 |
| **Named Volume** | `sprout-data` mounted to `/data` | Persistent SQLite database storage |
| **Desktop Launcher** | `C:\Users\candy\Desktop\Sprout.lnk` | Points to `Launch_Sprout.bat` |
| **Desktop Icon** | `C:\Users\candy\Desktop\sprout_seedling.ico` | High-res 3D seedling icon |

---

## 4. Database Architecture & Schema Ledger

- **Database File:** `/home/gemi/projects/Sprout/foster_binder.db` (and `/data/foster_binder.db`)
- **Schema Lock:** `PRAGMA user_version = 7` (Strict invariant checked by `test_phase13b_governance.py`).
- **Core Relational Schema:**
  1. **`children`**: `id`, `first_name`, `last_name`, `preferred_name`, `alias`, `dob`, `gender`, `placement_date`, `allergies`, `comfort_items`, `status`, `permanency_goal`, `relationship_type`, `high_conflict_mode`.
  2. **`households`**: `id`, `name`, `address`, `e911_address`, `mailing_address`, `status`, `license_status`, `primary_caregiver`, `secondary_caregiver`, `home_owner`, `household_structure`, `caregiver_stage`, `high_conflict_mode`.
  3. **`household_members`**: `id`, `household_id`, `name`, `role`, `relationship`, `age`, `dob`, `phone`, `email`, `notes`, `created_at` (Created idempotently via `ensure_extended_tables(conn)`).
  4. **`timeline_records`**: `id`, `child_id`, `category`, `title`, `severity`, `event_date`, `location`, `participants`, `summary`, `classification`, `domain`, `sensitivity_level`, `retention_state`, `dcf_draft_text`, `gal_draft_text`.
  5. **`parent_users`**: `id`, `child_id`, `parent_name`, `auth_token`, `state`, `is_high_conflict`.
  6. **`parent_goals`**: `id`, `parent_id`, `title`, `description`, `category`, `status`, `progress`.
  7. **`parent_evidence`**: `id`, `goal_id`, `file_name`, `file_path`, `verified_by`.
  8. **`audit_ledger`**: Cryptographic SHA-256 tamper-evident blockchain recording all record mutations.

---

## 5. Backend REST API Architecture (46 Endpoints)

### A. Context & Core Routing
- `GET /`: Serves `index.html` with dynamic `?v=<timestamp>` and `Cache-Control: no-store`.
- `GET /docs/<filename:path>`: Serves rendered markdown documentation over HTTP.
- `GET /static/<filename:path>`: Serves static assets with strict no-cache headers.

### B. Child & Household Entities
- `GET /api/children`: Resolves placed children based on active mode (`sample` vs `local`), dataset (`a` vs `b`), and caregiver session.
- `POST /api/children`: Atomic intake creation for new child placement.
- `GET /api/households`: Returns registered caregiver residences.
- `GET /api/households/<id>/members`: Returns household residents roster.
- `POST /api/households/<id>/members`: Adds a new resident/caregiver to household.
- `DELETE /api/households/<id>/members/<member_id>`: Removes resident from household.

### C. Timeline Records & Smart Logging
- `GET /api/children/<id>/records`: Filterable chronological entries by category (`medical`, `daily`, `school`, `visits`, `incident`).
- `POST /api/children/<id>/records`: Atomic creation of 15-second routine or medical entries.
- `PUT /api/records/<id>` & `DELETE /api/records/<id>`: Record lifecycle mutation.

### D. Training, Simulation & Datasets
- `GET /api/sample-dataset`: Returns 15 normalized caregiver journey homes and 26 children.
- `POST /api/sample-dataset/reset`: Wipes transient sandbox edits and reinitializes Day 1 baseline.
- `POST /api/onboarding/walkthrough`: Atomically creates household, child, adult member, and initial placement tasks across all 4 roles.

### E. Parent Participant Continuum
- `GET /api/parent/status`: Resolves parent access state (`PROVISIONAL`, `ACTIVE_ENGAGED`, `RESTRICTED`, `NEAR_REUNIFICATION`, `REVOKED`).
- `GET /api/parent/feed`: Anti-conflict sanitized feed (`shared_family` only; date-only timestamps; masked confidential visit locations).
- `GET /api/parent/goals` & `POST /api/parent/goals`: Roadmap progress tracker.
- `POST /api/parent/checkin`: Supervised visit arrival verification.

---

## 6. Client-Side State Machine (`app/static/app.js`)

### Global State Variables:
```javascript
let currentChildId = null;            // Active placed child ID (e.g., 201 for Liam)
let activeCaregiverUser = null;        // Active caregiver persona (e.g., Sarah Jenkins)
let currentSproutMode = 'sample';      // 'sample' (Sandbox) vs 'local' (Real Family)
let currentSproutDataset = 'a';        // 'a' (Day 1 Onboarding) vs 'b' (Day 90 Case)
let currentMainSection = 'training';   // Active page: 'training', 'mission_control', 'dashboard', 'children', 'parent', 'households'
let currentChildSubTab = 'overview';   // Child workspace subtab (12 total)
let isPrivacyBlurActive = false;       // PII Shield blur toggle
let onboardingOpenedFromLauncher = false; // Preserves modal return navigation
```

### Core Controller Functions:
- `switchMainSection(sectionKey, pushHistory = true)`: Controls main tab routing, updates browser history stack via HTML5 `pushState`, and automatically toggles context-sensitive header buttons.
- `updateActCardsActiveState()`: Evaluates active dataset; highlights Act 2 (Liam Day 1) or Act 3 (Emma Day 90), and gracefully dims (`opacity-40 grayscale-50`) non-active acts.
- `activateTrainingAct(actNumber)`: 1-click curriculum switcher; loads child context and routes directly to `#children` or `#guidedOnboardingModal`.
- `launchPersonaReview(persona, dataset)`: Flight simulator launcher; binds canonical child, locks sandbox containment, and routes directly to `#children`.
- `openHouseholdMembersModal(hhId, hhName)` & `loadHouseholdMembers(hhId)`: Full interactive roster management.
- `loadDashboardHouseholdMembers(hhId)`: Dynamically populates the Dashboard Roster card.

---

## 7. The 4-Act Curriculum Presentation Architecture

1. **Act 1: Day 0 Clean Slate (+ Set Up New Person):**
   - 4-step intake wizard (`#guidedOnboardingModal`) for new arrivals with zero prior records.
   - Tailored setup for Foster, Kinship, Respite, or Parent roles.
2. **Act 2: Day 1 Baseline (Foster Care — Liam Brooks):**
   - Dataset A: Pristine Day 1 placement clocks.
   - Highlights the 1-Page Printable Care Sheet (`openEmergencyHandoffCard()`) and 15-second routine check-in.
3. **Act 3: Day 90 Case (Dataset B — Emma Vance):**
   - Established 3-month history: Pediatrician well-visits, school IEP milestones, court evidence, and $0.67/mi mileage logs.
4. **Act 4: 15 Model Households Gallery:**
   - 15 synthetic Vermont homes modeling all structures (grandparents, domestic partners, single adults) and care pathways.

---

## 8. Verification Baseline: 8 Test Suites (261 / 261 Passing)

```bash
docker exec sprout-app python test_household_members.py           # 18/18 PASS
docker exec sprout-app python test_guided_onboarding.py           # 9/9   PASS
docker exec sprout-app python test_trainer_two_datasets.py        # 34/34 PASS
docker exec sprout-app python test_operational_readiness.py       # 29/29 PASS
docker exec sprout-app python test_e2e_flows.py                   # 73/73 PASS
docker exec sprout-app python test_browser_determinism.py         # 22/22 PASS
docker exec sprout-app python test_phase13b_governance.py         # 46/46 PASS
docker exec sprout-app python test_parent_workspace_integration.py# 30/30 PASS
```

---

## 9. The 3-Step Synchronization Invariant

Whenever system code, documentation, or rules are modified, execute this invariant workflow:

1. **Edit in Master Location:** Edit code and docs in `/home/gemi/projects/Sprout` (`\\wsl.localhost\Ubuntu\home\gemi\projects\Sprout`).
2. **Mirror to Windows:** Copy markdown docs to `C:\Users\candy\OneDrive\Documents\01_PERSONAL_&_FAMILY\Davis & VTDCF Shared Folder\docs\`.
3. **Commit & Push to GitHub:** Commit on `wsl-main`, fast-forward merge `main`, and push both branches to `candysuec/Sprout.git`.
