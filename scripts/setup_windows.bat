@echo off
echo ========================================
echo   AutoElite Motors Security Lab Setup
echo        Educational Use Only
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

:: Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

:: Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo Python and Node.js found!

:: Create .env file if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo Created .env file from template
        echo IMPORTANT: Edit .env and add your Gemini API key!
        echo Get your API key from: https://aistudio.google.com/app/apikey
    ) else (
        echo ERROR: .env.example not found
        pause
        exit /b 1
    )
) else (
    echo .env file already exists
)

:: Setup backend
echo Setting up Python backend...
cd backend

:: Create virtual environment if it doesn't exist
if not exist ".venv\" (
    if not exist "venv\" (
        echo Creating Python virtual environment...
        python -m venv .venv
        echo Virtual environment created
    )
)

:: Activate virtual environment and install dependencies
if exist ".venv\Scripts\activate" (
    echo Activating virtual environment...
    call .venv\Scripts\activate
    echo Installing Python dependencies...
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    echo Python dependencies installed
) else if exist "venv\Scripts\activate" (
    echo Activating virtual environment...
    call venv\Scripts\activate
    echo Installing Python dependencies...
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    echo Python dependencies installed
) else (
    echo WARNING: Virtual environment not found, using system Python
    pip install -r requirements.txt
)

cd ..

:: Setup frontend
echo Setting up React frontend...
cd frontend

echo Installing Node.js dependencies...
npm install

cd ..

echo.
echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo Backend: Python + Flask + Gemini AI
echo Frontend: React + Vite + Tailwind CSS
echo Attack scenarios: SQL, Command, Prompt Injection
echo.
echo Next steps:
echo 1. Make sure your API key is set in .env file
echo 2. Run: start_windows.bat to start both servers
echo 3. Open: http://localhost:5173 in your browser
echo 4. Start learning about LLM security!
echo.
echo Educational Use Only
echo This contains intentional vulnerabilities for learning purposes.
echo Never use in production or for malicious purposes.
echo.
pause