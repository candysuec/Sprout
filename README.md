# Sprout — Child & Family Success Operating System

> **A 100% Local, Offline-First Child & Family Success Operating System**

Sprout exists to:
- **Protect children.**
- **Reduce caregiver burden.**
- **Support family engagement.**
- **Support reunification when appropriate.**
- **Make the next step obvious.**

Sprout is **NOT** a DCF case management system, state database, court management platform, or electronic binder. It is an operating system that equips caregivers and families with clear, self-guiding tools.

---

## 🧭 Founder & Developer Cockpit (Orientation)

If you are orienting to the project, start with these operational guides:
- [**Founder Recovery, Parity & Backlog Master Plan**](docs/DATASET_A_DAY_ONE_ONBOARDING_PLAN.md): Authoritative governance and recovery roadmap restoring post-migration determinism, tracking REC-01 through REC-07, and gating Phase 3 behind 8-persona validation.
- [**Founder Orientation Dashboard**](docs/FOUNDER_ORIENTATION_DASHBOARD.md): *Where am I? What matters? What is active? What is blocked? What is next? What can I ignore?*
- [**Current Project State Ledger**](docs/PROJECT_STATE.md): Single source of truth for work status, complete milestones, and active dependencies.
- [**Repository Map & Knowledge Directory**](docs/REPOSITORY_MAP.md): Cognitive filter categorizing all documents into *What Matters*, *Active Work*, *Reference*, and *Ignore*.
- [**System Health Specification**](docs/SYSTEM_HEALTH_SPEC.md): Zero-investigation telemetry for children, caregivers, parent access, overdue tasks, and test health.

---

## 🌟 Key Capabilities

- **Strict Zero-Leakage Architecture**: Seamless dual-sphere operation between a complete **Practice Sandbox** (preloaded with 15 synthetic household models) and a **Real Family Workspace** with 100% offline local SQLite storage.
- **Two-Dataset Training Architecture**: 1-click toggling between **Dataset A (New to Sprout / Day 1 Onboarding)** with clean clocks and intake tasks, and **Dataset B (Established 90-Day User)** with rich multi-domain history, EPSDT compliance, and mileage logs—featuring instant 1-click sandbox reset.
- **Mission Control Launchpad**: Clean root landing cockpit with permanent Quick Action Dock (`+ 15-Sec Log`, `Care & Safety Sheet`, `Export This Month`), 4 operational quadrants (**TRAIN**, **CARE**, **DCF**, **SYSTEM**), and guided caregiver pathways.
- **Dedicated Parent Participant Workspace**: Isolated, dignity-first parent portal for court-approved goal tracking, 1-tap evidence upload, visitation check-in, and strengths-based child milestones across a 4-stage continuum (Danielle, Jason, Angela, Maria).
- **Caregiver Journey Model**: Multi-dimensional modeling of caregiver households across 8 lifecycle stages, 8 household structures, and 9 approved caregiving pathways.
- **Circles of Care & Relationship Center**: 4 concentric support tiers (Core DCF Team, Legal & Advocacy, Health & School, Extended Village/Mentors) with communication logs and zero-leakage privacy boundary controls.
- **Life Journey & Milestone Center**: Trauma-informed child keepsake and achievement catalog preserving positive childhood milestones, artwork, reading progress, and portable care transition packets.
- **Two-Step Smart Logger**: High-speed journal, pediatric medical visit, school IEP conference, and family time visitation logging completed in under 15 seconds.
- **Vermont Compliance (FS-221A & CHINS Stepper)**: Built-in milestone tracker for provisional home studies, annual safety drills, 90-day fingerprint deadlines, and Title 33 CHINS court hearing milestones.
- **VCWTP Training & Mileage Tracking**: Real-time logging of Vermont Child Welfare Training Partnership hours and automated State Form FS-334B travel reimbursement generation at the official standard rate ($0.67/mi).
- **Automated Verification Baseline**: **234 / 234 tests passing (100%)** across 6 automated test suites (Browser Determinism, Two-Dataset Trainer, E2E Flows, Operational Readiness, Phase 13B Governance, Parent Workspace).

---

## 🏡 Caregiver Journey Model

Sprout normalizes caregiver management across real-world dimensions:

1. **Household Structures**:
   - Single Adult
   - Married Couple
   - Domestic Partners
   - Friends / Co-Caregivers
   - Siblings
   - Parent & Adult Child
   - Grandparents
   - Multi-Generational

2. **Caregiver Stages**:
   - *Interested → Inquiry Submitted → Training In Progress → Home Study → Provisional Approval → Newly Licensed (0–1 Year) → Established (1–3 Years) → Experienced (3+ Years) → Specialized Provider → Mentor Caregiver → Permanency Provider → Closed / Retired*

3. **Approved Care Pathways**:
   - Foster Care
   - Kinship Care
   - Respite Care
   - Emergency 72-Hour Intake
   - Therapeutic Foster Care
   - Foster-to-Adopt
   - Independent Living / YDP
   - Teen Parent Support
   - Medical Complex Foster Care

---

## 🚀 Getting Started & Deployment

Sprout runs as a 100% offline-first, local system. The canonical production deployment uses Docker & Docker Compose inside WSL2, backed by persistent Docker volumes.

### Prerequisites

- Docker Desktop / Docker Engine & WSL2 (Ubuntu)
- Modern Web Browser (Chrome, Edge, Firefox)

### Canonical Production Deployment (Docker)

1. **Clone or pull the repository:**
   ```bash
   git clone https://github.com/candysuec/Sprout.git
   cd Sprout
   ```

2. **Ensure persistent volume exists:**
   ```bash
   docker volume create sprout-data
   ```

3. **Launch Sprout Stack:**
   ```bash
   docker compose up -d
   ```

4. **Access Sprout:**
   Open your browser to `http://127.0.0.1:5858`

5. **Windows 1-Click Desktop Launcher:**
   Double-click `Launch_Foster_Portal.bat` on the Desktop. It automatically checks for port 5858 listeners, launches the Docker container if needed, and opens the default browser.

### Local Development (Python Virtual Environment)

1. **Activate environment & run:**
   ```bash
   cd Sprout
   source .venv/bin/activate
   cd app && python server.py
   ```

2. **Run the 234-Test Verification Battery:**
   ```bash
   python3 test_trainer_two_datasets.py
   python3 test_browser_determinism.py
   python3 test_phase13b_governance.py
   python3 test_operational_readiness.py
   python3 test_e2e_flows.py
   python3 test_parent_workspace_integration.py
   ```

---

## 📚 Architecture, Foundation & Governance Documentation

Production specifications, system topologies, privacy audits, training flight simulators, and instructor guides are maintained in the [`docs/`](docs/) directory. Consult the [**Master Documentation Catalog**](docs/README.md) for the full categorized index:

### 🌟 Master Strategic State & Governance
- [**Phase 13A Pre-Implementation Governance Suite**](docs/README.md#2-phase-13a-pre-implementation-governance-specifications):
  - [**API Governance Matrix**](docs/API_GOVERNANCE_MATRIX.md): Exhaustive governance specifications for all 43 endpoints (39 REST APIs + 4 file routes), defining domain ownership, 5-tier note classifications, and 8-role permissions.
  - [**Export Governance Matrix**](docs/EXPORT_GOVERNANCE_MATRIX.md): Redaction, sanitization, and output boundary controls for all 9 document generators (DCF Monthly, Court Packet, FS-334B, Respite Card, Lifebook, etc.).
  - [**Database Governance Gap Report**](docs/DATABASE_GOVERNANCE_GAP_REPORT.md): Audit of 11 SQLite tables and 148 columns, identifying migration gaps, sovereignty domains, and field-level controls.
  - [**Role & Permission Matrix v2**](docs/ROLE_PERMISSION_MATRIX_V2.md): Fine-grained capability matrix for 8 roles across 8 operational gates and 4 data sovereignty domains.
  - [**Workflow Governance Dictionary**](docs/WORKFLOW_GOVERNANCE_DICTIONARY.md): Step-by-step governance specifications for 10 critical system workflows.
  - [**Data Sensitivity Classification Architecture**](docs/DATA_SENSITIVITY_CLASSIFICATION.md): 4-tier sensitivity classification standard (Standard, Sensitive, Restricted, Protected) with field-level controls.
  - [**Phase 13A Implementation Design Package**](docs/PHASE_13A_IMPLEMENTATION_DESIGN.md): **Implementation Readiness Lock** establishing Master Traceability Matrix, Schema Migration 7, 43-Endpoint Authorization Middleware, Export Filtering, High-Conflict Mode, and Security Test Plan.
  - [**Phase 13B Execution Control Plan**](docs/PHASE_13B_EXECUTION_CONTROL_PLAN.md): **Implementation Execution Control** establishing chronological 8-step order, Migration 7 runbook, 43-endpoint authorization matrix, and Go/No-Go gate.
  - [**Phase 13B Implementation Validation Report**](docs/PHASE_13B_IMPLEMENTATION_VALIDATION_REPORT.md): **Implementation Validation Review** covering code impact analysis, contradiction resolution, UX walkthroughs, implementation risk ranking, and 12-task backlog.
  - [**Owner Workflow Usability Validation Report**](docs/OWNER_WORKFLOW_VALIDATION_REPORT.md): **Usability & Ergonomics Review** simulating Foster, Kinship, Respite, and Parent workflows to eliminate clicks, friction, and cognitive overload.
  - [**Child Voice Domain Discovery**](docs/CHILD_VOICE_DOMAIN_DISCOVERY.md): Exploratory architectural analysis for a future 5th domain (deferred to Phase 17+).
- [**Master Governance, Safety & Security Framework**](docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md): **Engineering & Governance Specification (v3.1)** establishing precise legal disclaimers, tamper-evident record keeping, 5-state retention lifecycles, unlinked parent registration, 10-state access lifecycle, and the 5-gate sharing hierarchy.
- [**Child & Family Success Operating System Architecture**](docs/CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md): **The Foundational Strategic Constitution** establishing non-negotiable principles, DCF output integration, homepage attention philosophy, 4 data sovereignty domains, 4-tier note classifications, and the 8-role permission matrix.
- [**Parent Participant Workspace Specification**](docs/PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md): Dedicated specification for dignity-first parent goal tracking, evidence portfolios, and the anti-conflict Structured Family Engagement Feed.
- [**Sprout Canonical System State & Audit Registry**](docs/SPROUT_SYSTEM_STATE.md): **The authoritative single source of truth** covering all 36 API endpoints, 12 primary view renderers, 10 modal dialogs, 6 SQLite tables, dual-sphere isolation matrix, and readiness scores.
- [Sprout Foundation & North Star Constitution](docs/SPRINGBOARD_FOUNDATION.md): Governing specifications, 8 Non-Negotiable Tenets, Product Boundaries, and the 8-Point Decision Gate (Phase 6).
- [Master Project Management Board](docs/PROJECT_MANAGEMENT_BOARD.md): Formal sign-off record, phase completion tracker, and sprint backlogs across all 16 Phases.
- [Mission Control & System Understanding Layer](docs/MISSION_CONTROL_ARCHITECTURE.md): Root cockpit layout, 4 operational quadrants, and self-guiding interaction model (Phase 12A).
- [Relationship Center & Circles of Care](docs/RELATIONSHIP_CENTER_ARCHITECTURE.md): 4 concentric stakeholder circles, role directory, and privacy boundary controls (Phase 10).
- [Life Journey & Milestone Architecture](docs/LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md): Child-centered keepsake preservation, strengths-based metrics, and trauma-informed language (Phase 11).
- [Vermont DCF Excellence & Operations Architecture](docs/VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md): Statewide gap analysis, Title 33 CHINS timeline engine, State Form FS-334B claims, and 12-District Directory (Phase 9).
- [Technical Summary & System Map (v2)](docs/TECHNICAL_SUMMARY_SYSTEM_MAP.md): Production architectural reference covering all 18 technical sections.

### Training & Instructor Packages
- [Training Transcript & Instructor Guide](docs/TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md): Master script and instructional guide for walkthroughs, VCWTP demonstrations, and caregiver onboarding.
- [Video Recording Script](docs/VIDEO_RECORDING_SCRIPT.md): Minute-by-minute 14-minute platform walkthrough script with exact click cues.
- [Caregiver Scenario Library](docs/CAREGIVER_SCENARIO_LIBRARY.md): 9 simulated foster and kinship scenarios (emergency intake, missed visit, court prep, IEP conference).
- [Live Demo Runbook](docs/LIVE_DEMO_RUNBOOK.md): Trainer checklist, pause points, and audience demonstration instructions.
- [Frequently Asked Questions (FAQ)](docs/FAQ_AND_COMMON_QUESTIONS.md): Clear answers to common foster care, kinship, legal, and privacy questions.

### Audits & Validation Reports
- [Sprint 13C Usability Execution Report](docs/SPRINT_13C_USABILITY_EXECUTION_REPORT.md): Implementation and multi-persona validation of P0-1 Quick Action Dock, P0-2 Two-Step Smart Logger, and P0-3 Dedicated Parent Participant Workspace (Sprint 13C).
- [Owner Workflow Validation Report](docs/OWNER_WORKFLOW_VALIDATION_REPORT.md): End-to-end task simulation for Foster, Kinship, Respite, and Parent personas identifying friction points and P0/P1 ergonomics recommendations.
- [Phase 13B Implementation Validation Report](docs/PHASE_13B_IMPLEMENTATION_VALIDATION_REPORT.md): Code impact analysis, contradiction resolution, UX walkthroughs, and 12-task execution plan.
- [Privacy Hardening Audit Report](docs/PRIVACY_HARDENING_REPORT.md): Enforcement of the Child Reference ID standard, 1-tap Privacy Shield / Blur Mode, metadata scrubbing, and export sanitization (Phase 7).
- [Caregiver Flight Simulator & Sandbox Excellence Report](docs/QA_PHASE8_SANDBOX_EXCELLENCE.md): Complete documentation for interactive first-run onboarding, role-based personas, scenario simulations, and synthetic document vault (Phase 8).
- [Real-World Readiness Validation Report](docs/REAL_WORLD_READINESS_VALIDATION.md): End-to-end stress testing across 11 emergency scenarios, accessibility benchmarks, and deployment matrices (Phase 12B).
- [Final Release Scorecard](docs/FINAL_RELEASE_SCORECARD.md): Comprehensive platform audit rating Sprout at 96.3 / 100 Production Ready.
- [System Navigation & Interaction Audit](docs/SYSTEM_NAVIGATION_AND_INTERACTION_AUDIT.md): Complete site map, screen inventory, decision trees, and interaction model.

---

## 🔒 Security & Privacy Notice

- **No Cloud Transmission**: Sprout runs entirely on your local machine.
- **Data Isolation**: Synthetic sample records and real working records are strictly partitioned. Private documents, court orders, and personal medical data are never tracked in Git.

---

## 📜 License

MIT License. Designed with care for Vermont's foster and kinship families.
