document.addEventListener("DOMContentLoaded", () => {
    cargarComentarios();

    const form = document.getElementById("form-comentario");
    const mensajeError = document.getElementById("mensaje-error");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensajeError.style.display = "none";
        mensajeError.innerHTML = "";

        const nombreVal = document.getElementById("nombre").value.trim();
        const textoVal = document.getElementById("texto").value.trim();

        let errores = [];

        if (nombreVal.length < 3 || nombreVal.length > 50) {
            errores.push("El nombre debe tener entre 3 y 50 caracteres.");
        }

        if (textoVal.length < 5) {
            errores.push("El comentario debe tener al menos 5 caracteres.");
        }

        if (errores.length > 0) {
            mensajeError.innerHTML = errores.join("<br>");
            mensajeError.style.display = "block";
            return;
        }

        try {
            const response = await fetch(`/api/avistamiento/${avistamientoId}/comentarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: nombreVal, texto: textoVal })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                form.reset();
                cargarComentarios();
            } else {
                mensajeError.innerHTML = (result.errores || [result.mensaje]).join("<br>");
                mensajeError.style.display = "block";
            }
        } catch (error) {
            mensajeError.innerHTML = "Error al comunicarse con el servidor.";
            mensajeError.style.display = "block";
        }
    });
});

async function cargarComentarios() {
    const contenedor = document.getElementById("contenedor-comentarios");
    try {
        const response = await fetch(`/api/avistamiento/${avistamientoId}/comentarios`);
        const comentarios = await response.json();

        if (comentarios.length === 0) {
            contenedor.innerHTML = "<p>No hay comentarios aún.</p>";
            return;
        }

        contenedor.innerHTML = comentarios.map(c => `
            <div style="border-bottom: 1px solid #ccc; margin-bottom: 10px; padding-bottom: 5px;">
                <p><strong>${escapeHTML(c.nombre)}</strong> <em>(${c.fecha})</em></p>
                <p>${escapeHTML(c.texto)}</p>
            </div>
        `).join('');
    } catch (error) {
        contenedor.innerHTML = "<p>Error al cargar los comentarios.</p>";
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}