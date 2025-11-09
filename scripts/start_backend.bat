@echo off
REM Navigate to project root (one level up from scripts folder)
cd /d "%~dp0.."

echo ============================================================
echo   AutoElite Motors - Starting Backend Server (Flask + Gemini AI)
echo ============================================================
echo.
echo Current directory: %CD%
echo.

cd backend

echo Activating virtual environment...
if exist .venv\Scripts\activate.bat (
	call .venv\Scripts\activate.bat
	echo Virtual environment activated (Windows style)
) else if exist .venv\bin\activate (
	echo Found Unix-style venv, using Python executable directly
	set PYTHON_PATH=.venv\bin\python.exe
) else if exist venv\Scripts\activate.bat (
	call venv\Scripts\activate.bat
	echo Virtual environment activated (Windows style)
) else (
	echo [WARN] No virtual environment found. Using system Python.
	echo [INFO] Consider creating a venv: python -m venv .venv
	set PYTHON_PATH=python
)

echo.
echo Starting Flask server with Gemini AI integration...
echo Server will be available at: http://localhost:5000
echo.
if defined PYTHON_PATH (
	%PYTHON_PATH% server_unified.py
) else (
	python server_unified.py
)

pause
