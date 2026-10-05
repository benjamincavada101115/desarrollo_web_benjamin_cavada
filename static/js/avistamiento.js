document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("form-avistamiento");
    
    const lugar = document.getElementById("lugar");
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const fotoVideo = document.getElementById("foto-video");

    const errorLugar = document.getElementById("error-lugar");
    const errorFecha = document.getElementById("error-fecha");
    const errorHora = document.getElementById("error-hora");
    const errorFotoVideo = document.getElementById("error-foto-video");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            let esValido = true;

            if (lugar.value.trim().length < 3) {
                errorLugar.classList.add("visible");
                esValido = false;
            } else {
                errorLugar.classList.remove("visible");
            }

            if (fecha.value === "") {
                errorFecha.classList.add("visible");
                esValido = false;
            } else {
                errorFecha.classList.remove("visible");
            }

            if (hora.value === "") {
                errorHora.classList.add("visible");
                esValido = false;
            } else {
                errorHora.classList.remove("visible");
            }

            if (fotoVideo.files.length === 0) {
                errorFotoVideo.classList.add("visible");
                esValido = false;
            } else {
                errorFotoVideo.classList.remove("visible");
            }

            if (!esValido) {
                event.preventDefault();
            }
        });
    }
});