"""
Sprout / KinCare OS: Automated Parent Workspace Integration Verification
Validates the 5 Benchmark Parent Lifecycle Scenarios:
1. Scenario 1: New Case Parent (Danielle Miller - Provisional Access)
2. Scenario 2: Actively Engaged Parent (Angela Davis - 75%+ Complete, Check-in, Evidence)
3. Scenario 3: Restricted Parent (Jason Vance - High-Conflict Safety, Location Masking, Date Quantization)
4. Scenario 4: Near Reunification Parent (Care & Safety Handoff)
5. Scenario 5: Emergency Revocation / Revoked Parent (Fail-Closed Safety Gate)
"""

import os
import sys
import io
import json

# Setup paths
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
        print(f"  [FAIL] {name} {extra}")
        raise AssertionError(f"Test failed: {name} {extra}")


def wsgi_request(path, method="GET", headers=None, body=None):
    """Executes a synchronous request directly against the Bottle WSGI application."""
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


def run_parent_integration_suite():
    print("=" * 75)
    print("Sprout KinCare OS: Parent Workspace Integration Verification Suite")
    print("=" * 75)

    # Ensure database is initialized
    db.init_db()

    # =========================================================================
    # SCENARIO 1: New Case Parent (Danielle Miller - Provisional Access)
    # =========================================================================
    print("\n--- 1. Testing Scenario 1: New Case Parent (Provisional Access) ---")
    headers_s1 = {"X-Caregiver": "Danielle Miller", "X-Role": "PP", "X-Sprout-Mode": "sample"}

    code, status_s1 = wsgi_request("/api/parent/status?child_id=1", headers=headers_s1)
    assert_test("S1 Status: HTTP 200 OK returned", code == 200)
    assert_test("S1 Status: State is PROVISIONAL_ACCESS", status_s1.get("state") == "PROVISIONAL_ACCESS")
    assert_test("S1 Status: Linked to child", status_s1.get("linked") is True)

    code, goals_s1 = wsgi_request("/api/parent/goals?child_id=1", headers=headers_s1)
    assert_test("S1 Goals: HTTP 200 OK returned", code == 200)
    assert_test("S1 Goals: Goals returned for parent roadmap", len(goals_s1) >= 3)

    code, feed_s1 = wsgi_request("/api/parent/feed?child_id=1", headers=headers_s1)
    assert_test("S1 Feed: HTTP 200 OK returned", code == 200)
    assert_test("S1 Feed: Shared family records returned", len(feed_s1) > 0)
    # Check boundary: Parent Participant must NEVER see incident or private records
    assert_test("S1 Isolation: Zero incident records leaked to Parent", 
                all(f.get("classification") == "shared_family" for f in feed_s1))

    # =========================================================================
    # SCENARIO 2: Actively Engaged Parent (Angela Davis - 75%+ Progress)
    # =========================================================================
    print("\n--- 2. Testing Scenario 2: Actively Engaged Parent (Angela Davis) ---")
    headers_s2 = {"X-Caregiver": "Angela Davis", "X-Role": "PP", "X-Sprout-Mode": "sample"}

    code, status_s2 = wsgi_request("/api/parent/status?child_id=1", headers=headers_s2)
    assert_test("S2 Status: State is ACTIVE_ENGAGED", status_s2.get("state") == "ACTIVE_ENGAGED")

    code, goals_s2 = wsgi_request("/api/parent/goals?child_id=1", headers=headers_s2)
    completed_count = sum(1 for g in goals_s2 if g.get("status") == "Completed" or (g.get("progress") or 0) >= 100)
    progress_pct = (completed_count / len(goals_s2)) * 100
    assert_test("S2 Goals: Progress >= 75%", progress_pct >= 75.0)

    code, evidence_s2 = wsgi_request("/api/parent/evidence?child_id=1", headers=headers_s2)
    assert_test("S2 Evidence: HTTP 200 OK returned", code == 200)
    assert_test("S2 Evidence: Verified certificates present", any(e.get("verified") == 1 for e in evidence_s2))

    # Test 1-Tap Check-In POST
    code, checkin_post = wsgi_request("/api/parent/checkin", method="POST", headers=headers_s2, 
                                      body={"child_id": 1, "notes": "On-time arrival"})
    assert_test("S2 Check-In POST: HTTP 200 OK", code == 200)
    assert_test("S2 Check-In POST: Status is Checked In", checkin_post.get("status") == "Checked In")

    # Test Check-In GET
    code, checkin_get = wsgi_request("/api/parent/checkin?child_id=1", headers=headers_s2)
    assert_test("S2 Check-In GET: 100% on-time record verified", checkin_get.get("attendance_rate") == "100%")

    # =========================================================================
    # SCENARIO 3: Restricted Parent (Jason Vance - High Conflict Safety)
    # =========================================================================
    print("\n--- 3. Testing Scenario 3: Restricted Parent (High Conflict Safety) ---")
    headers_s3 = {"X-Caregiver": "Jason Vance", "X-Role": "PP", "X-Sprout-Mode": "sample", "X-High-Conflict": "1"}

    code, status_s3 = wsgi_request("/api/parent/status?child_id=2", headers=headers_s3)
    assert_test("S3 Status: State is RESTRICTED_ACCESS", status_s3.get("state") == "RESTRICTED_ACCESS")
    assert_test("S3 Status: is_high_conflict is True", status_s3.get("is_high_conflict") is True)

    code, checkin_s3 = wsgi_request("/api/parent/checkin?child_id=2", headers=headers_s3)
    assert_test("S3 Safety: Visit location masked to Confidential Site", 
                "Confidential Site" in checkin_s3.get("location", ""))

    code, feed_s3 = wsgi_request("/api/parent/feed?child_id=2", headers=headers_s3)
    assert_test("S3 Safety: Feed event locations masked", 
                any("Confidential Site" in f.get("location", "") for f in feed_s3))
    assert_test("S3 Safety: Timestamps quantized to date-only (length <= 10)", 
                all(len(str(f.get("event_date", ""))) <= 10 for f in feed_s3))

    # =========================================================================
    # SCENARIO 4: Near Reunification Parent (Care & Safety Handoff)
    # =========================================================================
    print("\n--- 4. Testing Scenario 4: Near Reunification (Care & Safety Handoff) ---")
    headers_s4 = {"X-Caregiver": "Maria Lin", "X-Role": "PP", "X-Sprout-Mode": "sample"}

    # Child handoff routines accessible to parent participant
    code, feed_s4 = wsgi_request("/api/parent/feed?child_id=1", headers=headers_s4)
    # In sample mode without revoked keyword, feed returns shared moments
    assert_test("S4 Handoff: Shared family moments returned", len(feed_s4) > 0)

    # =========================================================================
    # SCENARIO 5: Emergency Revocation / Revoked Parent (Fail-Closed Gate)
    # =========================================================================
    print("\n--- 5. Testing Scenario 5: Emergency Revocation (Fail-Closed Safety Gate) ---")
    headers_pc = {"X-Caregiver": "Candy Chevalier", "X-Role": "PC", "X-Sprout-Mode": "local"}

    # 1. Primary Caregiver triggers emergency revocation
    code, rev_res = wsgi_request("/api/parent/access/revoke", method="POST", headers=headers_pc,
                                 body={"child_id": 1, "reason": "Immediate Safety Lockout"})
    assert_test("S5 Revocation: Primary Caregiver triggers emergency revocation", code == 200)
    assert_test("S5 Revocation: Response confirms state = REVOKED", rev_res.get("state") == "REVOKED")

    # 2. Test Fail-Closed behavior for Revoked Parent
    headers_revoked = {"X-Caregiver": "Revoked Parent", "X-Role": "PP", "X-Sprout-Mode": "local"}

    code, status_rev = wsgi_request("/api/parent/status?child_id=1", headers=headers_revoked)
    assert_test("S5 Gate: Status reports state = REVOKED", status_rev.get("state") == "REVOKED")
    assert_test("S5 Gate: Linked is False", status_rev.get("linked") is False)

    code, feed_rev = wsgi_request("/api/parent/feed?child_id=1", headers=headers_revoked)
    assert_test("S5 Gate: /api/parent/feed returns HTTP 403 Forbidden", code == 403)

    code, goals_rev = wsgi_request("/api/parent/goals?child_id=1", headers=headers_revoked)
    assert_test("S5 Gate: /api/parent/goals returns HTTP 403 Forbidden", code == 403)

    code, evid_rev = wsgi_request("/api/parent/evidence?child_id=1", headers=headers_revoked)
    assert_test("S5 Gate: /api/parent/evidence returns HTTP 403 Forbidden", code == 403)

    code, chk_rev = wsgi_request("/api/parent/checkin?child_id=1", headers=headers_revoked)
    assert_test("S5 Gate: /api/parent/checkin GET returns HTTP 403 Forbidden", code == 403)

    code, chk_post_rev = wsgi_request("/api/parent/checkin", method="POST", headers=headers_revoked, 
                                      body={"child_id": 1, "notes": "Unauthorized attempt"})
    assert_test("S5 Gate: /api/parent/checkin POST returns HTTP 403 Forbidden", code == 403)

    # 3. Clean up DB state (reset parent user to active for future runs)
    conn = db.get_connection()
    conn.execute("UPDATE parent_users SET state = 'ACTIVE_ENGAGED' WHERE child_id = 1")
    conn.execute("UPDATE timeline_records SET retention_state = 'Active' WHERE child_id = 1 AND domain = 'parent'")
    conn.commit()
    conn.close()

    print("\n" + "=" * 75)
    print(f"PARENT WORKSPACE INTEGRATION VERIFICATION COMPLETE: {passed}/{total} TESTS PASSED (100%)")
    print("=" * 75)
    return True

if __name__ == "__main__":
    run_parent_integration_suite()
