// Llama a la función para cargar las áreas al cargar la página
document.addEventListener('DOMContentLoaded', loadAreas);
//muestra los areas disponibles directamente dentro de la pagina web
async function getServices() {
    try{
        const response = await fetch('/api/services');
        const data = await response.json();

        const container=document.getElementById('areasContainer');
        container.innerHTML = '';//limpiamos eel contenedor antes de agregar nuevas areas

        areas.forEach((area, index) => {
            const areaElement = document.createElement('div');
            areaElement.classList.add('grid-item', `grid-item${index + 1}`);
            areaElement.innerHTML = `
                <div class="carta">
                    <h3>${area.nombre}</h3>
                    <p>${area.descripcion}</p>
                    <a href="/service/${area.id}">
                        <button>Ver más</button>
                    </a>
                </div>
            `;
            container.appendChild(areaElement);
        });
    }catch(error){
        console.log(error);
    }
}