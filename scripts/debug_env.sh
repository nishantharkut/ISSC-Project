#!/bin/bash

# ===== Virtual Environment Debug Script =====
# This script helps diagnose Python virtual environment issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${GREEN}"
echo "=========================================="
echo "  Python Environment Diagnostic"
echo "=========================================="
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

cd backend

print_status "Checking Python installation..."

# Check system Python
if command -v python3 >/dev/null 2>&1; then
    SYSTEM_PYTHON="python3"
    SYSTEM_VERSION=$(python3 --version 2>&1)
elif command -v python >/dev/null 2>&1; then
    SYSTEM_PYTHON="python"
    SYSTEM_VERSION=$(python --version 2>&1)
else
    print_error "No Python found in system PATH"
    exit 1
fi

print_success "System Python: $SYSTEM_PYTHON ($SYSTEM_VERSION)"
print_status "System Python location: $(which $SYSTEM_PYTHON)"

# Check virtual environments
print_status "Checking for virtual environments..."

if [ -d ".venv" ]; then
    print_success "Found .venv directory"
    
    # Try to activate .venv
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OS" == "Windows_NT" ]]; then
        if [ -f ".venv/Scripts/activate" ]; then
            print_success ".venv activation script found (Windows)"
            source .venv/Scripts/activate
        else
            print_error ".venv/Scripts/activate not found"
        fi
    else
        if [ -f ".venv/bin/activate" ]; then
            print_success ".venv activation script found (Unix)"
            source .venv/bin/activate
        else
            print_error ".venv/bin/activate not found"
        fi
    fi
else
    print_warning ".venv directory not found"
fi

if [ -d "venv" ]; then
    print_success "Found venv directory"
    
    # Try to activate venv if .venv wasn't activated
    if [[ "$VIRTUAL_ENV" == "" ]]; then
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OS" == "Windows_NT" ]]; then
            if [ -f "venv/Scripts/activate" ]; then
                print_success "venv activation script found (Windows)"
                source venv/Scripts/activate
            else
                print_error "venv/Scripts/activate not found"
            fi
        else
            if [ -f "venv/bin/activate" ]; then
                print_success "venv activation script found (Unix)"
                source venv/bin/activate
            else
                print_error "venv/bin/activate not found"
            fi
        fi
    fi
else
    print_warning "venv directory not found"
fi

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" != "" ]]; then
    print_success "Virtual environment activated: $VIRTUAL_ENV"
    
    # Check Python in virtual environment
    VENV_PYTHON_VERSION=$(python --version 2>&1)
    print_success "Virtual env Python: $VENV_PYTHON_VERSION"
    print_status "Virtual env Python location: $(which python)"
    
    # Check pip
    if command -v pip >/dev/null 2>&1; then
        PIP_VERSION=$(pip --version 2>&1)
        print_success "Virtual env pip: $PIP_VERSION"
        print_status "Virtual env pip location: $(which pip)"
    else
        print_error "pip not found in virtual environment"
    fi
    
    # Check required packages
    print_status "Checking required packages..."
    
    # Check Flask
    if python -c "import flask" 2>/dev/null; then
        FLASK_VERSION=$(python -c "import flask; print(flask.__version__)" 2>/dev/null)
        print_success "Flask: $FLASK_VERSION"
    else
        print_error "Flask not installed"
    fi
    
    # Check Google Generative AI
    if python -c "import google.generativeai" 2>/dev/null; then
        print_success "google-generativeai: installed"
    else
        print_error "google-generativeai not installed"
    fi
    
    # Show all installed packages
    print_status "Installed packages in virtual environment:"
    pip list --format=columns 2>/dev/null || pip list
    
else
    print_error "No virtual environment is currently activated"
    
    print_status "To create and activate a virtual environment:"
    echo "  cd backend"
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OS" == "Windows_NT" ]]; then
        echo "  $SYSTEM_PYTHON -m venv .venv"
        echo "  source .venv/Scripts/activate"
    else
        echo "  $SYSTEM_PYTHON -m venv .venv"
        echo "  source .venv/bin/activate"
    fi
    echo "  pip install -r requirements.txt"
fi

# Check .env file
cd ..
print_status "Checking .env configuration..."
if [ -f ".env" ]; then
    print_success ".env file exists"
    if grep -q "API_KEY=" .env; then
        if grep -q "your_gemini_api_key_here" .env; then
            print_warning "API key not configured (still using placeholder)"
        else
            print_success "API key appears to be configured"
        fi
    else
        print_error "API_KEY not found in .env file"
    fi
else
    print_error ".env file not found"
    if [ -f ".env.example" ]; then
        print_status "To create .env file: cp .env.example .env"
    fi
fi

echo ""
echo -e "${GREEN}=========================================="
echo "  Diagnostic Complete"
echo "==========================================${NC}"

if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo -e "${GREEN}✓ Virtual environment is working${NC}"
    echo "You should be able to run: ./start_all.sh"
else
    echo -e "${RED}✗ Virtual environment issues detected${NC}"
    echo "Please run: ./setup.sh to fix the environment"
fi