


window.addEventListener('DOMContentLoaded', () => {
  const rutinaGuardada = localStorage.getItem('rutina_json');
  if (rutinaGuardada) {
    parseJSON(JSON.parse(rutinaGuardada));
  }
});
