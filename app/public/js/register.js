// Selecciona el primer elemento con la clase "error" y lo guarda en la variable mensajeError
const mensajeError = document.getElementsByClassName("error")[0];

// Añade un evento "submit" al formulario con el id "register-form"
document.getElementById("register-form").addEventListener("submit", async (e) => {
    // Previene que el formulario se envíe y recargue la página
    e.preventDefault();
    
    // Imprime en la consola el valor del campo "user" del formulario
    console.log(e.target.children.user.value);
    
    try {
        
        // Envía una solicitud POST a la URL especificada con los datos del formulario
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Especifica que el contenido es JSON
            },
            body: JSON.stringify({
                user: e.target.children.user.value, // Obtiene el valor del campo "user"
                password: e.target.children.password.value, // Obtiene el valor del campo "password"
                email: e.target.children.email.value, // Obtiene el valor del campo "email"
                username: e.target.children.username.value, // Obtiene el valor del campo "username"
                lastnamefather: e.target.children.lastnamefather.value, // Obtiene el valor del campo "lastnamefather"
                lastnamemother: e.target.children.lastnamemother.value, // Obtiene el valor del campo "lastnamemother"
                telefono: e.target.children.telefono.value, // Obtiene el valor del campo "telefono"
            })
            
        });
        
        // Si la respuesta no es exitosa, muestra el mensaje de error
        if (!res.ok) return alert("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
        
        // Convierte la respuesta a JSON
        const resJson = await res.json();
        
        // Si la respuesta JSON contiene una redirección, redirige a la URL especificada
        if (resJson.redirect) {
            window.location.href = resJson.redirect;
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
    }
});