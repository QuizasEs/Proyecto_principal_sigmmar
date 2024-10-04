// Obtener la ID del usuario de la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// Función para prellenar el formulario con los datos del usuario
function cargarUsuario() {
    if (userId) {
        fetch(`/api/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el usuario');
                }
                return response.json();
            })
            .then(user => {
                document.getElementById('username').value = user.us_username;
                document.getElementById('nombres').value = user.us_nombres;
                document.getElementById('ap_paterno').value = user.us_ap_paterno;
                document.getElementById('ap_materno').value = user.us_ap_materno;
                document.getElementById('correo').value = user.us_correo;
                document.getElementById('telefono').value = user.us_telefono;
            })
            .catch(error => console.error('Error al cargar el usuario:', error));
    }
}

// Manejar el envío del formulario para modificar el usuario
/* 
function manejarEnvioFormulario() {
    document.getElementById('modificarUsuarioForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const userData = {
            us_username: document.getElementById('username').value,
            us_nombres: document.getElementById('nombres').value,
            us_ap_paterno: document.getElementById('ap_paterno').value,
            us_ap_materno: document.getElementById('ap_materno').value,
            us_correo: document.getElementById('correo').value,
            us_telefono: document.getElementById('telefono').value,
        };

        fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el usuario');
                }
                return response.json();
            })
            .then(result => {
                alert(result.message);
                window.location.href = "/usuarios.html";
            })
            .catch(error => console.error('Error al actualizar el usuario:', error));
    });
} */

// Cargar los usuarios y crear la tabla
function cargarUsuarios() {
    fetch('/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los usuarios');
            }
            return response.json();
        })
        .then(users => {
            const userTableBody = document.getElementById('userTableBody');
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.us_username}</td>
                    <td>${user.us_password}</td>
                    <td>${user.us_nombres}</td>
                    <td>${user.us_ap_paterno}</td>
                    <td>${user.us_ap_materno}</td>
                    <td>${user.us_correo}</td>
                    <td>${user.us_telefono}</td>
                `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
}


// Unificar el uso de DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    cargarUsuario();
    cargarUsuarios();

});
