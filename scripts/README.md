# Scripts Directory

This directory contains all setup and utility scripts for the AutoElite Motors Security Lab.

## 🚀 Setup Scripts

### Unix/Linux/macOS (or Windows Git Bash)

- **`setup.sh`** - Main setup script for Unix-like systems
  - Creates Python virtual environment
  - Installs all dependencies
  - Configures environment
  - Verifies installation

- **`start_all.sh`** - Starts both backend and frontend servers
  - Activates virtual environment
  - Launches Flask backend on port 5000
  - Launches Vite frontend on port 5173
  - Monitors both processes

- **`debug_env.sh`** - Diagnoses environment issues
  - Checks Python installation
  - Verifies virtual environment
  - Lists installed packages
  - Validates configuration

### Windows (Command Prompt/PowerShell)

- **`setup_windows.bat`** - Windows setup script
  - Same functionality as setup.sh but for Windows
  - Uses Windows batch commands
  - Creates .venv virtual environment

- **`start_windows.bat`** - Windows startup script
  - Launches both servers in separate windows
  - Uses Windows-native commands
  - Provides visual feedback

## 📜 Legacy Scripts (Deprecated)

These scripts are kept for compatibility but are no longer actively maintained:

- `start_all.bat` - Old Windows batch file
- `start_backend.bat` - Backend-only Windows script
- `start_frontend.bat` - Frontend-only Windows script
- `system_check.bat` - Old system verification script

## 🔧 Usage

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

## ⚠️ Important Notes

- **Script Permissions**: Unix scripts may need execute permissions (`chmod +x`)
- **Virtual Environment**: Scripts automatically handle virtual environment activation
- **Path Dependencies**: Run scripts from the project root directory
- **API Keys**: Ensure `.env` file is configured before starting services

## 🆘 Common Issues

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