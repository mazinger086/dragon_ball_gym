  
import {
  firebaseConfig,
  initializeApp,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,   // <-- importar query
  where,
  Timestamp,
  doc,
  setDoc,
  getDoc
} from './firebase.js';
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Normalizar texto (quita tildes)
  function normalizeText(texto) {
    const acentos = {
      á: "a", é: "e", í: "i", ó: "o", ú: "u",
      Á: "a", É: "e", Í: "i", Ó: "o", Ú: "u",
      ñ: "n", Ñ: "n"
    };
    return texto
      .split('')
      .map(letra => acentos[letra] || letra)
      .join('')
      .toLowerCase()
      .trim();
  }

  // Mostrar nombre de archivo cargado
  document.getElementById('selectFileBtn').addEventListener('click', () => {
    document.getElementById('csvFile').click();
  });

  document.getElementById('csvFile').addEventListener('change', function () {
    const fileName = this.files[0] ? this.files[0].name : 'Ningún archivo seleccionado';
    document.getElementById('fileName').textContent = fileName;
  });

  // Leer CSV y guardar en Firestore
  document.getElementById('loadBtn').addEventListener('click', async function () {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Seleccioná un archivo CSV primero.' });
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {
      try {
        const text = e.target.result;
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length < headers.length) continue;

          const rutina = Object.fromEntries(headers.map((h, j) => [h, values[j]]));

          await addDoc(collection(db, "rutinas"), {
            dia: normalizeText(rutina['Día'] || rutina['Dia']),
            ejercicio: rutina['Ejercicio'],
            series: rutina['Series'],
            repeticiones: rutina['Repeticiones'],
            peso: rutina['Peso'],
            timestamp: Timestamp.now()
          });
        }

        Swal.fire({ icon: 'success', title: '¡Carga completa!', text: 'Rutina guardada en la nube.' });
        cargarRutinaHoy();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error al subir', text: error.message });
      }
    };

    reader.readAsText(file);
  });

  // Mostrar la rutina del día
  async function cargarRutinaHoy() {
    const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const diaActual = dias[new Date().getDay()];
    const fechaHoy = new Date().toISOString().split('T')[0];

    const q = query(collection(db, "rutinas"), where("dia", "==", diaActual));
    const snapshot = await getDocs(q);

    const routineContainer = document.getElementById("routine");
    routineContainer.innerHTML = `<h2>🥋 Rutina para hoy: <span style="color: yellow">${diaActual}</span></h2>`;

    if (snapshot.empty) {
      routineContainer.innerHTML += `<p style="color: orange">🎉 Hoy no hay ejercicios programados. Día de descanso.</p>`;
      updatePowerBar(0, 1);
      return;
    }

    const completadosDoc = await getDoc(doc(db, "progreso", fechaHoy));
    const completadosHoy = completadosDoc.exists() ? completadosDoc.data().completados : [];

    let completedCount = 0;
    let totalExercises = 0;
    const completed = {};

    snapshot.forEach((docSnap, index) => {
      const rutina = docSnap.data();
      const id = `ex-${index}`;
      const yaCompletado = completadosHoy.includes(id);

      const card = document.createElement('div');
      card.className = 'routine-card';
      card.innerHTML = `
        <h3>${rutina.ejercicio}</h3>
        <p>Series: ${rutina.series} | Reps: ${rutina.repeticiones}</p>
        <p>Peso: ${rutina.peso}</p>
        <button id="${id}" class="${yaCompletado ? 'complete-btn' : 'incomplete-btn'}" ${yaCompletado ? 'disabled' : ''}>
          ${yaCompletado ? '✔️ Completo' : '❌ Incompleto'}
        </button>
      `;
      routineContainer.appendChild(card);

      document.getElementById(id).addEventListener('click', async function () {
        if (completed[id]) return;
        completed[id] = true;
        completedCount++;

        const nuevosCompletados = [...completadosHoy, id];
        const porcentaje = ((completedCount + completadosHoy.length) / snapshot.size) * 100;

        await setDoc(doc(db, "progreso", fechaHoy), {
          fecha: fechaHoy,
          completado: porcentaje >= 100,
          completados: nuevosCompletados,
          porcentaje: porcentaje
        });

        updatePowerBar(completedCount + completadosHoy.length, snapshot.size);
        this.classList.remove('incomplete-btn');
        this.classList.add('complete-btn');
        this.disabled = true;
        this.textContent = "✔️ Completo";
      });

      totalExercises++;
    });

    updatePowerBar(completadosHoy.length, totalExercises);
  }

  // Barra de progreso
  function updatePowerBar(completed, total) {
    const percent = total === 0 ? 0 : (completed / total) * 100;
    document.getElementById('powerBar').style.width = percent + '%';
    document.getElementById('powerValue').textContent = `${percent.toFixed(1)}% Completado`;

    const progressWidth = document.querySelector('.progress').offsetWidth;
    const head = document.getElementById('shenlongHead');
    head.style.left = `calc(${percent}% - ${head.offsetWidth / 2}px)`;
  }

  // Mostrar rutina automáticamente al cargar
  window.addEventListener("DOMContentLoaded", cargarRutinaHoy);

