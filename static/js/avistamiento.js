document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("form-avistamiento");

    const voluntario = document.getElementById("voluntario");
    const ave = document.getElementById("ave");
    const lugar = document.getElementById("lugar");
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const descripcion = document.getElementById("descripcion");
    const fotoVideo = document.getElementById("foto-video");

    const errorVoluntario = document.getElementById("error-voluntario");
    const errorAve = document.getElementById("error-ave");
    const errorLugar = document.getElementById("error-lugar");
    const errorFecha = document.getElementById("error-fecha");
    const errorHora = document.getElementById("error-hora");
    const errorDescripcion = document.getElementById("error-descripcion");
    const errorFotoVideo = document.getElementById("error-foto-video");

    formulario.addEventListener("submit", function (event) {
        let esValido = true;

        if (voluntario && (voluntario.value === "" || voluntario.value === null)) {
            if (errorVoluntario) errorVoluntario.classList.add("visible");
            esValido = false;
        } else if (errorVoluntario) {
            errorVoluntario.classList.remove("visible");
        }

        if (ave && (ave.value === "" || ave.value === null)) {
            if (errorAve) errorAve.classList.add("visible");
            esValido = false;
        } else if (errorAve) {
            errorAve.classList.remove("visible");
        }

        if (lugar.value.trim().length < 3) {
            if (errorLugar) errorLugar.classList.add("visible");
            esValido = false;
        } else if (errorLugar) {
            errorLugar.classList.remove("visible");
        }

        if (descripcion && descripcion.value.trim().length > 500) {
            if (errorDescripcion) errorDescripcion.classList.add("visible");
            esValido = false;
        } else if (errorDescripcion) {
            errorDescripcion.classList.remove("visible");
        }

        if (fecha.value === "") {
            if (errorFecha) {
                errorFecha.textContent = "Debes seleccionar una fecha.";
                errorFecha.classList.add("visible");
            }
            esValido = false;
        } else if (errorFecha) {
            errorFecha.classList.remove("visible");
        }

        if (hora.value === "") {
            if (errorHora) errorHora.classList.add("visible");
            esValido = false;
        } else if (errorHora) {
            errorHora.classList.remove("visible");
        }

        if (fecha.value !== "" && hora.value !== "") {
            const partesFecha = fecha.value.split("-");
            const año = Number(partesFecha[0]);
            const mes = Number(partesFecha[1]);
            const dia = Number(partesFecha[2]);

            const partesHora = hora.value.split(":");
            const horas = Number(partesHora[0]);
            const minutos = Number(partesHora[1]);

            const fechaAvistamiento = new Date(año, mes - 1, dia, horas, minutos);
            const ahora = new Date();

            const fechaMinima = new Date();
            fechaMinima.setFullYear(fechaMinima.getFullYear() - 1);

            if (fechaAvistamiento > ahora) {
                if (errorFecha) {
                    errorFecha.textContent = "La fecha y hora no pueden ser futuras.";
                    errorFecha.classList.add("visible");
                }
                esValido = false;
            } else if (fechaAvistamiento < fechaMinima) {
                if (errorFecha) {
                    errorFecha.textContent = "El avistamiento no puede tener más de 1 año.";
                    errorFecha.classList.add("visible");
                }
                esValido = false;
            }
        }

        if (fotoVideo.files.length === 0) {
            if (errorFotoVideo) errorFotoVideo.classList.add("visible");
            esValido = false;
        } else if (errorFotoVideo) {
            errorFotoVideo.classList.remove("visible");
        }

        if (!esValido) {
            event.preventDefault();
        }
    });
});