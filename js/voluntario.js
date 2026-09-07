const formulario = document.getElementById("form-voluntario");

const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const correo = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const region = document.getElementById("region");
const comuna = document.getElementById("comuna");

const errorNombre = document.getElementById("error-nombre");
const errorApellido = document.getElementById("error-apellido");
const errorCorreo = document.getElementById("error-correo");
const errorTelefono = document.getElementById("error-telefono");
const errorRegion = document.getElementById("error-region");
const errorComuna = document.getElementById("error-comuna");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    if (nombre.value.trim().length < 3) {
        errorNombre.classList.add("visible");
    } else {
        errorNombre.classList.remove("visible");
    }

    if (apellido.value.trim().length < 3) {
        errorApellido.classList.add("visible");
    } else {
        errorApellido.classList.remove("visible");
    }

    if (correo.value.trim() < 3 || !correo.value.includes("@")) {
        errorCorreo.classList.add("visible");
    } else {
        errorCorreo.classList.remove("visible");
    }

    if (!Number.isInteger(Number(telefono.value)) || telefono.value.trim().length !== 9) {
        errorTelefono.classList.add("visible");
    } else {
        errorTelefono.classList.remove("visible");
    }

    if (region.value === "") {
        errorRegion.classList.add("visible");
    } else {
        errorRegion.classList.remove("visible");
    }

    if (comuna.value.trim().length < 3) {
        errorComuna.classList.add("visible");
    } else {
        errorComuna.classList.remove("visible");
    }
});