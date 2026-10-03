const formulario = document.getElementById("form-avistamiento");

const tipoAve = document.getElementById("tipo-ave");
const nombreAve = document.getElementById("nombre-Ave");
const lugar = document.getElementById("lugar");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const fotoVideo = document.getElementById("foto-video");

const errorTipoAve = document.getElementById("error-tipo-ave");
const errorNombreAve = document.getElementById("error-nombre-Ave");
const errorLugar = document.getElementById("error-lugar");
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

    if (lugar.value.trim().length < 3) {
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

    if (fecha.value !== "" && hora.value !== "") {

    const partesFecha = fecha.value.split("-");
    const año = Number(partesFecha[0]);
    const mes = Number(partesFecha[1]);
    const dia = Number(partesFecha[2]);

    // Separamos la hora en horas y minutos
    const partesHora = hora.value.split(":");
    const horas = Number(partesHora[0]);
    const minutos = Number(partesHora[1]);

    const fechaAvistamiento = new Date(
        año,
        mes - 1,
        dia,
        horas,
        minutos
    );

    const ahora = new Date();

    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 1);

    if (fechaAvistamiento > ahora) {
        errorFecha.textContent = "La fecha y hora no pueden ser futuras.";
        errorFecha.classList.add("visible");
    }

    else if (fechaAvistamiento < fechaMinima) {
        errorFecha.textContent = "El avistamiento no puede tener más de 1 año.";
        errorFecha.classList.add("visible");
    }
    else {
        errorFecha.classList.remove("visible");
    }
}

    if (fotoVideo.files.length === 0) {
        errorFotoVideo.classList.add("visible");
    } else {
        errorFotoVideo.classList.remove("visible");
    }
});