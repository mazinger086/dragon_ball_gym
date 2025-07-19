document.getElementById('selectFileBtn').addEventListener('click', function () {
  document.getElementById('jsonFile').click();
});

document.getElementById('jsonFile').addEventListener('change', function () {
  const fileName = this.files[0] ? this.files[0].name : 'Ningún archivo seleccionado';
  document.getElementById('fileName').textContent = fileName;
});
