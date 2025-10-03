#!/bin/bash

# ===== AutoElite Motors - Start All Services =====
# This script starts both backend and frontend servers
# Use this after running setup.sh

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

# Function to check if port is in use
check_port() {
    local port=$1
    if command -v netstat >/dev/null 2>&1; then
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            return 0  # Port is in use
        fi
    elif command -v ss >/dev/null 2>&1; then
        if ss -tuln 2>/dev/null | grep -q ":$port "; then
            return 0  # Port is in use
        fi
    elif command -v lsof >/dev/null 2>&1; then
        if lsof -i :$port >/dev/null 2>&1; then
            return 0  # Port is in use
        fi
    fi
    return 1  # Port is available
}

# Function to cleanup background processes on exit
cleanup() {
    print_status "Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        wait $FRONTEND_PID 2>/dev/null || true
    fi
    print_success "Services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Function to start backend
start_backend() {
    print_status "Starting Python backend server..."
    
    cd backend
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OS" == "Windows_NT" ]]; then
        # Windows (Git Bash)
        if [ -f ".venv/Scripts/activate" ]; then
            source .venv/Scripts/activate
            print_success "Virtual environment activated: .venv"
        elif [ -f "venv/Scripts/activate" ]; then
            source venv/Scripts/activate
            print_success "Virtual environment activated: venv"
        else
            print_warning "Virtual environment not found. Using system Python."
        fi
    else
        # macOS/Linux
        if [ -f ".venv/bin/activate" ]; then
            source .venv/bin/activate
            print_success "Virtual environment activated: .venv"
        elif [ -f "venv/bin/activate" ]; then
            source venv/bin/activate
            print_success "Virtual environment activated: venv"
        else
            print_warning "Virtual environment not found. Using system Python."
        fi
    fi
    
    # Check if Python server can start
    if [ ! -f "server_unified.py" ]; then
        print_error "server_unified.py not found in backend directory"
        cd ..
        return 1
    fi
    
    # Determine Python command - prefer the one from virtual environment
    if [[ "$VIRTUAL_ENV" != "" ]]; then
        PYTHON_CMD="python"
        print_status "Using Python from virtual environment: $VIRTUAL_ENV"
    elif command -v python3 >/dev/null 2>&1; then
        PYTHON_CMD="python3"
    elif command -v python >/dev/null 2>&1; then
        PYTHON_CMD="python"
    else
        print_error "Python not found"
        cd ..
        return 1
    fi
    
    # Verify Python can access required packages
    print_status "Verifying Python environment..."
    if ! $PYTHON_CMD -c "import flask, google.generativeai" 2>/dev/null; then
        print_error "Required Python packages not found. Please run ./setup.sh first."
        cd ..
        return 1
    fi
    
    # Start backend server in background
    print_status "Launching Flask server on http://localhost:5000"
    $PYTHON_CMD server_unified.py &
    BACKEND_PID=$!
    
    cd ..
    
    # Wait a moment and check if backend started
    sleep 3
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend server started (PID: $BACKEND_PID)"
        return 0
    else
        print_error "Backend server failed to start"
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    print_status "Starting React frontend server..."
    
    cd frontend
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in frontend directory"
        cd ..
        return 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Running npm install..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "npm install failed"
            cd ..
            return 1
        fi
    fi
    
    # Verify npm dev script exists
    if ! npm run dev --help >/dev/null 2>&1; then
        print_error "npm dev script not found in package.json"
        cd ..
        return 1
    fi
    
    # Start frontend server in background
    print_status "Launching Vite dev server on http://localhost:5173"
    # Create a log file for frontend output
    npm run dev > ../frontend_output.log 2>&1 &
    FRONTEND_PID=$!
    
    cd ..
    
    # Wait a moment and check if frontend started
    sleep 5
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend server started (PID: $FRONTEND_PID)"
        return 0
    else
        print_error "Frontend server failed to start"
        return 1
    fi
}

# Function to show access information
show_access_info() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "    AutoElite Motors Security Lab"
    echo "           Ready for Testing!"
    echo "=========================================="
    echo -e "${NC}"
    
    echo -e "${BLUE}🌐 Frontend:${NC} http://localhost:5173"
    echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:5000"
    echo ""
    echo -e "${GREEN}🎯 Attack Scenarios Available:${NC}"
    echo "  1. SQL Injection - Click 'Ask AI' and explore database"
    echo "  2. Command Injection - Use newsletter subscription"
    echo "  3. Indirect Prompt Injection - Add malicious product reviews"
    echo ""
    echo -e "${YELLOW}📚 Quick Start:${NC}"
    echo "  • Open http://localhost:5173 in your browser"
    echo "  • Click 'Ask AI' and try: 'What APIs do you have access to?'"
    echo "  • Follow the attack demonstrations in README.md"
    echo ""
    echo -e "${RED}⚠️  Educational Use Only${NC}"
    echo "This contains intentional vulnerabilities for learning purposes."
    echo ""
    echo -e "${BLUE}💡 Tips:${NC}"
    echo "  • Use Ctrl+C to stop all servers"
    echo "  • Check browser console for any errors"
    echo "  • See README.md for detailed attack instructions"
    echo ""
    echo -e "${GREEN}Happy learning about LLM security! 🎓🔒${NC}"
    echo ""
}

# Main function
main() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "  AutoElite Motors - Starting Services"
    echo "=========================================="
    echo -e "${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Please run this script from the project root directory"
        print_error "Make sure you have backend/ and frontend/ directories"
        exit 1
    fi
    
    # Check if .env file exists and has API key
    if [ ! -f ".env" ]; then
        print_error ".env file not found"
        print_error "Please run ./setup.sh first to create the environment file"
        exit 1
    fi
    
    if grep -q "your_gemini_api_key_here" .env 2>/dev/null; then
        print_warning "⚠️  API key not configured in .env file"
        print_warning "   Please edit .env and replace 'your_gemini_api_key_here' with your actual API key"
        print_warning "   Get your API key from: https://aistudio.google.com/app/apikey"
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Check if ports are available
    if check_port 5000; then
        print_warning "Port 5000 is already in use. Backend may not start properly."
    fi
    
    if check_port 5173; then
        print_warning "Port 5173 is already in use. Frontend may not start properly."
    fi
    
    # Start backend server
    if ! start_backend; then
        print_error "Failed to start backend server"
        exit 1
    fi
    
    # Start frontend server
    if ! start_frontend; then
        print_error "Failed to start frontend server"
        cleanup
        exit 1
    fi
    
    # Show access information
    show_access_info
    
    # Keep script running and monitor servers
    print_status "Monitoring servers... Press Ctrl+C to stop"
    
    while true; do
        sleep 5
        
        # Check if backend is still running
        if ! kill -0 $BACKEND_PID 2>/dev/null; then
            print_error "Backend server stopped unexpectedly"
            cleanup
            exit 1
        fi
        
        # Check if frontend is still running
        if ! kill -0 $FRONTEND_PID 2>/dev/null; then
            print_error "Frontend server stopped unexpectedly"
            cleanup
            exit 1
        fi
    done
}

# Run main function
main