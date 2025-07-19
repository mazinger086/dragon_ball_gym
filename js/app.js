// En tu app.js o dentro de <script> al final del HTML
    const toggle = document.getElementById("toggle-menu");
    const heading = document.querySelector("header h1");

    toggle.addEventListener("change", () => {
    console.log(heading);
    
    if (toggle.checked) {
        heading.classList.add("menu-open");
        console.log('abierto');
        
    } else {
        heading.classList.remove("menu-open");
        console.log('cerrado');
        
    }
    });



document.getElementById('selectFileBtn').addEventListener('click', function () {
  document.getElementById('csvFile').click();
});

document.getElementById('csvFile').addEventListener('change', function () {
  const fileName = this.files[0] ? this.files[0].name : 'Ningún archivo seleccionado';
  document.getElementById('fileName').textContent = fileName;
});



document.getElementById('loadBtn').addEventListener('click', function () {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];

  if (!file) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor seleccioná un archivo CSV primero.',
    });
    return;
  }

const reader = new FileReader();

reader.onload = function (e) {
  try {
    const text = e.target.result;
    localStorage.setItem('rutina_csv', text);
    parseCSV(text);
  } catch (error) {
    console.error("Error al cargar la rutina:", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error,
    });
  }
};

reader.readAsText(file);
});




function parseCSV(data) {
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const diaActual = diasSemana[new Date().getDay()];

  const lines = data.trim().split('\n');
  const headers = lines[0].split(',');

  const routineContainer = document.getElementById('routine');
  routineContainer.innerHTML = `<h2>🥋 Rutina para hoy: <span style="color: yellow">${diaActual}</span></h2>`;

  const ejerciciosHoy = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    const rutina = Object.fromEntries(headers.map((h, j) => [h.trim(), values[j].trim()]));

    if (rutina['Día'].toLowerCase() === diaActual.toLowerCase()) {
      ejerciciosHoy.push(rutina);
    }
  }

  if (ejerciciosHoy.length === 0) {
    routineContainer.innerHTML += `<p style="color: orange">🎉 Hoy no hay ejercicios programados. Día de descanso.</p>`;
    updatePowerBar(0, 1);
    return;
  }

  let completedCount = 0;
  const totalExercises = ejerciciosHoy.length;
  const completed = {};

  ejerciciosHoy.forEach((rutina, index) => {
    const id = `ex-${index}`;
    const yaCompletado = (JSON.parse(localStorage.getItem(`completados_${new Date().toISOString().split('T')[0]}`) || '[]')).includes(id);

    const card = document.createElement('div');
    card.className = 'routine-card';
    card.innerHTML = `
      <h3>${rutina['Ejercicio']}</h3>
      <p>Series: ${rutina['Series']} | Reps: ${rutina['Repeticiones']}</p>
      <p>Peso: ${rutina['Peso']}</p>
      <button id="${id}" class="${yaCompletado ? 'complete-btn' : 'incomplete-btn'}" ${yaCompletado ? 'disabled' : ''}>
        ${yaCompletado ? '✔️ Completo' : '❌ Incompleto'}
      </button>
    `;
    routineContainer.appendChild(card);

    document.getElementById(id).addEventListener('click', function () {
      if (completed[id]) return;
      completed[id] = true;
      completedCount++;    

      updatePowerBar(completedCount, totalExercises);
      guardarEjercicioCompletado(id);

      this.classList.remove('incomplete-btn');
      this.classList.add('complete-btn');
      this.disabled = true;
      this.textContent = "✔️ Completo";
    });
  });

    const completadosHoy = JSON.parse(localStorage.getItem(`completados_${new Date().toISOString().split('T')[0]}`) || '[]');
    completedCount = completadosHoy.length;

     updatePowerBar(completedCount, totalExercises);
}



function updatePowerBar(completed, total) {
  const percent = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById('powerBar').style.width = percent + '%';
  document.getElementById('powerValue').textContent = `${percent.toFixed(1)}% Completado`;

  // Nueva línea para mover la cabeza
    const progressWidth = document.querySelector('.progress').offsetWidth;
    const head = document.getElementById('shenlongHead');
    head.style.left = `calc(${percent}% - ${head.offsetWidth / 2}px)`;

  guardarProgresoDiario(percent);
}


function guardarProgresoDiario(porcentaje) {
  const hoy = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  const progreso = {
    fecha: hoy,
    completado: porcentaje >= 100,
  };

  const historial = JSON.parse(localStorage.getItem('historial_rutina') || '[]');
  const existente = historial.find(e => e.fecha === hoy);

  if (existente) {
    existente.completado = progreso.completado;
  } else {
    historial.push(progreso);
  }

  localStorage.setItem('historial_rutina', JSON.stringify(historial));
}


function guardarEjercicioCompletado(ejercicioID) {
  const hoy = new Date().toISOString().split('T')[0];
  const clave = `completados_${hoy}`;

  let lista = JSON.parse(localStorage.getItem(clave) || '[]');
  if (!lista.includes(ejercicioID)) {
    lista.push(ejercicioID);
    localStorage.setItem(clave, JSON.stringify(lista));
  }
}




// ✅ Al cargar la página, si hay rutina guardada, mostrarla automáticamente
window.addEventListener('DOMContentLoaded', () => {
  const rutinaGuardada = localStorage.getItem('rutina_csv');
  if (rutinaGuardada) {
    parseCSV(rutinaGuardada);
  }
});
