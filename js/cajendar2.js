import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

async function generarCalendario() {
  const contenedor = document.getElementById('calendar');
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
               'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  document.getElementById('mes-actual').textContent = `${meses[mes]} ${año}`;

  const primerDia = new Date(año, mes, 1).getDay(); // 0: domingo
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  // 🔄 Obtener historial de Firestore
  const snapshot = await getDocs(collection(db, "progreso"));
  const historial = [];
  snapshot.forEach(doc => historial.push(doc.data()));

  for (let i = 0; i < primerDia; i++) {
    const celda = document.createElement('div');
    celda.className = 'day empty';
    contenedor.appendChild(celda);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(año, mes, dia);
    const fechaISO = fecha.toISOString().split('T')[0];
    const entrada = historial.find(e => e.fecha === fechaISO);

    const celda = document.createElement('div');
    celda.classList.add('day');
    celda.textContent = dia;

    if (entrada) {
      celda.classList.add(entrada.completado ? 'complete' : 'incomplete');
    } else {
      celda.classList.add('empty');
    }

    celda.addEventListener('click', async () => {
      const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
      const nombreDia = dias[fecha.getDay()];

      const q = query(collection(db, "rutinas"), where("dia", "==", nombreDia));
      const snap = await getDocs(q);

      if (snap.empty) {
        Swal.fire({
          title: `No hay rutina para el día ${nombreDia.toUpperCase()}`,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      const ejercicios = [];
      snap.forEach(doc => {
        const r = doc.data();
        ejercicios.push(`• ${r.ejercicio} — ${r.series}x${r.repeticiones} — ${r.peso}`);
      });

      Swal.fire({
        title: `Rutina para el ${nombreDia.toUpperCase()}`,
        html: `<div style="font-size: 16px;">${ejercicios.join("<br>")}</div>`,
        icon: 'success',
        confirmButtonText: '¡Perfecto!'
      });
    });

    contenedor.appendChild(celda);
  }
}

document.addEventListener('DOMContentLoaded', generarCalendario);
