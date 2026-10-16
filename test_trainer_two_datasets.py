"""
Automated Verification Suite: Trainer Validation - Two-Dataset Architecture
Sprout / KinCare OS

Validates:
1. Dataset A (New to Sprout - Day 1 Onboarding): Day 1 placement clocks, clean intake state.
2. Dataset B (90-Day Sprout Users - Established): Rich historical records, full documentation.
3. Reset API (/api/sample-dataset/reset): Wipes transient test records, re-initializes sandboxes.
4. Parent Participant Continuum: Danielle (Provisional), Jason (Restricted), Angela (Active 75%), Maria (Near Reunification 100%).
"""

import os
import sys
import io
import json
import datetime

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
        env["wsgi.input"] = io.BytesIO(b"")

    res_status = []
    def start_response(status, response_headers, exc_info=None):
        res_status.append(status)

    output = b"".join(server.app(env, start_response))
    status_code = int(res_status[0].split()[0])
    try:
        data = json.loads(output.decode("utf-8"))
    except Exception:
        data = output.decode("utf-8")
    return status_code, data

def run_trainer_two_datasets_suite():
    global passed, total
    passed = 0
    total = 0

    print("=" * 75)
    print("Sprout KinCare OS: Trainer Two-Dataset Architecture Verification Suite")
    print("=" * 75)

    today_str = datetime.date.today().isoformat()
    ninety_days_ago = (datetime.date.today() - datetime.timedelta(days=90)).isoformat()

    foster_headers_a = {
        "X-Caregiver": "Sarah Jenkins (Sample - Foster)",
        "X-Sprout-Mode": "sample",
        "X-Sprout-Dataset": "a"
    }

    foster_headers_b = {
        "X-Caregiver": "Sarah Jenkins (Sample - Foster)",
        "X-Sprout-Mode": "sample",
        "X-Sprout-Dataset": "b"
    }

    # --- 1. Dataset A: Day 1 Placement Clocks & Clean States ---
    print("\n--- 1. Testing Dataset A (New to Sprout - Day 1 Onboarding) ---")
    code, data = simulate_request("GET", "/api/children", headers=foster_headers_a)
    assert_test("Dataset A: HTTP 200 OK", code == 200)
    assert_test("Dataset A: Children returned for Sarah Jenkins", isinstance(data, list) and len(data) >= 1)

    liam = next((c for c in data if c.get("alias") == "LB" or c.get("id") == 201), None)
    assert_test("Dataset A: Liam Brooks (LB) present", liam is not None)
    assert_test("Dataset A: Liam placement date is today (Day 1)", liam.get("placement_date") == today_str, f"got {liam.get('placement_date') if liam else None}")
    assert_test("Dataset A: Liam episode status is 'Active Episode (Day 1)'", "Day 1" in str(liam.get("episode_status", "")))

    code, records = simulate_request("GET", "/api/children/201/records", headers=foster_headers_a)
    assert_test("Dataset A Liam Records: HTTP 200 OK", code == 200)
    assert_test("Dataset A Liam Records: Minimal intake state (count <= 2)", len(records) <= 2, f"count={len(records)}")

    # --- 2. Dataset B: Established 90-Day User ---
    print("\n--- 2. Testing Dataset B (90-Day Sprout Users - Established) ---")
    code, data_b = simulate_request("GET", "/api/children", headers=foster_headers_b)
    assert_test("Dataset B: HTTP 200 OK", code == 200)
    liam_b = next((c for c in data_b if c.get("alias") == "LB" or c.get("id") == 201), None)
    assert_test("Dataset B: Liam Brooks present", liam_b is not None)
    assert_test("Dataset B: Liam placement date is 90 days ago", liam_b.get("placement_date") == ninety_days_ago, f"got {liam_b.get('placement_date') if liam_b else None}")

    code, records_b = simulate_request("GET", "/api/children/201/records", headers=foster_headers_b)
    assert_test("Dataset B Liam Records: HTTP 200 OK", code == 200)
    assert_test("Dataset B Liam Records: Rich established history (> 5 records)", len(records_b) > 5, f"count={len(records_b)}")

    # --- 3. Reset Sandbox API ---
    print("\n--- 3. Testing Reset Sandbox API (/api/sample-dataset/reset) ---")
    code, res = simulate_request("POST", "/api/sample-dataset/reset", body={"target": "all"})
    assert_test("Reset API: HTTP 200 OK", code == 200)
    assert_test("Reset API: Status OK", res.get("status") == "ok")

    # --- 4. Parent Participant Continuum Coverage ---
    print("\n--- 4. Testing Parent Participant Continuum Stages ---")
    parents = [
        ("danielle", "PROVISIONAL_ACCESS", 25),
        ("jason", "RESTRICTED_ACCESS", 30),
        ("angela", "ACTIVE_ENGAGED", 75),
        ("maria", "ACTIVE_ENGAGED", 100),
    ]

    for p_id, expected_status, expected_progress in parents:
        code, status_data = simulate_request("GET", f"/api/parent/status?parent_id={p_id}")
        assert_test(f"Parent {p_id.title()}: Status HTTP 200", code == 200)
        assert_test(f"Parent {p_id.title()}: State == {expected_status}", status_data.get("state") == expected_status, f"got {status_data.get('state')}")

        code, goals_data = simulate_request("GET", f"/api/parent/goals?parent_id={p_id}")
        assert_test(f"Parent {p_id.title()}: Goals HTTP 200", code == 200)
        assert_test(f"Parent {p_id.title()}: Goals returned", isinstance(goals_data, list) and len(goals_data) >= 3)
        if p_id == "maria":
            assert_test(f"Parent Maria: 100% Plan Completion on all goals", all(g.get("progress") == 100 for g in goals_data))
        elif p_id == "danielle":
            assert_test(f"Parent Danielle: Intake goals active (25% orientation)", any(g.get("progress") == 25 for g in goals_data))
        elif p_id == "jason":
            assert_test(f"Parent Jason: Restricted goals active", any(g.get("progress") == 30 for g in goals_data))
        elif p_id == "angela":
            assert_test(f"Parent Angela: Engaged goals active", any(g.get("progress") == 83 for g in goals_data))

    print("\n" + "=" * 75)
    print(f"TRAINER TWO-DATASET VERIFICATION COMPLETE: {passed}/{total} TESTS PASSED (100%)")
    print("=" * 75)

if __name__ == "__main__":
    run_trainer_two_datasets_suite()
