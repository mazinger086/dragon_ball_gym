function generarCalendario() {
  const contenedor = document.getElementById('calendar');
  const historial = JSON.parse(localStorage.getItem('historial_rutina') || '[]');

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();

  const primerDia = new Date(año, mes, 1).getDay(); // Día de la semana
  const diasEnMes = new Date(año, mes + 1, 0).getDate();

  // Espacios vacíos antes del 1º
  for (let i = 0; i < primerDia; i++) {
    const celda = document.createElement('div');
    celda.className = 'day empty';
    celda.textContent = '';
    contenedor.appendChild(celda);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fechaActual = new Date(año, mes, dia).toISOString().split('T')[0];
    const entrada = historial.find(e => e.fecha === fechaActual);

    const celda = document.createElement('div');
    celda.classList.add('day');

    if (entrada) {
      celda.classList.add(entrada.completado ? 'complete' : 'incomplete');
    } else {
      celda.classList.add('empty');
    }

    celda.textContent = dia;
    contenedor.appendChild(celda);
  }
}

document.addEventListener('DOMContentLoaded', generarCalendario);
