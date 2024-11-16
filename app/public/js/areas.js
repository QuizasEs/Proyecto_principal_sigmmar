document.addEventListener("DOMContentLoaded", async function () {
  const container = document.querySelector(".container");

  // Cargar áreas al cargar la página
  if (window.location.pathname === "/area") {
    await loadAreas();
  }
});

// Cargar el área al iniciar la página de modificación
function loadArea() {
  // Espera que todo el contenido del DOM se cargue antes de ejecutar cualquier acción
  document.addEventListener("DOMContentLoaded", async function () {
    const container = document.querySelector(".container"); // Selecciona el contenedor principal de la página

    // Si la página es la de "/area", carga las áreas automáticamente al iniciar
    if (window.location.pathname === "/area") {
      await loadAreas(); // Llamada a la función para cargar las áreas
    }
  });

  // Función para cargar los datos de un área específica al iniciar la página de modificación
  function loadArea() {
    const areaId = new URLSearchParams(window.location.search).get("id"); // Obtiene el ID del área desde la URL
    if (areaId) {
      // Si existe un ID, realiza una petición para obtener los datos del área
      fetch(`/api/areas/${areaId}`)
        .then((response) => {
          if (!response.ok) {
            // Si la respuesta no es correcta, lanza un error
            throw new Error(`Error al cargar el área: ${response.statusText}`);
          }
          return response.json(); // Convierte la respuesta a formato JSON
        })
        .then((area) => {
          if (area) {
            // Si se reciben datos del área, rellena los campos del formulario de edición
            document.getElementById("editAreaId").value = area.area_id;
            document.getElementById("editAreaNombre").value = area.area_nombre;
            document.getElementById("editAreaDescripcion").value =
              area.area_descripcion;
            document.getElementById("editAreaDirectorioImgActual").value =
              area.area_directorio_img; // Guarda el directorio de la imagen actual
            document.getElementById("imagePreview").src =
              area.area_directorio_img; // Muestra una vista previa de la imagen
            document.getElementById("imagePreview").style.display = "block"; // Muestra el elemento de vista previa de imagen
          } else {
            alert("Área no encontrada."); // Si no se encuentra el área, muestra un mensaje de error
          }
        })
        .catch((error) => console.error("Error al cargar el área:", error)); // Manejo de errores en la carga del área
    }
  }

  // Evento para manejar el envío del formulario de edición de áreas
  document
    .getElementById("editAreaForm")
    ?.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita el comportamiento por defecto del formulario (refrescar la página)

      const areaId = document.getElementById("editAreaId").value; // Obtiene el ID del área desde el formulario
      const formData = new FormData(); // Crea un objeto FormData para enviar los datos
      formData.append(
        "area_nombre",
        document.getElementById("editAreaNombre").value
      ); // Agrega el nombre del área al FormData
      formData.append(
        "area_descripcion",
        document.getElementById("editAreaDescripcion").value
      ); // Agrega la descripción del área al FormData

      // Verifica si se ha seleccionado una nueva imagen
      const imageFile = document.getElementById("editAreaDirectorioImg")
        .files[0];
      if (imageFile) {
        formData.append("area_directorio_img", imageFile); // Añade la nueva imagen al FormData si existe
      } else {
        // Si no se ha seleccionado una nueva imagen, mantiene la actual
        formData.append(
          "area_directorio_img",
          document.getElementById("editAreaDirectorioImgActual").value
        );
      }

      // Realiza la solicitud para actualizar los datos del área en el servidor
      fetch(`/api/areas/${areaId}`, {
        method: "PUT", // Método PUT para actualizar los datos
        body: formData, // Envía el FormData con los datos y la imagen
      })
        .then((response) => {
          if (response.ok) {
            alert("Área actualizada con éxito."); // Si la respuesta es exitosa, muestra un mensaje
            window.location.href = "/area"; // Redirige a la página de lista de áreas
          } else {
            alert("Error al actualizar el área."); // Si hay un error, muestra un mensaje de error
          }
        })
        .catch((error) => console.error("Error al guardar cambios:", error)); // Manejo de errores en la actualización
    });

  // Función asíncrona para cargar todas las áreas y mostrarlas en una tabla
  async function loadAreas() {
    try {
      const response = await fetch("/api/areas"); // Realiza una solicitud para obtener todas las áreas
      if (!response.ok)
        throw new Error(`Error al cargar áreas: ${response.statusText}`); // Si la respuesta no es correcta, lanza un error

      const areas = await response.json(); // Convierte la respuesta a formato JSON
      const tableBody = document.getElementById("areaTableBody"); // Selecciona el cuerpo de la tabla donde se mostrarán las áreas
      if (tableBody) {
        tableBody.innerHTML = ""; // Limpia el contenido anterior de la tabla
        const fragment = document.createDocumentFragment(); // Crea un fragmento para insertar las filas de manera eficiente

        areas.forEach((area) => {
          const row = document.createElement("tr"); // Crea una nueva fila de tabla para cada área
          row.innerHTML = `
                            <td>${area.area_id}</td>
                            <td>${area.area_nombre}</td>
                            <div id="desc" >
                              <td>${area.area_descripcion}</|td>
                            </div>
                            <td><img src="${area.area_directorio_img}" alt="Imagen de ${area.area_nombre}" class="img-fluid rounded" style="width: 100px; height: auto;"></td>
                            <td>${area.area_estado}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-1 mx+2" onclick="editArea(${area.area_id})">Editar</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteArea(${area.area_id})">Eliminar</button>
                            </td>
                    `; // Define el contenido de la fila con los datos del área
          fragment.appendChild(row); // Añade la fila al fragmento
        });

        tableBody.appendChild(fragment); // Añade todas las filas a la tabla de una sola vez
      }
    } catch (error) {
      console.error("Error al cargar áreas:", error); // Manejo de errores en la carga de áreas
    }
  }

  // Evento para manejar el registro de un área
  document
    .getElementById("areaFormCreate")
    ?.addEventListener("submit", async function (e) {
      e.preventDefault(); // Evita el comportamiento por defecto del formulario (refrescar la página)

      try {
        const formData = new FormData(
          document.getElementById("areaFormCreate")
        ); // Obtiene los datos del formulario
        const response = await fetch("/api/areas", {
          method: "POST", // Método POST para registrar un área
          body: formData, // Envía el FormData con los datos del formulario
        });

        if (!response.ok) {
          const errorData = await response.json(); // Si la respuesta no es correcta, obtiene el mensaje de error
          throw new Error(errorData.message || "Error al registrar el área."); // Lanza el error
        }

        // Si el área se registra con éxito, muestra un mensaje y redirige a la lista de áreas
        alert("Área registrada con éxito");
        window.location.href = "/area";
      } catch (error) {
        // Si ocurre un error, muestra un mensaje de error
        alert(`Error: ${error.message}`);
      }
    });

  // Función para eliminar un área
  async function deleteArea(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta área?")) {
      try {
        const response = await fetch(`/api/areas/${id}`, { method: "DELETE" }); // Realiza la solicitud para eliminar el área
        const data = await response.json(); // Convierte la respuesta a formato JSON
        alert(data.message); // Muestra un mensaje con el resultado de la operación
        await loadAreas(); // Recarga la lista de áreas
      } catch (error) {
        console.error("Error al eliminar área:", error); // Manejo de errores en la eliminación
      }
    }
  }

  // Función para redirigir a la página de edición de un área específica
  function editArea(area_id) {
    window.location.href = `/modificar_area?id=${area_id}`; // Redirige a la página de modificación con el ID del área
  }

  const areaId = new URLSearchParams(window.location.search).get("id");
  if (areaId) {
    fetch(`/api/areas/${areaId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al cargar el área: ${response.statusText}`);
        }
        return response.json();
      })
      .then((area) => {
        if (area) {
          document.getElementById("editAreaId").value = area.area_id;
          document.getElementById("editAreaNombre").value = area.area_nombre;
          document.getElementById("editAreaDescripcion").value =
            area.area_descripcion;
          document.getElementById("editAreaDirectorioImgActual").value =
            area.area_directorio_img; // Guardar la imagen actual
          document.getElementById("imagePreview").src =
            area.area_directorio_img; // Establecer vista previa de la imagen
          document.getElementById("imagePreview").style.display = "block"; // Mostrar imagen
        } else {
          alert("Área no encontrada.");
        }
      })
      .catch((error) => console.error("Error al cargar el área:", error));
  }
}

// Guardar cambios del área editada
document
  .getElementById("editAreaForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir comportamiento predeterminado del formulario

    const areaId = document.getElementById("editAreaId").value;
    const formData = new FormData();
    formData.append(
      "area_nombre",
      document.getElementById("editAreaNombre").value
    );
    formData.append(
      "area_descripcion",
      document.getElementById("editAreaDescripcion").value
    );

    const imageFile = document.getElementById("editAreaDirectorioImg").files[0];
    if (imageFile) {
      formData.append("area_directorio_img", imageFile); // Solo añadir si hay un nuevo archivo
    } else {
      formData.append(
        "area_directorio_img",
        document.getElementById("editAreaDirectorioImgActual").value
      ); // Mantener la imagen actual
    }

    fetch(`/api/areas/${areaId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Área actualizada con éxito.");
          window.location.href = "/area"; // Redirige a la lista de áreas
        } else {
          alert("Error al actualizar el área.");
        }
      })
      .catch((error) => console.error("Error al guardar cambios:", error));
  });

// Función para cargar las áreas usando async/await
async function loadAreas() {
  try {
    const response = await fetch("/api/areas");
    if (!response.ok)
      throw new Error(`Error al cargar áreas: ${response.statusText}`);

    const areas = await response.json();
    const tableBody = document.getElementById("areaTableBody");
    if (tableBody) {
      tableBody.innerHTML = "";
      const fragment = document.createDocumentFragment();

      areas.forEach((area) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${area.area_id}</td>
                    <td>${area.area_nombre}</td>
                    <td><div style="overflow-y: auto; height: 8rem;">
   
                    ${area.area_descripcion}
                    </div>
                    </td> 
                    <td><img src="${area.area_directorio_img}" alt="Imagen de ${area.area_nombre}" style="width: 140px; height: auto;"></td>
                    <!-- <td>${area.area_estado}</td> -->
                    <td>
                        <button class="btn btn-sm btn-primary m-1 px-3" onclick="editArea(${area.area_id})">Editar</button>
                        <button class="btn btn-sm btn-danger m-1" onclick="deleteArea(${area.area_id})">Eliminar</button>
                    </td>
                `;
        fragment.appendChild(row);
      });

      tableBody.appendChild(fragment);
    }
  } catch (error) {
    console.error("Error al cargar áreas:", error);
  }
}

// Función asincrónica para registrar un área

document
  .getElementById("areaFormCreate")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevenir comportamiento predeterminado del formulario

    try {
      //llama a los datos del formulario atravez del atributio name
      const formData = new FormData(document.getElementById("areaFormCreate")); // Obtener los datos del formulario
      const response = await fetch("/api/areas", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el área.");
      }

      // Mostrar mensaje de éxito y redirigir
      alert("Área registrada con éxito");
      window.location.href = "/area";
    } catch (error) {
      //Mostrar mensaje de error
      alert(`Error: ${error.message}`);
    }
  });

// Función para eliminar un área
async function deleteArea(id) {
  if (confirm("¿Estás seguro de que quieres eliminar esta área?")) {
    try {
      const response = await fetch(`/api/areas/${id}`, { method: "DELETE" });
      const data = await response.json();
      alert(data.message);
      await loadAreas();
    } catch (error) {
      console.error("Error al eliminar área:", error);
    }
  }
}

// Función para editar un área
function editArea(area_id) {
  window.location.href = `/modificar_area?id=${area_id}`; // Redirigir a la página de edición
}

// Función para agregar botón para volver a la tabla
/* function addBackToTableButton() {
    const button = document.createElement('button');
    button.textContent = 'Volver a la tabla';
    button.onclick = () => window.location.href = '/area'; // Cambia esta ruta a la de tu tabla
    button.style.marginTop = '10px';
    button.class="btn btn-primary"
    document.body.appendChild(button);
}
 */
// Guardar cambios del área editada
document
  .getElementById("saveAreaChanges")
  ?.addEventListener("click", async function () {
    try {
      const areaId = document.getElementById("editAreaId").value;
      const formData = new FormData();
      formData.append(
        "area_nombre",
        document.getElementById("editAreaNombre").value
      );
      formData.append(
        "area_descripcion",
        document.getElementById("editAreaDescripcion").value
      );

      const imageFile = document.getElementById("editAreaDirectorioImg")
        .files[0];
      if (imageFile) {
        formData.append("area_directorio_img", imageFile);
      }

      const response = await fetch(`/api/areas/${areaId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al actualizar el área.");

      alert("Área actualizada con éxito.");
      window.location.href = "/area"; // Redirige a la lista de áreas
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert(error.message);
    }
  });

// Cargar el área al iniciar la página de modificación
async function loadArea() {
  const areaId = new URLSearchParams(window.location.search).get("id");
  if (areaId) {
    try {
      const response = await fetch(`/api/areas/${areaId}`);
      if (!response.ok)
        throw new Error(`Error al cargar el área: ${response.statusText}`);

      const area = await response.json();
      if (area) {
        document.getElementById("editAreaId").value = area.area_id;
        document.getElementById("editAreaNombre").value = area.area_nombre;
        document.getElementById("editAreaDescripcion").value =
          area.area_descripcion;
        document.getElementById("editAreaDirectorioImgActual").value =
          area.area_directorio_img; // Guardar la imagen actual
        document.getElementById("imagePreview").src = area.area_directorio_img;
        document.getElementById("imagePreview").style.display = "block";
      } else {
        alert("Área no encontrada.");
      }
    } catch (error) {
      console.error("Error al cargar el área:", error);
    }
  }
}

// Cargar el área si estamos en la página de modificación
if (window.location.pathname === "/modificar_area") {
  loadArea();
}

// Función para previsualizar la imagen
function previewImage(event) {
  const imagePreview = document.getElementById("imagePreview");
  imagePreview.src = URL.createObjectURL(event.target.files[0]);
  imagePreview.style.display = "block"; // Mostrar vista previa
}
