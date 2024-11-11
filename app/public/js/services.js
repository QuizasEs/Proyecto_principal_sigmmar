// Llama a la función para cargar las áreas al cargar la página
document.addEventListener('DOMContentLoaded', getServices);

// Función asíncrona para obtener y mostrar las áreas disponibles
async function getServices() {
    try {
        // Realiza una solicitud a la API para obtener los servicios
        const response = await fetch('/api/areas'); // Asegúrate de que esta URL coincida con tu backend
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
        
        const data = await response.json();

        // Obtiene el contenedor donde se mostrarán las áreas
        const container = document.getElementById('areasContainer');
        if (!container) throw new Error('Contenedor "areasContainer" no encontrado en el DOM');

        // Limpia el contenedor antes de agregar nuevas áreas
        container.innerHTML = '';

        // Itera sobre cada área recibida de la API
        data.forEach((area, index) => {
            // Crea un nuevo elemento div para cada área
            const areaElement = document.createElement('div');
            // Agrega clases al elemento div para el estilo
            areaElement.classList.add('grid-item', `grid-item${index + 1}`);
            // Define el contenido HTML del elemento div
            areaElement.innerHTML = `
                <div class="carta">
                    <img src="${area.area_directorio_img}" alt="${area.area_nombre}">
                    <h3>${area.area_nombre}</h3>
                    <p>${area.area_descripcion}</p>
                    <a onclick="getSubServices(${area.area_id})">
                        <button>Ver más</button>
                    </a>

                </div>
            `;
            // Agrega el elemento div al contenedor
            container.appendChild(areaElement);
        });

    } catch (error) {
        // Muestra cualquier error en la consola
        console.error('Error al obtener servicios:', error);
    }
}
async function getSubServices(area_id) {

        //redirigir a la página de detalle de los sub áreas
        window.location.href = `/service?id=${area_id}`;

}
