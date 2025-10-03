@echo off
echo ========================================
echo   AutoElite Motors - Start All Services
echo ========================================

:: Check if we're in the right directory
if not exist "backend\" (
    echo ERROR: backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend\" (
    echo ERROR: frontend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist ".env" (
    echo ERROR: .env file not found
    echo Please run setup first or copy .env.example to .env
    pause
    exit /b 1
)

:: Start backend in new window
echo Starting backend server...
start "AutoElite Backend" cmd /k "cd backend && (if exist .venv\Scripts\activate (.venv\Scripts\activate) else if exist venv\Scripts\activate (venv\Scripts\activate)) && python server_unified.py"

:: Wait a moment for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend in new window
echo Starting frontend server...
start "AutoElite Frontend" cmd /k "cd frontend && npm run dev"

:: Wait a moment for frontend to start
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo   AutoElite Motors Security Lab
echo          Ready for Testing!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Educational Use Only - Contains intentional vulnerabilities
echo.
pause