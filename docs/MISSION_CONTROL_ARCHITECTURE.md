# MISSION CONTROL ARCHITECTURE
## Sprout / KinCare OS — Phase 12A Specification
**Document Version:** 1.0.0  
**Status:** Approved & Implemented  
**Date:** October 13, 2026  
**Governing Standard:** `SPRINGBOARD_FOUNDATION.md` & `SYSTEM_NAVIGATION_AND_INTERACTION_AUDIT.md`

---

## 1. Executive Summary & Philosophy

Prior releases established full operational capability:
- 15 realistic Vermont household models
- 4 Cognitive Care Domains (Health, Visits, Learning, Records)
- Automated DCF forms (FS-334B Mileage, FS-333B Expenses, Title 33 CHINS Stepper)
- Circles of Care relationship visualizer & Child Lifebook keepsakes
- Offline cryptographic SHA-256 blockchain audit trail

However, the user experience audit highlighted a critical usability threshold:
> **"The bottleneck is no longer whether a feature exists; the bottleneck is user understanding. Nobody should ever wonder where to start."**

**Mission Control** serves as the universal safe home and root understanding layer for Sprout. When any user opens Sprout or clicks the Sprout logo, they land on a clear, self-guiding cockpit that answers:
1. *Where am I?*
2. *What is Sprout?*
3. *What should I do next?*
4. *Which experience applies to me?*
5. *How do I learn the system?*
6. *How do I start working?*

---

## 2. Mission Control Architectural Quadrants

Mission Control categorizes all Sprout capabilities into **4 intuitive quadrants**:

```
+-----------------------------------------------------------------------------------+
|                                  SPROUT MISSION CONTROL                           |
|                       Vermont Caregiver Operating System                          |
|             Protect Children.  •  Reduce Burden.  •  Stay Prepared.               |
+-----------------------------------------------------------------------------------+
| 1. TRAIN (Practice & Simulator)    | 2. CARE (Daily Operations)                   |
| • Training Hub (Phase 8 Simulator) | • Today's Priorities (Daily Briefing)        |
| • Practice Sandbox                 | • My Children (4 Cognitive Domains)          |
| • 6 Real-World Scenarios           | • Care Binder (20 Vermont Folders)           |
| • 15 Model Households (HH-101-115) | • Circles of Care (Phase 10 Relationships)   |
| • Instructor Demonstrations        | • Life Journey Storybook (Phase 11 Lifebook) |
+------------------------------------+----------------------------------------------+
| 3. DCF (State & Court Compliance)  | 4. SYSTEM (Architecture & Security)          |
| • DCF Command Center               | • How Sprout Works Center                    |
| • Court Preparation (.docx)        | • Interactive Site Map                       |
| • Mileage Claims (Form FS-334B)    | • Visual Process Flow Library                |
| • Title 33 CHINS Timeline Stepper  | • System Decision Tree Center                |
| • Statewide 12 District Directory  | • Cryptographic Blockchain Settings          |
+------------------------------------+----------------------------------------------+
|           ROLE-BASED USER JOURNEYS (Which Experience Applies to You?)             |
| [New Foster] [Kinship Grandparent] [Respite Provider] [Adoptive] [Trainer] [DCF]  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Universal Safe Home: The Logo Interaction Contract

- **Logo Click Action:** Always routes to `switchMainSection('mission_control')`.
- **Guarantee:** Clicking the Sprout leaf logo in the persistent top header is guaranteed never to cause unexpected state changes or mode switches. It immediately returns the user to the Mission Control Center, regardless of what view or modal was previously active.
- **Top Navigation Integration:** A dedicated `Mission Control` hub button is permanently accessible in the top white navigation bar.

---

## 4. System Understanding Components

1. **5-Minute Quick-Start Orientation:** 1-tap launcher walking first-time users through the cockpit layout, cognitive domains, note logging, and state form generation.
2. **Interactive Site Map:** Hierarchical tree visualizer detailing every screen, route key, and purpose.
3. **Visual Process Flow Library:** Step-by-step state diagrams for Emergency Placement, Court Briefs, and FS-334B Mileage.
4. **Decision Tree Center:** Visual logic diagrams for Workspace Isolation, PII Presentation Blurring, and Canonical File Security.
5. **Role-Based Pathways:** Targeted guidance for New Foster Parents, Kinship Grandparents, Respite Providers, Adoptive Placements, Trainers, and State Supervisors.

---

## 5. Verification & Compliance
- **Zero Query Guard:** Unselected states remain 100% isolated.
- **Automated Verification:** 73/73 tests pass in `test_e2e_flows.py`.
- **Cryptographic Chaining:** All navigational selections and note events continue to record to the local SQLite audit ledger.
