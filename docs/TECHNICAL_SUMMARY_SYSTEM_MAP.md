# Sprout / KinCare OS: Technical Summary & System Map

## 1. Executive & Architectural Overview

**Sprout (KinCare OS)** is an offline-capable, privacy-first command center engineered specifically for Vermont foster, kinship, respite, and adoptive families. It is designed to bridge the operational gap between state-level statutory requirements (VT DCF Family Services Division, Policy 75 Normalcy/RPPS, CHINS proceedings) and everyday household documentation (daily journaling, incident tracking, medication administration, mileage, expense logging, and audit compliance).

The platform enforces a strict **Dual-Sphere Architecture**:
1. **Unselected / Welcome State**: Zero database execution, zero private records loaded, clean public landing page featuring the complete Vermont state caregiver resource directory and sample sandbox launcher.
2. **Dev Sandbox Mode (`sample`)**: An isolated environment operating on a normalized 15-household Caregiver Journey Model with synthetic placements, completely disjoint from any private disk storage or live production data.
3. **Local Live Mode (`local`)**: The encrypted, private operational sphere bound to verified caregivers (Candy Chevalier, Robin Davis, Mallory Wheeler) and designated physical properties (41 Elmwood Dr, 22 East Parkside), reading from local SQLite and OneDrive shared documents.

---

## 2. System Architecture & Component Map

```mermaid
graph TD
    Client["Browser Client (127.0.0.1:5858)<br/>TailwindCSS • Lucide Icons • Pure JS SPA"]
    
    subgraph Routing_Guard["Security & Mode Routing Barrier"]
        ModeCheck{"Sphere & Caregiver Selected?"}
        HeaderBar["Header: Logo Reset, 24/7 Hotline, Sphere & Caregiver Dropdowns"]
    end

    subgraph Unselected_Portal["Welcome & Resource Command Center (No Live DB)"]
        Landing["Master Welcome Hero"]
        JourneyCards["15 Caregiver Lifecycle Quick-Launch Cards"]
        StateHub["Official VT Caregiver Directory & Toolkit<br/>(Rates, CWTP, VKAP, Medicaid, 12 District Offices)"]
    end

    subgraph Scoped_App["Active Household Command Center"]
        Nav["Primary Nav Toolbar (Dashboard, Children, Journal, Binder, Reports)"]
        ChildNav["Child Workspace Sub-Nav (12 Scoped Tabs)"]
        Dashboard["Caregiver Dashboard & Compliance Metrics"]
    end

    subgraph Backend_Server["Bottle Python Backend (server.py)"]
        API_Households["/api/households"]
        API_Children["/api/children"]
        API_Compliance["/api/compliance"]
        API_Records["/api/children/:id/records"]
        API_Docs["/api/shared-docs & /api/open-doc"]
        API_Sample["/api/sample-data/*"]
    end

    subgraph Data_Stores["Data Sources"]
        SynthData[("sample_dataset.py<br/>(15 Model Homes, Synthetic Placements)")]
        LocalDB[("Local SQLite (portal.db)<br/>(Encrypted, PII Protected)")]
        SharedFS[("Local Shared Drive (OneDrive)<br/>(Sample Mode Blocked)")]
    end

    Client --> HeaderBar
    HeaderBar --> ModeCheck
    ModeCheck -- "No (Default / Logo Click)" --> Unselected_Portal
    ModeCheck -- "Yes (Sphere + Caregiver)" --> Scoped_App
    
    Unselected_Portal -.->|Zero Queries| Client
    Scoped_App --> Backend_Server
    
    Backend_Server -->|Mode = sample| SynthData
    Backend_Server -->|Mode = local| LocalDB
    Backend_Server -->|Mode = local| SharedFS
```

---

## 3. Data Flow & Security Boundaries

| Dimension | Default / Welcome State | Dev Sandbox (`sample`) | Local Live Data (`local`) |
| :--- | :--- | :--- | :--- |
| **Active Sphere** | None (`""`) | `sample` | `local` |
| **Caregiver Identity** | None (`""`) | e.g. `Sample Caregiver (Sarah Jenkins)` | `Candy Chevalier`, `Robin Davis`, `Mallory Wheeler` |
| **Top Navigation Bar** | **Hidden** (`#mainNavigationContainer.hidden`) | **Visible** | **Visible** |
| **Child Snapshot Pill** | **Hidden** | **Visible** (Initials only) | **Visible** (Initials only, CD) |
| **Database Access** | **Zero Queries** (`return json_res([])`) | Pure in-memory synthetic Python model | Scoped SQLite queries |
| **Local File System** | Disabled | Blocked (`403 Forbidden`) | Restricted to verified shared folders |
| **PII Protection** | Zero private records rendered | Fully synthetic Vermont fictional entities | Full legal names encrypted; UI shows initials only |
| **GitHub Push Policy** | Publicly safe | Publicly safe | Never exported or committed (`.gitignore`) |

---

## 4. Key Functional Modules Implemented

### A. Dynamic Entry & Reset Architecture
- **Logo Click Reset (`resetToHomeLanding()`)**: Clicking the Sprout brand icon or name resets both dropdown selectors (`#sproutModeSelect` and `#caregiverSelect`) to prompt placeholders, purges `localStorage`, and instantly drops back to the Welcome Portal with zero server calls.
- **Top Bar De-cluttering**: The white navigation and search bar (`#mainNavigationContainer`) is dynamically hidden when on the welcome landing page, keeping the entry screen clean, welcoming, and intuitive.

### B. Normalized Caregiver Journey Model (`sample_dataset.py`)
Replaces flat household types with an 8-dimensional lifecycle matrix across all 15 Vermont model homes:
1. **Household Structure**: Single Adult, Married Couple, Domestic Partners, Friends/Co-Caregivers, Siblings, Parent & Adult Child, Grandparents (55+), Multi-Generational.
2. **Caregiver Stage**: Interested, Inquiry Submitted, Training In Progress, Home Study, Provisional Approval, Newly Licensed (0-1 Yr), Established (1-3 Yrs), Experienced (3+ Yrs), Specialized Provider, Mentor Caregiver, Permanency Provider, Closed / Retired.
3. **Approvals**: Foster, Kinship, Respite, Emergency, Therapeutic, Foster-to-Adopt, Independent Living, Teen Parent Support, Medical Foster Care.
4. **Current Placements & Bed Capacities**: Active vs open beds.
5. **Years Working With DCF**: Accurate tenure representation.
6. **Placements Completed**: Historical volume.
7. **Adoption Finalizations**: Permanency metrics.
8. **Special Certifications**: CPR, Adolescent Behavioral Specialist, Trauma-Informed Care, Medical Foster Care.

### C. Master Vermont Caregiver Resource Hub
Integrated directly into the welcome screen and accessible without logging into a specific profile:
- **DCF Daily Rate Schedules**: Preschool (0–5: \$22.25/day), Child (6–12: \$25.85/day), Teen (13–18: \$31.45/day), Emergency Flat Rate (\$30.00/day), Specialized Care (up to \$200.00/day).
- **State Reimbursement Channels**: Family Support Fund (\$350/child/yr to `Carrie.deem@vermont.gov`), Initial Clothing Voucher (\$100), Child-Only Reach Up Cash Grant (1-800-479-6151), and official state claim forms (`FS-333B`, `FS-334B`, `FS-270`).
- **Education & Incentives**: VT-CWTP Foundations Online (15h) & 9h Learning Networks, **\$100 Completion Incentive**, Fostering to Forever, RPC+ Trauma workshops, Northern Lights CCV, CDC "Act Early" child milestones.
- **Advocacy & Support**: Vermont Kin as Parents (VKAP Warmline: 802-871-5104), Area Agencies on Aging (Caregivers 55+ Line: 1-800-642-5119), VFAFA Children's Activity Fund, Vermont Consortium for Adoption & Guardianship (802-241-0901).
- **Health & Crisis**: Dr. Dynasaur Medicaid (1-855-899-9600), WIC nutrition vouchers, CIS & Help Me Grow (2-1-1 ext. 6), Plan of Safe Care (POSC / CAPTA), all 12 DCF District Offices directory, and prominent **24/7 DCF Crisis Line: 1-800-649-5285**.

---

## 5. File System & Source Code Manifest

```
foster-portal/
├── app/
│   ├── server.py               # WSGI Bottle backend API server with mode routing
│   ├── sample_dataset.py       # Normalized 15-household Caregiver Journey Model
│   ├── portal.db               # Local SQLite database (git-ignored, strictly local)
│   └── static/
│       ├── index.html          # Shell layout, modals, header bar, 24/7 emergency badge
│       └── app.js              # SPA client router, state handling, dynamic UI rendering
├── .gitignore                  # Enforces zero leakage of *.db, uploads/, and local PII
└── README.md                   # Project overview & architectural guide
```

---

## 6. Version Control & GitHub Repository Sync

- **Remote Repository**: [https://github.com/candysuec/Sprout](https://github.com/candysuec/Sprout)
- **Branch**: `main`
- **Key Sync Commits**:
  - `cc4e2e6`: Initial repository baseline with git-ignored private stores.
  - `992ca04`: Master welcome portal, state resource directory, and brand reset implementation.
  - `b0d10de`: Dynamic concealment of primary navigation bar on the unselected welcome view.
