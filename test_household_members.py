"""
Automated Verification Suite: Household Members Management
Sprout / KinCare OS

Validates:
1. GET /api/households/<id>/members (Local DB default members: Candy, Mallory, Robin)
2. POST /api/households/<id>/members (Add new adult, caregiver, or child resident)
3. Member verification in database and response payload
4. DELETE /api/households/<id>/members/<id> (Remove member from household)
5. Zero side-effects and schema invariance (PRAGMA user_version == 7)
6. Sample dataset household members routing and dynamic manipulation
"""

import os
import sys
import io
import json
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(BASE_DIR, "app")
sys.path.insert(0, APP_DIR)

import db
import server

passed = 0
total = 0

def assert_test(name, condition, extra=""):
    global passed, total
    total += 1
    if condition:
        passed += 1
        print(f"  [PASS] {name}")
    else:
        print(f"  [FAIL] {name}: {extra}")
        raise AssertionError(f"Test failed: {name} -> {extra}")

def simulate_request(method, path, headers=None, body=None):
    headers = headers or {}
    env = {
        "PATH_INFO": path.split("?")[0],
        "QUERY_STRING": path.split("?")[1] if "?" in path else "",
        "REQUEST_METHOD": method,
        "wsgi.url_scheme": "http",
        "SERVER_NAME": "127.0.0.1",
        "SERVER_PORT": "5858",
        "HTTP_HOST": "127.0.0.1:5858",
        "HTTP_ORIGIN": "http://127.0.0.1:5858",
        "wsgi.errors": io.StringIO(),
    }
    for k, v in headers.items():
        env_key = "HTTP_" + k.upper().replace("-", "_")
        env[env_key] = v

    if body is not None:
        if isinstance(body, dict):
            body_bytes = json.dumps(body).encode("utf-8")
            env["CONTENT_TYPE"] = "application/json"
        elif isinstance(body, str):
            body_bytes = body.encode("utf-8")
        else:
            body_bytes = body
        env["CONTENT_LENGTH"] = str(len(body_bytes))
        env["wsgi.input"] = io.BytesIO(body_bytes)
    else:
        env["CONTENT_LENGTH"] = "0"
        env["wsgi.input"] = io.BytesIO(b"")

    status_capture = {}
    headers_capture = {}

    def start_response(status, response_headers, exc_info=None):
        status_capture["status"] = status
        headers_capture["headers"] = dict(response_headers)

    resp_iter = server.app(env, start_response)
    resp_body = b"".join(resp_iter).decode("utf-8")
    status_code = int(status_capture["status"].split(" ")[0])
    return status_code, resp_body

def run_suite():
    print("=" * 75)
    print("Sprout KinCare OS: Household Members Management Verification Suite")
    print("=" * 75)

    print("\n--- 1. Testing Default Local Household Members (Household 1) ---")
    status, body = simulate_request("GET", "/api/households/1/members")
    assert_test("GET /api/households/1/members HTTP 200", status == 200, f"Status: {status}")
    members = json.loads(body)
    assert_test("Members list returned", isinstance(members, list))
    assert_test("Contains at least 3 baseline members", len(members) >= 3, f"Count: {len(members)}")
    
    names = [m["name"] for m in members]
    assert_test("Candy Chevalier present", any("Candy" in n for n in names))
    assert_test("Mallory Wheeler present", any("Mallory" in n for n in names))
    assert_test("Robin D. present", any("Robin" in n for n in names))

    print("\n--- 2. Testing Adding New Household Member (POST /api/households/1/members) ---")
    new_member_payload = {
        "name": "Arthur Vance",
        "role": "Secondary Caregiver",
        "relationship": "Spouse / Partner",
        "age": 56,
        "notes": "Co-caregiver approved by DCF"
    }
    status, body = simulate_request("POST", "/api/households/1/members", body=new_member_payload)
    assert_test("POST /api/households/1/members HTTP 200", status == 200, f"Status: {status}")
    added_member = json.loads(body)
    assert_test("Added member has ID", "id" in added_member and added_member["id"] is not None)
    assert_test("Added member name is Arthur Vance", added_member["name"] == "Arthur Vance")
    assert_test("Added member role matches", added_member["role"] == "Secondary Caregiver")
    member_id = added_member["id"]

    print("\n--- 3. Testing Member Retrieval After Insertion ---")
    status, body = simulate_request("GET", "/api/households/1/members")
    assert_test("GET HTTP 200 after POST", status == 200)
    current_members = json.loads(body)
    found = any(m["id"] == member_id and m["name"] == "Arthur Vance" for m in current_members)
    assert_test("New member Arthur Vance found in listing", found)

    print("\n--- 4. Testing Removing Household Member (DELETE /api/households/1/members/<id>) ---")
    status, body = simulate_request("DELETE", f"/api/households/1/members/{member_id}")
    assert_test("DELETE /api/households/1/members/<id> HTTP 200", status == 200, f"Status: {status}")
    delete_resp = json.loads(body)
    assert_test("Delete response success is true", delete_resp.get("success") is True)

    status, body = simulate_request("GET", "/api/households/1/members")
    members_after_del = json.loads(body)
    not_found = not any(m["id"] == member_id for m in members_after_del)
    assert_test("Member Arthur Vance no longer present after delete", not_found)

    print("\n--- 5. Testing Sample Dataset Household Members (Household 101) ---")
    sample_headers = {"Cookie": "sproutMode=sample"}
    status, body = simulate_request("GET", "/api/households/101/members", headers=sample_headers)
    assert_test("GET /api/households/101/members HTTP 200 in sample mode", status == 200)
    sample_members = json.loads(body)
    assert_test("Sample members returned", isinstance(sample_members, list))

    print("\n--- 6. Verifying Database Schema Invariant (user_version == 7) ---")
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("PRAGMA user_version")
        ver = cursor.fetchone()[0]
        assert_test("PRAGMA user_version is strictly 7 (Zero drift)", ver == 7, f"Version: {ver}")

    print("\n" + "=" * 75)
    print(f"HOUSEHOLD MEMBERS VERIFICATION COMPLETE: {passed}/{total} TESTS PASSED (100%)")
    print("=" * 75)

if __name__ == "__main__":
    run_suite()
