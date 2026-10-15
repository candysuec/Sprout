# REPOSITORY MAP & DOCUMENT CLASSIFICATION DIRECTORY
**Initiative:** Sprout  
**Project:** Child & Family Success Operating System  
**Purpose:** Instant Orientation & Cognitive Filter for Founder & Engineers  
**Target Version:** Sprout v3.2 Foundation Baseline (Freeze Active & Sandbox Review Ready)  

---

## 1. Document Hierarchy & Knowledge Tiers

In Sprout, documents are organized by functional role, not chronology:

```
INITIATIVE (Sprout)
   ↓
PROJECT (Child & Family Success Operating System)
   ↓
WORK (Execution Plans & Active Backlogs)
   ↓
EVIDENCE (Audit Reports, Test Runs, Validation Logs)
```

To eliminate cognitive fatigue and prevent Candy from acting as a detective, every document in the repository is placed into one of four distinct categories:

1. **🔥 WHAT MATTERS (Canonical Source of Truth & Active Guides):** Read these to understand current system truth.
2. **🛠️ ACTIVE WORK & EXECUTION (Sandbox & Testing Verification):** Reference these during sandbox review and validation.
3. **📚 REFERENCE ONLY (Stable Technical & Training Specifications):** Read only when looking up a specific domain or curriculum detail.
4. **📦 COMPLETED WORK & ARCHIVE CANDIDATES (Historical Evidence):** Safe to completely ignore during daily operations.

---

## 2. Category 1: WHAT MATTERS (Current Canonical Truth)

*These 7 documents govern all architecture, data, security, and permissions. If there is a dispute, these documents win.*

| Document | Title & Location | Why It Matters |
| :--- | :--- | :--- |
| **Foundational Constitution** | [`CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md) | Defines what Sprout is/is not, DCF output principle, 4 sovereignty domains, and core governance. |
| **Founder Dashboard** | [`FOUNDER_ORIENTATION_DASHBOARD.md`](FOUNDER_ORIENTATION_DASHBOARD.md) | Answers: Where am I? What matters? What is active? What is blocked? What is next? What can I ignore? |
| **Project State** | [`PROJECT_STATE.md`](PROJECT_STATE.md) | Auto-maintainable single source of truth for work status, completed items, and active blockers. |
| **Safety Framework** | [`GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md) | 10-state parent lifecycle, tamper-evident audit chains, retention lifecycle, and export gates. |
| **Database Dictionary** | [`SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md`](SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md) | 11 SQLite tables, 148 fields with domain ownership, note classifications, and CRUD permissions. |
| **Role Permissions** | [`ROLE_PERMISSION_MATRIX_V2.md`](ROLE_PERMISSION_MATRIX_V2.md) | Complete 8-role permission matrix across CRUD, export, archive, approve, invite, and share actions. |
| **System Health Spec** | [`SYSTEM_HEALTH_SPEC.md`](SYSTEM_HEALTH_SPEC.md) | Zero-investigation telemetry specification for children, caregivers, parents, tasks, and exports. |

---

## 3. Category 2: ACTIVE WORK & EXECUTION (Sandbox & Validation Fixtures)

*Phase 13B and Migration 7 are 100% COMPLETE. Development freeze is active. Current active activities are Founder Sandbox Walkthrough, Real-World User Observation, and Primary Home Alignment.*

| Document | Title & Location | Execution Role |
| :--- | :--- | :--- |
| **Testing Ecosystem** | [`SAMPLE_CHILD_COMMUNITY.md`](SAMPLE_CHILD_COMMUNITY.md) | 5 multi-party child community fixtures (caregiver, parent, respite, GAL, DCF worker) for testing. |
| **Parent Scenarios** | [`PARENT_PARTICIPANT_SCENARIOS.md`](PARENT_PARTICIPANT_SCENARIOS.md) | 5 benchmark parent lifecycle testing profiles (New Case, Active, Restricted, Near Reunification, Reunified). |
| **API Governance** | [`API_GOVERNANCE_MATRIX.md`](API_GOVERNANCE_MATRIX.md) | Ownership, note classifications, and security filters for all 43 local REST endpoints. |
| **Export Governance** | [`EXPORT_GOVERNANCE_MATRIX.md`](EXPORT_GOVERNANCE_MATRIX.md) | Redaction, classification filtering, and preview requirements for all 9 document generators. |

---

## 4. Category 3: REFERENCE ONLY (Stable Specifications & Curricula)

*These documents are stable, complete, and require no active edits. Consult only when needed for specific domain knowledge.*

| Document | Domain | Purpose |
| :--- | :--- | :--- |
| **[`PEOPLE_AND_RELATIONSHIP_MODEL.md`](PEOPLE_AND_RELATIONSHIP_MODEL.md)** | Conceptual Architecture | Documents future unified "People" entity direction (Phase 16+). |
| **[`PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md`](PARENT_PARTICIPANT_WORKSPACE_SPECIFICATION.md)** | UI Specification | Original design specification for the dignity-first parent workspace. |
| **[`SPROUT_SYSTEM_STATE.md`](SPROUT_SYSTEM_STATE.md)** | Baseline Registry | Inventory of views, modals, tables, and readiness scores. |
| **[`MISSION_CONTROL_ARCHITECTURE.md`](MISSION_CONTROL_ARCHITECTURE.md)** | UI Architecture | Layout of root cockpit and 4 operational quadrants. |
| **[`TECHNICAL_SUMMARY_SYSTEM_MAP.md`](TECHNICAL_SUMMARY_SYSTEM_MAP.md)** | Technical Map | 18-part technical architecture reference. |
| **[`RELATIONSHIP_CENTER_ARCHITECTURE.md`](RELATIONSHIP_CENTER_ARCHITECTURE.md)** | Feature Spec | 4 concentric Circles of Care model. |
| **[`LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md`](LIFE_JOURNEY_MILESTONE_ARCHITECTURE.md)** | Feature Spec | Child Lifebook keepsake and transition packet architecture. |
| **[`VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md`](VERMONT_DCF_EXCELLENCE_ARCHITECTURE.md)** | Legal & Statutory | Title 33 CHINS juvenile court stepper, FS-221A checklist, FS-334B travel form. |
| **[`TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md`](TRAINING_TRANSCRIPT_AND_INSTRUCTOR_GUIDE.md)** | Training Hub | VCWTP instructional transcript and instructor guide. |
| **[`CAREGIVER_SCENARIO_LIBRARY.md`](CAREGIVER_SCENARIO_LIBRARY.md)** | Training Hub | 9 simulated caregiver scenarios for sandbox flight simulator. |
| **[`LIVE_DEMO_RUNBOOK.md`](LIVE_DEMO_RUNBOOK.md)** | Training Hub | Trainer checklist for live workshops. |
| **[`VIDEO_RECORDING_SCRIPT.md`](VIDEO_RECORDING_SCRIPT.md)** | Training Hub | Script for 14-minute platform video tour. |
| **[`FAQ_AND_COMMON_QUESTIONS.md`](FAQ_AND_COMMON_QUESTIONS.md)** | Training Hub | Caregiver support questions and answers. |

---

## 5. Category 4: COMPLETED EVIDENCE & ARCHIVE CANDIDATES (Ignore in Daily Work)

*These documents represent historical milestones, completed sprint reports, and superseded research. They are preserved for audit defense but can be 100% ignored during active feature development.*

| Document | Type | Historical Context |
| :--- | :--- | :--- |
| **[`PHASE_13B_EXECUTION_CONTROL_PLAN.md`](PHASE_13B_EXECUTION_CONTROL_PLAN.md)** | Completed Execution | 8-step execution order for completed Migration 7 and auth middleware. |
| **[`PHASE_13A_IMPLEMENTATION_DESIGN.md`](PHASE_13A_IMPLEMENTATION_DESIGN.md)** | Completed Design | Pre-implementation design and middleware specifications. |
| **[`SPRINT_13C_USABILITY_EXECUTION_REPORT.md`](SPRINT_13C_USABILITY_EXECUTION_REPORT.md)** | Sprint Evidence | Record of P0 dock, smart logger, and parent workspace execution. |
| **[`OWNER_WORKFLOW_VALIDATION_REPORT.md`](OWNER_WORKFLOW_VALIDATION_REPORT.md)** | Audit Evidence | Usability findings across the 4 personas (pre-Sprint 13C). |
| **[`PHASE_13B_IMPLEMENTATION_VALIDATION_REPORT.md`](PHASE_13B_IMPLEMENTATION_VALIDATION_REPORT.md)** | Audit Evidence | Code impact and contradiction analysis. |
| **[`DATABASE_GOVERNANCE_GAP_REPORT.md`](DATABASE_GOVERNANCE_GAP_REPORT.md)** | Gap Evidence | Pre-Phase 13 database field delta analysis. |
| **[`PRIVACY_HARDENING_REPORT.md`](PRIVACY_HARDENING_REPORT.md)** | Historical Audit | Phase 7 privacy blur and child reference ID report. |
| **[`QA_PHASE8_SANDBOX_EXCELLENCE.md`](QA_PHASE8_SANDBOX_EXCELLENCE.md)** | Historical Audit | Phase 8 sandbox verification audit. |
| **[`QA_SANDBOX_VALIDATION_AUDIT.md`](QA_SANDBOX_VALIDATION_AUDIT.md)** | Historical Audit | Early sandbox validation audit. |
| **[`REAL_WORLD_READINESS_VALIDATION.md`](REAL_WORLD_READINESS_VALIDATION.md)** | Historical Audit | Phase 12B stress-testing report. |
| **[`FINAL_RELEASE_SCORECARD.md`](FINAL_RELEASE_SCORECARD.md)** | Historical Audit | Phase 12 scorecard rating Sprout at 96.3/100. |
| **[`SYSTEM_NAVIGATION_AND_INTERACTION_AUDIT.md`](SYSTEM_NAVIGATION_AND_INTERACTION_AUDIT.md)** | Historical Audit | Early screen inventory. |
| **[`USABILITY_AUDIT.md`](USABILITY_AUDIT.md)** | Historical Audit | Superseded early usability report. |
| **[`UX_AUDIT_REPORT.md`](UX_AUDIT_REPORT.md)** | Historical Audit | Superseded early UX audit. |
| **[`UX_ENHANCEMENT_AUDIT.md`](UX_ENHANCEMENT_AUDIT.md)** | Historical Audit | Superseded early UX enhancement audit. |
| **[`UX_ENHANCEMENT_AUDIT_V2.md`](UX_ENHANCEMENT_AUDIT_V2.md)** | Historical Audit | Superseded early UX enhancement audit v2. |
| **[`NAVIGATION_EFFICIENCY_REVIEW.md`](NAVIGATION_EFFICIENCY_REVIEW.md)** | Historical Audit | Superseded click-depth review. |
| **[`WALKTHROUGH_READINESS_CERTIFICATION.md`](WALKTHROUGH_READINESS_CERTIFICATION.md)** | Historical Audit | Superseded walkthrough signoff. |
| **[`DEPLOYMENT_READINESS_REPORT.md`](DEPLOYMENT_READINESS_REPORT.md)** | Historical Audit | Superseded readiness report. |
| **[`PLATFORM_VALIDATION_MATRIX.md`](PLATFORM_VALIDATION_MATRIX.md)** | Historical Audit | Superseded validation matrix. |
| **[`OWNER_ACCEPTANCE_CHECKLIST.md`](OWNER_ACCEPTANCE_CHECKLIST.md)** | Historical Audit | Early phase acceptance checklist. |
| **[`OWNER_WALKTHROUGH_VALIDATION.md`](OWNER_WALKTHROUGH_VALIDATION.md)** | Historical Audit | Early walkthrough validation log. |
| **[`STRATEGIC_ARCHITECTURE_REVIEW.md`](STRATEGIC_ARCHITECTURE_REVIEW.md)** | Historical Audit | Early architecture review. |
| **[`SPRINGBOARD_ENHANCEMENT_PLAN_V2.md`](SPRINGBOARD_ENHANCEMENT_PLAN_V2.md)** | Historical Roadmap | Superseded roadmap. |
| **[`P1_CAREGIVER_COPILOT_ROADMAP.md`](P1_CAREGIVER_COPILOT_ROADMAP.md)** | Historical Roadmap | Superseded copilot roadmap. |
| **[`CAREGIVER_WORKFLOW_REPORT.md`](CAREGIVER_WORKFLOW_REPORT.md)** | Historical Audit | Early workflow report. |
| **[`SPRINGBOARD_FOUNDATION.md`](SPRINGBOARD_FOUNDATION.md)** | Historical Roots | Original project charter (superseded by OS Constitution). |
| **[`CHILD_VOICE_DOMAIN_DISCOVERY.md`](CHILD_VOICE_DOMAIN_DISCOVERY.md)** | Deferred Research | Youth-authoring discovery (intentionally deferred to Phase 17+). |

---

## 6. Founder Quick Decision Rule

When reviewing files or considering a task:
1. **Is it listed in Category 1 (What Matters)?** $\rightarrow$ Yes: Read and follow it strictly.
2. **Is it listed in Category 2 (Active Work)?** $\rightarrow$ Yes: Use it to guide code execution.
3. **Is it listed in Category 3 (Reference Only)?** $\rightarrow$ Read only if you need a specific statutory or curriculum detail.
4. **Is it listed in Category 4 (Archive / Completed)?** $\rightarrow$ **IGNORE IT.** It is preserved history.
