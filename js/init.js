// window.addEventListener('DOMContentLoaded', () => {
//   const rutinaGuardada = localStorage.getItem('rutina_csv');
//   if (rutinaGuardada) {
//     parseCSV(rutinaGuardada);
//   }
// });


window.addEventListener('DOMContentLoaded', () => {
  const rutinaGuardada = localStorage.getItem('rutina_json');
  if (rutinaGuardada) {
    parseJSON(JSON.parse(rutinaGuardada));
  }
});
