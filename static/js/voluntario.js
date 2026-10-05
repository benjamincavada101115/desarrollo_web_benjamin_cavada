document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("form-voluntario");

    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const correo = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");

    const errorNombre = document.getElementById("error-nombre");
    const errorApellido = document.getElementById("error-apellido");
    const errorCorreo = document.getElementById("error-email");
    const errorTelefono = document.getElementById("error-telefono");
    const errorRegion = document.getElementById("error-region");
    const errorComuna = document.getElementById("error-comuna");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            let esValido = true;

            if (nombre.value.trim().length < 3) {
                errorNombre.classList.add("visible");
                esValido = false;
            } else {
                errorNombre.classList.remove("visible");
            }

            if (apellido.value.trim().length < 3) {
                errorApellido.classList.add("visible");
                esValido = false;
            } else {
                errorApellido.classList.remove("visible");
            }

            if (!correo.checkValidity() || correo.value.trim() === "") {
                errorCorreo.classList.add("visible");
                esValido = false;
            } else {
                errorCorreo.classList.remove("visible");
            }

            if (!Number.isInteger(Number(telefono.value)) || telefono.value.trim().length !== 9) {
                errorTelefono.classList.add("visible");
                esValido = false;
            } else {
                errorTelefono.classList.remove("visible");
            }

            if (region.value === "") {
                errorRegion.classList.add("visible");
                esValido = false;
            } else {
                errorRegion.classList.remove("visible");
            }

            if (comuna.value === "") {
                errorComuna.classList.add("visible");
                esValido = false;
            } else {
                errorComuna.classList.remove("visible");
            }

            // Solo detiene el submit si hay algún error de validación
            if (!esValido) {
                event.preventDefault();
            }
        });
    }

    if (region) {
        region.addEventListener("change", function () {
            const regionId = this.value;
            comuna.innerHTML = '<option value="">Cargando...</option>';

            if (regionId) {
                fetch(`/get_comunas/${regionId}`)
                    .then(res => res.json())
                    .then(data => {
                        comuna.innerHTML = '<option value="">Seleccione una comuna</option>';
                        data.forEach(c => {
                            const opt = document.createElement("option");
                            opt.value = c.id;
                            opt.textContent = c.nombre;
                            comuna.appendChild(opt);
                        });
                    });
            } else {
                comuna.innerHTML = '<option value="">Seleccione primero una región</option>';
            }
        });
    }
});