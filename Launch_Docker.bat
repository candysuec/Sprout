@echo off
title Sprout KinCare OS (Official Docker Stack)
echo ========================================================
echo   Sprout KinCare OS (Canonical Docker Environment)
echo   Local-First, Secure, Zero-Drift
echo ========================================================
echo.
echo Starting sprout-app container stack...
docker compose up -d
echo Waiting for Sprout service to initialize...
timeout /t 3 /nobreak > nul
start "" "http://localhost:5858"
echo.
echo Sprout is running at http://localhost:5858
echo Press Ctrl+C to stop following logs (container keeps running in background).
echo To stop container completely: docker compose down
echo.
docker compose logs -f sprout-app
