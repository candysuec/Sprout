# Sprout KinCare OS: Last Known Good State & Disaster Recovery Runbook

**Initiative:** Sprout  
**System:** KinCare OS — Vermont Kinship & Placement Command Center  
**Status:** Certified Active Recovery Runbook  
**Last Verified State:** October 17, 2026 (Commit `4b91f03`)  
**Test Baseline:** 261 / 261 Automated Tests Passing (100%)  

---

## 1. Authoritative Known-Good Commit Ledger

If any code regression, state corruption, or breaking change occurs, rollback to these certified commits:

| Commit Hash | Branch | Description | Test Pass Rate |
| :--- | :--- | :--- | :--- |
| **`4b91f03`** | `main` / `wsl-main` | **Master Documentation, Governance & Project Board Sync** | **261 / 261 (100%)** |
| **`6632fd6`** | `main` / `wsl-main` | **Screen Recording UX Enhancements & Household Members Engine** | **261 / 261 (100%)** |
| **`9c70f8e`** | `main` / `wsl-main` | Desktop Launcher direct to Training Hub without Sarah Jenkins | 243 / 243 (100%) |
| **`6f8c285`** | `main` / `wsl-main` | High-resolution 3D Sprout seedling icon integration | 243 / 243 (100%) |
| **`a2216be`** | `main` / `wsl-main` | HTML5 History API Back/Forward browser navigation | 243 / 243 (100%) |

---

## 2. Emergency Recovery Runbooks

### Runbook A: Rapid Code Rollback (Git)
If a code change in `app/` introduces regressions or breaks tests:

```bash
# 1. Navigate to canonical project root in WSL
cd /home/gemi/projects/Sprout

# 2. Check current status
git status

# 3. Discard uncommitted dirty working tree changes
git reset --hard HEAD

# 4. If reverting to last certified known good release (6632fd6)
git checkout 6632fd6

# 5. Restart container to pick up restored code
docker restart sprout-app

# 6. Verify full test battery
docker exec sprout-app python test_household_members.py
```

---

### Runbook B: Database Snapshot Restoration & Integrity Check
Sprout uses an immutable migration ledger with `PRAGMA user_version = 7`. If database corruption occurs:

```bash
# 1. Connect to WSL container shell
docker exec -it sprout-app python -c "
import sqlite3
conn = sqlite3.connect('/home/gemi/projects/Sprout/foster_binder.db')
cursor = conn.cursor()
cursor.execute('PRAGMA integrity_check;')
print('Integrity:', cursor.fetchall())
cursor.execute('PRAGMA user_version;')
print('Schema Version:', cursor.fetchone()[0])
conn.close()
"

# 2. If restoring from automated backup snapshot in backups/
# Find the latest verified snapshot:
ls -la /home/gemi/projects/Sprout/backups/

# 3. Restore backup safely:
cp /home/gemi/projects/Sprout/backups/foster_binder_backup_*.db /home/gemi/projects/Sprout/foster_binder.db

# 4. Restart container:
docker restart sprout-app
```

---

### Runbook C: Docker Container Recreation
If the Docker container `sprout-app` becomes unresponsive or network-blocked:

```bash
# 1. Stop and remove stalled container
docker stop sprout-app
docker rm sprout-app

# 2. Re-run container using canonical specifications
docker run -d \
  --name sprout-app \
  -p 5858:5858 \
  -v /home/gemi/projects/Sprout:/home/gemi/projects/Sprout \
  -v sprout-data:/data \
  -w /home/gemi/projects/Sprout \
  --restart unless-stopped \
  sprout-app:canonical

# 3. Confirm health
curl -f http://127.0.0.1:5858/
```

---

### Runbook D: Desktop Launcher Recovery (Windows)
If the Windows Desktop icon or batch file fails:
- **Canonical Shortcut:** `C:\Users\candy\Desktop\Sprout.lnk`
- **Target Batch File:** `C:\Users\candy\Desktop\Launch_Sprout.bat`
- **Icon File:** `C:\Users\candy\Desktop\sprout_seedling.ico`
- **Manual Launch Fallback:** Open Windows PowerShell and run:
  ```powershell
  wsl.exe -d Ubuntu -e bash -c "docker restart sprout-app"
  Start-Process "http://127.0.0.1:5858"
  ```

---

## 3. Database Schema Version Invariant
- **Rule:** Under NO circumstances should `PRAGMA user_version` exceed 7 without an authorized Phase 14 migration script.
- **Verification Command:**
  ```bash
  docker exec sprout-app python -c "import sqlite3; conn = sqlite3.connect('foster_binder.db'); print('Version:', conn.execute('PRAGMA user_version').fetchone()[0]); conn.close()"
  # Expected output: Version: 7
  ```
- All extended tables (such as `household_members`) are created idempotently via `ensure_extended_tables()` without bumping `user_version`, ensuring 100% compatibility with `test_phase13b_governance.py`.
