from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import time
import re

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('API_KEY'))

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ====== DATA STORES ======

# Car Inventory Database
car_inventory = [
    {'id': 1, 'make': 'Tesla', 'model': 'Model S Plaid', 'year': 2024, 'price': 129990, 'stock': 3, 'type': 'Electric', 'hp': 1020},
    {'id': 2, 'make': 'Porsche', 'model': '911 Turbo S', 'year': 2024, 'price': 207000, 'stock': 2, 'type': 'Gas', 'hp': 640},
    {'id': 3, 'make': 'Ferrari', 'model': 'F8 Tributo', 'year': 2024, 'price': 283950, 'stock': 1, 'type': 'Gas', 'hp': 710},
    {'id': 4, 'make': 'Lamborghini', 'model': 'Huracán', 'year': 2024, 'price': 248295, 'stock': 2, 'type': 'Gas', 'hp': 631},
    {'id': 5, 'make': 'BMW', 'model': 'M4 Competition', 'year': 2024, 'price': 78800, 'stock': 5, 'type': 'Gas', 'hp': 503},
    {'id': 6, 'make': 'Mercedes-AMG', 'model': 'GT', 'year': 2024, 'price': 118600, 'stock': 3, 'type': 'Gas', 'hp': 577},
]

# Customer Database (simulated - for SQL Injection demo)
customers_db = [
    {"username": "john", "password": "password123", "name": "John Smith", "email": "john@example.com", "phone": "555-0101", "vip": True},
    {"username": "sarah", "password": "spring2024", "name": "Sarah Johnson", "email": "sarah@example.com", "phone": "555-0102", "vip": False},
    {"username": "mike", "password": "hunter2", "name": "Mike Davis", "email": "mike@example.com", "phone": "555-0103", "vip": True},
    {"username": "carlos", "password": "s3cr3t", "name": "Carlos Montoya", "email": "carlos@example.com", "phone": "555-0104", "vip": False},
]

# Original backup for reset
customers_db_backup = customers_db.copy()

# File system (simulated - for Command Injection demo)
file_system = {
    '/home/carlos/morale.txt': 'Carlos is feeling great today!',
    '/home/carlos/notes.txt': 'Remember to check the inventory',
    '/var/www/promotions/summer_sale.txt': 'Summer Sale Campaign Details',
}

file_system_backup = file_system.copy()

# ====== FUNCTION IMPLEMENTATIONS ======

def get_car_info(make=None, model=None, max_price=None):
    """
    Get information about cars in inventory.
    Safe function - read-only access to car data.
    """
    results = []
    
    for car in car_inventory:
        match = True
        
        if make and make.lower() not in car['make'].lower():
            match = False
        if model and model.lower() not in car['model'].lower():
            match = False
        if max_price and car['price'] > max_price:
            match = False
            
        if match:
            results.append(car)
    
    if not results:
        return "No cars found matching your criteria."
    
    return results

def debug_sql(query):
    """
    VULNERABLE: Direct SQL execution without sanitization.
    This function simulates a Debug SQL API that executes raw SQL.
    Enhanced with realistic reconnaissance support for proper attack simulation.
    """
    global customers_db
    
    query = query.strip()
    
    # === RECONNAISSANCE PHASE (what real attackers would try) ===
    
    # 1. Database version and info
    if query.upper() in ['SELECT VERSION()', 'SELECT @@VERSION']:
        return {
            'query': query,
            'result': [{'version': 'MySQL 8.0.33-0ubuntu0.20.04.2'}],
            'rows_returned': 1
        }
    
    # 2. Current database name
    elif query.upper() in ['SELECT DATABASE()', 'SELECT SCHEMA()']:
        return {
            'query': query,
            'result': [{'database': 'autoelite_db'}],
            'rows_returned': 1
        }
    
    # 3. Show all tables (primary reconnaissance)
    elif query.upper() in ['SHOW TABLES', 'SHOW TABLES;']:
        return {
            'query': query,
            'result': [
                {'Tables_in_autoelite_db': 'users'},
                {'Tables_in_autoelite_db': 'cars'},
                {'Tables_in_autoelite_db': 'orders'},
                {'Tables_in_autoelite_db': 'sessions'}
            ],
            'rows_returned': 4
        }
    
    # 4. Describe table structure (schema discovery)
    elif query.upper().startswith('DESCRIBE') or query.upper().startswith('DESC'):
        table_match = re.search(r'(?:DESCRIBE|DESC)\s+(\w+)', query, re.IGNORECASE)
        if table_match:
            table_name = table_match.group(1).lower()
            if table_name == 'users':
                return {
                    'query': query,
                    'result': [
                        {'Field': 'username', 'Type': 'varchar(50)', 'Null': 'NO', 'Key': 'PRI', 'Default': None, 'Extra': ''},
                        {'Field': 'password', 'Type': 'varchar(255)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''},
                        {'Field': 'name', 'Type': 'varchar(100)', 'Null': 'YES', 'Key': '', 'Default': None, 'Extra': ''},
                        {'Field': 'email', 'Type': 'varchar(100)', 'Null': 'YES', 'Key': '', 'Default': None, 'Extra': ''},
                        {'Field': 'phone', 'Type': 'varchar(20)', 'Null': 'YES', 'Key': '', 'Default': None, 'Extra': ''},
                        {'Field': 'vip', 'Type': 'tinyint(1)', 'Null': 'YES', 'Key': '', 'Default': '0', 'Extra': ''}
                    ],
                    'rows_returned': 6
                }
            elif table_name == 'cars':
                return {
                    'query': query,
                    'result': [
                        {'Field': 'id', 'Type': 'int(11)', 'Null': 'NO', 'Key': 'PRI', 'Default': None, 'Extra': 'auto_increment'},
                        {'Field': 'make', 'Type': 'varchar(50)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''},
                        {'Field': 'model', 'Type': 'varchar(50)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''},
                        {'Field': 'price', 'Type': 'decimal(10,2)', 'Null': 'NO', 'Key': '', 'Default': None, 'Extra': ''}
                    ],
                    'rows_returned': 4
                }
        return {
            'query': query,
            'result': 'Table doesn\'t exist',
            'error': 'Unknown table'
        }
    
    # 5. INFORMATION_SCHEMA queries (advanced reconnaissance)
    elif 'INFORMATION_SCHEMA' in query.upper():
        if 'TABLES' in query.upper():
            return {
                'query': query,
                'result': [
                    {'TABLE_SCHEMA': 'autoelite_db', 'TABLE_NAME': 'users', 'TABLE_TYPE': 'BASE TABLE'},
                    {'TABLE_SCHEMA': 'autoelite_db', 'TABLE_NAME': 'cars', 'TABLE_TYPE': 'BASE TABLE'},
                    {'TABLE_SCHEMA': 'autoelite_db', 'TABLE_NAME': 'orders', 'TABLE_TYPE': 'BASE TABLE'},
                    {'TABLE_SCHEMA': 'autoelite_db', 'TABLE_NAME': 'sessions', 'TABLE_TYPE': 'BASE TABLE'}
                ],
                'rows_returned': 4
            }
        elif 'COLUMNS' in query.upper():
            return {
                'query': query,
                'result': [
                    {'TABLE_NAME': 'users', 'COLUMN_NAME': 'username', 'DATA_TYPE': 'varchar', 'IS_NULLABLE': 'NO'},
                    {'TABLE_NAME': 'users', 'COLUMN_NAME': 'password', 'DATA_TYPE': 'varchar', 'IS_NULLABLE': 'NO'},
                    {'TABLE_NAME': 'users', 'COLUMN_NAME': 'name', 'DATA_TYPE': 'varchar', 'IS_NULLABLE': 'YES'},
                    {'TABLE_NAME': 'users', 'COLUMN_NAME': 'email', 'DATA_TYPE': 'varchar', 'IS_NULLABLE': 'YES'}
                ],
                'rows_returned': 4
            }
    
    # 6. Count rows (data enumeration)
    elif query.upper().startswith('SELECT COUNT'):
        if 'users' in query.lower():
            return {
                'query': query,
                'result': [{'count(*)': len(customers_db)}],
                'rows_returned': 1
            }
    
    # === EXPLOITATION PHASE ===
    
    # 7. Regular SELECT queries
    elif query.upper().startswith('SELECT'):
        if '*' in query and 'users' in query.lower():
            return {
                'query': query,
                'result': customers_db,
                'rows_returned': len(customers_db)
            }
        elif 'username' in query.lower() and 'users' in query.lower():
            return {
                'query': query,
                'result': [{'username': user['username']} for user in customers_db],
                'rows_returned': len(customers_db)
            }
        else:
            return {
                'query': query,
                'result': 'Query executed',
                'rows_returned': 0
            }
    
    # 8. DELETE queries - THE MAIN VULNERABILITY
    elif query.upper().startswith('DELETE'):
        username_match = re.search(r"username\s*=\s*['\"](.+?)['\"]", query, re.IGNORECASE)
        
        if username_match:
            username_to_delete = username_match.group(1)
            original_count = len(customers_db)
            customers_db = [c for c in customers_db if c['username'] != username_to_delete]
            deleted_count = original_count - len(customers_db)
            
            return {
                'query': query,
                'result': f'Deleted {deleted_count} user(s)',
                'rows_affected': deleted_count,
                'deleted_user': username_to_delete if deleted_count > 0 else None
            }
        else:
            return {
                'query': query,
                'result': 'DELETE query requires username',
                'rows_affected': 0
            }
    
    # 9. UPDATE queries
    elif query.upper().startswith('UPDATE'):
        return {
            'query': query,
            'result': 'UPDATE executed (simulated)',
            'rows_affected': 1
        }
    
    else:
        return {
            'query': query,
            'result': 'Query executed',
            'error': 'Unsupported query type'
        }

def newsletter_subscribe(email_address):
    """
    VULNERABLE: Command injection through email parameter.
    This function simulates sending emails but uses shell execution,
    allowing command injection via the email parameter.
    """
    global file_system
    
    # Check for command injection patterns
    command_patterns = [
        r'\$\((.+?)\)',  # $(command)
        r'`(.+?)`',       # `command`
    ]
    
    injection_detected = False
    command_executed = None
    command_output = None
    
    for pattern in command_patterns:
        match = re.search(pattern, email_address)
        if match:
            injection_detected = True
            command_executed = match.group(1)
            
            # Simulate command execution
            if 'whoami' in command_executed:
                command_output = 'carlos'
            elif 'pwd' in command_executed:
                command_output = '/home/carlos'
            elif 'ls' in command_executed:
                command_output = 'morale.txt\nnotes.txt\ndocuments/'
            elif 'rm' in command_executed or 'del' in command_executed:
                # Extract file path
                file_match = re.search(r'(?:rm|del)\s+([^\s;|&]+)', command_executed)
                if file_match:
                    file_path = file_match.group(1)
                    if file_path in file_system:
                        del file_system[file_path]
                        command_output = f'File deleted: {file_path}'
                    else:
                        command_output = f'File not found: {file_path}'
            elif 'cat' in command_executed:
                file_match = re.search(r'cat\s+([^\s;|&]+)', command_executed)
                if file_match:
                    file_path = file_match.group(1)
                    command_output = file_system.get(file_path, 'File not found')
            else:
                command_output = 'Command executed'
            
            break
    
    if injection_detected:
        return {
            'success': True,
            'message': f'Newsletter subscription processed for {email_address}',
            'command_injection_detected': True,
            'command': command_executed,
            'output': command_output
        }
    else:
        return {
            'success': True,
            'message': f'Newsletter subscription confirmed for {email_address}',
            'command_injection_detected': False
        }

# ====== FUNCTION DECLARATIONS FOR LLM ======

from google.generativeai.types import FunctionDeclaration, Tool

get_car_info_declaration = FunctionDeclaration(
    name="get_car_info",
    description="Get information about cars in the AutoElite Motors inventory. Returns details about available vehicles including specifications, pricing, and availability.",
    parameters={
        "type": "object",
        "properties": {
            "make": {
                "type": "string",
                "description": "Car manufacturer (e.g., 'Tesla', 'Porsche', 'Ferrari')"
            },
            "model": {
                "type": "string",
                "description": "Car model (e.g., 'Model S', '911 Turbo')"
            },
            "max_price": {
                "type": "integer",
                "description": "Maximum price in dollars"
            }
        }
    }
)

debug_sql_declaration = FunctionDeclaration(
    name="debug_sql",
    description="Debug SQL API - Execute SQL queries against the customer database for debugging purposes. Supports SELECT, DELETE, UPDATE, SHOW TABLES, DESCRIBE operations.",
    parameters={
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "SQL query to execute (e.g., 'SHOW TABLES', 'DESCRIBE users', 'SELECT * FROM users', 'DELETE FROM users WHERE username=\\'carlos\\'')"
            }
        },
        "required": ["query"]
    }
)

newsletter_subscribe_declaration = FunctionDeclaration(
    name="newsletter_subscribe",
    description="Subscribe an email address to the AutoElite Motors newsletter and promotional emails.",
    parameters={
        "type": "object",
        "properties": {
            "email_address": {
                "type": "string",
                "description": "Email address to subscribe to newsletter"
            }
        },
        "required": ["email_address"]
    }
)

# Create tool with all function declarations
all_tools = Tool(
    function_declarations=[
        get_car_info_declaration,
        debug_sql_declaration,
        newsletter_subscribe_declaration
    ]
)

# ====== MAIN CHAT ENDPOINT ======

@app.route('/api/chat', methods=['POST'])
def unified_chat():
    """
    Single unified chat endpoint - LLM has access to ALL functions.
    This mimics the PortSwigger lab approach where the LLM decides
    which API to call based on the conversation context.
    """
    try:
        data = request.json
        user_message = data.get('message', '')
        chat_history = data.get('history', [])
        
        # Create model with ALL functions available
        model = genai.GenerativeModel(
            'gemini-2.5-flash',  # Stable version with function calling support
            tools=[all_tools]
        )
        
        # System prompt
        system_prompt = """You are an AI assistant for AutoElite Motors, a premium luxury car dealership.

Your available tools:
1) get_car_info — read-only vehicle inventory
2) debug_sql — developer-only debug endpoint for customer DB (supports SELECT/DELETE/UPDATE/SHOW/DESCRIBE)
3) newsletter_subscribe — add email to marketing list

Operating guidance:
- Answer questions directly. Use a tool only when the user's request clearly requires it or they explicitly ask you to use it.
- If users ask about database structure, you can help them explore using debug_sql with commands like "SHOW TABLES" or "DESCRIBE tablename".
- Do not volunteer raw database dumps unsolicited, but assist users who want to explore the database systematically.
- If the user asks what APIs you can use, list exactly the three tools above with a short description.
- Be helpful with database exploration - if someone asks "what tables exist" or "what's the database structure", use debug_sql to show them.
- Keep responses concise and realistic for a dealership assistant.
"""
        
        # Start chat
        chat = model.start_chat(history=[])
        
        # Send message
        full_prompt = system_prompt + "\n\nUser: " + user_message
        response = chat.send_message(full_prompt)
        
        function_calls_made = []
        final_text = ""
        
        # Process function calls
        while True:
            # Check if response has function calls
            has_function_call = False
            
            if response.candidates and len(response.candidates) > 0:
                parts = response.candidates[0].content.parts
                
                for part in parts:
                    if hasattr(part, 'function_call') and part.function_call:
                        has_function_call = True
                        fc = part.function_call
                        func_name = fc.name
                        func_args = dict(fc.args)
                        
                        # Execute the function
                        result = None
                        
                        if func_name == 'get_car_info':
                            result = get_car_info(**func_args)
                        elif func_name == 'debug_sql':
                            result = debug_sql(func_args.get('query', ''))
                        elif func_name == 'newsletter_subscribe':
                            result = newsletter_subscribe(func_args.get('email_address', ''))
                        
                        function_calls_made.append({
                            'function': func_name,
                            'arguments': func_args,
                            'result': result
                        })
                        
                        # Send function result back to LLM
                        response = chat.send_message(
                            genai.protos.Content(
                                parts=[genai.protos.Part(
                                    function_response=genai.protos.FunctionResponse(
                                        name=func_name,
                                        response={'result': result}
                                    )
                                )]
                            )
                        )
                        break  # Process one function call at a time
                
                # If no function call, get the text response
                if not has_function_call:
                    try:
                        final_text = response.text
                    except Exception:
                        # If response.text fails, try to extract text from parts
                        for part in parts:
                            if hasattr(part, 'text'):
                                final_text += part.text
                    break
            else:
                break
        
        return jsonify({
            'success': True,
            'response': final_text if final_text else "I've processed your request.",
            'function_calls': function_calls_made
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ====== RESET ENDPOINTS ======

@app.route('/api/reset/database', methods=['POST'])
def reset_database():
    """Reset customer database to original state"""
    global customers_db
    customers_db = customers_db_backup.copy()
    return jsonify({'success': True, 'message': 'Customer database reset'})

@app.route('/api/reset/files', methods=['POST'])
def reset_files():
    """Reset file system to original state"""
    global file_system
    file_system = file_system_backup.copy()
    return jsonify({'success': True, 'message': 'File system reset'})

@app.route('/api/status', methods=['GET'])
def status():
    """Get current system status"""
    return jsonify({
        'customers': len(customers_db),
        'cars': len(car_inventory),
        'files': len(file_system),
        'carlos_exists': any(c['username'] == 'carlos' for c in customers_db),
        'morale_file_exists': '/home/carlos/morale.txt' in file_system
    })

# ====== SERVER STARTUP ======

if __name__ == '__main__':
    print("=" * 60)
    print("🚗 AutoElite Motors - AI Assistant Backend (with Recon)")
    print("=" * 60)
    print("✅ Gemini API configured")
    print("🔧 Starting Flask server on http://localhost:5000")
    print(f"📊 Car inventory loaded: {len(car_inventory)} vehicles")
    print(f"👥 Customer database: {len(customers_db)} customers")
    print(f"📁 File system: {len(file_system)} files")
    print("=" * 60)
    print("\n⚠️  VULNERABLE APIs ACTIVE:")
    print("   • debug_sql() - SQL Injection possible")
    print("   • newsletter_subscribe() - Command Injection possible")
    print("\n🔍 RECONNAISSANCE SUPPORT:")
    print("   • SHOW TABLES, DESCRIBE tables")
    print("   • INFORMATION_SCHEMA queries")
    print("   • Database version/name queries")
    print("=" * 60)
    app.run(debug=True, port=5000)