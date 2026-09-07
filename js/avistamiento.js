const formulario = document.getElementById("form-avistamiento");

const tipoAve = document.getElementById("tipo-ave");
const nombreAve = document.getElementById("nombre-Ave");
const Lugar = document.getElementById("Lugar");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const fotoVideo = document.getElementById("foto-video");

const errorTipoAve = document.getElementById("error-tipo-ave");
const errorNombreAve = document.getElementById("error-nombre-Ave");
const errorLugar = document.getElementById("error-Lugar");
const errorFecha = document.getElementById("error-fecha");
const errorHora = document.getElementById("error-hora");
const errorFotoVideo = document.getElementById("error-foto-video");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    if (tipoAve.value.trim().length < 3) {
        errorTipoAve.classList.add("visible");
    } else {
        errorTipoAve.classList.remove("visible");
    }

    if (nombreAve.value.trim().length < 3) {
        errorNombreAve.classList.add("visible");
    } else {
        errorNombreAve.classList.remove("visible");
    }

    if (Lugar.value.trim().length < 3) {
        errorLugar.classList.add("visible");
    } else {
        errorLugar.classList.remove("visible");
    }

    if (fecha.value === "") {
        errorFecha.classList.add("visible");
    } else {
        errorFecha.classList.remove("visible");
    }

    if (hora.value === "") {
        errorHora.classList.add("visible");
    } else {
        errorHora.classList.remove("visible");
    }

    if (!fotoVideo.value) {
        errorFotoVideo.classList.add("visible");
    } else {
        errorFotoVideo.classList.remove("visible");
    }
});