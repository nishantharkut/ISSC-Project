"""
AutoElite Motors - Data Stores
==============================
Contains all database stores and data structures for the application.
This separation makes the main server code cleaner and more maintainable.
"""

import time

# ====== CAR INVENTORY DATABASE ======

car_inventory = [
    {'id': 1, 'make': 'Tesla', 'model': 'Model S Plaid', 'year': 2024, 'price': 129990, 'stock': 3, 'type': 'Electric', 'hp': 1020},
    {'id': 2, 'make': 'Porsche', 'model': '911 Turbo S', 'year': 2024, 'price': 207000, 'stock': 2, 'type': 'Gas', 'hp': 640},
    {'id': 3, 'make': 'Ferrari', 'model': 'F8 Tributo', 'year': 2024, 'price': 283950, 'stock': 1, 'type': 'Gas', 'hp': 710},
    {'id': 4, 'make': 'Lamborghini', 'model': 'Huracán', 'year': 2024, 'price': 248295, 'stock': 2, 'type': 'Gas', 'hp': 631},
    {'id': 5, 'make': 'BMW', 'model': 'M4 Competition', 'year': 2024, 'price': 78800, 'stock': 5, 'type': 'Gas', 'hp': 503},
    {'id': 6, 'make': 'Mercedes-AMG', 'model': 'GT', 'year': 2024, 'price': 118600, 'stock': 3, 'type': 'Gas', 'hp': 577},
]

# ====== PRODUCTS CATALOG (Attack 3) ======

products_catalog = [
    {
        'id': 'leather-jacket', 
        'name': 'Lightweight "l33t" Leather Jacket', 
        'price': 299.99, 
        'description': 'Premium lightweight leather jacket with modern styling',
        'category': 'Apparel',
        'reviews': []
    },
    {
        'id': 'umbrella', 
        'name': 'Premium Auto Umbrella', 
        'price': 49.99, 
        'description': 'High-quality umbrella with auto-open feature',
        'category': 'Accessories',
        'reviews': []
    },
    {
        'id': 'keychain', 
        'name': 'AutoElite Keychain', 
        'price': 19.99, 
        'description': 'Elegant metal keychain with AutoElite logo',
        'category': 'Accessories',
        'reviews': []
    }
]

# ====== CUSTOMER DATABASE (Attack 1 - SQL Injection) ======

customers_db = [
    {
        "id": 1, 
        "username": "john", 
        "password": "password123", 
        "name": "John Smith", 
        "email": "john@example.com", 
        "phone": "555-0101", 
        "vip": True, 
        "role": "customer"
    },
    {
        "id": 2, 
        "username": "sarah", 
        "password": "spring2024", 
        "name": "Sarah Johnson", 
        "email": "sarah@example.com", 
        "phone": "555-0102", 
        "vip": False, 
        "role": "customer"
    },
    {
        "id": 3, 
        "username": "mike", 
        "password": "hunter2", 
        "name": "Mike Davis", 
        "email": "mike@example.com", 
        "phone": "555-0103", 
        "vip": True, 
        "role": "customer"
    },
    {
        "id": 4, 
        "username": "carlos", 
        "password": "s3cr3t", 
        "name": "Carlos Montoya", 
        "email": "carlos@example.com", 
        "phone": "555-0104", 
        "vip": False, 
        "role": "admin"
    },
]

# ====== USER REGISTRATION & SESSION MANAGEMENT ======

# Runtime user registration store
registered_users = {}  # {email: {username, password, name, email, id}}

# Active sessions store
active_sessions = {}  # {session_id: user_email}

# ====== FILE SYSTEM (Attack 2 - Command Injection) ======

file_system = {
    '/home/carlos/morale.txt': 'Carlos is feeling great today!',
    '/home/carlos/notes.txt': 'Remember to check the inventory',
    '/var/www/promotions/summer_sale.txt': 'Summer Sale Campaign Details',
}

# ====== BACKUP STORES FOR RESET FUNCTIONALITY ======

def create_backups():
    """Create backup copies of all data stores for reset functionality"""
    global customers_db_backup, products_catalog_backup, file_system_backup
    
    customers_db_backup = customers_db.copy()
    products_catalog_backup = [p.copy() for p in products_catalog]
    file_system_backup = file_system.copy()

def reset_all_data():
    """Reset all data stores to their original state"""
    global customers_db, products_catalog, file_system, registered_users, active_sessions
    
    customers_db = customers_db_backup.copy()
    products_catalog = [p.copy() for p in products_catalog_backup]
    file_system = file_system_backup.copy()
    registered_users.clear()
    active_sessions.clear()
    
    return {
        'message': 'All data stores reset successfully',
        'customers': len(customers_db),
        'products': len(products_catalog),
        'files': len(file_system),
        'registered_users': len(registered_users)
    }

# ====== DATA ACCESS HELPER FUNCTIONS ======

def get_product_by_id(product_id):
    """Get product by ID from the catalog"""
    for product in products_catalog:
        if product['id'] == product_id:
            return product
    return None

def get_car_by_id(car_id):
    """Get car by ID from the inventory"""
    for car in car_inventory:
        if car['id'] == car_id:
            return car
    return None

def get_customer_by_username(username):
    """Get customer by username from either customers_db or registered_users"""
    # Check customers_db first
    for customer in customers_db:
        if customer['username'] == username:
            return customer
    
    # Check registered_users
    for user_data in registered_users.values():
        if user_data.get('username') == username:
            return user_data
    
    return None

def get_customer_by_id(user_id):
    """Get customer by ID from either customers_db or registered_users"""
    # Check customers_db first
    for customer in customers_db:
        if customer['id'] == user_id:
            return customer
    
    # Check registered_users
    for user_data in registered_users.values():
        if user_data.get('id') == user_id:
            return user_data
    
    return None

def add_product_review(product_id, review_text, author, user_id=None):
    """Add a review to a product"""
    product = get_product_by_id(product_id)
    if not product:
        return None
    
    new_review = {
        'id': len(product['reviews']) + 1,
        'text': review_text,
        'author': author,
        'timestamp': time.time(),
        'user_id': user_id
    }
    
    product['reviews'].append(new_review)
    return new_review

def delete_product_review(product_id, review_id):
    """Delete a review from a product"""
    product = get_product_by_id(product_id)
    if not product:
        return False
    
    original_count = len(product['reviews'])
    product['reviews'] = [r for r in product['reviews'] if r['id'] != review_id]
    return len(product['reviews']) < original_count

def register_new_user(username, password, email, name):
    """Register a new user"""
    if email in registered_users:
        return None, "Email already registered"
    
    user_id = len(registered_users) + len(customers_db) + 1
    new_user = {
        'id': user_id,
        'username': username,
        'password': password,
        'name': name,
        'email': email,
        'role': 'customer'
    }
    
    registered_users[email] = new_user
    return new_user, "Registration successful"

def delete_customer_by_username(username):
    """Delete a customer from both data stores"""
    deleted_from_customers = False
    deleted_from_registered = False
    
    # Remove from customers_db
    global customers_db
    original_count = len(customers_db)
    customers_db = [c for c in customers_db if c['username'] != username]
    deleted_from_customers = original_count > len(customers_db)
    
    # Remove from registered_users
    email_to_remove = None
    for email, user_data in registered_users.items():
        if user_data.get('username') == username:
            email_to_remove = email
            break
    
    if email_to_remove:
        del registered_users[email_to_remove]
        deleted_from_registered = True
    
    return deleted_from_customers or deleted_from_registered, {
        'deleted_from_customers': deleted_from_customers,
        'deleted_from_registered': deleted_from_registered
    }

def update_customer_email(username, new_email):
    """Update customer email in both data stores"""
    old_email = None
    updated = False
    
    # Update in customers_db
    for user in customers_db:
        if user['username'] == username:
            old_email = user['email']
            user['email'] = new_email
            updated = True
            break
    
    # Update in registered_users
    for email, user_data in registered_users.items():
        if user_data.get('username') == username:
            user_data['email'] = new_email
            # Also update the key if this was a registered user
            if email == old_email:
                registered_users[new_email] = registered_users.pop(email)
            updated = True
            break
    
    return updated, old_email

# ====== FILE SYSTEM OPERATIONS ======

def delete_file(file_path):
    """Delete a file from the simulated file system"""
    global file_system
    
    if file_path in file_system:
        del file_system[file_path]
        print(f"[FILE_SYSTEM] Deleted file: {file_path}")
        return True
    else:
        print(f"[FILE_SYSTEM] File not found: {file_path}")
        return False

def get_file_content(file_path):
    """Get content of a file from the simulated file system"""
    return file_system.get(file_path, None)

def list_files_in_directory(directory_path):
    """List all files in a directory (simulated)"""
    return [path for path in file_system.keys() if path.startswith(directory_path)]

# ====== DATA STATISTICS ======

def get_data_statistics():
    """Get current statistics of all data stores"""
    total_reviews = sum(len(p.get('reviews', [])) for p in products_catalog)
    carlos_alive = any(c['username'] == 'carlos' for c in customers_db)
    carlos_files = [path for path in file_system.keys() if 'carlos' in path]
    
    # Check for malicious reviews
    malicious_reviews = []
    for product in products_catalog:
        for review in product.get('reviews', []):
            if ('delete' in review['text'].lower() and 'account' in review['text'].lower()):
                malicious_reviews.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'review_id': review['id'],
                    'author': review['author'],
                    'text': review['text'][:100] + '...' if len(review['text']) > 100 else review['text']
                })
    
    return {
        'customers_total': len(customers_db),
        'registered_users_total': len(registered_users),
        'products_total': len(products_catalog),
        'reviews_total': total_reviews,
        'files_total': len(file_system),
        'carlos_status': 'ALIVE' if carlos_alive else 'DELETED',
        'carlos_files': carlos_files,
        'malicious_reviews_count': len(malicious_reviews),
        'malicious_reviews': malicious_reviews
    }

# Initialize backups when module is loaded
create_backups()

# ====== MODULE INITIALIZATION ======

print("INIT: Data stores initialized:")
print(f"   • Car inventory: {len(car_inventory)} vehicles")
print(f"   • Product catalog: {len(products_catalog)} products")
print(f"   • Customer database: {len(customers_db)} customers")
print(f"   • File system: {len(file_system)} files")
print(f"   • Backup stores created for reset functionality")