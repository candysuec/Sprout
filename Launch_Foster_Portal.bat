@echo off
title Vermont Foster Care Digital Binder
echo ========================================================
echo   Vermont Foster & Kinship Care Digital Binder & Portal
echo   Local-First, Secure, Offline-Ready
echo ========================================================
echo.
echo Starting local binder server...
start "" "http://127.0.0.1:5858"
python "%~dp0app\server.py"
pause
