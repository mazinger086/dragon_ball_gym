// document.getElementById('loadBtn').addEventListener('click', function () {
//   const fileInput = document.getElementById('csvFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Por favor seleccioná un archivo JSON primero.',
//     });
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     try {
//       const text = e.target.result;
//       localStorage.setItem('rutina_csv', text);
//       parseCSV(text);
//     } catch (error) {
//       console.error("Error al cargar la rutina:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: error,
//       });
//     }
//   };

//   reader.readAsText(file);
// });


document.getElementById('loadBtn').addEventListener('click', function () {
  const fileInput = document.getElementById('jsonFile'); // puedes renombrar csvFile a jsonFile
  const file = fileInput.files[0];

  if (!file) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor seleccioná un archivo JSON primero.',
    });
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const jsonText = e.target.result;
      const jsonData = JSON.parse(jsonText);
      localStorage.setItem('rutina_json', JSON.stringify(jsonData));
      parseJSON(jsonData);  // Nuevo método
    } catch (error) {
      console.error("Error al cargar la rutina:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El archivo no es un JSON válido.',
      });
    }
  };

  reader.readAsText(file);
});

