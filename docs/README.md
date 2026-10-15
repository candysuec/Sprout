# Sprout — Child & Family Success Operating System
**Master Documentation Catalog & Operating Architecture**

**Initiative:** Sprout  
**Project:** Child & Family Success Operating System  
**Current Milestone:** Sprout v3.2 Foundation Baseline  
**Governing Standard:** [`REPOSITORY_MAP.md`](REPOSITORY_MAP.md)  
**Test Suite Verification:** 73 / 73 Tests Passing (100% CI Baseline)  
**Repository:** [github.com/candysuec/Sprout](https://github.com/candysuec/Sprout.git)

---

## 🧭 Project North Star

> **Sprout is a Child & Family Success Operating System.**
>
> It exists to:
> - **Protect children.**
> - **Reduce caregiver burden.**
> - **Support family engagement.**
> - **Support reunification when appropriate.**
> - **Make the next step obvious.**
>
> It is **NOT** a DCF case management system, state database, court tracking portal, or electronic binder.

---

## 🏛️ The New Organizational Hierarchy

Sprout documentation follows a functional hierarchy:

```
INITIATIVE (Sprout)
   ↓
PROJECT (Child & Family Success Operating System)
   ↓
WORK (Execution Plans, Development Sprints & Active Backlogs)
   ↓
EVIDENCE (Validation Reports, Audit Certifications, Test Results)
```

Documents are **evidence**.  
Projects are **work**.  
Initiatives provide **orientation**.

---

## 🚀 Immediate Founder Cockpit (Start Here)

Before searching through documentation or code, consult these operational visibility dashboards:

1. **[`FOUNDER_ORIENTATION_DASHBOARD.md`](FOUNDER_ORIENTATION_DASHBOARD.md)**: **The Primary Cockpit.** Answers: *Where am I? What matters? What is active? What is blocked? What is next? What can I ignore?*
2. **[`PROJECT_STATE.md`](PROJECT_STATE.md)**: **Active Project Truth.** Single source of truth for work status, complete items, active workstreams, and gated dependencies.
3. **[`REPOSITORY_MAP.md`](REPOSITORY_MAP.md)**: **Cognitive Filter.** Complete 4-category classification of every document into *What Matters*, *Active Work*, *Reference Only*, and *Ignore/Archived*.
4. **[`SYSTEM_HEALTH_SPEC.md`](SYSTEM_HEALTH_SPEC.md)**: **Zero-Investigation Pulse.** Specifications for real-time telemetry across population, overdue items, parent access, and test suite health.

---

## 1. Canonical Governance & Architecture (What Matters)

*These documents represent approved system truth. They govern all features, permissions, and data structures.*

| Document | Purpose & Scope | Status |
| :--- | :--- | :---: |
| **[`CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md)** | **Foundational Strategic Constitution**: Defines what Sprout is/is not, DCF output principle, homepage attention principle, 4 data ownership domains, 4-tier note classifications, and the 8-role permission matrix. | **CORE CONSTITUTION** |
| **[`GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)** | **Master Governance, Safety & Security Framework**: Legal disclaimers, tamper-evident standards, 5-state retention lifecycle, unlinked parent onboarding, 10-state access lifecycle, and 5-gate sharing hierarchy. | **SAFETY HARDENED** |
| **[`SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md`](SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md)** | **Master SQLite Data Governance Dictionary**: Field-by-field domain ownership, allowed classifications, 8-role CRUD permissions, and output scope across all 11 SQLite tables. | **CANONICAL DICTIONARY** |
| **[`ROLE_PERMISSION_MATRIX_V2.md`](ROLE_PERMISSION_MATRIX_V2.md)** | **Role Permissions v2.0**: Read, write, export, archive, share, approve, invite, and revoke matrix across all 8 roles. | **LOCKED ACCESS** |
| **[`DATA_SENSITIVITY_CLASSIFICATION.md`](DATA_SENSITIVITY_CLASSIFICATION.md)** | **Data Sensitivity Tiers**: Standard, Sensitive, Restricted, and Protected data architectures; High-Conflict masking rules. | **LOCKED PRIVACY** |
| **[`PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md`](PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md)** | **Parent Workspace Specification**: Dignity-first parent portal, goal tracking, evidence locker, and Structured Family Engagement Feed. | **APPROVED SPEC** |

---

## 2. Active Implementation & Testing Packages (Active Work)

*These documents guide ongoing Phase 13A/13B engineering execution and multi-party test harnesses.*

| Document | Focus Area | Role in Execution |
| :--- | :--- | :--- |
| **[`PHASE_13B_EXECUTION_CONTROL_PLAN.md`](PHASE_13B_EXECUTION_CONTROL_PLAN.md)** | **Phase 13B Execution Control Plan**: Chronological 8-step execution order, Migration 7 runbook, 43-endpoint authorization matrix, and readiness gate. | Implementation Plan |
| **[`PHASE_13A_IMPLEMENTATION_DESIGN.md`](PHASE_13A_IMPLEMENTATION_DESIGN.md)** | **Implementation Readiness Design Package**: Master Traceability Matrix, Schema Migration 7, 43-Endpoint Middleware, Export Filters, High-Conflict Mode, and Test Plan. | Architecture Traceability |
| **[`API_GOVERNANCE_MATRIX.md`](API_GOVERNANCE_MATRIX.md)** | **Complete API Governance**: Scoping, ownership, classification filters, and output eligibility across all 43 local endpoints. | Gateway Specification |
| **[`EXPORT_GOVERNANCE_MATRIX.md`](EXPORT_GOVERNANCE_MATRIX.md)** | **Export & Output Governance**: Pre-release preview, classification gating, redaction, watermarking, and sign-off pipeline across all 9 generators. | Output Redaction Rules |
| **[`SAMPLE_CHILD_COMMUNITY.md`](SAMPLE_CHILD_COMMUNITY.md)** | **Sample Child Community Package**: 5 multi-party child ecosystems (caregiver, parent, respite, GAL, DCF worker) for system-wide testing. | Ecosystem Test Fixtures |
| **[`PARENT_PARTICIPANT_SCENARIOS.md`](PARENT_PARTICIPANT_SCENARIOS.md)** | **Parent Participant Scenarios**: Standardized profiles for New Case, Active, Restricted, Near Reunification, and Reunified parents. | Lifecycle Test Fixtures |
| **[`PEOPLE_AND_RELATIONSHIP_MODEL.md`](PEOPLE_AND_RELATIONSHIP_MODEL.md)** | **People & Relationship Model Discovery**: Future-state insight on unified human identities connected via roles and permissions. | Concept Reference |

---

## 3. Stable Technical & Training References (Reference Only)

*Consult these completed documents when looking up a specific operational, legal, or curriculum detail.*

| Document | Operational Area | Content Description |
| :--- | :--- | :--- |
| **[`MISSION_CONTROL_ARCHITECTURE.md`](MISSION_CONTROL_ARCHITECTURE.md)** | Root Cockpit & Understanding Layer | 4 operational quadrants (TRAIN, CARE, DCF, SYSTEM), hidden toolbar rule, 7 persona pathways. |
| **[`TECHNICAL_SUMMARY_SYSTEM_MAP.md`](TECHNICAL_SUMMARY_SYSTEM_MAP.md)** | Full System Technical Reference | Complete 18-part technical architecture: Bottle server, SQLite schemas, REST API, SHA-256 blockchain audit. |
| **[`RELATIONSHIP_CENTER_ARCHITECTURE.md`](RELATIONSHIP_CENTER_ARCHITECTURE.md)** | Circles of Care & Multi-Party Comms | 4 concentric support tiers (DCF, Legal/GAL, School/Medical, Extended Village), comm logs, role permissions. |
| **[`LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md`](LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md)** | Child-Centered Keepsake & Milestones | Strengths-based memory keeper, trauma-informed milestone tracking, transition handoff packager. |
| **[`VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md`](VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md)** | Vermont Statutory & DCF Alignment | Title 33 CHINS juvenile court stepper, FS-221A agreement checklist, FS-334B mileage generator, 12-district directory. |
| **[`TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md`](TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md)** | VCWTP & Caregiver Onboarding | Scripted walkthrough, pause prompts, pedagogical objectives. |
| **[`CAREGIVER_SCENARIO_LIBRARY.md`](CAREGIVER_SCENARIO_LIBRARY.md)** | 9 Simulated Caregiver Scenarios | Emergency intake, missed visit, med refill, IEP dispute, court day. |
| **[`LIVE_DEMO_RUNBOOK.md`](LIVE_DEMO_RUNBOOK.md)** | Live Presentation Guide | Presenter prep, timeboxing, audience Q&A cues, reset steps. |
| **[`VIDEO_RECORDING_SCRIPT.md`](VIDEO_RECORDING_SCRIPT.md)** | 14-Minute Platform Walkthrough | Minute-by-minute visual walkthrough script with exact click cues. |
| **[`FAQ_AND_COMMON_QUESTIONS.md`](FAQ_AND_COMMON_QUESTIONS.md)** | Caregiver FAQ | Plain-English answers to foster care, legal, and privacy questions. |

---

## 4. Completed Work Evidence & Historical Archives (Safe to Ignore)

*These documents represent completed milestones and historical validation. They are cataloged in [`REPOSITORY_MAP.md`](REPOSITORY_MAP.md) and can be safely ignored during active engineering.*

- [`SPRINT_13C_USABILITY_EXECUTION_REPORT.md`](SPRINT_13C_USABILITY_EXECUTION_REPORT.md) (Sprint 13C P0 execution evidence)
- [`OWNER_WORKFLOW_VALIDATION_REPORT.md`](OWNER_WORKFLOW_VALIDATION_REPORT.md) (Pre-Sprint 13C usability findings)
- [`PHASE_13B_IMPLEMENTATION_VALIDATION_REPORT.md`](PHASE_13B_IMPLEMENTATION_VALIDATION_REPORT.md) (Code impact analysis)
- [`DATABASE_GOVERNANCE_GAP_REPORT.md`](DATABASE_GOVERNANCE_GAP_REPORT.md) (Pre-Phase 13 schema gap analysis)
- All Phase 1–12 audit scorecards, sandbox validation logs, and navigation efficiency reviews.
