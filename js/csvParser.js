function normalizeText(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function parseJSON(data) {
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const diaActual = diasSemana[new Date().getDay()];
  const routineContainer = document.getElementById('routine');
  routineContainer.innerHTML = `<h2>🥋 Rutina para hoy: <span style="color: yellow">${diaActual}</span></h2>`;

  const ejerciciosHoy = data.filter(item => normalizeText(item['Día']) === normalizeText(diaActual));

  if (ejerciciosHoy.length === 0) {
    routineContainer.innerHTML += `<p style="color: orange">🎉 Hoy no hay ejercicios programados. Día de descanso.</p>`;
    updatePowerBar(0, 1);
    return;
  }

  let completedCount = 0;
  const totalExercises = ejerciciosHoy.length;
  const completed = {};
  const completadosHoy = JSON.parse(localStorage.getItem(`completados_${new Date().toISOString().split('T')[0]}`) || '[]');

  ejerciciosHoy.forEach((rutina, index) => {
    const id = `ex-${index}`;
    const yaCompletado = completadosHoy.includes(id);

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

  updatePowerBar(completadosHoy.length, totalExercises);
}


