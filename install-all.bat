@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo HRP Monorepo - Complete Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/5] Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install root dependencies
    pause
    exit /b 1
)
echo.
echo [2/5] Installing React dependencies...
call npm --prefix hrp-react install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install React dependencies
    pause
    exit /b 1
)
echo.
echo [3/5] Creating Python virtual environment...
cd hrp-server
python -m venv venv
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to create virtual environment
    pause
    cd ..
    exit /b 1
)
echo.
echo [4/5] Installing Python dependencies...
call venv\Scripts\pip install --upgrade pip
call venv\Scripts\pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install Python dependencies
    pause
    cd ..
    exit /b 1
)
echo.
echo [5/5] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env created from .env.example
) else (
    echo .env already exists
)
cd ..
echo.
echo ============================================
echo ^✅ Setup Complete!
echo ============================================
echo.
echo To start development:
echo   npm run dev
echo.
echo Services will run on:
echo   • React:  http://localhost:5173
echo   • Flask:  http://localhost:5000
echo   • API:    http://localhost:5000/api
echo.
echo ============================================
echo.
pause
