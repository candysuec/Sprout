import os
desktop = r"C:\Users\candy\OneDrive\Desktop"
target = os.path.join(desktop, "Launch_Foster_Portal.bat")
vbs_path = os.path.join(desktop, "make_shortcut.vbs")
script = f'''Set oWS = WScript.CreateObject("WScript.Shell")
sLink = "{desktop}\\Vermont Foster Care Portal.lnk"
Set oLink = oWS.CreateShortcut(sLink)
oLink.TargetPath = "{target}"
oLink.WorkingDirectory = "C:\\Users\\candy\\OneDrive\\Documents\\01_PERSONAL_&_FAMILY\\Davis & VTDCF Shared Folder"
oLink.Description = "Vermont Foster Care Digital Binder"
oLink.IconLocation = "shell32.dll, 220"
oLink.Save
'''
with open(vbs_path, "w") as f:
    f.write(script)
os.system(f'cscript //nologo "{vbs_path}"')
if os.path.exists(vbs_path):
    os.remove(vbs_path)
print("Desktop shortcut successfully created!")
