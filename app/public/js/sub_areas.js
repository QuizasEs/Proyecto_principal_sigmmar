// Escucha el evento 'DOMContentLoaded' para ejecutar el código cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async function () {
    const path = window.location.pathname;
     try { 
        if (path === '/sub_areas') {
            await loadSubAreas(); // Cargar sub áreas al cargar la página
        } else if (path === '/crear_sub_areas') {
            const subAreasId = new URLSearchParams(window.location.search).get('id');
            await loadAreas(); // Cargar áreas para selección
            document.getElementById('subAreaFormCreate').addEventListener('submit', registerSubArea);
             // Registrar sub área
        } else if (path === '/modificar_sub_areas') {
            const subAreaId = new URLSearchParams(window.location.search).get('id');
            await loadAreas(); // Cargar áreas para selección
            await loadSubAreaDetails(subAreaId); // Cargar detalles de la sub área a modificar
            document.getElementById('editSubAreaForm').addEventListener('submit', updateSubArea); // Actualizar sub área
        }
        } catch (error) {
        console.error('Error durante la carga de la página:', error);
        alert('Ocurrió un error al cargar la página. Intente de nuevo.');
    } 
});

// Función para cargar las sub áreas desde la API
async function loadSubAreas() {
    try {
        const response = await fetch('/api/sub_areas');


        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const subAreas = await response.json();
        const tableBody = document.getElementById('subAreaTableBody');
        tableBody.innerHTML = '';

        const fragment = document.createDocumentFragment();
        subAreas.forEach(subArea => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subArea.sub_id}</td>
                <td>${subArea.sub_nombre}</td>
                <td>${subArea.area_nombre}</td>
                <td> <div style="overflow-y: auto; height: 8rem;">
                ${subArea.sub_descripcion}
                </div></td>
                <td><img src="${subArea.sub_directorio_img}" alt="Imagen de ${subArea.sub_nombre}" style="width: 140px; height: auto;"></td>
                <td>${subArea.sub_estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="btn btn-primary m-1 px-3" onclick="editSubArea(${subArea.sub_id})">Editar</button>
                    <button class="btn btn-danger m-1" onclick="deleteSubArea(${subArea.sub_id})">Eliminar</button>
                </td>
            `;
            fragment.appendChild(row);
        });
        tableBody.appendChild(fragment);
    } catch (error) {
        console.error('Error al cargar sub áreas:', error);
        alert('Error al cargar las sub áreas. Intente de nuevo más tarde.');
    }
}

// Función para registrar una nueva sub área
async function registerSubArea(event) {
    event.preventDefault();
    try {
        const formData = new FormData(event.target);
        const response = await fetch('/api/sub_areas', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al registrar la sub área.');
        }

        alert('Sub área registrada con éxito.');
        window.location.href = '/sub_areas';
    } catch (error) {
        console.error("Error en la creación de la sub área:", error);
        alert(`Error: ${error.message}`);
    } 
}

// Función para eliminar una sub área
async function deleteSubArea(id) {
    if (confirm('¿Está seguro de que desea eliminar esta sub área?')) {
        try {
            const response = await fetch(`/api/sub_areas/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            alert(data.message);
            await loadSubAreas();
        } catch (error) {
            console.error('Error al eliminar la sub área:', error);
            alert('Error al eliminar la sub área. Intente de nuevo.');
        }
    }
}

// Función para redirigir a la página de edición de sub áreas
function editSubArea(id) {
    window.location.href = `/modificar_sub_areas?id=${id}`;
}

// Función para actualizar una sub área existente
async function updateSubArea(event) {
    event.preventDefault();
    try {
        const formData = new FormData(event.target);
        const id = new URLSearchParams(window.location.search).get('id');
        
        const response = await fetch(`/api/sub_areas/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la sub área.');
        }

        alert('Sub área actualizada con éxito.');
        window.location.href = '/sub_areas';
    } catch (error) {
        console.error("Error al actualizar la sub área: el error es de este codigo ", error);
        alert(`Error de mamadas: ${error.message}`);
    }
}

async function loadSubAreaDetails(id) {
    const subAreaId = new URLSearchParams(window.location.search).get('id');
    if (subAreaId) {
        try {
            const response = await fetch(`/api/sub_areas/${subAreaId}`);
            if (!response.ok) {
                throw new Error(`Error al cargar el área: ${response.statusText}`);
            }
            const subArea = await response.json();
            if (subArea) {
                document.getElementById('subAreaNombre').value = subArea.sub_nombre;
                document.getElementById('subAreaArea').value = subArea.area_id;
                document.getElementById('subAreaDescripcion').value = subArea.sub_descripcion;
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.src = subArea.sub_directorio_img;
                imagePreview.style.display = 'block';
            } else {
                alert('Sub área no encontrada.');
            }
        } catch (error) {
            console.error('Error al cargar los detalles de la sub área:', error);
            alert('Error al cargar los detalles. Intente de nuevo.');
        }
    }
}

document.getElementById('subAreaDirectorioImg').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('subAreaDirectorioImg').value = e;
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});


// Función para cargar las áreas desde la API
async function loadAreas() {
     try {
        const response = await fetch('/api/areas');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const areas = await response.json();
        const select = document.getElementById('subAreaArea');
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
