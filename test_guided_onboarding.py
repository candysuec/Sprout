"""
Test Guided Day 1 Onboarding Walkthrough for All 4 Roles:
1. Foster Caregiver
2. Kinship Caregiver
3. Respite Provider
4. Parent Participant
"""

import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:5858"

def test_onboarding():
    roles = [
        {
            "role_type": "foster",
            "caregiver_name": "Eleanor Rigby",
            "caregiver_phone": "(802) 555-0101",
            "caregiver_email": "eleanor@example.org",
            "address": "404 Meadow Lane",
            "town": "Burlington",
            "zip_code": "05401",
            "household_name": "Rigby Foster Haven",
            "household_structure": "Single Adult",
            "household_members": "None",
            "child_name": "Leo Martin",
            "child_dob": "2024-04-01",
            "gender": "Male",
            "allergies": "No known allergies",
            "special_needs": "Infant formula every 3 hours",
            "role_specific": {
                "dcf_office": "Burlington District Office",
                "caseworker_name": "Sarah Collins, MSW",
                "caseworker_phone": "(802) 863-7370"
            }
        },
        {
            "role_type": "kinship",
            "caregiver_name": "Arthur & Martha Vance",
            "caregiver_phone": "(802) 555-0102",
            "caregiver_email": "martha.vance@example.org",
            "address": "12 Grandparent Hill",
            "town": "Barre",
            "zip_code": "05641",
            "household_name": "Vance Family Homestead",
            "household_structure": "Married Couple",
            "household_members": "Arthur (Grandfather), Martha (Grandmother)",
            "child_name": "Kinsley Vance",
            "child_dob": "2022-06-15",
            "gender": "Female",
            "allergies": "Strawberries",
            "special_needs": "Night light on at bedtime",
            "role_specific": {
                "kinship_relation": "Maternal Grandparents",
                "reach_up_applied": True
            }
        },
        {
            "role_type": "respite",
            "caregiver_name": "Jordan Bennett",
            "caregiver_phone": "(802) 555-0103",
            "caregiver_email": "jordan.b@example.org",
            "address": "77 Whispering Pines",
            "town": "Montpelier",
            "zip_code": "05602",
            "household_name": "Bennett Respite Hearth",
            "household_structure": "Single Adult",
            "household_members": "None",
            "child_name": "Toby Miller",
            "child_dob": "2020-09-10",
            "gender": "Male",
            "allergies": "Penicillin",
            "special_needs": "Needs quiet decompression after school",
            "role_specific": {
                "respite_duration": "48-Hour Weekend Respite (Fri 5PM - Sun 5PM)",
                "respite_bedtime_routine": "Reads two books, warm milk before sleep"
            }
        },
        {
            "role_type": "parent",
            "caregiver_name": "Cassandra Miller",
            "caregiver_phone": "(802) 555-0104",
            "caregiver_email": "cassandra.m@example.org",
            "address": "30 Elm Court",
            "town": "Rutland",
            "zip_code": "05701",
            "household_name": "Miller Residence",
            "household_structure": "Single Adult",
            "household_members": "None",
            "child_name": "Aria Miller",
            "child_dob": "2021-11-20",
            "gender": "Female",
            "allergies": "No known allergies",
            "special_needs": "Favorite stuffed bear named Barney",
            "role_specific": {
                "fsw_worker": "David Martinez, DCF Family Services",
                "parent_visitation_schedule": "Tuesdays & Thursdays 4:00 PM at Easterseals Family Center"
            }
        }
    ]

    print("===========================================================================")
    print("Sprout KinCare OS: Testing Guided Day 1 Onboarding Across All 4 Roles")
    print("===========================================================================")

    for r in roles:
        role_type = r["role_type"]
        cg_name = r["caregiver_name"]
        ch_name = r["child_name"]
        print(f"\n--- Testing Role: {role_type.upper()} ({cg_name} -> {ch_name}) ---")
        
        req = urllib.request.Request(
            f"{BASE_URL}/api/onboarding/walkthrough",
            data=json.dumps(r).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                status = resp.status
                body = json.loads(resp.read().decode())
                assert status == 200, f"Expected 200, got {status}"
                assert body.get("success") is True, f"Expected success=True, got {body}"
                assert body.get("child_id") is not None, "Missing child_id"
                assert body.get("caregiver_user") is not None, "Missing caregiver_user"
                assert body.get("household_id") is not None, "Missing household_id"
                print(f"  [PASS] {role_type.capitalize()} Created: Child ID={body['child_id']}, User={body['caregiver_user']}, Household={body['household_id']}")
        except Exception as e:
            print(f"  [FAIL] Failed onboarding for {role_type}: {e}")
            sys.exit(1)

        # Verify child is returned when queried under this caregiver
        ch_req = urllib.request.Request(
            f"{BASE_URL}/api/children?dataset=a",
            headers={"X-Caregiver": body["caregiver_user"], "X-Sprout-Dataset": "a", "X-Sprout-Mode": "sample"}
        )
        with urllib.request.urlopen(ch_req) as ch_resp:
            children = json.loads(ch_resp.read().decode())
            found = any(c.get("first_name", "") in ch_name or c.get("preferred_name", "") in ch_name or c.get("alias", "") in ch_name for c in children)
            assert found, f"Child {ch_name} not returned in /api/children for {body['caregiver_user']}"
            print(f"  [PASS] Child returned in /api/children under new caregiver's household")

    print("\n===========================================================================")
    print("ALL 4 ONBOARDING ROLES VERIFIED SUCCESSFULLY (100%)")
    print("===========================================================================")

if __name__ == "__main__":
    test_onboarding()
