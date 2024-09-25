document.addEventListener('DOMContentLoaded', async function () {
    const container = document.querySelector('.container');

    // Cargar áreas al cargar la página
    if (window.location.pathname === '/area') {
        await loadAreas();
    }

    // Si estamos en la página de creación, agregar botón para volver a la tabla
    if (window.location.pathname === '/crear_area') {
        addBackToTableButton();
    }
});

// Cargar el área al iniciar la página de modificación
function loadArea() {
    const areaId = new URLSearchParams(window.location.search).get('id');
    if (areaId) {
        fetch(`/api/areas/${areaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar el área: ${response.statusText}`);
                }
                return response.json();
            })
            .then(area => {
                if (area) {
                    document.getElementById('editAreaId').value = area.area_id;
                    document.getElementById('editAreaNombre').value = area.area_nombre;
                    document.getElementById('editAreaDescripcion').value = area.area_descripcion;
                    document.getElementById('editAreaDirectorioImgActual').value = area.area_directorio_img; // Guardar la imagen actual
                    document.getElementById('imagePreview').src = area.area_directorio_img; // Establecer vista previa de la imagen
                    document.getElementById('imagePreview').style.display = 'block'; // Mostrar imagen
                } else {
                    alert('Área no encontrada.');
                }
            })
            .catch(error => console.error('Error al cargar el área:', error));
    }
}

// Guardar cambios del área editada
document.getElementById('editAreaForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir comportamiento predeterminado del formulario

    const areaId = document.getElementById('editAreaId').value;
    const formData = new FormData();
    formData.append('area_nombre', document.getElementById('editAreaNombre').value);
    formData.append('area_descripcion', document.getElementById('editAreaDescripcion').value);
    
    const imageFile = document.getElementById('editAreaDirectorioImg').files[0];
    if (imageFile) {
        formData.append('area_directorio_img', imageFile); // Solo añadir si hay un nuevo archivo
    } else {
        formData.append('area_directorio_img', document.getElementById('editAreaDirectorioImgActual').value); // Mantener la imagen actual
    }

    fetch(`/api/areas/${areaId}`, {
        method: 'PUT',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            alert('Área actualizada con éxito.');
            window.location.href = '/area'; // Redirige a la lista de áreas
        } else {
            alert('Error al actualizar el área.');
        }
    })
    .catch(error => console.error('Error al guardar cambios:', error));
});


// Función para cargar las áreas usando async/await
async function loadAreas() {
    try {
        const response = await fetch('/api/areas');
        if (!response.ok) throw new Error(`Error al cargar áreas: ${response.statusText}`);
        
        const areas = await response.json();
        const tableBody = document.getElementById('areaTableBody');
        if (tableBody) {
            tableBody.innerHTML = '';
            const fragment = document.createDocumentFragment();
            
            areas.forEach(area => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${area.area_id}</td>
                    <td>${area.area_nombre}</td>
                    <td>${area.area_descripcion}</td>
                    <td><img src="${area.area_directorio_img}" alt="Imagen de ${area.area_nombre}" style="width: 100px; height: auto;"></td>
                    <td>${area.area_estado}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editArea(${area.area_id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteArea(${area.area_id})">Eliminar</button>
                    </td>
                `;
                fragment.appendChild(row);
            });

            tableBody.appendChild(fragment);
        }
    } catch (error) {
        console.error('Error al cargar áreas:', error);
    }
}

// Función para registrar un área
async function registerArea() {
    try {
        const formData = new FormData();
        formData.append('area_nombre', document.getElementById('areaNombre').value);
        formData.append('area_descripcion', document.getElementById('areaDescripcion').value);
        formData.append('area_directorio_img', document.getElementById('areaDirectorioImg').files[0]); // Input de archivo
        formData.append('area_estado', 1);

        const response = await fetch('/api/areas', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error(`Error al registrar el área: ${response.statusText}`);
        
        alert('Área registrada con éxito');
        document.getElementById('areaForm').reset();
        await loadAreas();
        window.location.href = 'area'; // Redireccionar a la tabla
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el área: ' + error.message);
    }
}

// Función para eliminar un área
async function deleteArea(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
        try {
            const response = await fetch(`/api/areas/${id}`, { method: 'DELETE' });
            const data = await response.json();
            alert(data.message);
            await loadAreas();
        } catch (error) {
            console.error('Error al eliminar área:', error);
        }
    }
}

// Función para editar un área
function editArea(area_id) {
    window.location.href = `/modificar_area?id=${area_id}`; // Redirigir a la página de edición
}

// Función para agregar botón para volver a la tabla
function addBackToTableButton() {
    const button = document.createElement('button');
    button.textContent = 'Volver a la tabla';
    button.onclick = () => window.location.href = '/area'; // Cambia esta ruta a la de tu tabla
    button.style.marginTop = '10px';
    document.body.appendChild(button);
}

// Guardar cambios del área editada
document.getElementById('saveAreaChanges')?.addEventListener('click', async function () {
    try {
        const areaId = document.getElementById('editAreaId').value;
        const formData = new FormData();
        formData.append('area_nombre', document.getElementById('editAreaNombre').value);
        formData.append('area_descripcion', document.getElementById('editAreaDescripcion').value);
        
        const imageFile = document.getElementById('editAreaDirectorioImg').files[0];
        if (imageFile) {
            formData.append('area_directorio_img', imageFile);
        }

        const response = await fetch(`/api/areas/${areaId}`, {
            method: 'PUT',
            body: formData,
        });
        
        if (!response.ok) throw new Error('Error al actualizar el área.');

        alert('Área actualizada con éxito.');
        window.location.href = '/area'; // Redirige a la lista de áreas
    } catch (error) {
        console.error('Error al guardar cambios:', error);
        alert(error.message);
    }
});

// Cargar el área al iniciar la página de modificación
async function loadArea() {
    const areaId = new URLSearchParams(window.location.search).get('id');
    if (areaId) {
        try {
            const response = await fetch(`/api/areas/${areaId}`);
            if (!response.ok) throw new Error(`Error al cargar el área: ${response.statusText}`);

            const area = await response.json();
            if (area) {
                document.getElementById('editAreaId').value = area.area_id;
                document.getElementById('editAreaNombre').value = area.area_nombre;
                document.getElementById('editAreaDescripcion').value = area.area_descripcion;
                document.getElementById('imagePreview').src = area.area_directorio_img;
                document.getElementById('imagePreview').style.display = 'block';
            } else {
                alert('Área no encontrada.');
            }
        } catch (error) {
            console.error('Error al cargar el área:', error);
        }
    }
}

// Cargar el área si estamos en la página de modificación
if (window.location.pathname === '/modificar_area') {
    loadArea();
}

// Función para previsualizar la imagen
function previewImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
    imagePreview.style.display = 'block'; // Mostrar vista previa
}
