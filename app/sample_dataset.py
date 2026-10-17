"""
Normalized Foster Care Management Dataset & Multi-Entity Model
Fully normalized relational structure separating:
1. Households (Physical Home & Capacity)
2. Adult Household Members (Roles & Relationship Structures)
3. Household Licensing & Approvals (Multi-License Array)
4. Household Capabilities & Age Acceptances (Capacities & Services)
5. Placements (Placement Type, Household Link, Program Participation)
6. Children & Youth (Demographics, Needs, Permanency Goals)

DISCLAIMER:
⚠ SAMPLE DATA ONLY - FOR TRAINING, TESTING, AND DEMONSTRATION PURPOSES. NO REAL INDIVIDUALS ARE REPRESENTED.
"""

# ==============================================================================
# 1. HOUSEHOLDS (Caregiver Journey Lifecycle & Structure Model)
# ==============================================================================
HOUSEHOLDS = [
    {
        "HouseholdID": "HH-101",
        "HouseholdName": "Maple Ridge Home",
        "Address": "104 Meadow Lane, Fictional Town, VT 05001",
        "Status": "Active",
        "Capacity": 2,
        "OccupiedBeds": 1,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Single Adult",
        "CaregiverStage": "Established (1-3 Years)",
        "Approvals": ["Foster", "Respite"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 2.5,
        "PlacementsCompleted": 3,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Trauma-Informed Care (VCWTP)", "CPR / First Aid", "De-escalation Strategies"]
    },
    {
        "HouseholdID": "HH-102",
        "HouseholdName": "Birchwood Haven",
        "Address": "218 Forest Brook Rd, Fictional Valley, VT 05002",
        "Status": "Active",
        "Capacity": 2,
        "OccupiedBeds": 2,
        "OpenBeds": 0,
        # Caregiver Journey Model
        "HouseholdStructure": "Single Adult",
        "CaregiverStage": "Specialized Provider",
        "Approvals": ["Foster", "Therapeutic", "Independent Living", "Emergency"],
        "CurrentPlacements": 2,
        "YearsWorkingWithDCF": 5.0,
        "PlacementsCompleted": 8,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Adolescent Behavioral Specialist", "Vocational Apprenticeship Mentor", "Crisis Intervention"]
    },
    {
        "HouseholdID": "HH-103",
        "HouseholdName": "Oak Hill Cottage",
        "Address": "55 Pinecrest Way, Sample Hill, VT 05003",
        "Status": "Active",
        "Capacity": 3,
        "OccupiedBeds": 1,
        "OpenBeds": 2,
        # Caregiver Journey Model
        "HouseholdStructure": "Married Couple",
        "CaregiverStage": "Permanency Provider",
        "Approvals": ["Foster", "Foster-to-Adopt", "Respite"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 4.2,
        "PlacementsCompleted": 4,
        "AdoptionFinalizations": 1,
        "SpecialCertifications": ["Foster-to-Adopt Pre-Placement Credential", "Infant & Toddler Attachment", "Trauma-Informed Parenting"]
    },
    {
        "HouseholdID": "HH-104",
        "HouseholdName": "Sunny Meadow Homestead",
        "Address": "342 Orchard Road, Fictional Crossing, VT 05004",
        "Status": "Active",
        "Capacity": 4,
        "OccupiedBeds": 4,
        "OpenBeds": 0,
        # Caregiver Journey Model
        "HouseholdStructure": "Married Couple",
        "CaregiverStage": "Experienced (3+ Years)",
        "Approvals": ["Foster", "Emergency", "Respite"],
        "CurrentPlacements": 4,
        "YearsWorkingWithDCF": 6.8,
        "PlacementsCompleted": 14,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Large Sibling Group Care Specialist", "High-Volume Intake Endorsement", "Water Safety Certified"]
    },
    {
        "HouseholdID": "HH-105",
        "HouseholdName": "Cedar Grove Residence",
        "Address": "12 Riverbank Drive, Sample Falls, VT 05005",
        "Status": "Active",
        "Capacity": 2,
        "OccupiedBeds": 1,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Domestic Partners",
        "CaregiverStage": "Specialized Provider",
        "Approvals": ["Foster", "Therapeutic", "Respite"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 3.8,
        "PlacementsCompleted": 5,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Trauma-Informed Behavioral Health (LCSW Partnered)", "Sensory Processing Accommodations", "LGBTQ+ Youth Advocate"]
    },
    {
        "HouseholdID": "HH-106",
        "HouseholdName": "Willow Creek Sanctuary",
        "Address": "77 Whispering Pines Ave, Fictional Summit, VT 05006",
        "Status": "Active",
        "Capacity": 3,
        "OccupiedBeds": 2,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Domestic Partners",
        "CaregiverStage": "Mentor Caregiver",
        "Approvals": ["Foster", "Independent Living", "Respite"],
        "CurrentPlacements": 2,
        "YearsWorkingWithDCF": 8.0,
        "PlacementsCompleted": 19,
        "AdoptionFinalizations": 1,
        "SpecialCertifications": ["Youth Transition & YDP Mentor", "Peer Caregiver Navigator", "Youth Financial Literacy Coach"]
    },
    {
        "HouseholdID": "HH-107",
        "HouseholdName": "Highland Vista Retreat",
        "Address": "409 Mountain View Terrace, Sample Brook, VT 05007",
        "Status": "Active",
        "Capacity": 2,
        "OccupiedBeds": 1,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Domestic Partners",
        "CaregiverStage": "Newly Licensed (0-1 Year)",
        "Approvals": ["Foster", "Medical Foster Care", "Emergency"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 0.8,
        "PlacementsCompleted": 1,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Pediatric Specialized Medical Administration", "Infant Safe Sleep & CPR", "G-Tube / Medication Certified"]
    },
    {
        "HouseholdID": "HH-108",
        "HouseholdName": "Valley View Acres",
        "Address": "88 Stonebridge Court, Fictional Hollow, VT 05008",
        "Status": "Pending Approval",
        "Capacity": 2,
        "OccupiedBeds": 0,
        "OpenBeds": 2,
        # Caregiver Journey Model
        "HouseholdStructure": "Domestic Partners",
        "CaregiverStage": "Home Study",
        "Approvals": ["Kinship", "Foster"],
        "CurrentPlacements": 0,
        "YearsWorkingWithDCF": 0.3,
        "PlacementsCompleted": 0,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Home Study Phase II Complete", "VCWTP Pre-Service Modules (8/15 hrs)"]
    },
    {
        "HouseholdID": "HH-109",
        "HouseholdName": "Two Sisters Haven",
        "Address": "154 Apple Blossom Circle, Sample Corners, VT 05009",
        "Status": "Active",
        "Capacity": 3,
        "OccupiedBeds": 1,
        "OpenBeds": 2,
        # Caregiver Journey Model
        "HouseholdStructure": "Siblings",
        "CaregiverStage": "Established (1-3 Years)",
        "Approvals": ["Kinship", "Foster", "Respite"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 2.0,
        "PlacementsCompleted": 2,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Kinship Family Dynamics Endorsement", "Birth Family Engagement Specialist", "Co-Parenting Support"]
    },
    {
        "HouseholdID": "HH-110",
        "HouseholdName": "Summit Ridge Homestead",
        "Address": "902 Timberline Pass, Fictional Notch, VT 05010",
        "Status": "Provisional",
        "Capacity": 2,
        "OccupiedBeds": 1,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Siblings",
        "CaregiverStage": "Provisional Approval",
        "Approvals": ["Kinship", "Emergency"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 0.2,
        "PlacementsCompleted": 0,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["FS-221A Section 4 District-Approved Walkthrough", "Emergency 72-Hour Kinship Clearance"]
    },
    {
        "HouseholdID": "HH-111",
        "HouseholdName": "Evergreen Family House",
        "Address": "33 Clover Hill Road, Sample Glen, VT 05011",
        "Status": "Active",
        "Capacity": 3,
        "OccupiedBeds": 2,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Parent & Adult Child",
        "CaregiverStage": "Experienced (3+ Years)",
        "Approvals": ["Foster", "Kinship", "Respite"],
        "CurrentPlacements": 2,
        "YearsWorkingWithDCF": 4.5,
        "PlacementsCompleted": 7,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Multi-Caregiver Team Coordination", "Educational Advocacy (IEP / 504)", "Youth Mentorship"]
    },
    {
        "HouseholdID": "HH-112",
        "HouseholdName": "Friendship Hearth",
        "Address": "612 Sycamore Street, Fictional Center, VT 05012",
        "Status": "Active",
        "Capacity": 2,
        "OccupiedBeds": 1,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Friends / Co-Caregivers",
        "CaregiverStage": "Newly Licensed (0-1 Year)",
        "Approvals": ["Respite"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 0.9,
        "PlacementsCompleted": 6,
        "AdoptionFinalizations": 0,
        "SpecialCertifications": ["Dedicated Weekend Respite Endorsement", "Sensory-Safe Home Environment", "First Aid / CPR"]
    },
    {
        "HouseholdID": "HH-113",
        "HouseholdName": "Grandparent's Haven",
        "Address": "27 Old Farmhouse Way, Sample Village, VT 05013",
        "Status": "Active",
        "Capacity": 2,
        "OccupiedBeds": 1,
        "OpenBeds": 1,
        # Caregiver Journey Model
        "HouseholdStructure": "Grandparents",
        "CaregiverStage": "Permanency Provider",
        "Approvals": ["Kinship", "Foster-to-Adopt"],
        "CurrentPlacements": 1,
        "YearsWorkingWithDCF": 3.0,
        "PlacementsCompleted": 1,
        "AdoptionFinalizations": 2,
        "SpecialCertifications": ["Grandfamilies Legal Custody & Guardianship", "Intergenerational Trauma Support", "VKAP Network Leader"]
    },
    {
        "HouseholdID": "HH-114",
        "HouseholdName": "Community Anchor House",
        "Address": "504 Heritage Lane, Fictional Mills, VT 05014",
        "Status": "Active",
        "Capacity": 2,
        "OccupiedBeds": 2,
        "OpenBeds": 0,
        # Caregiver Journey Model
        "HouseholdStructure": "Married Couple",
        "CaregiverStage": "Experienced (3+ Years)",
        "Approvals": ["Kinship", "Foster", "Independent Living", "Teen Parent Support"],
        "CurrentPlacements": 2,
        "YearsWorkingWithDCF": 7.2,
        "PlacementsCompleted": 11,
        "AdoptionFinalizations": 1,
        "SpecialCertifications": ["Fictive Kin Navigation", "Young Adult Independent Living Pathways", "Driver Education Mentor"]
    },
    {
        "HouseholdID": "HH-115",
        "HouseholdName": "Multi-Gen Farmstead",
        "Address": "780 Country Hollow Rd, Sample Prairie, VT 05015",
        "Status": "Closed",
        "Capacity": 3,
        "OccupiedBeds": 0,
        "OpenBeds": 0,
        # Caregiver Journey Model
        "HouseholdStructure": "Multi-Generational",
        "CaregiverStage": "Closed / Retired",
        "Approvals": ["Foster", "Kinship", "Respite", "Teen Parent Support"],
        "CurrentPlacements": 0,
        "YearsWorkingWithDCF": 12.0,
        "PlacementsCompleted": 26,
        "AdoptionFinalizations": 3,
        "SpecialCertifications": ["Lifetime Caregiver Service Award", "Master Foster Parent Mentor", "Former VTDCF Advisory Council"]
    }
]

# ==============================================================================
# 2. ADULT HOUSEHOLD MEMBERS (Roles & Relationship Categories)
# ==============================================================================
ADULT_MEMBERS = [
    # HH-101: Single Female Caregiver
    {"AdultID": "ADM-101", "HouseholdID": "HH-101", "Name": "Sarah Jenkins", "Role": "Primary Caregiver", "RelationshipCategory": "Single Adult"},

    # HH-102: Single Male Caregiver
    {"AdultID": "ADM-102", "HouseholdID": "HH-102", "Name": "Marcus Vance", "Role": "Primary Caregiver", "RelationshipCategory": "Single Adult"},

    # HH-103: Married Male/Female Couple
    {"AdultID": "ADM-103A", "HouseholdID": "HH-103", "Name": "David Miller", "Role": "Primary Caregiver", "RelationshipCategory": "Married Couple"},
    {"AdultID": "ADM-103B", "HouseholdID": "HH-103", "Name": "Emily Miller", "Role": "Secondary Caregiver", "RelationshipCategory": "Married Couple"},

    # HH-104: Married Male/Female Couple
    {"AdultID": "ADM-104A", "HouseholdID": "HH-104", "Name": "Robert Hayes", "Role": "Primary Caregiver", "RelationshipCategory": "Married Couple"},
    {"AdultID": "ADM-104B", "HouseholdID": "HH-104", "Name": "Laura Hayes", "Role": "Secondary Caregiver", "RelationshipCategory": "Married Couple"},

    # HH-105: Married Female/Female Couple
    {"AdultID": "ADM-105A", "HouseholdID": "HH-105", "Name": "Elena Ramos", "Role": "Primary Caregiver", "RelationshipCategory": "Married Couple"},
    {"AdultID": "ADM-105B", "HouseholdID": "HH-105", "Name": "Chloe Bennett", "Role": "Secondary Caregiver", "RelationshipCategory": "Married Couple"},

    # HH-106: Married Male/Male Couple
    {"AdultID": "ADM-106A", "HouseholdID": "HH-106", "Name": "Julian Scott", "Role": "Primary Caregiver", "RelationshipCategory": "Married Couple"},
    {"AdultID": "ADM-106B", "HouseholdID": "HH-106", "Name": "Anthony Rivera", "Role": "Secondary Caregiver", "RelationshipCategory": "Married Couple"},

    # HH-107: Domestic Partner Female/Female Couple
    {"AdultID": "ADM-107A", "HouseholdID": "HH-107", "Name": "Rachel Foster", "Role": "Primary Caregiver", "RelationshipCategory": "Domestic Partners"},
    {"AdultID": "ADM-107B", "HouseholdID": "HH-107", "Name": "Maya Lin", "Role": "Secondary Caregiver", "RelationshipCategory": "Domestic Partners"},

    # HH-108: Domestic Partner Male/Male Couple
    {"AdultID": "ADM-108A", "HouseholdID": "HH-108", "Name": "Tyler Adams", "Role": "Primary Caregiver", "RelationshipCategory": "Domestic Partners"},
    {"AdultID": "ADM-108B", "HouseholdID": "HH-108", "Name": "Zachary Brooks", "Role": "Secondary Caregiver", "RelationshipCategory": "Domestic Partners"},

    # HH-109: Two Sisters Applying Together
    {"AdultID": "ADM-109A", "HouseholdID": "HH-109", "Name": "Hannah Abbott", "Role": "Primary Caregiver", "RelationshipCategory": "Sisters"},
    {"AdultID": "ADM-109B", "HouseholdID": "HH-109", "Name": "Beatrice Abbott", "Role": "Secondary Caregiver", "RelationshipCategory": "Sisters"},

    # HH-110: Two Brothers Applying Together
    {"AdultID": "ADM-110A", "HouseholdID": "HH-110", "Name": "Logan Fletcher", "Role": "Primary Caregiver", "RelationshipCategory": "Brothers"},
    {"AdultID": "ADM-110B", "HouseholdID": "HH-110", "Name": "Caleb Fletcher", "Role": "Secondary Caregiver", "RelationshipCategory": "Brothers"},

    # HH-111: Parent and Adult Child Caregiving Team
    {"AdultID": "ADM-111A", "HouseholdID": "HH-111", "Name": "Margaret Sullivan", "Role": "Primary Caregiver", "RelationshipCategory": "Parent and Adult Child"},
    {"AdultID": "ADM-111B", "HouseholdID": "HH-111", "Name": "Claire Sullivan", "Role": "Secondary Caregiver", "RelationshipCategory": "Parent and Adult Child"},

    # HH-112: Two Friends / Co-Caregivers Sharing Household
    {"AdultID": "ADM-112A", "HouseholdID": "HH-112", "Name": "Samantha Price", "Role": "Primary Caregiver", "RelationshipCategory": "Friends / Co-Caregivers"},
    {"AdultID": "ADM-112B", "HouseholdID": "HH-112", "Name": "Jordan Taylor", "Role": "Secondary Caregiver", "RelationshipCategory": "Friends / Co-Caregivers"},

    # HH-113: Grandparent Household
    {"AdultID": "ADM-113A", "HouseholdID": "HH-113", "Name": "Eleanor Vance", "Role": "Primary Caregiver", "RelationshipCategory": "Grandparents"},
    {"AdultID": "ADM-113B", "HouseholdID": "HH-113", "Name": "Arthur Vance", "Role": "Secondary Caregiver", "RelationshipCategory": "Grandparents"},

    # HH-114: Fictive Kin Household
    {"AdultID": "ADM-114A", "HouseholdID": "HH-114", "Name": "Douglas Cole", "Role": "Primary Caregiver", "RelationshipCategory": "Married Couple"},
    {"AdultID": "ADM-114B", "HouseholdID": "HH-114", "Name": "Miriam Cole", "Role": "Secondary Caregiver", "RelationshipCategory": "Married Couple"},

    # HH-115: Multi-Generational Household
    {"AdultID": "ADM-115A", "HouseholdID": "HH-115", "Name": "Grace Holloway", "Role": "Primary Caregiver", "RelationshipCategory": "Multi-Generational"},
    {"AdultID": "ADM-115B", "HouseholdID": "HH-115", "Name": "Lydia Holloway", "Role": "Household Member", "RelationshipCategory": "Multi-Generational"}
]

# ==============================================================================
# 3. LICENSING & APPROVALS (Many-to-One with Households)
# ==============================================================================
LICENSES = [
    # HH-101: Licensed Foster Home + Licensed Respite Provider
    {"LicenseID": "LIC-101A", "HouseholdID": "HH-101", "LicenseType": "Licensed Foster Home", "Status": "Active", "EffectiveDate": "2022-04-15"},
    {"LicenseID": "LIC-101B", "HouseholdID": "HH-101", "LicenseType": "Licensed Respite Provider", "Status": "Active", "EffectiveDate": "2022-08-01"},

    # HH-102: Licensed Therapeutic Foster Home + Independent Living Support
    {"LicenseID": "LIC-102A", "HouseholdID": "HH-102", "LicenseType": "Licensed Therapeutic Foster Home", "Status": "Active", "EffectiveDate": "2021-08-10"},
    {"LicenseID": "LIC-102B", "HouseholdID": "HH-102", "LicenseType": "Independent Living Support Provider", "Status": "Active", "EffectiveDate": "2023-01-15"},

    # HH-103: Foster-To-Adopt Approved + Licensed Foster Home
    {"LicenseID": "LIC-103A", "HouseholdID": "HH-103", "LicenseType": "Licensed Foster Home", "Status": "Active", "EffectiveDate": "2020-02-18"},
    {"LicenseID": "LIC-103B", "HouseholdID": "HH-103", "LicenseType": "Foster-To-Adopt Approved", "Status": "Active", "EffectiveDate": "2021-03-01"},

    # HH-104: Licensed Foster Home + Emergency Placement Resource
    {"LicenseID": "LIC-104A", "HouseholdID": "HH-104", "LicenseType": "Licensed Foster Home", "Status": "Active", "EffectiveDate": "2019-11-04"},
    {"LicenseID": "LIC-104B", "HouseholdID": "HH-104", "LicenseType": "Emergency Placement Resource", "Status": "Active", "EffectiveDate": "2022-05-10"},

    # HH-105: Licensed Respite Provider
    {"LicenseID": "LIC-105A", "HouseholdID": "HH-105", "LicenseType": "Licensed Respite Provider", "Status": "Active", "EffectiveDate": "2023-01-20"},

    # HH-106: Licensed Therapeutic Foster Home + Licensed Respite Provider
    {"LicenseID": "LIC-106A", "HouseholdID": "HH-106", "LicenseType": "Licensed Therapeutic Foster Home", "Status": "Active", "EffectiveDate": "2021-06-12"},
    {"LicenseID": "LIC-106B", "HouseholdID": "HH-106", "LicenseType": "Licensed Respite Provider", "Status": "Active", "EffectiveDate": "2022-04-10"},

    # HH-107: Emergency Placement Resource + Licensed Foster Home
    {"LicenseID": "LIC-107A", "HouseholdID": "HH-107", "LicenseType": "Licensed Foster Home", "Status": "Active", "EffectiveDate": "2023-07-01"},
    {"LicenseID": "LIC-107B", "HouseholdID": "HH-107", "LicenseType": "Emergency Placement Resource", "Status": "Active", "EffectiveDate": "2023-07-15"},

    # HH-108: Pending License (Home Study in progress)
    {"LicenseID": "LIC-108A", "HouseholdID": "HH-108", "LicenseType": "Licensed Foster Home", "Status": "Pending License", "EffectiveDate": "2024-03-10"},

    # HH-109: Kinship Approved (Non-Licensed Kinship Custody)
    {"LicenseID": "LIC-109A", "HouseholdID": "HH-109", "LicenseType": "Kinship Approved", "Status": "Active", "EffectiveDate": "2022-09-14"},

    # HH-110: Provisional Approval + Kinship Approved (Licensed Kinship Pathway)
    {"LicenseID": "LIC-110A", "HouseholdID": "HH-110", "LicenseType": "Kinship Approved", "Status": "Provisional Approval", "EffectiveDate": "2024-01-05"},
    {"LicenseID": "LIC-110B", "HouseholdID": "HH-110", "LicenseType": "Licensed Foster Home", "Status": "Provisional Approval", "EffectiveDate": "2024-01-10"},

    # HH-111: Licensed Foster Home + Licensed Respite Provider
    {"LicenseID": "LIC-111A", "HouseholdID": "HH-111", "LicenseType": "Licensed Foster Home", "Status": "Active", "EffectiveDate": "2020-08-22"},
    {"LicenseID": "LIC-111B", "HouseholdID": "HH-111", "LicenseType": "Licensed Respite Provider", "Status": "Active", "EffectiveDate": "2021-09-05"},

    # HH-112: Licensed Respite Provider
    {"LicenseID": "LIC-112A", "HouseholdID": "HH-112", "LicenseType": "Licensed Respite Provider", "Status": "Active", "EffectiveDate": "2023-05-19"},

    # HH-113: Kinship Approved + Licensed Foster Home (Dual Licensed Kinship)
    {"LicenseID": "LIC-113A", "HouseholdID": "HH-113", "LicenseType": "Kinship Approved", "Status": "Active", "EffectiveDate": "2019-03-12"},
    {"LicenseID": "LIC-113B", "HouseholdID": "HH-113", "LicenseType": "Licensed Foster Home", "Status": "Active", "EffectiveDate": "2020-04-15"},

    # HH-114: Fictive Kin Approved + Independent Living Support
    {"LicenseID": "LIC-114A", "HouseholdID": "HH-114", "LicenseType": "Fictive Kin Approved", "Status": "Active", "EffectiveDate": "2022-11-30"},
    {"LicenseID": "LIC-114B", "HouseholdID": "HH-114", "LicenseType": "Independent Living Support Provider", "Status": "Active", "EffectiveDate": "2023-08-10"},

    # HH-115: Closed Home
    {"LicenseID": "LIC-115A", "HouseholdID": "HH-115", "LicenseType": "Licensed Foster Home", "Status": "Closed Home", "EffectiveDate": "2018-05-01"}
]

# ==============================================================================
# 4. HOUSEHOLD CAPABILITIES (Accepted Age Groups & Service Capacities)
# ==============================================================================
CAPABILITIES = [
    {
        "HouseholdID": "HH-101",
        "AgeGroups": ["Infants", "Toddlers", "Children"],
        "ServiceCapacities": ["Respite", "Behavioral Support"],
        "ApprovedAgeRange": "0 - 8"
    },
    {
        "HouseholdID": "HH-102",
        "AgeGroups": ["Teens", "Young Adults"],
        "ServiceCapacities": ["Therapeutic Care", "Independent Living", "Behavioral Support"],
        "ApprovedAgeRange": "10 - 21"
    },
    {
        "HouseholdID": "HH-103",
        "AgeGroups": ["Infants", "Toddlers", "Children"],
        "ServiceCapacities": ["Medical Support", "Behavioral Support"],
        "ApprovedAgeRange": "0 - 12"
    },
    {
        "HouseholdID": "HH-104",
        "AgeGroups": ["Toddlers", "Children", "Teens"],
        "ServiceCapacities": ["Sibling Groups", "Emergency Placement", "Behavioral Support"],
        "ApprovedAgeRange": "2 - 17"
    },
    {
        "HouseholdID": "HH-105",
        "AgeGroups": ["Infants", "Toddlers"],
        "ServiceCapacities": ["Respite", "Medical Support"],
        "ApprovedAgeRange": "0 - 6"
    },
    {
        "HouseholdID": "HH-106",
        "AgeGroups": ["Children", "Teens"],
        "ServiceCapacities": ["Therapeutic Care", "Respite", "Behavioral Support"],
        "ApprovedAgeRange": "10 - 18"
    },
    {
        "HouseholdID": "HH-107",
        "AgeGroups": ["Infants", "Toddlers", "Children", "Teens"],
        "ServiceCapacities": ["Emergency Placement", "Behavioral Support"],
        "ApprovedAgeRange": "0 - 17"
    },
    {
        "HouseholdID": "HH-108",
        "AgeGroups": ["Children", "Teens"],
        "ServiceCapacities": ["Behavioral Support"],
        "ApprovedAgeRange": "6 - 15"
    },
    {
        "HouseholdID": "HH-109",
        "AgeGroups": ["Infants", "Toddlers", "Children", "Teens"],
        "ServiceCapacities": ["Sibling Groups", "Behavioral Support"],
        "ApprovedAgeRange": "0 - 18"
    },
    {
        "HouseholdID": "HH-110",
        "AgeGroups": ["Teens"],
        "ServiceCapacities": ["Behavioral Support", "Sibling Groups"],
        "ApprovedAgeRange": "10 - 18"
    },
    {
        "HouseholdID": "HH-111",
        "AgeGroups": ["Infants", "Toddlers", "Teens"],
        "ServiceCapacities": ["Teen Parents", "Medical Support"],
        "ApprovedAgeRange": "0 - 18"
    },
    {
        "HouseholdID": "HH-112",
        "AgeGroups": ["Children", "Teens"],
        "ServiceCapacities": ["Respite", "Behavioral Support"],
        "ApprovedAgeRange": "5 - 16"
    },
    {
        "HouseholdID": "HH-113",
        "AgeGroups": ["Infants", "Toddlers", "Children"],
        "ServiceCapacities": ["Medical Support"],
        "ApprovedAgeRange": "0 - 17"
    },
    {
        "HouseholdID": "HH-114",
        "AgeGroups": ["Children", "Teens", "Young Adults"],
        "ServiceCapacities": ["Independent Living", "Behavioral Support"],
        "ApprovedAgeRange": "7 - 21"
    },
    {
        "HouseholdID": "HH-115",
        "AgeGroups": [],
        "ServiceCapacities": [],
        "ApprovedAgeRange": "Closed"
    }
]

# ==============================================================================
# 5. CHILDREN & YOUTH (Demographics & Permanency Goals)
# ==============================================================================
CHILDREN = [
    # 3 Primary Training Anchor Children
    {"ChildID": "CH-201", "Initials": "LB", "FullName": "Liam Brooks", "DOB": "2024-03-14", "Age": 0, "AgeBracket": "Infant", "Gender": "Male", "PermanencyGoal": "Reunification"},
    {"ChildID": "CH-202", "Initials": "EV", "FullName": "Emma Vance", "DOB": "2023-04-18", "Age": 3, "AgeBracket": "Toddler", "Gender": "Female", "PermanencyGoal": "Relative Guardianship"},
    {"ChildID": "CH-203", "Initials": "NM", "FullName": "Noah Miller", "DOB": "2018-09-12", "Age": 8, "AgeBracket": "Elementary", "Gender": "Male", "PermanencyGoal": "Reunification"},

    # 3 Continuum & Sibling Support Children
    {"ChildID": "CH-204", "Initials": "MV", "FullName": "Marcus Vance", "DOB": "2019-05-20", "Age": 7, "AgeBracket": "Elementary", "Gender": "Male", "PermanencyGoal": "Reunification"},
    {"ChildID": "CH-205", "Initials": "CL", "FullName": "Chloe Lin", "DOB": "2017-06-14", "Age": 9, "AgeBracket": "Elementary", "Gender": "Female", "PermanencyGoal": "Reunification"},
    {"ChildID": "CH-206", "Initials": "SJ", "FullName": "Sophia Jenkins", "DOB": "2022-02-04", "Age": 2, "AgeBracket": "Toddler", "Gender": "Female", "PermanencyGoal": "Assessment Pending"},

    # 4 Elementary Age
    {"ChildID": "CH-207", "Initials": "LH", "FullName": "Lucas Hayes", "DOB": "2019-05-12", "Age": 5, "AgeBracket": "Elementary", "Gender": "Male", "PermanencyGoal": "Reunification"},
    {"ChildID": "CH-208", "Initials": "AH", "FullName": "Ava Hayes", "DOB": "2017-09-30", "Age": 7, "AgeBracket": "Elementary", "Gender": "Female", "PermanencyGoal": "Reunification"},
    {"ChildID": "CH-209", "Initials": "AV", "FullName": "Aiden Vance", "DOB": "2018-04-18", "Age": 6, "AgeBracket": "Elementary", "Gender": "Male", "PermanencyGoal": "Relative Guardianship"},
    {"ChildID": "CH-210", "Initials": "EC", "FullName": "Emma Cole", "DOB": "2016-10-14", "Age": 8, "AgeBracket": "Elementary", "Gender": "Female", "PermanencyGoal": "Guardianship"},

    # 4 Middle School Age
    {"ChildID": "CH-211", "Initials": "JM", "FullName": "Jackson Miller", "DOB": "2014-06-21", "Age": 10, "AgeBracket": "Middle School", "Gender": "Male", "PermanencyGoal": "Adoption"},
    {"ChildID": "CH-212", "Initials": "CD", "FullName": "Chloe Davis", "DOB": "2013-01-17", "Age": 11, "AgeBracket": "Middle School", "Gender": "Female", "PermanencyGoal": "Reunification"},
    {"ChildID": "CH-213", "Initials": "BT", "FullName": "Benjamin Taylor", "DOB": "2012-07-09", "Age": 12, "AgeBracket": "Middle School", "Gender": "Male", "PermanencyGoal": "Permanent Custody"},
    {"ChildID": "CH-214", "Initials": "ZW", "FullName": "Zoey Washington", "DOB": "2011-12-03", "Age": 12, "AgeBracket": "Middle School", "Gender": "Female", "PermanencyGoal": "Reunification"},

    # 4 Teenagers
    {"ChildID": "CH-215", "Initials": "KR", "FullName": "Kayla Ramos", "DOB": "2009-08-11", "Age": 15, "AgeBracket": "Teen", "Gender": "Female", "PermanencyGoal": "Relative Guardianship"},
    {"ChildID": "CH-216", "Initials": "MR", "FullName": "Mason Rivera", "DOB": "2008-05-29", "Age": 16, "AgeBracket": "Teen", "Gender": "Male", "PermanencyGoal": "APPLA"},
    {"ChildID": "CH-217", "Initials": "IB", "FullName": "Isabella Bennett", "DOB": "2009-02-14", "Age": 15, "AgeBracket": "Teen", "Gender": "Female", "PermanencyGoal": "Guardianship"},
    {"ChildID": "CH-218", "Initials": "EW", "FullName": "Elijah Ward", "DOB": "2008-11-20", "Age": 15, "AgeBracket": "Teen", "Gender": "Male", "PermanencyGoal": "Reunification"},

    # 2 Young Adults
    {"ChildID": "CH-219", "Initials": "JP", "FullName": "Jordan Patterson", "DOB": "2006-04-10", "Age": 18, "AgeBracket": "Young Adult", "Gender": "Non-Binary", "PermanencyGoal": "Independent Living"},
    {"ChildID": "CH-220", "Initials": "DC", "FullName": "Destiny Clark", "DOB": "2005-09-08", "Age": 19, "AgeBracket": "Young Adult", "Gender": "Female", "PermanencyGoal": "Independent Living"}
]

# ==============================================================================
# 6. PLACEMENT EPISODES & PROGRAM PARTICIPATION (Separated from Demographics)
# ==============================================================================
PLACEMENTS = [
    {
        "PlacementID": "PLC-301",
        "ChildID": "CH-201",
        "HouseholdID": "HH-101",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Infant Support", "Family Reunification Services"],
        "StartDate": "2024-09-01",
        "SpecialScenario": "Infant Liam Brooks placed with single female foster caregiver (Sarah Jenkins)"
    },
    {
        "PlacementID": "PLC-302",
        "ChildID": "CH-202",
        "HouseholdID": "HH-111",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Teen Parent Support", "Infant Support"],
        "StartDate": "2024-06-10",
        "SpecialScenario": "Infant placed alongside teen mother (CH-215)"
    },
    {
        "PlacementID": "PLC-303",
        "ChildID": "CH-203",
        "HouseholdID": "HH-103",
        "PlacementType": "Foster-To-Adopt",
        "ProgramParticipation": ["Infant Support"],
        "StartDate": "2024-01-15",
        "SpecialScenario": "Child transitioning to adoption post-TPR"
    },
    {
        "PlacementID": "PLC-304",
        "ChildID": "CH-204",
        "HouseholdID": "HH-104",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2023-08-20",
        "SpecialScenario": "Sibling Group of 4 children (Child 1 of 4)"
    },
    {
        "PlacementID": "PLC-305",
        "ChildID": "CH-205",
        "HouseholdID": "HH-104",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2023-08-20",
        "SpecialScenario": "Sibling Group of 4 children (Child 2 of 4)"
    },
    {
        "PlacementID": "PLC-306",
        "ChildID": "CH-206",
        "HouseholdID": "HH-105",
        "PlacementType": "Respite Care",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2024-10-11",
        "SpecialScenario": "Emergency respite placement"
    },
    {
        "PlacementID": "PLC-307",
        "ChildID": "CH-207",
        "HouseholdID": "HH-104",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2023-08-20",
        "SpecialScenario": "Sibling Group of 4 children (Child 3 of 4)"
    },
    {
        "PlacementID": "PLC-308",
        "ChildID": "CH-208",
        "HouseholdID": "HH-104",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2023-08-20",
        "SpecialScenario": "Sibling Group of 4 children (Child 4 of 4)"
    },
    {
        "PlacementID": "PLC-309",
        "ChildID": "CH-202",
        "HouseholdID": "HH-113",
        "PlacementType": "Kinship Care",
        "ProgramParticipation": ["Family Reunification Services", "Kinship Support"],
        "StartDate": "2022-05-14",
        "SpecialScenario": "Toddler Emma Vance placed with grandparents (Eleanor & Arthur Vance) transitioning to relative guardianship"
    },
    {
        "PlacementID": "PLC-310",
        "ChildID": "CH-210",
        "HouseholdID": "HH-114",
        "PlacementType": "Kinship Care",
        "ProgramParticipation": ["Behavioral Health Supports"],
        "StartDate": "2023-03-22",
        "SpecialScenario": "Fictive kin placement with youth minister family"
    },
    {
        "PlacementID": "PLC-311",
        "ChildID": "CH-211",
        "HouseholdID": "HH-108",
        "PlacementType": "Pre-Adoptive Placement",
        "ProgramParticipation": ["Behavioral Health Supports"],
        "StartDate": "2022-11-10",
        "SpecialScenario": "Child transitioning to adoption"
    },
    {
        "PlacementID": "PLC-312",
        "ChildID": "CH-212",
        "HouseholdID": "HH-106",
        "PlacementType": "Respite Care",
        "ProgramParticipation": ["Behavioral Health Supports"],
        "StartDate": "2024-10-05",
        "SpecialScenario": "Sample Scenario CD (Mock respite with male/male couple)"
    },
    {
        "PlacementID": "PLC-313",
        "ChildID": "CH-213",
        "HouseholdID": "HH-102",
        "PlacementType": "Therapeutic Placement",
        "ProgramParticipation": ["Behavioral Health Supports"],
        "StartDate": "2022-09-01",
        "SpecialScenario": "Child in therapeutic foster care with single male caregiver"
    },
    {
        "PlacementID": "PLC-314",
        "ChildID": "CH-214",
        "HouseholdID": "HH-109",
        "PlacementType": "Trial Home Visit",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2024-08-15",
        "SpecialScenario": "Trial home visit under sister kinship supervision"
    },
    {
        "PlacementID": "PLC-315",
        "ChildID": "CH-215",
        "HouseholdID": "HH-111",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Teen Parent Support"],
        "StartDate": "2024-06-10",
        "SpecialScenario": "Teen parent with infant (Mother of CH-202)"
    },
    {
        "PlacementID": "PLC-316",
        "ChildID": "CH-216",
        "HouseholdID": "HH-106",
        "PlacementType": "Therapeutic Placement",
        "ProgramParticipation": ["Behavioral Health Supports", "Independent Living"],
        "StartDate": "2023-04-18",
        "SpecialScenario": "Youth in therapeutic care preparing for independent living"
    },
    {
        "PlacementID": "PLC-317",
        "ChildID": "CH-217",
        "HouseholdID": "HH-110",
        "PlacementType": "Kinship Care",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2024-02-01",
        "SpecialScenario": "Child transitioning to guardianship with brother caregiver team"
    },
    {
        "PlacementID": "PLC-318",
        "ChildID": "CH-218",
        "HouseholdID": "HH-102",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Family Reunification Services"],
        "StartDate": "2023-01-20",
        "SpecialScenario": "High school teen in driver education"
    },
    {
        "PlacementID": "PLC-319",
        "ChildID": "CH-219",
        "HouseholdID": "HH-102",
        "PlacementType": "Foster Care",
        "ProgramParticipation": ["Independent Living"],
        "StartDate": "2022-10-12",
        "SpecialScenario": "Child preparing for independent living (18yo extended care)"
    },
    {
        "PlacementID": "PLC-320",
        "ChildID": "CH-220",
        "HouseholdID": "HH-114",
        "PlacementType": "Kinship Care",
        "ProgramParticipation": ["Independent Living"],
        "StartDate": "2023-05-01",
        "SpecialScenario": "Child preparing for independent living (19yo vocational apprentice)"
    },
    {
        "PlacementID": "PLC-321",
        "ChildID": "CH-201",
        "HouseholdID": "HH-112",
        "PlacementType": "Respite Care",
        "ProgramParticipation": ["Infant Support", "Care & Safety Handoff"],
        "StartDate": "2024-10-15",
        "SpecialScenario": "Infant Liam Brooks in 48-hour weekend respite care with Samantha Price & Jordan Taylor"
    }
]

# ==============================================================================
# 7. SYNTHETIC TIMELINE & BINDER RECORDS (Zero-Leakage Fictional Events)
# ==============================================================================
SAMPLE_RECORDS = [
    {
        "id": 1001,
        "child_id": 201,  # CH-201 Liam Brooks (Infant, 6 mos)
        "category": "medical",
        "sub_type": "Pediatric Checkup",
        "title": "30-Day EPSDT Well-Child & Immunization Exam",
        "event_date": "2026-03-15",
        "location": "Green Mountain Pediatrics",
        "participants": "Dr. Miller, Sarah Jenkins (Caregiver), Liam Brooks",
        "summary": "Statutory 30-day EPSDT exam completed. Height and weight at 55th percentile. Pediatric reflexes and auditory screening normal. 6-month Rotavirus and DTaP vaccines administered.",
        "follow_up_needed": 0,
        "follow_up_notes": "9-month developmental checkup scheduled.",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 1,
        "dcf_draft_text": "EPSDT Statutory Compliance Notice: Liam Brooks (CH-201) attended required EPSDT checkup on 03/15/2026. Immunizations current. Exam record uploaded to binder.",
        "communication_status": "Sent"
    },
    {
        "id": 1002,
        "child_id": 201,
        "category": "daily",
        "sub_type": "Infant Care & Sleep",
        "title": "Formula Schedule & Night Sleep Rhythm",
        "event_date": "2026-03-22",
        "location": "Maple Ridge Home",
        "participants": "Sarah Jenkins, Liam Brooks",
        "summary": "Liam took 4 oz of gentle formula at 11:30 AM and 3:30 PM without reflux. Settled smoothly into sensory-safe bassinet with white noise machine.",
        "follow_up_needed": 0,
        "follow_up_notes": "",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 0,
        "dcf_draft_text": "",
        "communication_status": "Logged"
    },
    {
        "id": 1003,
        "child_id": 201,
        "category": "family_time",
        "sub_type": "Supervised Visit",
        "title": "Supervised Family Time with Biological Mother",
        "event_date": "2026-04-02",
        "location": "Easterseals Family Time Center",
        "participants": "Liam Brooks, Biological Mother (Angela Davis), Visit Specialist Kelly R.",
        "summary": "1-hour supervised visit. Mother held and fed Liam his afternoon bottle, engaged warmly with soft rattle toy, and sang soothing lullabies. Positive transition at handoff.",
        "follow_up_needed": 0,
        "follow_up_notes": "",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 0,
        "dcf_draft_text": "",
        "communication_status": "Sent"
    },
    {
        "id": 1004,
        "child_id": 202,  # CH-202 Emma Vance (Toddler, 3 yrs)
        "category": "medical",
        "sub_type": "Pediatric Checkup",
        "title": "3-Year Well-Child Checkup & Dr. Dynasaur Enrollment",
        "event_date": "2026-03-10",
        "location": "Community Health Center",
        "participants": "Eleanor Vance (Grandparent), Emma Vance, Dr. Thorne",
        "summary": "3-year pediatric physical completed. Growth trajectory healthy (60th percentile). Dr. Dynasaur healthcare coverage verified active. Fluoride varnish applied.",
        "follow_up_needed": 0,
        "follow_up_notes": "Annual dental cleaning scheduled for October.",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 1,
        "dcf_draft_text": "Kinship Health Update: Emma Vance (CH-202) completed 3-year pediatric physical. Health record uploaded.",
        "communication_status": "Sent"
    },
    {
        "id": 1005,
        "child_id": 202,
        "category": "case",
        "sub_type": "Kinship Support",
        "title": "$350 Emergency Family Support Grant & Reach Up Disbursed",
        "event_date": "2026-03-18",
        "location": "DCF District Office",
        "participants": "Eleanor Vance, Kinship Specialist Sarah M.",
        "summary": "Received $350 emergency family support fund check for toddler car seat and clothing essentials. Reach Up child-only financial stipend confirmed active.",
        "follow_up_needed": 0,
        "follow_up_notes": "",
        "follow_up_due_date": "",
        "severity": "Important",
        "dcf_draft_generated": 0,
        "dcf_draft_text": "",
        "communication_status": "Logged"
    },
    {
        "id": 1006,
        "child_id": 202,
        "category": "education",
        "sub_type": "Early Learning",
        "title": "Head Start Preschool Playgroup Enrollment",
        "event_date": "2026-04-05",
        "location": "Valley Early Learning Center",
        "participants": "Eleanor Vance, Emma Vance, Teacher Brenda",
        "summary": "Emma attended first morning playgroup session. Interacted enthusiastically in music circle and building blocks corner.",
        "follow_up_needed": 0,
        "follow_up_notes": "",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 0,
        "dcf_draft_text": "",
        "communication_status": "Logged"
    },
    {
        "id": 1007,
        "child_id": 201,
        "category": "mileage",
        "sub_type": "State Mileage Reimbursement",
        "title": "FS-334B Mileage Claim: Easterseals & Clinic ($184.20)",
        "event_date": "2026-04-10",
        "location": "DCF District 5 Route",
        "participants": "Sarah Jenkins",
        "summary": "Monthly travel log for medical clinic and family time visits. 288 cumulative monthly miles logged. State form FS-334B compiled for $184.20 reimbursement.",
        "follow_up_needed": 0,
        "follow_up_notes": "Form ready for 1-click submission.",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 1,
        "dcf_draft_text": "FS-334B Mileage Claim compiled for Sarah Jenkins: 288 miles ($184.20).",
        "communication_status": "Ready"
    },
    {
        "id": 1008,
        "child_id": 201,
        "category": "therapy",
        "sub_type": "Early Intervention",
        "title": "Pediatric Sensory & Motor Development Consultation",
        "event_date": "2026-04-12",
        "location": "Maple Ridge Home",
        "participants": "Sarah Jenkins, Liam Brooks, OT Specialist Marcus W.",
        "summary": "In-home early intervention occupational therapy session. Liam demonstrated improved prone head lift and bilateral grasping. Caregiver provided sensory soothing techniques.",
        "follow_up_needed": 0,
        "follow_up_notes": "Next monthly home session set for May 14.",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 1,
        "dcf_draft_text": "Early intervention OT session completed for Liam Brooks with positive milestones.",
        "communication_status": "Sent"
    },
    {
        "id": 1009,
        "child_id": 201,
        "category": "case",
        "sub_type": "Worker Home Visit",
        "title": "Monthly DCF Family Services Worker Home Visit",
        "event_date": "2026-04-14",
        "location": "Maple Ridge Home",
        "participants": "Sarah Jenkins, Liam Brooks, Family Services Worker Amanda P.",
        "summary": "Monthly statutory casework visit. Walkthrough of infant nursery completed; safe sleep standards verified. Discussion of reunification roadmap and upcoming joint team meeting.",
        "follow_up_needed": 0,
        "follow_up_notes": "Court progress summary due in 3 weeks.",
        "follow_up_due_date": "",
        "severity": "Routine",
        "dcf_draft_generated": 1,
        "dcf_draft_text": "DCF Monthly Caseworker Home Visit documented. Sleeping area and routine compliant.",
        "communication_status": "Logged"
    }
]

# ==============================================================================
# 8. SYNTHETIC FS-221A LICENSING & COMPLIANCE ITEMS (By Household Stage)
# ==============================================================================
# Day 1 Initial Licensing & Safety Milestones (Dataset A - Uncompleted / Initial Placement Triage)
SAMPLE_COMPLIANCE_DAY_ONE = {
    "HH-101": [
        {"id": 101, "standard_code": "FS-221A § 4.1", "item_name": "Initial Fire Safety & Two-Exit Evacuation Plan", "category": "Safety", "status": "Pending Schedule", "due_date": "Within 30 Days", "completed_date": "", "notes": "Must be scheduled and tested with placed child."},
        {"id": 102, "standard_code": "FS-221A § 6.2", "item_name": "VCWTP Annual Caregiver Training (15 Hours)", "category": "Training", "status": "Not Started", "due_date": "Year 1 Deadline", "completed_date": "", "notes": "0 of 15 required foundational hours completed."},
        {"id": 103, "standard_code": "FS-221A § 1.1", "item_name": "Emergency Worker & Pediatrician Contact Card", "category": "Safety", "status": "In Progress", "due_date": "Day 1 Triage", "completed_date": "", "notes": "Post DCF after-hours numbers and clinic on refrigerator."}
    ],
    "HH-113": [
        {"id": 104, "standard_code": "FS-221A § 1.2", "item_name": "Provisional Kinship Home Safety Walkthrough", "category": "Provisional", "status": "In Progress", "due_date": "Within 48 Hours", "completed_date": "", "notes": "Emergency safety checklist with family services worker."},
        {"id": 105, "standard_code": "FS-221A § 2.1", "item_name": "Kinship Adult Background & Fingerprint Deadline", "category": "Licensing", "status": "Pending", "due_date": "Within 90 Days", "completed_date": "", "notes": "VCIC and FBI fingerprint cards submitted."}
    ],
    "DEFAULT": [
        {"id": 106, "standard_code": "FS-221A § 1.1", "item_name": "Initial Placement Safety & First Aid Kit Triage", "category": "Safety", "status": "In Progress", "due_date": "Within 7 Days", "completed_date": "", "notes": "Review first aid kit and emergency medications."},
        {"id": 107, "standard_code": "FS-221A § 6.0", "item_name": "VCWTP Foundational Pre-Service Orientation", "category": "Training", "status": "Not Started", "due_date": "Within 60 Days", "completed_date": "", "notes": "Enroll in Vermont Child Welfare Training Partnership modules."}
    ]
}

SAMPLE_COMPLIANCE = {
    "HH-101": [
        {"id": 1, "standard_code": "FS-221A § 4.1", "item_name": "Annual Fire Safety & Evacuation Plan Drill", "category": "Safety", "status": "Completed", "due_date": "2026-09-01", "completed_date": "2026-03-01", "notes": "Two-exit escape route tested with child."},
        {"id": 2, "standard_code": "FS-221A § 6.2", "item_name": "VCWTP Annual Caregiver Training (15 Hours)", "category": "Training", "status": "In Progress", "due_date": "2026-10-15", "completed_date": "", "notes": "9 of 15 required hours completed."},
        {"id": 3, "standard_code": "FS-221A § 3.5", "item_name": "Annual Well-Water Potability Testing", "category": "Environmental", "status": "Completed", "due_date": "2026-05-01", "completed_date": "2026-02-14", "notes": "Vermont Department of Health certified clear."}
    ],
    "HH-108": [
        {"id": 4, "standard_code": "FS-221A § 1.2", "item_name": "Provisional Kinship Home Safety Inspection", "category": "Provisional", "status": "In Progress", "due_date": "2026-05-15", "completed_date": "", "notes": "Initial walk-through checklist pending worker signature."},
        {"id": 5, "standard_code": "FS-221A § 2.1", "item_name": "Household Member Background & Fingerprint Check", "category": "Licensing", "status": "Completed", "due_date": "2026-04-10", "completed_date": "2026-03-12", "notes": "FBI and VCIC clearance received for both adults."}
    ],
    "HH-103": [
        {"id": 6, "standard_code": "FS-221A § 8.0", "item_name": "Adoption Home Study Update & Recommendation", "category": "Adoption", "status": "Completed", "due_date": "2026-04-01", "completed_date": "2026-03-20", "notes": "Full adoption favorable recommendation filed with court."}
    ],
    "DEFAULT": [
        {"id": 10, "standard_code": "FS-221A § 4.1", "item_name": "Home Safety & First Aid Kit Inspection", "category": "Safety", "status": "Completed", "due_date": "2026-12-31", "completed_date": "2026-01-15", "notes": "Inspected and stocked."},
        {"id": 11, "standard_code": "FS-221A § 6.0", "item_name": "VCWTP Ongoing Training Hours", "category": "Training", "status": "In Progress", "due_date": "2026-11-30", "completed_date": "", "notes": "Regular course credits ongoing."}
    ]
}

# ==============================================================================
# VALIDATION & DENORMALIZED COMPOSITE MATRIX GENERATOR
# ==============================================================================
def get_validation_matrix():
    """
    Generates the cross-entity matrix demonstrating how each household coexists with:
    Household + Relationship Structure + Licenses + Capabilities + Current Placements
    """
    matrix = []
    for h in HOUSEHOLDS:
        hid = h["HouseholdID"]

        # Adult members & structure
        members = [m for m in ADULT_MEMBERS if m["HouseholdID"] == hid]
        structure = members[0]["RelationshipCategory"] if members else "None"
        caregivers = " & ".join([f"{m['Name']} ({m['Role']})" for m in members])

        # Active Licenses
        hh_licenses = [l["LicenseType"] for l in LICENSES if l["HouseholdID"] == hid and l["Status"] != "Closed Home"]

        # Capabilities
        hh_cap = next((c for c in CAPABILITIES if c["HouseholdID"] == hid), None)
        cap_summary = []
        if hh_cap:
            if hh_cap["AgeGroups"]:
                cap_summary.append("Ages: " + ", ".join(hh_cap["AgeGroups"]))
            if hh_cap["ServiceCapacities"]:
                cap_summary.append("Services: " + ", ".join(hh_cap["ServiceCapacities"]))
        cap_str = " | ".join(cap_summary) if cap_summary else "No active capacity"

        # Placements in household
        hh_placements = [p for p in PLACEMENTS if p["HouseholdID"] == hid]
        pl_details = []
        for p in hh_placements:
            ch = next((c for c in CHILDREN if c["ChildID"] == p["ChildID"]), None)
            if ch:
                pl_details.append({
                    "ChildID": ch["ChildID"],
                    "Initials": ch["Initials"],
                    "Age": ch["Age"],
                    "AgeBracket": ch["AgeBracket"],
                    "PlacementType": p["PlacementType"],
                    "Programs": ", ".join(p["ProgramParticipation"]),
                    "PermanencyGoal": ch["PermanencyGoal"],
                    "SpecialScenario": p["SpecialScenario"]
                })

        matrix.append({
            "HouseholdID": hid,
            "HouseholdName": h["HouseholdName"],
            "Address": h["Address"],
            "Capacity": h["Capacity"],
            "OccupiedBeds": h["OccupiedBeds"],
            "OpenBeds": h["OpenBeds"],
            # Caregiver Journey Model
            "HouseholdStructure": h.get("HouseholdStructure", structure),
            "CaregiverStage": h.get("CaregiverStage", "Established (1-3 Years)"),
            "Approvals": h.get("Approvals", hh_licenses),
            "YearsWorkingWithDCF": h.get("YearsWorkingWithDCF", 0.0),
            "PlacementsCompleted": h.get("PlacementsCompleted", 0),
            "AdoptionFinalizations": h.get("AdoptionFinalizations", 0),
            "SpecialCertifications": h.get("SpecialCertifications", []),
            "Caregivers": caregivers,
            "Licenses": hh_licenses if hh_licenses else ["Closed Home"],
            "Capabilities": cap_str,
            "Placements": pl_details
        })
    return matrix


def get_capacity_report():
    total_capacity = sum(h["Capacity"] for h in HOUSEHOLDS)
    occupied_beds = sum(h["OccupiedBeds"] for h in HOUSEHOLDS)
    open_beds = sum(h["OpenBeds"] for h in HOUSEHOLDS)
    occupancy_rate = round((occupied_beds / total_capacity * 100), 1) if total_capacity else 0
    return {
        "TotalHouseholds": len(HOUSEHOLDS),
        "TotalCapacity": total_capacity,
        "OccupiedBeds": occupied_beds,
        "OpenBeds": open_beds,
        "OccupancyRate": f"{occupancy_rate}%"
    }


def get_licensing_summary():
    counts = {}
    for l in LICENSES:
        t = f"{l['LicenseType']} ({l['Status']})"
        counts[t] = counts.get(t, 0) + 1
    return counts


def get_placement_type_summary():
    counts = {}
    for p in PLACEMENTS:
        pt = p["PlacementType"]
        counts[pt] = counts.get(pt, 0) + 1
    return counts


def get_program_participation_summary():
    counts = {}
    for p in PLACEMENTS:
        for prog in p["ProgramParticipation"]:
            counts[prog] = counts.get(prog, 0) + 1
    return counts


def get_permanency_goal_summary():
    counts = {}
    for c in CHILDREN:
        pg = c["PermanencyGoal"]
        counts[pg] = counts.get(pg, 0) + 1
    return counts
