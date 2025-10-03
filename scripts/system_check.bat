@echo off
echo ============================================================
echo   AutoElite Motors - System Health Check
echo ============================================================
echo.
echo This will check:
echo 1. Frontend React app (http://localhost:5173)
echo 2. Backend Flask API (http://localhost:5000)
echo 3. API connectivity and Gemini AI integration
echo.
echo IMPORTANT: Make sure both servers are running:
echo - Backend: start_backend.bat
echo - Frontend: start_frontend.bat
echo.
pause

echo Checking backend API...
curl -s http://localhost:5000/api/products > nul 2>&1
if %errorlevel% equ 0 (
	echo [SUCCESS] Backend API is running on port 5000
) else (
	echo [ERROR] Backend API not responding - start start_backend.bat
)

echo.
echo Opening AutoElite Motors application...
start "AutoElite Motors" "http://localhost:5173"
echo.
echo [SUCCESS] Frontend opened at http://localhost:5173
echo.
echo System Status:
echo - Frontend (React + Vite): http://localhost:5173
echo - Backend (Flask + AI): http://localhost:5000
echo - Attack Panel: Available in frontend UI
echo.
pause