@echo off
title GitHub Automated Push Helper
echo ===================================================
echo   GitHub Automated Push Helper (node-chat-app)
echo ===================================================
echo.

cd /d "%~dp0"

:: Check if git is initialized
if not exist .git (
    echo [1/3] Initializing local Git repository...
    git init
) else (
    echo [*] Git is already initialized locally.
)

:: Ask for remote repository URL if not set
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Please copy and paste your GitHub Repository URL (e.g., https://github.com/username/repo-name.git):
    set /p REPO_URL=URL: 
    
    if "%REPO_URL%"=="" (
        echo Error: No URL provided. Exiting.
        pause
        exit /b
    )
    
    git remote add origin %REPO_URL%
    git branch -M main
) else (
    echo [*] GitHub Remote Origin is already configured.
)

echo.
echo [2/3] Staging and committing changes...
git add .
git commit -m "Upgrade to premium cyber-neon layout"

echo.
echo [3/3] Pushing changes to GitHub...
echo (Note: If this is your first push, GitHub might open a window asking you to Sign In).
echo.
git push -u origin main

echo.
echo ===================================================
echo Done! Render will start building the updates now.
echo ===================================================
pause
