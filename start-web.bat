@echo off
echo ========================================
echo    Feenixs AI Platform Web Server
echo ========================================
echo.
echo Starting web server on port 8008...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Change to project directory
cd /d "%~dp0"

REM Start HTTP server
echo Server starting at http://localhost:8008
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8008

pause
