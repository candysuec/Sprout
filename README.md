# Sprout — Vermont Foster & Kinship Caregiver Operating System

> **A 100% Local, Offline-First Caregiver Command Center & Caregiver Journey Model**

Sprout is a dedicated digital binder and documentation management platform designed specifically for foster parents, kinship caregivers, respite providers, and fictive kin navigating the Vermont Department for Children and Families (DCF) child welfare system.

---

## 🌟 Key Capabilities

- **Strict Zero-Leakage Architecture**: Seamless dual-sphere operation between a complete **Developer Sandbox** (preloaded with synthetic data) and a **Local Live Data** workspace with 100% offline local SQLite storage.
- **Caregiver Journey Model**: Multi-dimensional modeling of caregiver households across 8 lifecycle stages, 8 household structures, and 9 approved caregiving pathways.
- **15-Second Fast Logging**: High-speed journal, pediatric medical visit, school IEP conference, and family time visitation logging with automatic notification drafting for DCF Family Services Workers and Guardians ad Litem (GAL).
- **Vermont Compliance (FS-221A)**: Built-in milestone tracker for provisional home studies, annual fire safety drills, smoke/CO detector inspections, and 90-day fingerprint deadlines.
- **VCWTP Training & Mileage Tracking**: Real-time logging of Vermont Child Welfare Training Partnership hours and DCF travel reimbursement monitoring at the official standard rate.

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

Production specifications, system topologies, privacy audits, training flight simulators, and project governance boards are maintained in the [`docs/`](docs/) directory:

- [Sprout Foundation & North Star Constitution](docs/SPRINGBOARD_FOUNDATION.md): Governing specifications, 8 Non-Negotiable Tenets, Product Boundaries, and the 8-Point Decision Gate (Phase 6).
- [Privacy Hardening Audit Report](docs/PRIVACY_HARDENING_REPORT.md): Enforcement of the Child Reference ID standard, 1-tap Privacy Shield / Blur Mode, metadata scrubbing, and export sanitization (Phase 7).
- [Caregiver Flight Simulator & Sandbox Excellence Report](docs/QA_PHASE8_SANDBOX_EXCELLENCE.md): Complete documentation for interactive first-run onboarding, role-based personas, scenario flight simulations, and synthetic document vault (Phase 8).
- [Vermont DCF Excellence & Operations Architecture](docs/VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md): Statewide gap analysis, Title 33 CHINS timeline engine, State Form FS-334B reimbursement claims, and 12-District Office Directory (Phase 9).
- [Master Project Management Board](docs/PROJECT_MANAGEMENT_BOARD.md): Formal sign-off record, phase completion tracker, and sprint backlogs.
- [Sandbox & Sample Data Validation Audit](docs/QA_SANDBOX_VALIDATION_AUDIT.md): Comprehensive validation of environment isolation (`Welcome ≠ Sandbox ≠ Local`) and 15-household relational dataset.
- [Technical Summary & System Map (v2)](docs/TECHNICAL_SUMMARY_SYSTEM_MAP.md): Production architectural reference covering all 18 technical sections.
- [UX Enhancement & Caregiver Usability Audit](docs/UX_ENHANCEMENT_AUDIT.md): Comprehensive evaluation of daily friction, cognitive load, and orientation metrics.
- [UI Process Flow Blueprint](docs/UI_PROCESS_FLOW_BLUEPRINT.md): Finite state machine mapping every button and modal to deterministic flows.

---

## 🔒 Security & Privacy Notice

- **No Cloud Transmission**: Sprout runs entirely on your local machine.
- **Data Isolation**: Synthetic sample records and real working records are strictly partitioned. Private documents, court orders, and personal medical data are never tracked in Git.

---

## 📜 License

MIT License. Designed with care for Vermont's foster and kinship families.
