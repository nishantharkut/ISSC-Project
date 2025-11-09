# Scripts Directory

This directory contains all setup and utility scripts for the AutoElite Motors Security Lab.

## Setup Scripts

### Unix/Linux/macOS (or Windows Git Bash)

- **`setup.sh`** - Main setup script for Unix-like systems
  - Creates Python virtual environment
  - Installs all dependencies
  - Configures environment
  - Verifies installation
  - **Can be run from anywhere** - automatically finds project root

- **`start_all.sh`** - Starts both backend and frontend servers
  - Activates virtual environment
  - Launches Flask backend on port 5000
  - Launches Vite frontend on port 5173
  - Monitors both processes
  - **Can be run from anywhere** - automatically finds project root

- **`debug_env.sh`** - Diagnoses environment issues
  - Checks Python installation
  - Verifies virtual environment
  - Lists installed packages
  - Validates configuration
  - **Can be run from anywhere** - automatically finds project root

### Windows (Command Prompt/PowerShell)

- **`setup_windows.bat`** - Windows setup script
  - Same functionality as setup.sh but for Windows
  - Uses Windows batch commands
  - Creates .venv virtual environment
  - **Can be run from anywhere** - automatically finds project root

- **`start_all.bat`** - Windows startup script (recommended)
  - Launches both servers in separate windows
  - Uses Windows-native commands
  - Provides visual feedback
  - **Can be run from anywhere** - automatically finds project root

- **`start_windows.bat`** - Alternative Windows startup script
  - Same functionality as start_all.bat
  - Different UI style
  - **Can be run from anywhere** - automatically finds project root

## Individual Server Scripts

For advanced users who want to run servers separately:

- **`start_backend.bat`** - Backend-only Windows script
- **`start_frontend.bat`** - Frontend-only Windows script
- **`system_check.bat`** - System verification script

All batch files automatically navigate to the project root when run from the scripts folder.

## Legacy Scripts (Note)

All scripts have been updated to work from anywhere. The designation "legacy" no longer applies - all scripts are actively maintained and production-ready.

## Usage

### First Time Setup

**Unix/Linux/macOS:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Windows:**
```cmd
scripts\setup_windows.bat
```

### Daily Usage

**Unix/Linux/macOS:**
```bash
./scripts/start_all.sh
```

**Windows:**
```cmd
scripts\start_windows.bat
```

### Troubleshooting

**Environment Issues:**
```bash
./scripts/debug_env.sh
```

**Manual Backend Start:**
```bash
cd backend
source .venv/bin/activate  # Unix/Linux/macOS
# OR
.venv\Scripts\activate     # Windows
python server_unified.py
```

**Manual Frontend Start:**
```bash
cd frontend
npm run dev
```

## Important Notes

- **Script Permissions**: Unix scripts may need execute permissions (`chmod +x`)
- **Virtual Environment**: Scripts automatically handle virtual environment activation
- **Flexible Execution**: All scripts can be run from the project root OR from the scripts directory
- **Automatic Navigation**: Scripts detect their location and navigate to project root automatically
- **API Keys**: Ensure `.env` file is configured before starting services

## Common Issues

**Permission Denied (Unix/Linux/macOS):**
```bash
chmod +x scripts/*.sh
```

**Virtual Environment Not Found:**
- Delete existing `.venv` or `venv` directory
- Run setup script again

**Windows Script Security:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

For more detailed troubleshooting, see the main project documentation.