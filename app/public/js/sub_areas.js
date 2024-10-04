// Escucha el evento 'DOMContentLoaded' para ejecutar el código una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async function () {
    const path = window.location.pathname; // Obtiene la ruta actual de la URL
    try {
        if (path === '/sub_areas') {
            await loadSubAreas(); // Cargar sub áreas al cargar la página
        } else if (path === '/crear_sub_areas') {
            await loadAreas(); // Cargar áreas al crear sub área
            document.getElementById('subAreaFormCreate').addEventListener('submit', registerSubArea); // Añadir evento de envío al formulario de creación
            await loadSubAreaDetails('crear'); // Cargar detalles (sin datos) para crear
        } else if (path === '/modificar_sub_areas') {
            const subAreaId = new URLSearchParams(window.location.search).get('id'); // Obtener el ID de la sub área de la URL
            await Promise.all([loadAreas(), loadSubAreaDetails('modificar', subAreaId)]); // Cargar detalles para modificar
            document.getElementById('editSubAreaForm').addEventListener('submit', updateSubArea); // Añadir evento de envío al formulario de edición
        }

        // Añadir evento al botón cancelar para volver a la lista de sub áreas
        const cancelButton = document.querySelector('.btn-cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => window.location.href = '/sub_areas');
        }
    } catch (error) {
        console.error('Error durante la carga de la página:', error);
        alert('Ocurrió un error al cargar la página. Por favor, intente de nuevo.');
    }
});

// Función para cargar las sub áreas desde la API
async function loadSubAreas() {
    try {
        const response = await fetch('/api/sub_areas'); // Realiza una solicitud GET a la API
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const subAreas = await response.json(); // Convierte la respuesta a JSON
        const tableBody = document.getElementById('subAreaTableBody');
        tableBody.innerHTML = ''; // Limpiar el cuerpo de la tabla

        const fragment = document.createDocumentFragment();
        subAreas.forEach(subArea => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subArea.sub_id}</td>
                <td>${subArea.sub_nombre}</td>
                <td>${subArea.area_nombre}</td>
                <td>${subArea.sub_descripcion}</td>
                <td><img src="${subArea.sub_directorio_img}" alt="Imagen de ${subArea.sub_nombre}" style="width: 100px; height: auto;"></td>
                <td>${subArea.sub_estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="btn btn-primary" onclick="editSubArea(${subArea.sub_id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteSubArea(${subArea.sub_id})">Eliminar</button>
                </td>
            `;
            fragment.appendChild(row);
        });
        tableBody.appendChild(fragment); // Añadir las filas al cuerpo de la tabla
    } catch (error) {
        console.error('Error al cargar sub áreas:', error);
        alert('Error al cargar las sub áreas. Por favor, intente de nuevo más tarde.');
    }
}

// Función para registrar una nueva sub área
async function registerSubArea(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    try {
        const formData = new FormData(document.getElementById('subAreaFormCreate')); // Obtener los datos del formulario
        const response = await fetch('/api/sub_areas', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al registrar la sub área.');
        }

        alert('Sub área registrada con éxito.');
        window.location.href = '/sub_areas'; // Redirigir a la lista de sub áreas
    } catch (error) {
        console.error("Error en la creación de la sub área:", error);
        alert(`Error: ${error.message}`);
    }
}

// Función para eliminar una sub área
async function deleteSubArea(id) {
    if (confirm('¿Está seguro de que desea eliminar esta sub área?')) {
        try {
            const response = await fetch(`/api/sub_areas/${id}`, { method: 'DELETE' }); // Realiza una solicitud DELETE a la API
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            alert(data.message);
            await loadSubAreas(); // Recargar la lista de sub áreas
        } catch (error) {
            console.error('Error al eliminar la sub área:', error);
            alert('Error al eliminar la sub área. Por favor, intente de nuevo.');
        }
    }
}

// Función para redirigir a la página de edición de sub áreas
function editSubArea(id) {
    window.location.href = `/modificar_sub_areas?id=${id}`;
}

// Función para actualizar una sub área existente
async function updateSubArea(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    const form = event.target;
    const formData = new FormData(form);
    const id = new URLSearchParams(window.location.search).get('id'); // Obtener ID de la URL

    try {
        const response = await fetch(`/api/sub_areas/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la sub área.');
        }

        alert('Sub área actualizada con éxito.');
        window.location.href = '/sub_areas'; // Redirigir a la lista de sub áreas
    } catch (error) {
        console.error("Error al actualizar la sub área:", error);
        alert(`Error: ${error.message}`);
    }
}

// Función para cargar los detalles de una sub área
async function loadSubAreaDetails(mode, id) {
    if (mode === 'modificar') {
        try {
            const response = await fetch(`/api/sub_areas/${id}`); // Realiza una solicitud GET a la API
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const subArea = await response.json();

            // Llenar el formulario con los datos de la sub área
            document.getElementById('subAreaNombre').value = subArea.sub_nombre;
            document.getElementById('subAreaArea').value = subArea.area_id; // Cambiar a area_id para el select
            document.getElementById('subAreaDescripcion').value = subArea.sub_descripcion;

            if (subArea.sub_directorio_img) {
                const imgPreview = document.getElementById('currentImagePreview');
                imgPreview.src = subArea.sub_directorio_img; // Previsualizar la imagen
            }
        } catch (error) {
            console.error('Error al cargar los detalles de la sub área:', error);
            alert('Espere Por favor.');
        }
    } else {
        // En el modo de creación, limpiar el formulario
        document.getElementById('subAreaNombre').value = '';
        document.getElementById('subAreaArea').value = ''; // No se debe mostrar nada en creación
        document.getElementById('subAreaDescripcion').value = '';
        const imgPreview = document.getElementById('currentImagePreview');
        imgPreview.src = ''; // Limpiar la previsualización de la imagen
    }
}

// Función para cargar las áreas desde la API
async function loadAreas() {
    try {
        const response = await fetch('/api/areas'); // Realiza una solicitud GET a la API
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const areas = await response.json();
        const select = document.getElementById('subAreaArea') || document.getElementById('editSubAreaArea');
        select.innerHTML = '<option value="">Seleccione un área</option>';
        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.area_id;
            option.text = area.area_nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar áreas:', error);
        alert('Error al cargar las áreas. Por favor, recargue la página.');
    }
}
