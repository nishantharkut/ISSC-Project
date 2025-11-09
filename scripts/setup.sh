#!/bin/bash

# ===== AutoElite Motors - Automated Setup Script =====
# This script sets up the entire LLM security demonstration environment
# Compatible with Windows (Git Bash), macOS, and Linux

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Python version
check_python() {
    if command_exists python3; then
        PYTHON_CMD="python3"
    elif command_exists python; then
        PYTHON_CMD="python"
    else
        print_error "Python not found. Please install Python 3.8+ from https://python.org"
        exit 1
    fi

    # Check Python version
    PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2)
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)

    if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 8 ]); then
        print_error "Python 3.8+ required. Found: $PYTHON_VERSION"
        exit 1
    fi

    print_success "Python $PYTHON_VERSION found"
}

# Function to check Node.js version
check_node() {
    if ! command_exists node; then
        print_error "Node.js not found. Please install Node.js 16+ from https://nodejs.org"
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)

    if [ "$NODE_MAJOR" -lt 16 ]; then
        print_error "Node.js 16+ required. Found: $NODE_VERSION"
        exit 1
    fi

    print_success "Node.js $NODE_VERSION found"
}

# Main setup function
main() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "  AutoElite Motors Security Lab Setup"
    echo "     Educational Use Only"
    echo "=========================================="
    echo -e "${NC}"

    # Navigate to project root if we're in the scripts directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [ "$(basename "$SCRIPT_DIR")" = "scripts" ]; then
        print_status "Navigating to project root..."
        cd "$SCRIPT_DIR/.."
    fi
    
    # Check if we're in the right directory
    if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Cannot find project root directory"
        print_error "Make sure you have backend/ and frontend/ directories"
        exit 1
    fi
    
    print_success "Working directory: $(pwd)"

    # Check prerequisites
    print_status "Checking prerequisites..."
    check_python
    check_node

    if ! command_exists npm; then
        print_error "npm not found. Please install Node.js from https://nodejs.org"
        exit 1
    fi

    if ! command_exists pip && ! command_exists pip3; then
        print_error "pip not found. Please install pip for Python package management"
        exit 1
    fi

    # Set pip command
    if command_exists pip3; then
        PIP_CMD="pip3"
    else
        PIP_CMD="pip"
    fi

    echo "All prerequisites met!"

    # Create .env file in backend folder if it doesn't exist
    print_status "Setting up environment configuration..."
    if [ ! -f "backend/.env" ]; then
        if [ -f "backend/.env.example" ]; then
            cp backend/.env.example backend/.env
            print_warning "Created backend/.env file from template"
            print_warning "IMPORTANT: Edit backend/.env and add your Gemini API key!"
            print_warning "   Get your API key from: https://aistudio.google.com/app/apikey"
        else
            print_error "backend/.env.example not found"
            exit 1
        fi
    else
        print_success "backend/.env file already exists"
    fi

    # Setup backend
    print_status "Setting up Python backend..."
    cd backend

    # Create virtual environment if it doesn't exist
    if [ ! -d ".venv" ] && [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        $PYTHON_CMD -m venv .venv
        print_success "Virtual environment created"
    fi

    # Activate virtual environment
    print_status "Activating virtual environment..."
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OS" == "Windows_NT" ]]; then
        # Windows (Git Bash)
        if [ -d ".venv" ]; then
            source .venv/Scripts/activate
        elif [ -d "venv" ]; then
            source venv/Scripts/activate
        fi
    else
        # macOS/Linux
        if [ -d ".venv" ]; then
            source .venv/bin/activate
        elif [ -d "venv" ]; then
            source venv/bin/activate
        fi
    fi

    # Verify virtual environment is activated
    if [[ "$VIRTUAL_ENV" != "" ]]; then
        print_success "Virtual environment activated: $(basename $VIRTUAL_ENV)"
    else
        print_warning "Virtual environment may not be activated properly"
    fi

    # Install Python dependencies
    print_status "Installing Python dependencies..."
    # Use pip from the virtual environment to ensure proper installation
    if [[ "$VIRTUAL_ENV" != "" ]]; then
        python -m pip install --upgrade pip
        python -m pip install -r requirements.txt
    else
        $PIP_CMD install -r requirements.txt
    fi
    print_success "Python dependencies installed"

    # Go back to project root
    cd ..

    # Setup frontend
    print_status "Setting up React frontend..."
    cd frontend

    # Install Node.js dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    print_success "Node.js dependencies installed"

    # Go back to project root
    cd ..

    # Verify setup
    print_status "Verifying setup..."
    
    # Check if .env has API key
    if grep -q "your_gemini_api_key_here" backend/.env 2>/dev/null; then
        print_warning "API key not configured in backend/.env file"
        print_warning "   Please edit backend/.env and replace 'your_gemini_api_key_here' with your actual API key"
        print_warning "   Get your API key from: https://aistudio.google.com/app/apikey"
    else
        print_success "API key appears to be configured"
    fi

    # Final success message
    echo -e "${GREEN}"
    echo "=========================================="
    echo "           Setup Complete!"
    echo "=========================================="
    echo -e "${NC}"
    
    echo "Backend: Python + Flask + Gemini AI"
    echo "Frontend: React + Vite + Tailwind CSS"
    echo "Attack scenarios: SQL, Command, Prompt Injection"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Make sure your API key is set in backend/.env file"
    echo "2. Run: ${GREEN}./scripts/start_all.sh${NC} to start both servers"
    echo "3. Open: ${BLUE}http://localhost:5173${NC} in your browser"
    echo "4. Start learning about LLM security!"
    echo ""
    echo -e "${RED}Educational Use Only${NC}"
    echo "This contains intentional vulnerabilities for learning purposes."
    echo "Never use in production or for malicious purposes."
    echo ""
    echo "For troubleshooting, see README.md or create an issue on GitHub."
    echo ""
    echo -e "${GREEN}Happy learning!${NC}"
}

# Run main setup
main