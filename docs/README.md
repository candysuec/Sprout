# Sprout / KinCare OS — Master Documentation Catalog & Knowledge Directory

**Current Version:** 2.0.0 (Post-Phase 12 Real-World Readiness Baseline)  
**Governing Baseline:** [`docs/SPROUT_SYSTEM_STATE.md`](SPROUT_SYSTEM_STATE.md) & [`docs/SPRINGBOARD_FOUNDATION.md`](SPRINGBOARD_FOUNDATION.md)  
**Test Suite Verification:** 73 / 73 Tests Passing (100% CI Baseline)  
**Repository:** [github.com/candysuec/Sprout](https://github.com/candysuec/Sprout.git)

---

## 🧭 Central Knowledge Architecture

All official documentation, architecture specifications, training curricula, legal alignment guides, and audit scorecards for Sprout are organized below by operational domain.

```
foster-portal/docs/
├── CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md <-- Foundational Strategic Constitution (What Sprout Is & Is Not)
├── SPROUT_SYSTEM_STATE.md            <-- Canonical System State & Feature Registry (Single Source of Truth)
├── SPRINGBOARD_FOUNDATION.md         <-- North Star Constitution & Non-Negotiable Tenets
├── PROJECT_MANAGEMENT_BOARD.md       <-- Phase Execution & Sign-Off Governance
│
├── 👨‍👩‍👧 Family Success & Parent Participation
│   ├── CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md
│   └── PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md
│
├── 🏗️ Architecture & Operations
│   ├── MISSION_CONTROL_ARCHITECTURE.md
│   ├── TECHNICAL_SUMMARY_SYSTEM_MAP.md
│   ├── RELATIONSHIP_CENTER_ARCHITECTURE.md
│   ├── LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md
│   └── VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md
│
├── 🎓 Training Hub & Flight Simulator
│   ├── TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md
│   ├── CAREGIVER_SCENARIO_LIBRARY.md
│   ├── LIVE_DEMO_RUNBOOK.md
│   ├── VIDEO_RECORDING_SCRIPT.md
│   ├── TRAINER_PLAYBOOK.md
│   └── FAQ_AND_COMMON_QUESTIONS.md
│
├── 🛡️ Privacy, Security & Usability Audits
│   ├── PRIVACY_HARDENING_REPORT.md
│   ├── QA_PHASE8_SANDBOX_EXCELLENCE.md
│   ├── QA_SANDBOX_VALIDATION_AUDIT.md
│   ├── REAL_WORLD_READINESS_VALIDATION.md
│   ├── FINAL_RELEASE_SCORECARD.md
│   ├── SYSTEM_NAVIGATION_AND_INTERACTION_AUDIT.md
│   └── UX_AUDIT_REPORT.md
│
└── 📋 Workflows & Decision Frameworks
    ├── PROCESS_FLOW_LIBRARY.md
    ├── DECISION_TREE_LIBRARY.md
    ├── USER_JOURNEY_GUIDE.md
    ├── NEW_USER_QUICKSTART.md
    └── OWNER_WALKTHROUGH_VALIDATION.md
```

---

## 1. Authoritative System State & Strategic Governance

| Document | Purpose | Audience | Status |
| :--- | :--- | :--- | :---: |
| **[`GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)** | **Master Governance, Safety & Security Framework**: Legal disclaimers, tamper-evident standards, 5-state retention lifecycle, unlinked parent onboarding, 10-state access lifecycle, and 5-gate sharing hierarchy. | Legal, Security, Architects | **SAFETY HARDENED** |
| **[`SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md`](SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md)** | **Master SQLite Data Governance Dictionary**: Field-by-field domain ownership, allowed classifications, 8-role CRUD permissions, and output scope across all 11 SQLite tables. | Database, Security, QA | **CANONICAL DICTIONARY** |
| **[`CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md)** | **Foundational Strategic Constitution**: Defines what Sprout is/is not, DCF output principle, homepage attention principle, 4 data ownership domains, 4-tier note classifications, high-conflict mode, and 8-role permission matrix. | All Stakeholders, Founders | **CORE CONSTITUTION** |
| **[`PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md`](PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md)** | **Parent Workspace Specification**: Dignity-first parent portal, goal tracking, evidence locker, and Structured Family Engagement Feed. | Product, UX, Engineers | **STRATEGIC SPEC** |
| **[`SPROUT_SYSTEM_STATE.md`](SPROUT_SYSTEM_STATE.md)** | **Canonical System State & Audit Registry**: 36 API endpoints, 12 primary views, 10 modals, 6 SQLite tables, dual-sphere isolation matrix, and readiness scores. | Developers, Auditors, Founders | **CANONICAL BASELINE** |
| **[`SPRINGBOARD_FOUNDATION.md`](SPRINGBOARD_FOUNDATION.md)** | **North Star Constitution**: The 8 non-negotiable tenets, product scope boundaries, 8-point architectural decision gate, and trauma-informed design principles. | Leadership, Engineers | **PERMANENT STANDARD** |
| **[`PROJECT_MANAGEMENT_BOARD.md`](PROJECT_MANAGEMENT_BOARD.md)** | **Execution & Phase Tracker**: Milestone sign-offs, phase execution log (Phases 1–16), stakeholder register, and roadmap status. | Project Managers, QA | **ACTIVE** |

---

## 2. Phase 13A Pre-Implementation Governance Specifications

| Document | Focus Area | Governance Scope | Status |
| :--- | :--- | :--- | :---: |
| **[`API_GOVERNANCE_MATRIX.md`](API_GOVERNANCE_MATRIX.md)** | **Complete API Governance**: Scoping, ownership, classification filters, and output eligibility across all 43 local endpoints. | API, Security, Gateway | **VERIFIED** |
| **[`EXPORT_GOVERNANCE_MATRIX.md`](EXPORT_GOVERNANCE_MATRIX.md)** | **Export & Output Governance**: Pre-release preview, classification gating, redaction, watermarking, and sign-off pipeline across all 9 generators. | Export, Compliance, Legal | **VERIFIED** |
| **[`DATABASE_GOVERNANCE_GAP_REPORT.md`](DATABASE_GOVERNANCE_GAP_REPORT.md)** | **Database Gap Analysis**: Cross-reference of 11 tables and 148 fields against v3.1 data dictionary; Phase 13A prerequisites. | DB Schema, Migrations | **ACTIONABLE** |
| **[`ROLE_PERMISSION_MATRIX_V2.md`](ROLE_PERMISSION_MATRIX_V2.md)** | **Role Permissions v2.0**: Read, write, export, archive, share, approve, invite, and revoke matrix across all 8 roles. | Access Control, Security | **VERIFIED** |
| **[`WORKFLOW_GOVERNANCE_DICTIONARY.md`](WORKFLOW_GOVERNANCE_DICTIONARY.md)** | **Workflow Governance**: 10 critical operational workflows, checkpoints, classification rules, human approval gates, and audit trails. | Business Logic, Workflows | **VERIFIED** |
| **[`DATA_SENSITIVITY_CLASSIFICATION.md`](DATA_SENSITIVITY_CLASSIFICATION.md)** | **Data Sensitivity Tiers**: Standard, Sensitive, Restricted, and Protected data architectures; High-Conflict masking rules. | Privacy, Data Protection | **VERIFIED** |
| **[`PHASE_13A_IMPLEMENTATION_DESIGN.md`](PHASE_13A_IMPLEMENTATION_DESIGN.md)** | **Implementation Readiness Design Package**: Master Traceability Matrix, Schema Migration 7, 43-Endpoint Middleware, Export Filters, High-Conflict Mode, and Test Plan. | Architecture Lock, Implementation Plan | **LOCKED & READY** |
| **[`PHASE_13B_EXECUTION_CONTROL_PLAN.md`](PHASE_13B_EXECUTION_CONTROL_PLAN.md)** | **Phase 13B Execution Control Plan**: Chronological 8-step execution order, Migration 7 runbook, 43-endpoint authorization matrix, and readiness gate. | Execution Control, Safe Implementation | **APPROVED & GO** |
| **[`CHILD_VOICE_DOMAIN_DISCOVERY.md`](CHILD_VOICE_DOMAIN_DISCOVERY.md)** | **Child Voice Discovery (Future Only)**: Strategic exploration of youth-authored goals, reflections, and Lifebook curation (Deferred to Phase 17+). | Future Horizons, Ethics | **EXPLORATORY** |

---

## 3. Core Architecture Specifications

| Document | Focus Area | Key Features Covered |
| :--- | :--- | :--- |
| **[`MISSION_CONTROL_ARCHITECTURE.md`](MISSION_CONTROL_ARCHITECTURE.md)** | Root Cockpit & Understanding Layer | 4 operational quadrants (TRAIN, CARE, DCF, SYSTEM), hidden toolbar rule, 7 persona pathways. |
| **[`TECHNICAL_SUMMARY_SYSTEM_MAP.md`](TECHNICAL_SUMMARY_SYSTEM_MAP.md)** | Full System Technical Reference | Complete 18-part technical architecture: Bottle server, SQLite schemas, REST API, SHA-256 blockchain audit. |
| **[`RELATIONSHIP_CENTER_ARCHITECTURE.md`](RELATIONSHIP_CENTER_ARCHITECTURE.md)** | Circles of Care & Multi-Party Comms | 4 concentric support tiers (DCF, Legal/GAL, School/Medical, Extended Village), comm logs, role permissions. |
| **[`LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md`](LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md)** | Child-Centered Keepsake & Milestones | Strengths-based memory keeper, trauma-informed milestone tracking, transition handoff packager. |
| **[`VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md`](VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md)** | Vermont Statutory & DCF Alignment | Title 33 CHINS juvenile court stepper, FS-221A agreement checklist, FS-334B mileage generator, 12-district directory. |

---

## 4. Training Hub, Flight Simulator & Video Guides

| Document | Focus Area | Format / Delivery |
| :--- | :--- | :--- |
| **[`TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md`](TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md)** | VCWTP & Caregiver Onboarding | Scripted walkthrough, pause prompts, pedagogical objectives. |
| **[`VIDEO_RECORDING_SCRIPT.md`](VIDEO_RECORDING_SCRIPT.md)** | 14-Minute Platform Walkthrough | Minute-by-minute visual walkthrough script with exact click cues. |
| **[`CAREGIVER_SCENARIO_LIBRARY.md`](CAREGIVER_SCENARIO_LIBRARY.md)** | 9 Simulated Caregiver Scenarios | Emergency intake, missed visit, med refill, IEP dispute, court day. |
| **[`LIVE_DEMO_RUNBOOK.md`](LIVE_DEMO_RUNBOOK.md)** | Live Presentation Guide | Presenter prep, timeboxing, audience Q&A cues, reset steps. |
| **[`TRAINER_PLAYBOOK.md`](TRAINER_PLAYBOOK.md)** | Facilitator Strategy | Coaching foster parents, kinship guardians, and caseworkers. |
| **[`FAQ_AND_COMMON_QUESTIONS.md`](FAQ_AND_COMMON_QUESTIONS.md)** | Frequently Asked Questions | Answers covering privacy, offline access, court filings, and mileage. |

---

## 5. Privacy, Security & Usability Audits

| Document | Scope | Audit Result |
| :--- | :--- | :---: |
| **[`PRIVACY_HARDENING_REPORT.md`](PRIVACY_HARDENING_REPORT.md)** | PII shielding, Child Ref IDs, metadata scrubbing, sandbox isolation. | **100 / 100** Zero-Leakage |
| **[`QA_PHASE8_SANDBOX_EXCELLENCE.md`](QA_PHASE8_SANDBOX_EXCELLENCE.md)** | 15 synthetic households, zero live DB query guard, template vault. | **100% Pass** |
| **[`REAL_WORLD_READINESS_VALIDATION.md`](REAL_WORLD_READINESS_VALIDATION.md)** | 11 emergency workflows, low-light testing, battery-saver checks. | **97.3 / 100** Production Ready |
| **[`FINAL_RELEASE_SCORECARD.md`](FINAL_RELEASE_SCORECARD.md)** | Platform evaluation across Caregiver, DCF, Legal, and Tech pillars. | **96.3 / 100** Certified |
| **[`SYSTEM_NAVIGATION_AND_INTERACTION_AUDIT.md`](SYSTEM_NAVIGATION_AND_INTERACTION_AUDIT.md)** | Click map, dead link audit, modal triggers, back navigation flows. | **Zero Dead Links** |

---

## 6. Workflows, Blueprints & Quickstarts

- **[`NEW_USER_QUICKSTART.md`](NEW_USER_QUICKSTART.md)**: 3-step startup guide for first-time caregivers.
- **[`USER_JOURNEY_GUIDE.md`](USER_JOURNEY_GUIDE.md)**: Role-specific journey maps (foster parent, kinship aunt, respite host).
- **[`PROCESS_FLOW_LIBRARY.md`](PROCESS_FLOW_LIBRARY.md)**: Visual sequence diagrams of common daily tasks.
- **[`DECISION_TREE_LIBRARY.md`](DECISION_TREE_LIBRARY.md)**: Flowcharts for medical incidents, court dates, and licensing drills.
- **[`OWNER_WALKTHROUGH_VALIDATION.md`](OWNER_WALKTHROUGH_VALIDATION.md)**: Comprehensive verification guide for platform sponsors.

---

## 🔄 Documentation Maintenance & Update Protocol

To ensure system documentation remains completely synchronized with the codebase:

1. **Rule of Single Truth:** When adding or modifying routes, views, database tables, or modal dialogs, update [`SPROUT_SYSTEM_STATE.md`](SPROUT_SYSTEM_STATE.md) first.
2. **Automated Verification:** Run `python test_e2e_flows.py` to confirm all automated assertions pass before updating documentation versions.
3. **Dual-Sphere Preservation:** Always verify that sample/sandbox documentation clearly distinguishes between synthetic fixtures (`sample_dataset.py`) and live local SQLite records (`%LOCALAPPDATA%`).
4. **Zero-PII Commitment:** Never commit real names, real addresses, or un-scrubbed documents to Git. All documentation must use synthetic examples or sanitized public addresses.
