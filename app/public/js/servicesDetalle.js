// Llama a la función para cargar las áreas al cargar la página
document.addEventListener('DOMContentLoaded', getServices);

async function getServicesDetalle() {
    try{
        //realiza unapeticion a la api para optener todos los sub servicios del area de id correspondiente
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
        
        const data = await response.json();

        // Obtiene el contenedor donde se mostrarán las subareas
    }catch(error){
        console.error("Error al obtener los sub servicios:", error);
    }

}