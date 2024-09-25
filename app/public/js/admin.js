// Espera a que todo el contenido del documento se haya cargado
document.addEventListener("DOMContentLoaded", () => {
    // Selecciona el botón con el id "logout-button" y lo guarda en la variable button
    const button = document.getElementById("logout-button");
    
    // Añade un evento "click" al botón de cerrar sesión
    button.addEventListener("click", async () => {
        // Envía una solicitud POST a la URL "/api/logout" para cerrar sesión
        await fetch('/api/logout', { method: 'POST' });
        
        // Redirige al usuario a la página principal
        document.location.href = "/";
    });
});
