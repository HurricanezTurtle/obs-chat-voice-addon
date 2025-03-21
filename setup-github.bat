@echo off
setlocal enabledelayedexpansion

echo ===================================
echo OBS Chat Voice - GitHub Setup Script
echo ===================================
echo.

:: Check if Git is installed
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed.
    echo Please install Git from https://git-scm.com/
    echo.
    pause
    exit /b 1
)

:: Initialize Git repository if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to initialize Git repository.
        echo.
        pause
        exit /b 1
    )
)

:: Add all files to Git
echo Adding files to Git...
git add .
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to add files to Git.
    echo.
    pause
    exit /b 1
)

:: Commit changes
echo Committing changes...
git commit -m "Initial commit"
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to commit changes.
    echo.
    pause
    exit /b 1
)

echo.
echo Repository initialized and files committed.
echo.
echo Next steps:
echo 1. Create a new repository on GitHub (https://github.com/new)
echo 2. Do NOT initialize the repository with a README, .gitignore, or license
echo 3. After creating the repository, copy the repository URL
echo.

set /p repo_url=Enter the GitHub repository URL (e.g., https://github.com/username/repo.git): 

if "!repo_url!"=="" (
    echo Error: Repository URL cannot be empty.
    echo.
    pause
    exit /b 1
)

:: Add remote repository
echo Adding remote repository...
git remote add origin !repo_url!
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to add remote repository.
    echo.
    pause
    exit /b 1
)

:: Push to GitHub
echo Pushing to GitHub...
git push -u origin master
if %ERRORLEVEL% neq 0 (
    echo.
    echo Trying to push to main branch instead...
    git push -u origin main
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to push to GitHub.
        echo You may need to push manually or check your repository URL.
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Success! Your project has been pushed to GitHub.
echo Repository URL: !repo_url!
echo.

pause
