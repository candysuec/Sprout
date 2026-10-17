#!/usr/bin/env python3
"""
Sprout KinCare OS: Canonical Docker Volume Restore Harness
Restores SQLite database, uploads, exports, and backups into the 'sprout-data' Docker volume.
"""

import os
import sys
import subprocess
import glob

def run_restore(backup_tar_path=None):
    if not backup_tar_path:
        # Default to latest backup in backups/
        host_backup_dir = os.path.join(os.path.dirname(__file__), "backups")
        backups = sorted(glob.glob(os.path.join(host_backup_dir, "sprout_volume_backup_*.tar.gz")))
        if not backups:
            print("[ERROR] No backup archives found in backups/ directory.")
            sys.exit(1)
        backup_tar_path = backups[-1]

    if not os.path.exists(backup_tar_path):
        print(f"[ERROR] Specified backup file does not exist: {backup_tar_path}")
        sys.exit(1)

    backup_abs = os.path.abspath(backup_tar_path)
    backup_dir = os.path.dirname(backup_abs)
    backup_filename = os.path.basename(backup_abs)

    print(f"[*] Restoring Sprout Docker Volume from: {backup_abs}...")

    # 1. Stop container briefly to prevent file lock during extraction
    print("[*] Halting sprout-app container...")
    subprocess.call(["docker", "compose", "stop", "sprout-app"])

    # 2. Extract into sprout-data volume via helper container
    print("[*] Extracting archive into sprout-data volume...")
    restore_cmd = [
        "docker", "run", "--rm",
        "-v", "sprout-data:/data",
        "-v", f"{backup_dir}:/backup",
        "alpine",
        "sh", "-c", f"tar -xzf /backup/{backup_filename} -C /data"
    ]
    subprocess.check_call(restore_cmd)

    # 3. Restart container
    print("[*] Restarting sprout-app container...")
    subprocess.check_call(["docker", "compose", "start", "sprout-app"])

    print(f"[SUCCESS] Volume successfully restored from {backup_filename} and container started.")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    run_restore(target)
