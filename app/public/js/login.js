// Selecciona el primer elemento con la clase "error" y lo guarda en la variable mensajeError
const mensajeError = document.getElementsByClassName("error")[0];

// Añade un evento "submit" al formulario con el id "login-form"
document.getElementById("login-form").addEventListener("submit", async (e) => {
    // Previene que el formulario se envíe y recargue la página
    e.preventDefault();
    
    // Obtiene los valores de los campos "user" y "password" del formulario
    const user = e.target.children.user.value;
    const password = e.target.children.password.value;
    
    // Envía una solicitud POST a la URL especificada con los datos del formulario
    const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Especifica que el contenido es JSON
        },
        body: JSON.stringify({
            user, password // Envía los valores de "user" y "password" en el cuerpo de la solicitud
        })
    });
    
    // Si la respuesta no es exitosa, muestra el mensaje de error
    if (!res.ok) return alert("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
    
    // Convierte la respuesta a JSON
    const resJson = await res.json();
    
    // Si la respuesta JSON contiene una redirección, redirige a la URL especificada
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
