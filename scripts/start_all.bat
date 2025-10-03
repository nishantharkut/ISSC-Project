@echo off
echo ============================================================
echo   AutoElite Motors - Starting Complete System
echo ============================================================
echo.
echo This will start both:
echo 1. Backend Server (Flask + Gemini AI) on port 5000
echo 2. Frontend Server (React + Vite) on port 5173
echo.
echo Two command windows will open - keep both running!
echo.
pause

echo Starting Backend Server...
start "AutoElite Backend" cmd /k "cd backend && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat && python server_unified.py) else if exist .venv\bin\python.exe (.venv\bin\python.exe server_unified.py) else (python server_unified.py)"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "AutoElite Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo [SUCCESS] Both servers are starting!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Wait for both servers to fully load, then visit:
echo http://localhost:5173
echo.
pause