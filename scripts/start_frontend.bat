@echo off
echo ============================================================
echo   AutoElite Motors - Starting Frontend Server (React + Vite)
echo ============================================================
echo.

cd frontend

echo Checking Node.js dependencies...
if not exist node_modules (
	echo Installing Node.js dependencies...
	npm install
)

echo.
echo Starting Vite development server...
echo Frontend will be available at: http://localhost:5173
echo Backend API should be running at: http://localhost:5000
echo.
echo Hot Module Replacement (HMR) enabled for live reloading
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
