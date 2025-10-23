@echo off

echo ========================================
echo MCPE-Tool Installation Script
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
where node > nul 2>&1 || (
    goto :handle_missing_node
)

echo Node.js found: 
call node --version

echo.

:check_typescript

REM Check if TypeScript is installed
echo Checking for TypeScript...
where tsc > nul 2>&1 || (
    goto :handle_missing_typescript
)

echo TypeScript found:
call tsc --version

echo.
echo ========================================
echo Installing Project Dependencies
echo ========================================
echo.

REM Install project dependencies
echo Installing npm dependencies...
call npm install
if %errorLevel% neq 0 (
    echo Failed to install npm dependencies.
    echo Please check the error messages above.
    echo You might miss some of the necessary build tools, reinstall nodejs and install the Tools for native modules
    pause
    exit /b 1
)

echo.
echo ========================================
echo Building Project
echo ========================================
echo.

REM Build the project
echo Building TypeScript project...
call npm run build
if %errorLevel% neq 0 (
    echo Build failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Generating Config Schema
echo ========================================
echo.

call npm run schema

echo.
echo ========================================
echo Linking Project Globally
echo ========================================
echo.

REM Link the project globally
echo Linking project globally as 'mc' command...
call npm link
if %errorLevel% neq 0 (
    echo Failed to link project globally.
    echo You may need to run this script as administrator.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo The MCPE-Tool has been successfully installed!
echo.
echo You can now use the 'mc' command from anywhere in your terminal.
echo.
echo Quick start:
echo   mc help        - Show available commands
echo   mc init        - Initialize a new project
echo   mc watch       - Start watching for file changes
echo   mc build       - Build your project
echo.
echo For more information, check the README.md file.
echo.
echo Press any key to exit...

echo %* | findstr /i "\-y" >nul
if errorlevel 1 pause >nul

goto :eof

@REM Functions

:handle_missing_node
echo Node.js not found. Please install Node.js from https://nodejs.org/
echo Recommended version: LTS (Latest)
echo.
echo Opening Node.js download page...
start https://nodejs.org/
echo Please install Node.js and run this script again.
pause
exit /b 1
goto :eof

:handle_missing_typescript
echo TypeScript not found. Installing globally...
call npm install -g typescript
if %errorLevel% neq 0 (
    echo Failed to install TypeScript globally.
    echo You may need to run this script as administrator.
    pause
    exit /b 1
)
echo TypeScript installed successfully.
goto :check_typescript
