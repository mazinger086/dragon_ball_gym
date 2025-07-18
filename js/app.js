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
    alert('Por favor seleccioná un archivo CSV primero.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    parseCSV(text);
  };
  reader.readAsText(file);
});

function parseCSV(data) {
  const lines = data.trim().split('\n');
  const headers = lines[0].split(',');

  const routineContainer = document.getElementById('routine');
  routineContainer.innerHTML = '';

  const totalExercises = lines.length - 1;
  let completedCount = 0;
  const completed = {};

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    const routineObj = Object.fromEntries(headers.map((h, j) => [h.trim(), values[j].trim()]));
    const id = `ex-${i}`;

    const card = document.createElement('div');
    card.className = 'routine-card';
    card.innerHTML = `
      <h3>${routineObj['Día']} - ${routineObj['Ejercicio']}</h3>
      <p>Series: ${routineObj['Series']} | Reps: ${routineObj['Repeticiones']}</p>
      <p>Peso: ${routineObj['Peso']}</p>
      <button id="${id}" class="incomplete-btn">❌ Incompleto</button>
    `;
    routineContainer.appendChild(card);

    document.getElementById(id).addEventListener('click', function () {
      if (completed[id]) return;
      completed[id] = true;
      completedCount++;

      updatePowerBar(completedCount, totalExercises);

      this.classList.remove('incomplete-btn');
      this.classList.add('complete-btn');
      this.disabled = true;
      this.textContent = "✔️ Completo";
    });
  }

  updatePowerBar(0, totalExercises);
}



function updatePowerBar(completed, total) {
  const percent = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById('powerBar').style.width = percent + '%';
  document.getElementById('powerValue').textContent = `${percent.toFixed(1)}% Completado`;
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