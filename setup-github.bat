@echo off
echo ========================================
echo    GitHub Repository Setup for Feenixs
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com
    pause
    exit /b 1
)

REM Change to project directory
cd /d "%~dp0"

REM Initialize Git repository if not already done
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files to staging
echo Adding files to Git...
git add .
echo.

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Feenixs AI Platform - Modular Multi-Page Website

Features:
- Modular HTML/CSS/JS architecture
- 6 separate pages (Home, Vision, Technologies, Founder, Community, Contact)
- Responsive design with glassmorphism effects
- User authentication system with CSV storage
- Community chat functionality
- Contact form with message storage
- Visitor tracking system
- Particle animation background
- Mobile responsive navigation
- GSAP animations and interactions"
echo.

REM Check if remote repository is already configured
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo Please follow these steps to create GitHub repository:
    echo.
    echo 1. Go to https://github.com and create a new repository named "feenixs-website"
    echo 2. Make sure the repository is PUBLIC
    echo 3. Do NOT initialize with README (we already have one)
    echo 4. Copy the repository URL (HTTPS format)
    echo.
    set /p repo_url="Enter your GitHub repository URL: "
    echo.
    echo Adding remote repository...
    git remote add origin "%repo_url%"
    echo.
    echo Pushing to GitHub...
    git push -u origin main
) else (
    echo Remote repository already configured.
    echo Pushing to GitHub...
    git push origin main
)

echo.
echo ========================================
echo    GitHub Setup Complete!
echo ========================================
echo.
echo Your repository is now available at:
echo https://github.com/YOUR_USERNAME/feenixs-website
echo.
echo To deploy to GitHub Pages:
echo 1. Go to your repository on GitHub
echo 2. Go to Settings > Pages
echo 3. Select "Deploy from a branch"
echo 4. Choose "main" branch and "/pages" folder
echo 5. Save and wait for deployment
echo.
echo Your site will be available at:
echo https://YOUR_USERNAME.github.io/feenixs-website/
echo.

pause
