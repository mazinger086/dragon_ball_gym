function updatePowerBar(completed, total) {
  const percent = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById('powerBar').style.width = percent + '%';
  document.getElementById('powerValue').textContent = `${percent.toFixed(1)}% Completado`;

  const progressWidth = document.querySelector('.progress').offsetWidth;
  const head = document.getElementById('shenlongHead');
  head.style.left = `calc(${percent}% - ${head.offsetWidth / 2}px)`;

  guardarProgresoDiario(percent);
}

function guardarProgresoDiario(porcentaje) {
  const hoy = new Date().toISOString().split('T')[0];
  const progreso = { fecha: hoy, completado: porcentaje >= 100 };
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
