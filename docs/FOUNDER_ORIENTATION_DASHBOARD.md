# FOUNDER ORIENTATION DASHBOARD
**Initiative:** Sprout  
**Project:** Child & Family Success Operating System  
**Current Milestone:** v3.2 Foundation Alignment  
**Last Verified:** 2026-10-14  

---

## 🧭 WHERE AM I?

You are standing in **Sprout v3.2 Foundation Execution Complete**.

- **The Vision Is Decided:** Sprout is a **Child & Family Success Operating System**, not a case management system, not a state database, and not a passive binder.
- **The Architecture Is Implemented & Frozen:** Four Data Sovereignty Domains (`child`, `case`, `caregiver`, `parent`), 5-Level Note Classification (`legacy_unreviewed`, `private`, `working`, `official`, `shared_family`), and DCF Output Integration are operational in SQLite.
- **Database Migration 7 Executed:** `timeline_records` upgraded with classification, domain, sensitivity_level, and retention_state. Parent workspace tables (`parent_users`, `parent_goals`, `parent_evidence`) and composite indexes deployed.
- **Authorization Middleware Deployed:** `app/auth_middleware.py` mounted. Role resolution, domain gates, high-conflict address masking, and EXIF scrubber active.
- **Parent Participant Workspace Operational:** 5 benchmark parent scenarios verified; emergency access revocation & legal hold tested.
- **The Usability Bottlenecks Are Removed:** Mission Control Quick Action Dock, Two-Step Smart Logger, and Parent Workspace operational.
- **Parent Participant Workspace Wired & Operational:** Existing 4 modules dynamically wired to persistent backend endpoints with fail-closed gates, location masking, and date quantization.
- **Repository Documentation PII Sanitized:** Live addresses and personal caregiver identifiers replaced with synthetic placeholders in Git-tracked documentation.
- **The Entire System Is 100% Tested:** Automated test suites pass 149/149 tests (73 E2E flow tests + 46 Phase 13B governance/security tests + 30 Parent Workspace integration tests).

---

## 🎯 WHAT MATTERS?

Only two things matter right now:

1. **Protecting Caregiver Cognitive Load:** Never make Candy or any caregiver act as the integration layer, memory clerk, detective, or debugger. Every screen must answer: *Where am I? What is next?*
2. **Execution Without Regression:** Preserving 100% test pass rate and backward compatibility with local workspace data.

---

## 🟢 WHAT IS ACTIVE?

These are the only active workstreams currently in motion:

| Workstream | Scope | Target File(s) | Status |
| :--- | :--- | :--- | :---: |
| **Phase 13B Governance Execution** | Pre-migration backup, Migration 7, authorization middleware, parent tables, export hardening. | `app/db.py`, `app/server.py`, `app/services.py`, `app/auth_middleware.py` | **100% COMPLETED (46/46 Tests)** |
| **Parent Workspace Frontend Integration** | 4 modules dynamically wired to backend endpoints, fail-closed security, 5 benchmark scenarios verified. | `app/static/app.js`, `app/server.py`, `test_parent_workspace_integration.py` | **100% COMPLETED (30/30 Tests)** |
| **Founder Home Alignment** | Single source-of-truth project maintenance. | `docs/FOUNDER_ORIENTATION_DASHBOARD.md`, `docs/PROJECT_STATE.md` | **ACTIVE & SYNCHRONIZED (149/149 Tests)** |

---

## 🔴 WHAT IS BLOCKED?

The following are **INTENTIONALLY HELD (GATED)**:

| Item | Gate Condition | Why It Is Held |
| :--- | :--- | :--- |
| **Outbound Invitation Delivery** | Blocked pending verified legal, privacy, identity-verification, consent, and delivery requirements. | Prevents unverified external electronic transmission. |
| **Child Voice Direct Authoring** | Deferred to Phase 17+. | Intentionally out of scope for v3.x foundation. |

---

## ⏩ WHAT IS NEXT?

1. **Caregiver Intake Readiness:** Review and prepare intake workflows and document vaults for Sample Child CH-201 at Sample Household A.
2. **Continuous Maintenance:** Maintain single source of truth in `FOUNDER_ORIENTATION_DASHBOARD.md` and `PROJECT_STATE.md`.

---

## 🚫 WHAT CAN I IGNORE?

You do **NOT** need to think about, review, or touch any of the following:

- **Historical Architecture Proposals:** All pre-v3.1 design docs, discovery drafts, and brainstorm logs. (They are superseded by [`CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/docs/CHILD_AND_FAMILY_SUCCESS_OPERATING_SYSTEM.md)).
- **Role Permission Redesigns:** The 8 roles and their CRUD matrix are locked in [`ROLE_PERMISSION_MATRIX_V2.md`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/docs/ROLE_PERMISSION_MATRIX_V2.md). Do not invent new roles.
- **Child Voice Authoring:** Youth-authored Lifebook accounts and reflections are deferred to Phase 17+ ([`CHILD_VOICE_DOMAIN_DISCOVERY.md`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/docs/CHILD_VOICE_DOMAIN_DISCOVERY.md)).
- **State IT / SACWIS / CCWIS Integration:** Sprout outputs formatted `.docx` and `.pdf` documents for DCF workers. We do not integrate with state mainframe databases.
- **Complex Cloud Infrastructure:** Sprout remains 100% local and offline-first. Zero cloud deployment overhead.

---

## 📌 PRIMARY PROJECT HOME & MAINTENANCE PROTOCOL

> **Mandate:** `FOUNDER_ORIENTATION_DASHBOARD.md` and `PROJECT_STATE.md` are the **primary project home**.
>
> **Future Sprint Rule:** All future sprint reports and deliverables MUST directly update:
> - **WHAT IS ACTIVE?**
> - **WHAT IS BLOCKED?**
> - **WHAT IS NEXT?**
> - **WHAT CAN I IGNORE?**
>
> **Do NOT create additional status documents, side-car trackers, or redundant progress files.**

