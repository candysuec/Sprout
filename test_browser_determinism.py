"""
Automated Verification Suite: Browser Determinism & Zero-Drift Gate
Sprout / KinCare OS

Validates:
1. Normal Browser State: Standard headers and canonical storage.
2. Incognito Browser State: Zero headers, clean initial session.
3. Dirty Browser State: Corrupted modes, deprecated caregivers, invalid datasets, stale child IDs.
4. Deterministic Invariant: All 3 startup states produce IDENTICAL placement-ready operation (0 lockouts, 0 crashes).
5. Cache Invariant: Server strictly enforces no-store, no-cache, and dynamic asset cache-busting.
"""

import os
import sys
import io
import json
import datetime
import re

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
    res_headers = {}
    def start_response(status, response_headers, exc_info=None):
        res_status.append(status)
        for hk, hv in response_headers:
            res_headers[hk.lower()] = hv

    output = b"".join(server.app(env, start_response))
    status_code = int(res_status[0].split()[0])
    try:
        data = json.loads(output.decode("utf-8"))
    except Exception:
        data = output.decode("utf-8")
    return status_code, res_headers, data

def run_browser_determinism_suite():
    global passed, total
    passed = 0
    total = 0

    print("=" * 75)
    print("Sprout KinCare OS: Browser Determinism & Zero-Drift Release Gate")
    print("=" * 75)

    today_str = datetime.date.today().isoformat()

    # --- 1. Cache-Control & Dynamic Asset Busting Invariant ---
    print("\n--- 1. Testing Zero-Browser-Cache & Dynamic Asset Invariant ---")
    code, hdrs, body = simulate_request("GET", "/")
    assert_test("Root HTML: HTTP 200 OK", code == 200)
    assert_test("Root HTML: Cache-Control has 'no-store'", "no-store" in hdrs.get("cache-control", ""))
    assert_test("Root HTML: Pragma is 'no-cache'", hdrs.get("pragma") == "no-cache")
    assert_test("Root HTML: Dynamic app.js timestamp injected", bool(re.search(r'/static/app\.js\?v=\d+', body)))

    code_js, hdrs_js, _ = simulate_request("GET", "/static/app.js")
    assert_test("Static JS: HTTP 200 OK", code_js == 200)
    assert_test("Static JS: Cache-Control has 'no-store'", "no-store" in hdrs_js.get("cache-control", ""))

    # --- 2. State 1: Fresh Incognito Browser (Zero headers / clean session) ---
    print("\n--- 2. Testing State 1: Fresh Incognito Browser (Clean Startup) ---")
    code_inc, _, data_inc = simulate_request("GET", "/api/children", headers={})
    assert_test("Incognito: /api/children HTTP 200 OK", code_inc == 200)
    assert_test("Incognito: Children list not empty", isinstance(data_inc, list) and len(data_inc) >= 1)
    liam_inc = next((c for c in data_inc if c.get("id") == 201 or c.get("alias") == "LB"), None)
    assert_test("Incognito: Resolves canonically to Liam Brooks (LB)", liam_inc is not None)
    assert_test("Incognito: Day 1 placement date matches today", liam_inc.get("placement_date") == today_str)

    # --- 3. State 2: Normal Browser Profile ---
    print("\n--- 3. Testing State 2: Normal Browser Profile (Standard Session) ---")
    normal_headers = {
        "X-Caregiver": "Sarah Jenkins (Sample - Foster)",
        "X-Sprout-Mode": "sample",
        "X-Sprout-Dataset": "a"
    }
    code_norm, _, data_norm = simulate_request("GET", "/api/children", headers=normal_headers)
    assert_test("Normal: /api/children HTTP 200 OK", code_norm == 200)
    liam_norm = next((c for c in data_norm if c.get("id") == 201 or c.get("alias") == "LB"), None)
    assert_test("Normal: Resolves to Liam Brooks (LB)", liam_norm is not None)
    assert_test("Normal: Placement date matches today", liam_norm.get("placement_date") == today_str)

    # --- 4. State 3: Dirty Browser State (Corrupted Storage, Stale Keys, Obsolete Headers) ---
    print("\n--- 4. Testing State 3: Dirty Browser State (Staleness & Corruption) ---")
    dirty_headers = {
        "X-Caregiver": "Obsolete Deprecated Caregiver That No Longer Exists (HH-999)",
        "X-Sprout-Mode": "corrupted_mode_xyz_!@#$",
        "X-Sprout-Dataset": "unknown_dataset_invalid"
    }
    code_dirty, _, data_dirty = simulate_request("GET", "/api/children", headers=dirty_headers)
    assert_test("Dirty State: /api/children self-heals with HTTP 200", code_dirty == 200)
    assert_test("Dirty State: Never locks into empty list", isinstance(data_dirty, list) and len(data_dirty) >= 1)
    liam_dirty = next((c for c in data_dirty if c.get("id") == 201 or c.get("alias") == "LB"), None)
    assert_test("Dirty State: Self-heals to benchmark child Liam Brooks (LB)", liam_dirty is not None)
    assert_test("Dirty State: Self-heals to Day 1 placement date", liam_dirty.get("placement_date") == today_str)

    # Test corrupted child ID in records API
    code_rec_dirty, _, data_rec_dirty = simulate_request("GET", "/api/children/99999/records", headers=dirty_headers)
    assert_test("Dirty Child ID: /api/children/99999/records returns HTTP 200 (Zero 500 crash)", code_rec_dirty == 200)
    assert_test("Dirty Child ID: Returns self-healing fallback record", isinstance(data_rec_dirty, list) and len(data_rec_dirty) >= 1)

    # --- 5. Tri-State Identity Invariant ---
    print("\n--- 5. Verifying Tri-State Identity Invariant ---")
    assert_test("Tri-State Invariant: Incognito child ID == Normal child ID", liam_inc.get("id") == liam_norm.get("id"))
    assert_test("Tri-State Invariant: Dirty child ID == Normal child ID", liam_dirty.get("id") == liam_norm.get("id"))
    assert_test("Tri-State Invariant: Zero dead states across all profiles", all(len(d) > 0 for d in [data_inc, data_norm, data_dirty]))

    print("\n" + "=" * 75)
    print(f"BROWSER DETERMINISM & ZERO-DRIFT VERIFICATION COMPLETE: {passed}/{total} TESTS PASSED (100%)")
    print("=" * 75)

if __name__ == "__main__":
    run_browser_determinism_suite()
