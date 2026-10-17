#!/usr/bin/env python3
"""
Sprout KinCare OS: Canonical Docker Volume Backup Harness
Backs up SQLite database, uploads, exports, and backups from the 'sprout-data' Docker volume.
Safe to run while container is running (uses SQLite hot backup / vacuum).
"""

import os
import sys
import subprocess
import datetime
import shutil

def run_backup():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    host_backup_dir = os.path.join(os.path.dirname(__file__), "backups")
    os.makedirs(host_backup_dir, exist_ok=True)
    backup_file = os.path.join(host_backup_dir, f"sprout_volume_backup_{timestamp}.tar.gz")

    print(f"[*] Starting Sprout Docker Volume Backup at {timestamp}...")
    
    # 1. Trigger hot SQLite backup inside container
    print("[*] Performing hot snapshot of SQLite database...")
    hot_snap_cmd = [
        "docker", "compose", "exec", "-T", "sprout-app",
        "python", "-c",
        "import sqlite3, os; "
        "src = sqlite3.connect('/data/data/foster_binder.db'); "
        "os.makedirs('/data/backups', exist_ok=True); "
        "dst = sqlite3.connect('/data/backups/live_snapshot.db'); "
        "src.backup(dst); "
        "dst.close(); src.close(); "
        "print('Hot backup successful')"
    ]
    try:
        subprocess.check_call(hot_snap_cmd)
    except subprocess.CalledProcessError as e:
        print(f"[!] Warning: Hot snapshot via exec failed: {e}. Falling back to container volume stream.")

    # 2. Archive /data volume to host tar.gz
    print(f"[*] Streaming /data volume to {backup_file}...")
    tar_cmd = [
        "docker", "run", "--rm",
        "-v", "sprout-data:/data:ro",
        "-v", f"{os.path.abspath(host_backup_dir)}:/backup",
        "alpine",
        "tar", "-czf", f"/backup/sprout_volume_backup_{timestamp}.tar.gz", "-C", "/data", "."
    ]
    subprocess.check_call(tar_cmd)

    if os.path.exists(backup_file):
        size_kb = os.path.getsize(backup_file) / 1024.0
        print(f"[SUCCESS] Sprout volume backup complete: {backup_file} ({size_kb:.2f} KB)")
        return backup_file
    else:
        raise RuntimeError("Backup file was not created.")

if __name__ == "__main__":
    run_backup()
