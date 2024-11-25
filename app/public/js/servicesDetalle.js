document.addEventListener('DOMContentLoaded', getServicesDetalle);

async function getServicesDetalle() {
    try {
        // Obtiene el parámetro `id` desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id'); // Obtén el valor del parámetro `id`

        if (!id) throw new Error("ID no encontrado en la URL");

        // Realiza una petición a la API para obtener la información del área y sus sub servicios
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
        
        const { area, subAreas } = await response.json();

        // Obtiene el contenedor donde se mostrarán los detalles
        const container = document.getElementById('servicio');
        if (!container) throw new Error('Contenedor "servicio" no encontrado en el DOM');

        // Limpia el contenedor antes de agregar los detalles del área
        container.innerHTML = '';

        // Muestra la información del área principal
        const areaElement = document.createElement('div');
        areaElement.classList.add('area-details');
        areaElement.innerHTML = `
            <h2>${area.area_nombre}</h2>
            <img src="${area.area_directorio_img}" alt="${area.area_nombre}" style="width:50%;height:auto;">
            <p>${area.area_descripcion}</p>
        `;
        container.appendChild(areaElement);

        // Muestra los sub servicios del área
        subAreas.forEach(subArea => {
            const subAreaElement = document.createElement('div');
            subAreaElement.classList.add('sub-area-item');
            subAreaElement.innerHTML = `
                <div>
                    <h3>${subArea.sub_nombre}</h3>
                    <img src="${subArea.sub_directorio_img}" alt="${subArea.sub_nombre}" style="width:40%;height:auto;">
                    <p>${subArea.sub_descripcion}</p>
                </div>
            `;
            container.appendChild(subAreaElement);
        });

    } catch (error) {
        console.error("Error al obtener los sub servicios:", error);
    }
}
