#!/usr/bin/env python3
"""
Sprout KinCare OS: Desktop Launcher Installation Utility
Creates the canonical 'Sprout' and 'Sprout Command Center' desktop shortcuts,
assigns the official sprout.ico icon, and archives deprecated legacy shortcuts.
"""

import os
import sys
import subprocess

def create_shortcut():
    # Resolve project root
    project_root = os.path.dirname(os.path.abspath(__file__))
    vbs_launcher = os.path.join(project_root, "Launch_Sprout.vbs")
    icon_path = os.path.join(project_root, "app", "static", "sprout.ico")

    # Locate Windows Desktop (including OneDrive redirection)
    desktop = os.environ.get("USERPROFILE")
    potential_desktops = [
        os.path.join(os.environ.get("USERPROFILE", ""), "OneDrive", "Desktop"),
        os.path.join(os.environ.get("USERPROFILE", ""), "Desktop"),
    ]
    desktop_dir = None
    for d in potential_desktops:
        if os.path.exists(d):
            desktop_dir = d
            break
            
    if not desktop_dir:
        desktop_dir = os.path.join(os.environ.get("USERPROFILE", ""), "Desktop")

    print(f"[*] Detected Desktop: {desktop_dir}")
    print(f"[*] Project Target: {vbs_launcher}")
    print(f"[*] Icon Location: {icon_path}")

    # Remove old deprecated desktop files if present
    deprecated_shortcuts = [
        os.path.join(desktop_dir, "Vermont Foster Care Portal.lnk"),
        os.path.join(desktop_dir, "Launch_Foster_Portal.bat"),
    ]
    for old_file in deprecated_shortcuts:
        if os.path.exists(old_file):
            try:
                os.remove(old_file)
                print(f"[RETIRED] Removed deprecated desktop shortcut: {os.path.basename(old_file)}")
            except Exception as e:
                print(f"[!] Warning: Could not remove {old_file}: {e}")

    # Canonical shortcut targets: Sprout.lnk and Sprout Command Center.lnk
    shortcut_names = ["Sprout.lnk", "Sprout Command Center.lnk"]
    
    ps_script = f'''
$WshShell = New-Object -ComObject WScript.Shell
$Desktop = "{desktop_dir}"
$Target = "wscript.exe"
$Arguments = '"{vbs_launcher}"'
$Icon = "{icon_path}"
$WorkDir = "{project_root}"

foreach ($name in @("Sprout.lnk", "Sprout Command Center.lnk")) {{
    $ShortcutPath = Join-Path $Desktop $name
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = $Target
    $Shortcut.Arguments = $Arguments
    $Shortcut.WorkingDirectory = $WorkDir
    $Shortcut.Description = "Sprout Child & Family Success Operating System (Official Docker Stack)"
    $Shortcut.IconLocation = "$Icon, 0"
    $Shortcut.Save()
    Write-Output "Created: $ShortcutPath"
}}
'''

    # Execute PowerShell COM automation to build shortcut
    temp_ps1 = os.path.join(project_root, "_make_shortcut.ps1")
    with open(temp_ps1, "w", encoding="utf-8") as f:
        f.write(ps_script)

    try:
        subprocess.check_call(["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", temp_ps1])
        print("[SUCCESS] Official Sprout desktop launcher installed successfully!")
    finally:
        if os.path.exists(temp_ps1):
            os.remove(temp_ps1)

if __name__ == "__main__":
    create_shortcut()
