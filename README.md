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

Production specifications, system topologies, privacy audits, training flight simulators, and instructor guides are maintained in the [`docs/`](docs/) directory:

### Core Governance & System Architecture
- [Sprout Foundation & North Star Constitution](docs/SPRINGBOARD_FOUNDATION.md): Governing specifications, 8 Non-Negotiable Tenets, Product Boundaries, and the 8-Point Decision Gate (Phase 6).
- [Master Project Management Board](docs/PROJECT_MANAGEMENT_BOARD.md): Formal sign-off record, phase completion tracker, and sprint backlogs across all 12 Phases.
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
