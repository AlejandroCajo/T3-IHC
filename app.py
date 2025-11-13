from flask import Flask, render_template, request, jsonify
import sqlite3
import os
import hashlib
import secrets

app = Flask(__name__)

# Ruta absoluta hacia la base de datos
DB_PATH = os.path.join(os.path.dirname(__file__), 'tienda.db')

# ------------------------------
# FUNCIONES AUXILIARES
# ------------------------------
def query_db(query, args=(), one=False):
    """Ejecuta una consulta SQL y devuelve los resultados."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(query, args)
    conn.commit()
    data = cursor.fetchall()
    conn.close()
    return (data[0] if data else None) if one else data

# ------------------------------
# RUTAS DE PÁGINAS HTML
# ------------------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/templates/register.html')
def register_page():
    return render_template('register.html')

@app.route('/templates/login_client.html')
def login_page():
    return render_template('login_client.html')


@app.route('/templates/products.html')
def products():
    return render_template('products.html')


@app.route('/templates/product_detail.html')
def product_detail_page():
    return render_template('product_detail.html')

@app.route('/templates/search.html')
def search_page():
    return render_template('search.html')

@app.route('/templates/cart.html')
def search_cart():
    return render_template('cart.html')

@app.route('/templates/checkout.html')
def search_checkout():
    return render_template('checkout.html')

@app.route('/templates/confirmation.html')
def search_confirmation():
    return render_template('confirmation.html')

# ------------------------------
# API: REGISTRO DE USUARIO
# ------------------------------
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    nombre_completo = data.get('nombre_completo')
    correo = data.get('correo')
    nombre_usuario = data.get('nombre_usuario')
    contrasena = data.get('contrasena')

    # Validar campos vacíos
    if not all([nombre_completo, correo, nombre_usuario, contrasena]):
        return jsonify({"status": "error", "message": "Todos los campos son obligatorios"}), 400

    # Generar salt y hash
    salt = secrets.token_hex(16)
    hashed_pw = hashlib.sha256((contrasena + salt).encode()).hexdigest()

    try:
        query_db("""
            INSERT INTO users (nombre_completo, correo, nombre_usuario, contrasena, salt)
            VALUES (?, ?, ?, ?, ?)
        """, (nombre_completo, correo, nombre_usuario, hashed_pw, salt))
        return jsonify({"status": "success", "message": "Usuario registrado correctamente"})
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "El correo o usuario ya existen"}), 409

# ------------------------------
# API: LOGIN DE USUARIO
# ------------------------------
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    correo = data.get('email')
    contrasena = data.get('password')

    if not correo or not contrasena:
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    # Buscar usuario en base de datos
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT contrasena, salt FROM users WHERE correo = ?", (correo,))
    user = cursor.fetchone()
    conn.close()

    if user:
        stored_hash, stored_salt = user
        hashed_input = hashlib.sha256((contrasena + stored_salt).encode()).hexdigest()

        if hashed_input == stored_hash:
            return jsonify({"success": True, "message": "Login exitoso"})
        else:
            return jsonify({"success": False, "message": "Contraseña incorrecta"}), 401
    else:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404


# ------------------------------
# API: LISTA DE PRODUCTOS
# ------------------------------
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, nombre, autor, editorial, precio, cantidad, descripcion, tipo_producto, imagen_url
        FROM productos
    """)
    productos = cursor.fetchall()
    conn.close()

    # Convertir a lista de diccionarios
    productos_list = []
    for p in productos:
        productos_list.append({
            "id": p[0],
            "nombre": p[1],
            "autor": p[2],
            "editorial": p[3],
            "precio": p[4],
            "cantidad": p[5],
            "descripcion": p[6],
            "tipo_producto": p[7],
            "imagen_url": p[8]
        })
    
    return jsonify(productos_list)

# ----------------------
@app.route('/api/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, nombre, autor, editorial, precio, cantidad, descripcion, tipo_producto, imagen_url
        FROM productos
        WHERE id = ?
    """, (product_id,))
    product = cursor.fetchone()
    conn.close()

    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    product_data = {
        "id": product[0],
        "nombre": product[1],
        "autor": product[2],
        "editorial": product[3],
        "precio": product[4],
        "cantidad": product[5],
        "descripcion": product[6],
        "tipo_producto": product[7],
        "imagen_url": product[8]
    }

    return jsonify(product_data)



# ------------------------------
# API: BÚSQUEDA DE PRODUCTOS
# ------------------------------
@app.route('/api/search')
def search_products():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify([])

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, nombre, autor, editorial, precio, cantidad, descripcion, tipo_producto, imagen_url
        FROM productos
        WHERE nombre LIKE ? OR autor LIKE ? OR editorial LIKE ? OR tipo_producto LIKE ?
    """, (f"%{q}%", f"%{q}%", f"%{q}%", f"%{q}%"))
    rows = cursor.fetchall()
    conn.close()

    products = [dict(row) for row in rows]
    return jsonify(products)

# ------------------------------
# MAIN
# ------------------------------
if __name__ == '__main__':
    app.run(debug=True)
