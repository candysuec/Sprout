# Sprout / KinCare OS — Data Sensitivity Classification Architecture
**Document Version:** 3.1.1 (Phase 13A Pre-Implementation Governance Review)  
**Status:** Approved Data Security & Protection Architecture  
**Effective Date:** October 14, 2026  
**Governing Standard:** [`docs/GOVERNANCE_AND_SAFETY_FRAMEWORK.md`](GOVERNANCE_AND_SAFETY_FRAMEWORK.md)  

---

## 1. Sensitivity Architecture Purpose

This Sensitivity Architecture operates as a **protective security layer orthogonal to the 5 note classifications**. While note classifications define *operational intent and reporting scope* (`private`, `working`, `official`, `shared_family`, `legacy_unreviewed`), the Sensitivity Tier establishes *storage, encryption, masking, and redaction safeguards*.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           FOUR DATA SENSITIVITY TIERS                            │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ 1. STANDARD        │ General operational data; low privacy risk.                 │
│                    │ (e.g. food preferences, preferred nicknames, grade level)   │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 2. SENSITIVE       │ Confidential case data; restricted to verified care team.   │
│                    │ (e.g. school name, routine doctor appointments, visit dates)│
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 3. RESTRICTED      │ High liability data; requires explicit redaction rules.      │
│                    │ (e.g. psychiatric diagnoses, trauma triggers, Medicaid IDs) │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 4. PROTECTED       │ Extreme safety liability; requires automated masking & seals│
│                    │ (e.g. physical home addresses, legal surnames, E911 coords) │
└────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 2. Field-Level Sensitivity Mapping

| Data Category | Specific Database Fields | Sensitivity Tier | Masking & Redaction Rules | Storage & Export Requirements |
| :--- | :--- | :---: | :--- | :--- |
| **Protected Identity Data** | `children.legal_name_enc`, `children.last_name` | **PROTECTED** | Surnames completely masked to initials / Child Ref ID (`CD-090926`) across all screens. | Never exported in plain text without explicit court unsealing. |
| **Physical Location & E911**| `households.address`, `households.e911_address`, `contacts.address` | **PROTECTED** | 100% masked for Parent Participants in High-Conflict Mode. GPS metadata stripped from photos. | Excluded from parent workspace; sealed in public filings. |
| **Medicaid & State IDs** | `children.medicaid_number`, `benefit_claims.amount_claimed` | **RESTRICTED** | Masked to last 4 digits on flight strips (`***-**-1245`). | Included only on official DCF medical & benefit claims. |
| **Mental Health & Trauma** | `children.behavioral_supports`, `children.emergency_notes`, `timeline_records.details` | **RESTRICTED** | Redacted from parent feeds and respite cards. Clinical summaries only. | Excluded from Lifebooks; protected from third-party disclosure. |
| **Birth & Demographic** | `children.dob`, `children.gender` | **SENSITIVE** | Screen displays age in years/months rather than full DOB. | Full DOB included only on official EPSDT medical forms. |
| **Court & Legal Docket** | `chins_proceedings.court_docket`, `chins_proceedings.notes` | **RESTRICTED** | Case notes sealed from parents. Docket number accessible only to legal parties. | Formatted strictly for Title 33 court brief exports. |
| **School & Daycare** | `children.school`, `children.grade` | **SENSITIVE** | School name masked to `"Local Elementary"` if protective order active. | Grade level accessible to parent; exact campus masked in high-conflict. |
| **Emergency Contacts** | `contacts.phone`, `contacts.email`, `contacts.is_emergency` | **SENSITIVE** | Personal phone numbers masked in parent workspace; official DCF numbers visible. | Formatted on 1-Page Emergency Care Handoff Cards. |
| **Child Voice & Routines** | `children.food_preferences`, `children.comfort_items`, `posc_plans.soothing_techniques`| **STANDARD** | Accessible across care circles to ensure continuity of care. | Shared with parents to support positive engagement and co-parenting. |
| **Cryptographic Audits** | `audit_log.prev_hash`, `audit_log.row_hash`, `audit_log.changes` | **RESTRICTED** | System-level audit view; immutable. | Exported only for formal forensic evidentiary verification. |

---

## 3. High-Conflict Masking Rules by Sensitivity Tier

When High-Conflict / Protective Order Mode is activated by the Primary Caregiver:
1. **PROTECTED fields:** Automatically replaced with string `"[SEALED FOR SAFETY]"` across all parent-facing views and shared exports.
2. **RESTRICTED fields:** Automatically subjected to the 5-Gate Sharing Control Hierarchy before any export or display.
3. **SENSITIVE fields:** Scrubbed of specific institutional names (e.g. school, daycare, pediatrician office replaced with generic terms).
4. **STANDARD fields:** Remain visible to foster healthy parent-child connection without safety risks.
