document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const messageDiv = document.getElementById('message');

    if (password !== confirmPassword) {
        messageDiv.textContent = 'Error: Las contraseñas no coinciden.';
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        return;
    }

    // Enviar datos al servidor Flask
    try {
        const response = await fetch('/api/register', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_completo: name,
                correo: email,
                nombre_usuario: username,
                contrasena: password
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            messageDiv.textContent = result.message;
            messageDiv.style.display = 'block';
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            setTimeout(() => {
                window.location.href = 'login_client.html';
            }, 2000);
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.display = 'block';
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'Error al conectar con el servidor.';
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
    }
});
