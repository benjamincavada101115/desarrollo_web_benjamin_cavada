document.addEventListener("DOMContentLoaded", () => {
    const formBusqueda = document.getElementById("form-busqueda");
    const campoBusqueda = document.getElementById("campo-busqueda");
    const mensajeEstado = document.getElementById("mensaje-estado");
    const tablaResultados = document.getElementById("tabla-resultados");
    const cuerpoTabla = document.getElementById("cuerpo-tabla");

    const modalEvaluar = document.getElementById("modal-evaluar");
    const detalleModal = document.getElementById("detalle-modal");
    const selectNota = document.getElementById("select-nota");
    const errorModal = document.getElementById("error-modal");
    const btnGuardarNota = document.getElementById("btn-guardar-nota");
    const btnCancelarModal = document.getElementById("btn-cancelar-modal");

    let avistamientoSeleccionadoId = null;

    formBusqueda.addEventListener("submit", (event) => {
        event.preventDefault();
    });

    campoBusqueda.addEventListener("input", () => {
        const texto = campoBusqueda.value.trim();

        if (texto === "") {
            cuerpoTabla.innerHTML = "";
            tablaResultados.classList.add("oculto");
            mensajeEstado.textContent = "Comienza a escribir en el buscador para ver los avistamientos registrados.";
            mensajeEstado.classList.remove("oculto");
            return;
        }

        buscarAvistamientos(texto);
    });

    async function buscarAvistamientos(texto) {
        try {
            const url = `/api/avistamientos/buscar?q=${encodeURIComponent(texto)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Error al consultar los avistamientos.");
            }

            const lista = await response.json();
            renderizarResultados(lista, texto);
        } catch (error) {
            cuerpoTabla.innerHTML = "";
            tablaResultados.classList.add("oculto");
            mensajeEstado.textContent = "Ocurrió un problema al realizar la búsqueda. Intenta nuevamente.";
            mensajeEstado.classList.remove("oculto");
        }
    }

    function crearTextoResaltado(textoOriginal, patron) {
        const fragmento = document.createDocumentFragment();
        if (!patron) {
            fragmento.appendChild(document.createTextNode(textoOriginal));
            return fragmento;
        }

        const patronEscapado = patron.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${patronEscapado})`, "gi");
        const partes = textoOriginal.split(regex);

        partes.forEach((parte) => {
            if (parte.toLowerCase() === patron.toLowerCase()) {
                const marca = document.createElement("mark");
                marca.className = "coincidencia";
                marca.textContent = parte;
                fragmento.appendChild(marca);
            } else if (parte.length > 0) {
                fragmento.appendChild(document.createTextNode(parte));
            }
        });

        return fragmento;
    }

    function renderizarResultados(lista, patron) {
        cuerpoTabla.innerHTML = "";

        if (lista.length === 0) {
            tablaResultados.classList.add("oculto");
            mensajeEstado.textContent = `No se encontraron avistamientos que coincidan con "${patron}".`;
            mensajeEstado.classList.remove("oculto");
            return;
        }

        mensajeEstado.classList.add("oculto");
        tablaResultados.classList.remove("oculto");

        lista.forEach((item) => {
            const fila = document.createElement("tr");
            fila.dataset.avistamientoId = item.id;

            const tdVoluntario = document.createElement("td");
            tdVoluntario.appendChild(crearTextoResaltado(item.voluntario, patron));
            fila.appendChild(tdVoluntario);

            const tdDia = document.createElement("td");
            tdDia.textContent = item.dia;
            fila.appendChild(tdDia);

            const tdAve = document.createElement("td");
            tdAve.appendChild(crearTextoResaltado(item.ave, patron));
            fila.appendChild(tdAve);

            const tdComuna = document.createElement("td");
            tdComuna.appendChild(crearTextoResaltado(item.comuna, patron));
            fila.appendChild(tdComuna);

            const tdNota = document.createElement("td");
            tdNota.className = "celda-nota";
            tdNota.id = `nota-avistamiento-${item.id}`;
            tdNota.textContent = item.nota;
            fila.appendChild(tdNota);

            const tdAccion = document.createElement("td");
            const btnEvaluar = document.createElement("button");
            btnEvaluar.type = "button";
            btnEvaluar.className = "btn-evaluar";
            btnEvaluar.textContent = "Evaluar";
            btnEvaluar.addEventListener("click", () => abrirModalEvaluacion(item));
            tdAccion.appendChild(btnEvaluar);
            fila.appendChild(tdAccion);

            cuerpoTabla.appendChild(fila);
        });
    }

    function abrirModalEvaluacion(item) {
        avistamientoSeleccionadoId = item.id;
        detalleModal.textContent = `Avistamiento de ${item.ave} registrado por ${item.voluntario} (${item.comuna}).`;
        selectNota.value = "";
        errorModal.textContent = "";
        errorModal.classList.add("oculto");
        modalEvaluar.classList.remove("oculto");
        selectNota.focus();
    }

    function cerrarModalEvaluacion() {
        avistamientoSeleccionadoId = null;
        modalEvaluar.classList.add("oculto");
    }

    btnCancelarModal.addEventListener("click", cerrarModalEvaluacion);

    btnGuardarNota.addEventListener("click", async () => {
        if (avistamientoSeleccionadoId === null) {
            return;
        }

        const valorSeleccionado = Number(selectNota.value);

        if (!Number.isInteger(valorSeleccionado) || valorSeleccionado < 1 || valorSeleccionado > 7) {
            errorModal.textContent = "Debes seleccionar una nota entera válida entre 1 y 7.";
            errorModal.classList.remove("oculto");
            return;
        }

        try {
            const response = await fetch(`/api/avistamientos/${avistamientoSeleccionadoId}/notas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nota: valorSeleccionado })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                errorModal.textContent = data.error || "No se pudo registrar la nota.";
                errorModal.classList.remove("oculto");
                return;
            }

            const celdaNota = document.getElementById(`nota-avistamiento-${avistamientoSeleccionadoId}`);
            if (celdaNota) {
                celdaNota.textContent = data.notaPromedio;
            }

            cerrarModalEvaluacion();
        } catch (error) {
            errorModal.textContent = "Error de conexión al guardar la nota.";
            errorModal.classList.remove("oculto");
        }
    });
});