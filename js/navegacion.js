const botonesPrincipales = document.querySelector(".botones-principales");
const secciones = document.querySelectorAll("section");

function ocultarTodo() {
  botonesPrincipales.hidden = true;
  secciones.forEach(sec => sec.hidden = true);
}

function mostrar(nombre) {
  ocultarTodo();
  document.querySelector("section." + nombre).hidden = false;
}

function volver() {
  ocultarTodo();
  botonesPrincipales.hidden = false;
}

document.querySelectorAll("[data-ir]").forEach(btn => {
  btn.addEventListener("click", () => mostrar(btn.dataset.ir));
});

document.querySelectorAll("[data-volver]").forEach(btn => {
  btn.addEventListener("click", volver);
});