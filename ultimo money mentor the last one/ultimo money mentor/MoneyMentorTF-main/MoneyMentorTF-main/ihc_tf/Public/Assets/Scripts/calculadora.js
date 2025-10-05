// Evento para calcular los resultados
document.getElementById("calcularButton").addEventListener("click", function () {
    // 1. Obtener los valores de entrada del usuario
    const monto = parseFloat(document.getElementById("monto").value) || 0;
    const tasaInteres = parseFloat(document.getElementById("interes").value) || 0;
    const cuotas = parseInt(document.getElementById("plazo").value) || 1;

    // Validar que los valores sean positivos
    if (monto <= 0) {
        alert("Por favor, ingresa un monto válido mayor a 0.");
        return;
    }
    if (tasaInteres <= 0) {
        alert("Por favor, ingresa una tasa de interés válida mayor a 0.");
        return;
    }
    if (cuotas <= 0 || !Number.isInteger(cuotas)) {
        alert("Por favor, ingresa un número de cuotas válido (entero positivo).");
        return;
    }

    // 2. Realizar cálculos
    const capitalPorCuota = monto / cuotas; // Cálculo de capital por cuota
    const interesPorCuota = (monto * (tasaInteres / 100)) / cuotas; // Cálculo de interés por cuota
    const montoPorCuota = capitalPorCuota + interesPorCuota; // Monto a pagar por cuota

    const interesTotal = monto * (tasaInteres / 100); // Interés total
    const capitalTotal = monto; // Capital total
    const totalPagar = monto + interesTotal; // Monto total a pagar

    // CONVERTIDOR DE MONEDAS (se ejecuta solo cuando se presiona "Calcular")

    const curr1 = document.getElementById('tipoMoneda');
    const curr2 = document.getElementById('tipoMonedaDatosCalculados');

    const id_capitalCuota = document.getElementById("capitalCuota");
    const id_interesCuota = document.getElementById("interesCuota");
    const id_montoPorCuota = document.getElementById("cuotaindividual");

    const id_capitalTotal = document.getElementById('capitalTotal');  
    const id_interesTotal = document.getElementById("interestotal");
    const id_totalPagar = document.getElementById("totalpagar");

    function converter() {
        const c1 = curr1.value; // Moneda base
        const c2 = curr2.value; // Moneda objetivo 

        fetch(`https://v6.exchangerate-api.com/v6/53fc54f1da350fcd30a8868c/latest/${c1}`)
          .then(res => res.json())
          .then(data => {
            const rate = data.conversion_rates[c2]; // Obtener la tasa de cambio 
        
            // Convertir valores
            id_capitalCuota.value = (parseFloat(capitalPorCuota) * rate).toFixed(2);
            id_interesCuota.value = (parseFloat(interesPorCuota) * rate).toFixed(2);
            id_montoPorCuota.value = (parseFloat(montoPorCuota) * rate).toFixed(2);

            id_capitalTotal.value = (parseFloat(capitalTotal) * rate).toFixed(2);
            id_interesTotal.value = (parseFloat(interesTotal) * rate).toFixed(2);
            id_totalPagar.value = (parseFloat(totalPagar) * rate).toFixed(2);
          })
          .catch(err => {
            console.error(err);
            alert("Error al obtener las tasas de cambio. Verifica tu conexión o intenta más tarde.");
          });
    }

    // Ejecutar la conversión después de presionar el botón calcular
    converter();
});

// Limpiar los valores
document.getElementById("limpiarButton").addEventListener("click", function () {
    // Restablecer los valores de los campos de entrada a su estado vacío o predeterminado
    document.getElementById("monto").value = '';
    document.getElementById("interes").value = '';
    document.getElementById("plazo").value = '';

    document.getElementById("capitalCuota").value = '';
    document.getElementById("interesCuota").value = '';
    document.getElementById("cuotaindividual").value = '';

    document.getElementById("capitalTotal").value = '';
    document.getElementById("interestotal").value = '';
    document.getElementById("totalpagar").value = '';
});
