# SYSTEM DECISION TREE LIBRARY
## Logic Diagrams for Security, Isolation & Permissions
**Document Version:** 1.0.0  
**Status:** Approved Reference  
**Date:** October 13, 2026

---

## 1. Workspace Selection & Data Isolation

```
           [User Launches Sprout]
                      │
                      ▼
        [Inspect localStorage['sproutMode']]
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    ['local' mode]          ['sample' mode]
          │                       │
[Header: Emerald Green]    [Header: Navy Blue + Amber Line]
[Identity: Candy Chevalier] [Identity: Sarah Jenkins (HH-101)]
[DB: Private SQLite]       [DB: Synthetic In-Memory Vault]
[External Files: Available][External Files: 403 FORBIDDEN]
```

---

## 2. Privacy Presentation Shield Logic

```
        [User Clicks "Shield PII" in Header]
                      │
                      ▼
           [Toggle isPrivacyBlurActive]
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     [Active (True)]        [Inactive (False)]
          │                       │
[Add body class]           [Remove body class]
[.privacy-sensitive: blur] [.privacy-sensitive: normal]
[Screenshots / Demos Safe] [Standard Reading Mode]
```

---

## 3. Respite Care Confidentiality Gate

```
         [User Opens Child Workspace]
                      │
                      ▼
      [Inspect child.relationship_type]
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   ['Respite Care']         ['Foster' / 'Kinship']
          │                       │
[Hide Historical Court]    [Display Complete Dossier]
[Hide Family Finances]     [Display 20-Tab Binder]
[Display Current Meds]     [Display CHINS Stepper]
[Display Allergy & Routines]
```
