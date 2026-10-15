# FOUNDER ORIENTATION DASHBOARD
**Initiative:** Sprout  
**Project:** Child & Family Success Operating System  
**Current Milestone:** v3.2 Foundation Alignment  
**Last Verified:** 2026-10-14  

---

## 🧭 WHERE AM I?

You are standing at the threshold of **Phase 13A/13B Implementation**.

- **The Vision Is Decided:** Sprout is a **Child & Family Success Operating System**, not a case management system, not a state database, and not a passive binder.
- **The Architecture Is Frozen:** Four Data Sovereignty Domains (`child`, `case`, `caregiver`, `parent`), 5-Level Note Classification (`legacy_unreviewed`, `private`, `working`, `official`, `shared_family`), and DCF Output Integration are permanent.
- **The Usability Bottlenecks Are Removed:** Sprint 13C resolved all P0 friction points:
  - Persistent Mission Control Quick Action Dock installed.
  - Two-Step Smart Logger implemented (90% of routine logs completed in Step 1 in <15 seconds).
  - Dedicated, dignity-first Parent Participant Workspace operational and isolated from caregiver administrative chrome.
- **The System Is Stable:** Automated test suite passes 100% (73/73 tests).

---

## 🎯 WHAT MATTERS?

Only two things matter right now:

1. **Protecting Caregiver Cognitive Load:** Never make Candy or any caregiver act as the integration layer, memory clerk, detective, or debugger. Every screen must answer: *Where am I? What is next?*
2. **Safe, Traceable Implementation Execution:** Building the authorization middleware, schema migration 7, and parent access lifecycle strictly according to the approved governance matrices without regressing existing workflows.

---

## 🟢 WHAT IS ACTIVE?

These are the only active workstreams currently in motion:

| Workstream | Scope | Target File(s) | Status |
| :--- | :--- | :--- | :---: |
| **Foundation Alignment** | Aligning repository orientation, founder dashboards, and people model. | `docs/*.md`, `README.md` | **ACTIVE NOW** |
| **Implementation Readiness** | Preparing Migration 7 and authorization middleware tests. | `docs/PHASE_13B_EXECUTION_CONTROL_PLAN.md` | **READY FOR DEV** |
| **Usability Verification** | Preserving P0 dock, smart logger, and parent workspace. | `app/static/index.html`, `app/static/app.js` | **DEPLOYED & PASSING** |

---

## 🔴 WHAT IS BLOCKED?

Nothing is technically blocked, but the following are **INTENTIONALLY HELD (GATED)**:

| Item | Gate Condition | Why It Is Held |
| :--- | :--- | :--- |
| **Database Migration 7 (`app/db.py`)** | Gated on Founder sign-off of Phase 13B Execution Plan. | Prevents schema corruption before authorization middleware is verified. |
| **Parent Live Accounts** | Gated on Migration 7 completion and token invitation service. | Prevents exposure of unclassified legacy records to parents. |
| **High-Conflict Live Masking** | Gated on Authorization Middleware implementation. | Requires verified field-level redaction at the API gateway layer. |

---

## ⏩ WHAT IS NEXT?

When you return to coding, the exact sequence is already locked in [`docs/PHASE_13B_EXECUTION_CONTROL_PLAN.md`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/docs/PHASE_13B_EXECUTION_CONTROL_PLAN.md):

1. **Step 1:** Create pre-migration database snapshot backup.
2. **Step 2:** Execute Database Migration 7 (`classification`, `domain`, `sensitivity_level` on `timeline_records`; create `parent_users`, `parent_goals`, `parent_evidence`).
3. **Step 3:** Implement Authorization Middleware in `app/auth_middleware.py`.
4. **Step 4:** Mount middleware across all 43 endpoints in `app/app.py`.
5. **Step 5:** Run automated regression suite (`test_e2e_flows.py` + new Phase 13 tests).

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

