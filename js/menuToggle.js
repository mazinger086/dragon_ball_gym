const toggle = document.getElementById("toggle-menu");
const heading = document.querySelector("header h1");

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    heading.classList.add("menu-open");    
  } else {
    heading.classList.remove("menu-open");    
  }
});
