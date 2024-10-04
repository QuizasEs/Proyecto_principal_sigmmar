// modificar_areas.js

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveAreaChanges').addEventListener('click', function() {
        updateArea();
    });
});

function editArea(areaId) {
    fetch(`/api/areas/${areaId}`)
        .then(response => response.json())
        .then(area => {
            document.getElementById('editAreaId').value = area.area_id;
            document.getElementById('editAreaNombre').value = area.area_nombre;
            document.getElementById('editAreaDescripcion').value = area.area_descripcion;
            document.getElementById('editAreaDirectorioImg').value = null; // Vaciar el campo de archivo

            new bootstrap.Modal(document.getElementById('editAreaModal')).show();
        });
}

function updateArea() {
    const areaId = document.getElementById('editAreaId').value;
    const formData = new FormData();
    formData.append('area_nombre', document.getElementById('editAreaNombre').value);
    formData.append('area_descripcion', document.getElementById('editAreaDescripcion').value);

    // Solo enviar el archivo si se selecciona uno
    const fileInput = document.getElementById('editAreaDirectorioImg');
    if (fileInput.files.length > 0) {
        formData.append('area_directorio_img', fileInput.files[0]);
    }

    fetch(`/api/areas/${areaId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Área actualizada con éxito');
        bootstrap.Modal.getInstance(document.getElementById('editAreaModal')).hide();
        loadAreas();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el área');
    });
}
