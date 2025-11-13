from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3

app = Flask(__name__)

# Conexión a BD
def get_db_connection():
    conn = sqlite3.connect('tienda.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    productos = conn.execute('SELECT * FROM productos').fetchall()
    conn.close()
    return render_template('index.html', productos=productos)

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form['nombre']
        correo = request.form['correo']
        usuario = request.form['usuario']
        contrasena = request.form['contrasena']
        salt = 'abc123'  # temporal, luego puedes usar os.urandom()

        conn = get_db_connection()
        try:
            conn.execute("""
                INSERT INTO users (nombre_completo, correo, nombre_usuario, contrasena, salt)
                VALUES (?, ?, ?, ?, ?)
            """, (nombre, correo, usuario, contrasena, salt))
            conn.commit()
        except sqlite3.IntegrityError:
            return "Usuario o correo ya existe"
        finally:
            conn.close()
        return redirect(url_for('index'))
    return render_template('register.html')

@app.route('/productos')
def productos():
    conn = get_db_connection()
    data = conn.execute('SELECT * FROM productos').fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])

if __name__ == '__main__':
    app.run(debug=True)

