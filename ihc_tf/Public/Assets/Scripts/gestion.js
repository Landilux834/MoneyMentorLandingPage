document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("operacion-form");
  const fechaInput = document.getElementById("fecha");
  const tablaBody = document.querySelector("#tabla-operaciones tbody");

  // --- Mostrar fecha actual automáticamente (solo fecha)
  fechaInput.value = new Date().toLocaleDateString();

  // --- Función para mostrar operaciones en la tabla
  function mostrarOperaciones() {
    tablaBody.innerHTML = ""; // limpiar tabla
    let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];

    operaciones.forEach((op, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${op.categoria}</td>
        <td>${op.tipo}</td>
        <td>${parseFloat(op.monto).toFixed(2)}</td>
        <td>${op.fecha}</td>
        <td><button class="eliminar-btn" data-index="${index}">Eliminar</button></td>
      `;
      tablaBody.appendChild(row);
    });
  }

  // --- Cargar operaciones guardadas al abrir la página
  mostrarOperaciones();

  // --- Guardar nueva operación al enviar formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const categoria = document.getElementById("nombre").value; // lista desplegable
    const tipo = document.getElementById("tipo").value;        // ingreso / gasto / ahorro
    const monto = parseFloat(document.getElementById("monto").value);
    const fecha = new Date().toLocaleDateString(); // en formato de fecha local

    // Guardar también en localStorage
    let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];
    operaciones.push({ categoria, tipo, monto, fecha });
    localStorage.setItem("operaciones", JSON.stringify(operaciones));

    // Actualizar tabla
    mostrarOperaciones();

    // Limpiar formulario y actualizar fecha
    form.reset();
    fechaInput.value = new Date().toLocaleDateString();

    alert("Operación registrada");
  });

  // --- Eliminar operación
  tablaBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      const index = e.target.dataset.index;
      let operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];
      operaciones.splice(index, 1); // elimina el índice
      localStorage.setItem("operaciones", JSON.stringify(operaciones));
      mostrarOperaciones();
    }
  });
});





