// Leer operaciones desde localStorage
const operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];

// Calcular totales por tipo
const totales = { ingreso: 0, gasto: 0, ahorro: 0 };

operaciones.forEach(op => {
  if (totales[op.tipo] !== undefined) {
    totales[op.tipo] += Number(op.monto);
  }
});

// Crear gráfico
const ctx = document.getElementById("grafico-pastel").getContext("2d");
const graficoPastel = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Ingresos", "Gastos", "Ahorros"],
    datasets: [{
      label: "Distribución de Operaciones",
      data: [totales.ingreso, totales.gasto, totales.ahorro],
      backgroundColor: [
        "rgba(54, 162, 235, 0.7)", // azul
        "rgba(255, 99, 132, 0.7)", // rojo
        "rgba(75, 192, 192, 0.7)"  // verde
      ],
      borderColor: [
        "rgba(54, 162, 235, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(75, 192, 192, 1)"
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Distribución de Ingresos, Gastos y Ahorros"
      }
    },
    // Clic en sector del gráfico
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const tipoSeleccionado = graficoPastel.data.labels[index].toLowerCase();
        mostrarOperaciones(tipoSeleccionado);
      }
    }
  }
});

// Mostrar operaciones en la tabla
function mostrarOperaciones(filtro = "todos") {
  const tablaBody = document.getElementById("tabla-operaciones-analisis");
  tablaBody.innerHTML = ""; // limpiar tabla

  const filtradas = filtro === "todos"
    ? operaciones
    : operaciones.filter(op => op.tipo === filtro);

  filtradas.forEach(op => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${op.categoria}</td>
      <td>${op.tipo}</td>
      <td>S/. ${Number(op.monto).toFixed(2)}</td>
      <td>${op.fecha}</td>
    `;
    tablaBody.appendChild(fila);
  });
}

// Mostrar todas al cargar
mostrarOperaciones();
