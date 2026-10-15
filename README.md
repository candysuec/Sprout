# Sprout — Vermont Foster & Kinship Caregiver Operating System

> **A 100% Local, Offline-First Caregiver Command Center & Caregiver Journey Model**

Sprout is a dedicated digital binder and documentation management platform designed specifically for foster parents, kinship caregivers, respite providers, and fictive kin navigating the Vermont Department for Children and Families (DCF) child welfare system.

---

## 🌟 Key Capabilities

- **Strict Zero-Leakage Architecture**: Seamless dual-sphere operation between a complete **Practice Sandbox** (preloaded with 15 synthetic household models) and a **Real Family Workspace** with 100% offline local SQLite storage.
- **Mission Control Launchpad**: Clean root landing cockpit with 4 operational quadrants (**TRAIN**, **CARE**, **DCF**, **SYSTEM**) and 7 guided caregiver pathways.
- **Caregiver Journey Model**: Multi-dimensional modeling of caregiver households across 8 lifecycle stages, 8 household structures, and 9 approved caregiving pathways.
- **Circles of Care & Relationship Center**: 4 concentric support tiers (Core DCF Team, Legal & Advocacy, Health & School, Extended Village/Mentors) with communication logs and zero-leakage privacy boundary controls.
- **Life Journey & Milestone Center**: Trauma-informed child keepsake and achievement catalog preserving positive childhood milestones, artwork, reading progress, and portable care transition packets.
- **15-Second Fast Logging**: High-speed journal, pediatric medical visit, school IEP conference, and family time visitation logging with automatic notification drafting for DCF Family Services Workers and Guardians ad Litem (GAL).
- **Vermont Compliance (FS-221A & CHINS Stepper)**: Built-in milestone tracker for provisional home studies, annual safety drills, 90-day fingerprint deadlines, and Title 33 CHINS court hearing milestones.
- **VCWTP Training & Mileage Tracking**: Real-time logging of Vermont Child Welfare Training Partnership hours and automated State Form FS-334B travel reimbursement generation at the official standard rate ($0.67/mi).

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

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Modern Web Browser (Chrome, Edge, Firefox, Safari)

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/candysuec/Sprout.git
   cd Sprout/app
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the local server:**
   ```bash
   python server.py
   ```

4. **Access Sprout:**
   Open your browser to `http://127.0.0.1:5858`

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
