        // Cargar e insertar el contenido de navbar.html
        document.addEventListener("DOMContentLoaded", function () {
            fetch("/app/pages/components/navbar.html")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("navbar-container").innerHTML = data;
                })
                .catch(error => console.error("Error al cargar el navbar:", error));
        });