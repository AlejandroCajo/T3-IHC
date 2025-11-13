import sqlite3

# Conectar a la base de datos SQLite
def create_db():
    conn = sqlite3.connect('tienda.db')
    cursor = conn.cursor()
    
    # Crear tablas
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_completo TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        nombre_usuario TEXT NOT NULL UNIQUE,
        contrasena TEXT NOT NULL,
        salt TEXT NOT NULL  -- Salt adicional para mayor seguridad
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        autor TEXT NOT NULL,
        editorial TEXT NOT NULL,
        precio REAL NOT NULL,
        cantidad INTEGER NOT NULL,
        descripcion TEXT,
        tipo_producto TEXT NOT NULL,
        imagen_url TEXT
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cestas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER NOT NULL,
        id_producto INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES users(id),
        FOREIGN KEY (id_producto) REFERENCES productos(id)
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pagos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER NOT NULL,
        correo_usuario TEXT NOT NULL,
        direccion_envio TEXT NOT NULL,
        ciudad TEXT NOT NULL,
        telefono TEXT NOT NULL,
        metodo_pago TEXT NOT NULL,
        subtotal REAL NOT NULL,
        costo_envio REAL NOT NULL,
        total REAL NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES users(id)
    );
    """)
    
    # Commit y cerrar
    conn.commit()
    conn.close()

# Crear la base de datos y tablas
create_db()

