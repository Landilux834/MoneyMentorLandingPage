document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.querySelector("#tabla-impuestos tbody");
  const operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];

  // --- Ajustes: cambiar UIT si lo deseas
  const UIT = 5150; // UIT 2024, cámbiala si hace falta

  // --- Reglas por monto (ordenadas por max)
  // Edita los valores y las tasas aquí según lo que necesites
  const reglasPorMonto = [
    { max: 5 * UIT, categoria: "1ra categoria (<= 5 UIT)", tasa: 8 },        // <= 25,750
    { max: 20 * UIT, categoria: "2da categoria (5-20 UIT)", tasa: 14 },     // <= 103,000    // <= 180,250
    { max: 45 * UIT, categoria: "4ta categoria (35-45 UIT)", tasa: 20 },    // <= 231,750
    { max: Infinity, categoria: "5ta categoria (>45 UIT)", tasa: 30 }       // > 231,750
  ];

  // Devuelve la regla cuyo max >= monto (como tramos acumulativos)
  function obtenerReglaPorMonto(monto) {
    const m = Number(monto) || 0;
    return reglasPorMonto.find(r => m <= r.max) || reglasPorMonto[reglasPorMonto.length - 1];
  }

  function formatearSoles(v) {
    return "S/ " + Number(v).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function mostrarIngresos() {
    tablaBody.innerHTML = "";

    const ingresos = operaciones.filter(op => op.tipo && op.tipo.toLowerCase() === "ingreso");

    if (ingresos.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="6" style="text-align:center; padding:12px;">No hay ingresos registrados.</td>`;
      tablaBody.appendChild(tr);
      return;
    }

    ingresos.forEach((ing) => {
      // Tu operacion.js guarda el "nombre" del ingreso en la propiedad `categoria`,
      // por eso primero intento leer ing.nombre y si no existe uso ing.categoria.
      const nombreIngreso = ing.nombre || ing.categoria || "Sin nombre";
      const monto = Number(ing.monto) || 0;
      const fecha = ing.fecha || "";

      const regla = obtenerReglaPorMonto(monto);
      const tasa = regla.tasa;
      const montoFinal = monto - (monto * tasa / 100);

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${nombreIngreso}</td>
        <td>${formatearSoles(monto)}</td>
        <td>${fecha}</td>
        <td>${regla.categoria}</td>
        <td>${tasa}%</td>
        <td>${formatearSoles(montoFinal)}</td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  mostrarIngresos();
});






