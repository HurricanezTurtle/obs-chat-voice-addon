@echo off
setlocal enabledelayedexpansion

echo ===================================
echo OBS Chat Voice - Setup Script
echo ===================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set node_major=%%a
    set node_major=!node_major:~1!
)

if !node_major! LSS 14 (
    echo Warning: Node.js version !node_major! detected.
    echo This application requires Node.js 14 or higher.
    echo Please upgrade your Node.js installation.
    echo.
    pause
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install dependencies.
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

:: Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo Please edit the .env file with your API keys.
    echo.
)

echo.
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit the .env file with your API keys
echo 2. Configure the application in config.js
echo 3. Run 'npm start' to start the application
echo 4. Open http://localhost:3000 in your browser
echo.
echo You can also run 'npm test' to test the application without connecting to Twitch or OBS.
echo.

pause
