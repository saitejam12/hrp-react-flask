@echo off
setlocal enabledelayedexpansion

echo Starting HRP Development Environment...
echo ==========================================
echo.
echo Starting React app (http://localhost:5173)...
echo Starting Flask server (http://localhost:5000)...
echo.
echo Press Ctrl+C to stop both services
echo.

REM Install root dependencies
call npm install

REM Install React dependencies
cd hrp-react
call npm install

REM Setup Python environment
cd ..\hrp-server
if not exist venv (
    python -m venv venv
)

REM Activate venv and install dependencies
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Create .env if it doesn't exist
if not exist .env (
    copy .env.example .env
)

REM Go back to root
cd ..

REM Start both services
echo.
echo Starting services...
start "" cmd /k "cd hrp-react && npm run dev"
start "" cmd /k "cd hrp-server && venv\Scripts\activate.bat && python wsgi.py"

echo.
echo Services started! Open http://localhost:5173 in your browser
echo Close the command windows to stop the services
