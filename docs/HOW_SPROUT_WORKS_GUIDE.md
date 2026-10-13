# HOW SPROUT WORKS GUIDE
## Comprehensive 5-Minute Orientation for Vermont Caregivers
**Document Version:** 1.0.0  
**Status:** Approved Reference  
**Date:** October 13, 2026

---

## 1. What is Sprout?
Sprout is a local, private command center engineered specifically for Vermont foster, kinship, respite, and adoptive families. It unifies daily scheduling, health tracking, legal milestones, and DCF documentation into a single offline tool.

---

## 2. Who is it For?
- **Foster Parents:** Navigating complex DCF regulations, court dates, and school IEPs.
- **Kinship Caregivers:** Grandparents, aunts, uncles, or adult siblings caring for family children who need guidance without institutional jargon.
- **Respite Providers:** Needing rapid access to allergy, dietary, and medication routines without exposing sensitive biological family history.
- **Adoptive Families:** Preserving childhood achievements and lifebook memories while finalizing permanency.

---

## 3. How the Sandbox Differs from Production
Sprout maintains a strict physical and cryptographic barrier between environments:
- **Practice Sandbox (Blue Header):** Pre-loaded with 15 synthetic household models (Sarah Jenkins, Marcus Vance, etc.). Changes here never touch real records. Opening real OneDrive files or writing to production disks is physically blocked (403 Barrier).
- **Real Family Workspace (Emerald Header):** Your private local environment. All data lives in your local SQLite database on your computer. Zero data is transmitted to external servers.

---

## 4. How Child Reference IDs Work
To uphold the Phase 7 privacy standard (*Protect Children First*):
- Child surnames are never displayed on navigation flight strips, dashboard headers, or presentation screens.
- Children are identified by protected **Child Reference IDs** (e.g. `CH-201`, `CCC-000001`, or initials `CD`).
- When generating reports for court or DCF, full legal names are compiled only inside encrypted, downloadable `.docx` packets.

---

## 5. The 4 Cognitive Domains
Sprout consolidates child care into 4 structured domains to minimize cognitive overload:
1. **Health & Wellbeing:** Immunizations, prescription doses, allergies, and the statutory EPSDT 30-day health clock.
2. **Family Time & Visits:** Supervised visitation logs, parent contact notes, and transport mileage.
3. **Learning & Growth:** School attendance, IEP/504 goals, teacher communications, and report cards.
4. **Records & Paperwork:** 20-tab Vermont standard care binder, court orders, birth certificates, and claims.

---

## 6. Vermont DCF Command Center & Form Generation
- **EPSDT 30-Day Health Clock:** Automatically counts down days from child placement to ensure compliance with Vermont Medicaid policy.
- **State Mileage Claims (Form FS-334B):** Automatically aggregates trips and calculates reimbursements at Vermont's official \$0.67/mile rate.
- **Title 33 CHINS Timeline:** Guides caregivers through Temporary Care, Merits, Disposition, and Permanency reviews.

---

## 7. Life Journey & Circles of Care
- **Circles of Care:** Visually maps the child's support network into 4 concentric tiers (DCF Team, Legal/GAL, School/Medical, Mentors).
- **Life Journey Storybook:** Preserves favorite bedtime stories, soccer goals, report card honors, and comfort foods so childhood history is never lost during placement transitions.
