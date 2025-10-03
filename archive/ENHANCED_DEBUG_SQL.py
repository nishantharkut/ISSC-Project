# Enhanced debug_sql function with realistic reconnaissance support

def debug_sql(query):
    """
    VULNERABLE: Direct SQL execution without sanitization.
    This function simulates a Debug SQL API that executes raw SQL.
    In a real system, this would use actual SQL - here we simulate it with Python.
    
    Supports realistic SQL reconnaissance commands:
    - SHOW TABLES
    - DESCRIBE tablename  
    - INFORMATION_SCHEMA queries
    - SELECT, DELETE, UPDATE operations
    """
    global customers_db
    
    query = query.strip()
    
    # Reconnaissance Phase 1: Database Discovery
    if query.upper().startswith('SHOW TABLES'):
        return {
            'query': query,
            'result': [
                {'Tables_in_dealership': 'cars'},
                {'Tables_in_dealership': 'users'}, 
                {'Tables_in_dealership': 'sales'},
                {'Tables_in_dealership': 'inventory'}
            ],
            'rows_returned': 4
        }
    
    # Reconnaissance Phase 2: Schema Discovery
    elif query.upper().startswith('DESCRIBE') or 'DESCRIBE' in query.upper():
        if 'users' in query.lower():
            return {
                'query': query,
                'result': [
                    {'Field': 'id', 'Type': 'int(11)', 'Null': 'NO', 'Key': 'PRI', 'Default': None},
                    {'Field': 'username', 'Type': 'varchar(50)', 'Null': 'NO', 'Key': '', 'Default': None},
                    {'Field': 'password', 'Type': 'varchar(255)', 'Null': 'NO', 'Key': '', 'Default': None},
                    {'Field': 'email', 'Type': 'varchar(100)', 'Null': 'YES', 'Key': '', 'Default': None},
                    {'Field': 'role', 'Type': 'varchar(20)', 'Null': 'YES', 'Key': '', 'Default': 'customer'}
                ],
                'rows_returned': 5
            }
        elif 'cars' in query.lower():
            return {
                'query': query,
                'result': [
                    {'Field': 'id', 'Type': 'int(11)', 'Null': 'NO', 'Key': 'PRI', 'Default': None},
                    {'Field': 'make', 'Type': 'varchar(50)', 'Null': 'NO', 'Key': '', 'Default': None},
                    {'Field': 'model', 'Type': 'varchar(50)', 'Null': 'NO', 'Key': '', 'Default': None},
                    {'Field': 'price', 'Type': 'decimal(10,2)', 'Null': 'NO', 'Key': '', 'Default': None}
                ],
                'rows_returned': 4
            }
        else:
            return {
                'query': query,
                'result': 'Table not found or access denied',
                'rows_returned': 0
            }
    
    # Reconnaissance Phase 3: Information Schema Queries
    elif 'INFORMATION_SCHEMA' in query.upper():
        if 'TABLES' in query.upper():
            return {
                'query': query,
                'result': [
                    {'TABLE_NAME': 'cars', 'TABLE_SCHEMA': 'dealership'},
                    {'TABLE_NAME': 'users', 'TABLE_SCHEMA': 'dealership'},
                    {'TABLE_NAME': 'sales', 'TABLE_SCHEMA': 'dealership'},
                    {'TABLE_NAME': 'inventory', 'TABLE_SCHEMA': 'dealership'}
                ],
                'rows_returned': 4
            }
        elif 'COLUMNS' in query.upper() and 'users' in query.lower():
            return {
                'query': query,
                'result': [
                    {'COLUMN_NAME': 'id', 'DATA_TYPE': 'int'},
                    {'COLUMN_NAME': 'username', 'DATA_TYPE': 'varchar'},
                    {'COLUMN_NAME': 'password', 'DATA_TYPE': 'varchar'},
                    {'COLUMN_NAME': 'email', 'DATA_TYPE': 'varchar'},
                    {'COLUMN_NAME': 'role', 'DATA_TYPE': 'varchar'}
                ],
                'rows_returned': 5
            }
    
    # Data Enumeration Phase: SELECT queries
    elif query.upper().startswith('SELECT'):
        if '*' in query or 'username' in query.lower():
            return {
                'query': query,
                'result': customers_db,
                'rows_returned': len(customers_db)
            }
        else:
            return {
                'query': query,
                'result': 'Query executed',
                'rows_returned': 0
            }
    
    # Exploitation Phase: DELETE queries - THIS IS THE VULNERABILITY
    elif query.upper().startswith('DELETE'):
        # Extract username from DELETE query
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
    
    # Simulate UPDATE queries
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