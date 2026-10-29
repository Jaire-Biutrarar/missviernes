const audio = new Audio();
const btnPlay = document.getElementById("btn-play");
const titulo = document.getElementById("titulo");
const progreso = document.getElementById("progreso");
const listaUl = document.getElementById("lista-canciones");
const pestanas = document.querySelectorAll(".pestanas button");

let listaActual = [];
let cancionActual = null;

progreso.min = 0;
progreso.step = "any";

function marcarActiva() {
  [...listaUl.children].forEach((li, i) => {
    li.classList.toggle("activa", listaActual[i] === cancionActual);
  });
  const activa = listaUl.querySelector(".activa");
  if (!activa) return;
  const r = activa.getBoundingClientRect();
  const u = listaUl.getBoundingClientRect();
  if (r.top < u.top) listaUl.scrollTop -= u.top - r.top;
  else if (r.bottom > u.bottom) listaUl.scrollTop += r.bottom - u.bottom;
}

function alternar() {
  if (!cancionActual) {
    if (listaActual.length) reproducir(listaActual[0]);
    return;
  }
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

function reproducir(cancion) {
  cancionActual = cancion;
  audio.src = cancion.archivo;
  titulo.textContent = cancion.titulo;
  progreso.value = 0;
  audio.play().catch(() => {});
  marcarActiva();
}

function siguiente() {
  if (!listaActual.length) return;
  const i = listaActual.indexOf(cancionActual);
  reproducir(listaActual[(i + 1) % listaActual.length]);
}

function dibujarLista() {
  listaUl.innerHTML = "";
  listaActual.forEach(cancion => {
    const li = document.createElement("li");
    li.textContent = cancion.titulo;
    li.addEventListener("click", () => {
      if (cancion === cancionActual) alternar();
      else reproducir(cancion);
    });
    listaUl.appendChild(li);
  });
  marcarActiva();
}

function mostrarLista(filtro) {
  listaActual = filtro === "detodo"
    ? canciones
    : canciones.filter(c => c.lista === filtro);
  pestanas.forEach(btn => {
    btn.classList.toggle("activa", btn.dataset.lista === filtro);
  });
  listaUl.scrollTop = 0;
  dibujarLista();
}

pestanas.forEach(btn => {
  btn.addEventListener("click", () => mostrarLista(btn.dataset.lista));
});

btnPlay.addEventListener("click", alternar);

progreso.addEventListener("input", () => {
  audio.currentTime = progreso.value;
});

audio.addEventListener("play", () => { btnPlay.textContent = "⏸"; });
audio.addEventListener("pause", () => { btnPlay.textContent = "▶"; });
audio.addEventListener("loadedmetadata", () => { progreso.max = audio.duration; });
audio.addEventListener("timeupdate", () => { progreso.value = audio.currentTime; });
audio.addEventListener("ended", siguiente);
audio.addEventListener("error", () => {
  titulo.textContent = "No se pudo cargar la canción";
});

mostrarLista("detodo");