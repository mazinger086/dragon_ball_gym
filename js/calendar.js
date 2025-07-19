function generarCalendario() {
  const contenedor = document.getElementById("calendar");
  const historial = JSON.parse(
    localStorage.getItem("historial_rutina") || "[]"
  );

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  document.getElementById("mes-actual").textContent = `${meses[mes]} ${año}`;

  const primerDia = new Date(año, mes, 1).getDay(); // 0: domingo
  const diasEnMes = new Date(año, mes + 1, 0).getDate();

  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  for (let i = 0; i < primerDia; i++) {
    const celda = document.createElement("div");
    celda.className = "day empty";
    contenedor.appendChild(celda);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(año, mes, dia);
    const fechaISO = fecha.toISOString().split("T")[0];
    const entrada = historial.find((e) => e.fecha === fechaISO);

    const celda = document.createElement("div");
    celda.classList.add("day");
    celda.textContent = dia;

    if (entrada) {
      celda.classList.add(entrada.completado ? "complete" : "incomplete");
    } else {
      celda.classList.add("empty");
    }

    celda.addEventListener("click", () => {
      const nombreDia = diasSemana[fecha.getDay()]; // ej: 'lunes'
      const rutinaJSON = localStorage.getItem("rutina_json");

      if (!rutinaJSON) {
        Swal.fire({
          title: "¡Oops!",
          text: "No hay ninguna rutina guardada.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

     

      const rutina = JSON.parse(rutinaJSON);      

      // Filtrar ejercicios del día seleccionado
      const ejerciciosDelDia = rutina.filter(
        (ej) => ej.Día.toLowerCase().trim() === nombreDia.toLowerCase()
      );

      if (ejerciciosDelDia.length === 0) {
        Swal.fire({
          title: `No hay rutina para el día ${nombreDia.toUpperCase()}`,
          icon: "info",
          confirmButtonText: "Aceptar",
        });
      } else {
        const ejercicios = ejerciciosDelDia
          .map((ej) => {
            return `• ${ej.Ejercicio} — ${ej.Series}x${ej.Repeticiones} — ${ej.Peso}`;
          })
          .join("<br>");

        Swal.fire({
          title: `Rutina para el ${nombreDia.toUpperCase()}`,
          html: `<div style="font-size: 16px;">${ejercicios}</div>`,
          icon: "success",
          confirmButtonText: "¡Perfecto!",
        });
      }
    });

    contenedor.appendChild(celda);
  }
}

document.addEventListener("DOMContentLoaded", generarCalendario);
