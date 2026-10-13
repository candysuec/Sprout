# LIFE JOURNEY & MILESTONE CENTER ARCHITECTURE
## Sprout / KinCare OS — Phase 11 Specification
**Document Version:** 1.0.0  
**Status:** Approved & Implemented  
**Date:** October 2026  
**Governing Standard:** `SPRINGBOARD_FOUNDATION.md` & `PRIVACY_HARDENING_REPORT.md`

---

## 1. Executive Summary & Philosophy

In typical child welfare and foster care workflows, a child's institutional footprint consists almost entirely of:
- Petitions, court reviews, and protective orders
- Incident summaries and behavioral intervention logs
- Special education (IEP/504) deficiency reports
- Medication changes and psychotropic monitoring audits

When children transition to permanency (reunification, kinship guardianship, or adoption) or age out into adulthood, their documented history often reflects trauma and bureaucracy rather than humanity, growth, or identity.

**The Life Journey & Milestone Center** transforms Sprout into a trauma-informed, strengths-based sanctuary. It provides caregivers with an intuitive environment to record positive developmental milestones, memorable life events, personal interests, comfort routines, and proud accomplishments, while strictly enforcing the **Child Reference ID** privacy model established in Phase 7.

---

## 2. Core Architectural Pillars

```
+-----------------------------------------------------------------------------------+
|                        LIFE JOURNEY & MILESTONE CENTER                            |
+-----------------------------------------------------------------------------------+
| 1. Life Journey Timeline      | Chronological timeline of positive life events,    |
|                               | academic accomplishments, creative pursuits       |
+-----------------------------------------------------------------------------------+
| 2. Positive Outcomes Center   | Strengths-based metrics tracking resilience,      |
|                               | talents, hobbies, and emotional stability         |
+-----------------------------------------------------------------------------------+
| 3. Memory Preservation Hub    | Digital keepsakes, favorite routines, comfort     |
|                               | items, favorite foods, songs, and sensory anchors  |
+-----------------------------------------------------------------------------------+
| 4. Care Transition Engine     | 1-Click portable Lifebook & Transition Packets     |
|                               | for Reunification, Guardianship, or Adoption      |
+-----------------------------------------------------------------------------------+
| 5. Privacy-First Shield       | Zero unredacted surname leakage; Child Reference  |
|                               | ID standard (e.g., CH-201, CCC-000001) enforced   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Architecture

### 3.1 Life Journey Timeline
The timeline captures milestone entries categorized by domain:
- **Academic & School:** Honor roll, reading milestones, science fairs, perfect attendance weeks.
- **Athletics & Physical:** Soccer goals, swim badge, learning to ride a bicycle, hiking milestones.
- **Creativity & Arts:** Art projects, music recital, drama participation, craft creations.
- **Social & Emotional:** Demonstrations of empathy, conflict resolution, bonding with family pets, making new friendships.
- **Daily Living & Independence:** Learning to cook a meal, tying shoes, managing laundry, banking and financial literacy (for teens).

### 3.2 Memory Preservation Hub (Keepsakes & Sensory Anchors)
Caregivers document personal details that often get lost between placements:
- **Comfort Items:** Loved stuffed animal ("Blue Bunny"), weighted blanket, nighttime nightlight color.
- **Favorite Meals & Foods:** Homemade mac and cheese, sliced apples with cinnamon, preferred snacks.
- **Sensory & De-escalation Anchors:** Calming music playlists, dim lighting, quiet reading corners, deep breathing techniques.
- **Daily Routines:** Bedtime story traditions, morning wake-up pacing, school prep checklists.

### 3.3 Care Transition Engine (The Portable Lifebook)
When a child transitions home (reunification) or to a permanent kinship or adoptive home, Sprout generates a **Caregiver Transition Packet**:
- **Format:** Formatted print/PDF report and structured digital JSON export.
- **Contents:**
  1. Routine, dietary preferences, and sleep schedule guide.
  2. Medical provider roster, emergency contacts, and pharmacy info (redacted of caregiver private data).
  3. Positive achievements and strengths inventory to share with teachers and new caregivers.
  4. Keepsake photo catalog placeholders and certificate records.
- **Impact:** Eliminates the "cold handoff" where new caregivers or biological parents must rediscover what comforts the child through distressing trial and error.

---

## 4. Trauma-Informed Language Standards

All text, prompts, and tooltips adhere strictly to non-stigmatizing, strengths-based framing:

| Stigmatizing / Deficit Language (Prohibited) | Strengths-Based / Trauma-Informed (Mandatory) |
| :--- | :--- |
| "Behavioral outburst" | "Expressed emotional distress / Seeking co-regulation" |
| "Defiant / Insubordinate" | "Asserted autonomy / Expressed boundaries" |
| "Non-compliant with chores" | "Working on daily routine consistency" |
| "Attachment disorder symptoms" | "Building safety and trusting relationships" |
| "Special needs child" | "Child receiving specialized individualized supports" |

---

## 5. Privacy & Data Boundary Validation

Under `SPRINGBOARD_FOUNDATION.md`:
- **Flight Strip & Navigation:** Displays `Child Ref: CH-201` and Alias `CD`.
- **Packet Generation:** Generated transition packets header uses `Child Reference ID: CCC-000001` or selected alias. Legal surnames are never placed in unredacted export headers.
- **Local Isolation:** Keepsakes, entries, and timeline milestones are stored in the active environment (Local SQLite vs Sandbox State) without cross-contamination.

---

## 6. Implementation Verification

- **Navigation Button:** Integrated in [`app/static/index.html`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/app/static/index.html) (`switchMainSection('life_journey')`).
- **Interactive UI & Controllers:** Implemented in [`app/static/app.js`](file:///c:/Users/candy/OneDrive/Documents/01_PERSONAL_&_FAMILY/Davis%20&%20VTDCF%20Shared%20Folder/foster-portal/app/static/app.js):
  - `renderLifeJourneyView(container)`
  - `openNewMilestoneModal()`
  - `saveMilestone()`
  - `generateTransitionPacket()`
- **E2E Test Compatibility:** Verified against `test_e2e_flows.py`.
