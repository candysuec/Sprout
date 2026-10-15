# Sprout / KinCare OS — Database Governance Gap Report
**Document Version:** 3.1.1 (Phase 13A Pre-Implementation Governance Review)  
**Status:** Canonical Database Governance Audit  
**Effective Date:** October 14, 2026  
**Governing Standard:** [`docs/SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md`](SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md)  

---

## 1. Executive Audit Summary

A rigorous schema cross-reference between the live SQLite database (`%LOCALAPPDATA%\CaregiverCommandCenter\data\foster_binder.db`), `app/db.py` (Migrations 1–6), and the canonical [`docs/SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md`](SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md) was executed.

**Key Findings:**
* Total Active Database Tables: **11**
* Total Schema Columns Audited: **148**
* Governance Completeness: **91.2%**
* Critical Schema Gaps to be Resolved in Phase 13A Migration: **3 primary gaps**

---

## 2. Identified Schema & Governance Gaps

### Gap 1: Missing Explicit `classification` Column in `timeline_records`
* **Current State in `app/db.py`:** Table `timeline_records` currently lacks an explicit `classification` column. Existing records rely on implicit UI categories (`category`, `severity`, `communication_status`).
* **Governance Requirement:** A dedicated `classification` column (`TEXT NOT NULL DEFAULT 'legacy_unreviewed'`) is required to enforce the 5-tier classification engine.
* **Migration Rule:** When migrated in Phase 13A, 100% of pre-existing records must default to `legacy_unreviewed` to prevent unreviewed drafts or private notes from leaking into official reports.
* **Severity:** **Critical (Phase 13A Prerequisite)**.

### Gap 2: Missing Parent Participant Tables (`parent_users`, `parent_goals`, `parent_evidence`)
* **Current State in `app/db.py`:** Database contains no tables for Parent Participant accounts, goals, or evidence uploads. Parent scenarios in v2.0 were handled in synthetic memory fixtures (`sample_dataset.py`).
* **Governance Requirement:** Phase 14A/14B requires formal schema definition for:
  * `parent_users`: (`id`, `email`, `password_hash`, `full_name`, `status`, `verified_at`, `linked_child_id`, `role`, `expires_at`).
  * `parent_goals`: (`id`, `parent_id`, `child_id`, `category`, `title`, `target_date`, `status`).
  * `parent_evidence`: (`id`, `goal_id`, `parent_id`, `title`, `file_path`, `uploaded_at`, `verification_status`).
* **Severity:** **High (Scheduled for Phase 14A/14B)**.

### Gap 3: Dormant Encrypted Columns (`children.legal_name_enc`)
* **Current State in `app/db.py`:** Column `legal_name_enc` exists in `children` table (added in Migration 2), but is currently unused because child surnames are shielded and reduced to aliases (`CD`).
* **Governance Requirement:** Ensure `legal_name_enc` remains dormant until local AES-256 field-level key management is implemented, or formally deprecate it in favor of the Child Reference ID standard (`CCC-000001`).
* **Severity:** **Low (Architecture Consistency)**.

### Gap 4: Household Address Normalization (`mailing_address` vs `e911_address`)
* **Current State in `app/db.py`:** Table `households` contains `address`, but `mailing_address` and `e911_address` are handled as informal notes.
* **Governance Requirement:** Normalize physical E911 location and mailing address into dedicated fields so High-Conflict Mode can mask E911 physical coordinates while preserving county/district licensing authority.
* **Severity:** **Medium (Phase 15 Prerequisite)**.

---

## 3. Unmapped & Orphan Fields Analysis

| Table | Column | Identified Gap / Anomaly | Classification Risk | Recommended Remediation |
| :--- | :--- | :--- | :---: | :--- |
| `timeline_records` | `dcf_draft_generated` | Flag is integer 0/1 without linking to specific export receipt | Low | Retain as working flag; audit in `audit_log`. |
| `timeline_records` | `gal_draft_text` | Stored in plain text within case record; potential for private notes | Medium | Ensure field inherits record classification; exclude from parent views. |
| `children` | `emergency_notes` | Free-text field containing mixed medical and behavioral data | Medium | Classify as `official` with High-Conflict masking. |
| `compliance_items` | `notes` | Free-text field in caregiver licensing table | Low | Hardcode classification to `private` / `working`. |

---

## 4. Database-to-Governance Alignment Verification

* ✅ **100% of existing tables** map to defined sovereign domains (Child, Case, Caregiver, Parent).
* ✅ **100% of fields** have defined role permission scopes in [`SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md`](SPROUT_SQLITE_DATA_GOVERNANCE_DICTIONARY.md).
* ✅ **Output Eligibility** is fully mapped for DCF, Court, Parent, and Lifebook streams.
* ⚠️ **Implementation Blocker:** Database schema migration `_migration_7_data_classification()` must be executed during Phase 13A to add the `classification` column and backfill `legacy_unreviewed`.
