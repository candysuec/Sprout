# Sprout / KinCare OS — Master Governance, Safety & Security Framework
**Document Version:** 3.1.0 (Governance Hardening Baseline)  
**Status:** Approved Engineering & Governance Specification  
**Effective Date:** October 14, 2026  
**Governing Standard:** Child Safety First, Caregiver Protection, Tamper-Evident Integrity  
**Repository Remote:** [github.com/candysuec/Sprout](https://github.com/candysuec/Sprout.git)  

---

## 1. Legal Disclaimer & Precise Evidentiary Terminology

### 1.1 Legal Disclaimer
> **LEGAL REVIEW REQUIRED:** Sprout is an independent documentation assistance tool designed to support caregiver organization, child welfare confidentiality, tamper-evident record keeping, and documentation integrity. Sprout does not provide legal advice, does not guarantee legal admissibility or court outcomes, and is not an official system of the Vermont Agency of Human Services or the Department for Children and Families. All reports, exhibits, and filings should be reviewed with legal counsel or the assigned caseworker prior to submission.

### 1.2 Approved Technical Definitions
* **Tamper-Evident Record Keeping:** Records are cryptographically signed with forward-chained SHA-256 hashes, timestamped, and attributable to user profiles. This provides technical verification against silent tampering; it does not claim automated legal certification or guaranteed court admissibility.
* **Confidentiality by Design:** Architecture is local-first, offline-ready, with zero telemetry and zero external cloud transmission.

---

## 2. Five-State Data Retention & Archive Lifecycle

Sprout replaces unconditional "archive forever" rules with a structured **5-State Data Retention Lifecycle**:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   SPROUT DATA RETENTION & ARCHIVE LIFECYCLE                      │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ 1. ACTIVE          │ Daily logging active; child actively placed in home; full   │
│                    │ access across enabled cognitive domains.                    │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 2. ARCHIVED        │ Child discharged / case closed; historical records locked in│
│                    │ read-only status; fully searchable; no new daily entries.   │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 3. LEGAL HOLD      │ Explicit dispute or court flag; disposition reviews frozen; │
│                    │ cryptographic verification locked; full audit immutability. │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 4. TRANSFER        │ Transition to permanency or adulthood; Child Data staged    │
│    PENDING         │ for Lifebook export container.                              │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 5. DISPOSITION     │ Post-statutory milestone (e.g., 7 yrs post-majority);       │
│    REVIEW          │ Caregiver prompted to encrypt or offline archive locally.   │
└────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 3. Unlinked Parent Self-Registration & Identity Safety Model

To prevent stalking, unauthorized data access, and safety plan breaches, parent self-registration uses an **Air-Gapped, Unlinked Model**:

1. **Self-Registration (Unlinked):** Parent creates an account. The account is set to `Pending Verification`. **Zero child names, records, or photos are visible.**
2. **Identity Verification:** Parent submits identity proof and caseworker contact.
3. **Caregiver / Authority Validation:** Authorized primary caregiver validates active court orders and DCF safety plan.
4. **Child-Scoped Linkage:** Primary caregiver explicitly links the parent account to the specific child with a defined role.
5. **Session Expiration & Revocation:** Authorizations expire after 90 days unless affirmatively renewed. Caregivers have a 1-tap `[Revoke Access]` switch that immediately cuts off access.

---

## 4. Ten-State Parent Participant Access Lifecycle

Parent access states are strictly enforced by a finite state machine:
1. `Pending Verification`: Registered; identity pending confirmation; zero child visibility.
2. `Pending Child Link`: Identity verified; awaiting caregiver confirmation of court authorization.
3. `Active Standard Access`: Standard view of goals, evidence locker, and approved milestone feed.
4. `Active Restricted Access`: Supervised view only; no commenting on shared feed.
5. `Temporarily Suspended`: 24-72 hour cooling period toggled by caregiver.
6. `Safety Suspension`: Automated freeze following security flag or boundary violation.
7. `Court Restricted`: Judicial order modifying contact entered.
8. `Expired`: 90-day authorization window elapsed.
9. `Revoked`: Permanent administrative termination of access.
10. `Archived Participant`: Case closed; placed in read-only historical archive.

---

## 5. Refined 5-Gate Sharing Control Hierarchy

Information sharing must clear all 5 sequential gates before release:
$$\text{Gate 1: Verified Legal Restrictions} \longrightarrow \text{Gate 2: Verified Safety Requirements} \longrightarrow \text{Gate 3: System Access Rules} \longrightarrow \text{Gate 4: Authorized Caregiver Decision} \longrightarrow \text{Gate 5: Human Review Before External Release}$$

---

## 6. Legacy Note Migration Standard (`legacy_unreviewed`)

All historical notes created prior to the 4-tier classification schema are classified as `legacy_unreviewed`.
* **Exclusion Standard:** Any note tagged `legacy_unreviewed` is strictly excluded from DCF monthly reports, court briefs, digital binders, and parent feeds.
* **Review Gate:** The caregiver must individually review and re-classify legacy notes before they become eligible for export or sharing.

---

## 7. Export Safety Layer Architecture

Every document export (DCF Summary, Court Brief, Mileage Claim) passes through the Export Safety Layer:
1. **Content Preview:** Full side-by-side preview of text and attachments.
2. **Classification Audit:** Visual audit ensuring only `official` notes are included; counts `private` and `working` notes excluded.
3. **Recipient Verification:** User selects explicit recipient (DCF, GAL, Attorney) to generate tracking watermarks.
4. **Redaction Engine:** 1-Click redaction of non-case names, GPS locations, and medical IDs.
5. **Human Sign-Off:** Affirmative user confirmation checkbox required to unlock download.

---

## 8. Child-Scoped Access Boundaries

* All parent and caregiver permissions are scoped strictly to `(user_id, child_id)`.
* In multi-child households, parents have zero access to sibling or unrelated foster child records.
* Household management records (fire drills, licensing, finances) are strictly segregated from child profiles.
