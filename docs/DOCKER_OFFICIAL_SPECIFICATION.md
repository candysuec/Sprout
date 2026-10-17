# Sprout KinCare OS: Official Docker & Infrastructure Specification

**Initiative:** Sprout  
**System:** KinCare OS — Vermont Kinship & Placement Command Center  
**Status:** Canonical & Operational  
**Port:** `5858`  
**Container:** `sprout-app`  
**Image:** `sprout-app:canonical`  

---

## 1. Overview & Architecture

Sprout is containerized using Docker inside WSL2 (Ubuntu 24.04 LTS), providing complete environment isolation, zero port collisions, high-performance ext4 Linux SQLite database access, and 100% offline operational capability.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HOST ENVIRONMENT (WSL2 UBUNTU)                        │
│                                                                             │
│  Project Root: /home/gemi/projects/Sprout                                   │
│  UNC Path:     \\wsl.localhost\Ubuntu\home\gemi\projects\Sprout             │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     DOCKER CONTAINER: sprout-app                      │  │
│  │                                                                       │  │
│  │  • Image: sprout-app:canonical (Python 3.11-slim)                     │  │
│  │  • Process: python app/server.py                                      │  │
│  │  • Internal Port: 5858 -> Host Port: 5858                             │  │
│  │  • Volumes:                                                           │  │
│  │      - /home/gemi/projects/Sprout -> /home/gemi/projects/Sprout (bind)│  │
│  │      - sprout-data -> /data (external named volume for live DB)       │  │
│  │      - /home/gemi/projects/Sprout/shared_docs -> /shared_docs (ro)    │  │
│  │                                                                       │  │
│  │  • Healthcheck: curl -f http://127.0.0.1:5858/ || exit 1             │  │
│  │  • Restart Policy: unless-stopped                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      ▲                                      │
│                                      │ (HTTP Port 5858)                     │
│                                      ▼                                      │
│  Windows Desktop Browser: http://127.0.0.1:5858/                            │
│  Desktop Launcher: C:\Users\candy\Desktop\Sprout.lnk                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Container Configuration Specifications

| Parameter | Specification | Notes |
| :--- | :--- | :--- |
| **Container Name** | `sprout-app` | Unique container identifier |
| **Image Tag** | `sprout-app:canonical` | Built from local `Dockerfile` |
| **Base OS** | Debian GNU/Linux 12 (bookworm) / Python 3.11-slim | Lightweight, security-hardened |
| **Working Directory** | `/home/gemi/projects/Sprout` | Matches host project path for deterministic tooling |
| **Entrypoint Command** | `python app/server.py` | Starts WSGI Bottle HTTP server |
| **Host Port Mapping** | `5858:5858` | Avoids common port collisions (8080, 8081, 5000) |
| **Binding Address** | `0.0.0.0:5858` | Binds to all interfaces inside container, accessible from `127.0.0.1` |
| **Restart Policy** | `unless-stopped` | Auto-restarts on Docker daemon reboot |
| **Healthcheck Interval** | 30s | Probes root HTML `GET /` with 10s timeout, 3 retries |

---

## 3. Storage & Volume Mounts

1. **Host Project Bind Mount (`/home/gemi/projects/Sprout`):**
   - Mounts the full code tree into the container.
   - Code edits in `app/server.py`, `app/db.py`, `app/static/app.js`, and `app/static/index.html` take effect immediately or upon lightweight server reload.
2. **Persistent Named Volume (`sprout-data`):**
   - Mounts to `/data`.
   - Houses the canonical production SQLite database (`/data/foster_binder.db`) and automated backups, completely insulated from OneDrive file locking.
3. **Shared Documents Mount (`/shared_docs`):**
   - Read-only mount of Vermont DCF official forms, FS-221A licensing checklists, and safety templates.

---

## 4. Operational CLI Commands Runbook

### Check Status & Health
```bash
# Verify container is running and healthy
docker ps --filter "name=sprout-app"

# View live container logs
docker logs --tail 50 -f sprout-app
```

### Starting & Stopping
```bash
# Start container
docker start sprout-app

# Stop container cleanly
docker stop sprout-app

# Restart container after server code updates
docker restart sprout-app
```

### Running Test Suites in Container
```bash
# Run all 8 verification suites (261 tests, 100% pass)
docker exec sprout-app bash -c "python test_household_members.py && python test_guided_onboarding.py && python test_trainer_two_datasets.py && python test_operational_readiness.py && python test_e2e_flows.py && python test_browser_determinism.py && python test_phase13b_governance.py && python test_parent_workspace_integration.py"

# Run individual test suite
docker exec sprout-app python test_household_members.py
```

### Interactive Shell
```bash
# Open interactive bash terminal inside container
docker exec -it sprout-app bash
```

---

## 5. Port Collision & Network Guard

The desktop launch script (`Launch_Sprout.bat`) includes an automated port detector:
- Checks if port `5858` is occupied by an unmanaged process.
- Verifies Docker is active and `sprout-app` is healthy.
- Opens default Windows browser to `http://127.0.0.1:5858`.
