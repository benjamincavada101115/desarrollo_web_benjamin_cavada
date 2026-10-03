let avistamientos = [
    { tipo: "Ave 1", fecha: "2023-06-01", hora: "10:00", lugar: "Atacama" },
    { tipo: "Ave 2", fecha: "2023-06-02", hora: "11:00", lugar: "Magallanes" },
    { tipo: "Ave 3", fecha: "2023-06-03", hora: "12:00", lugar: "Valparaíso" },
    { tipo: "Ave 4", fecha: "2023-06-04", hora: "13:00", lugar: "Santiago" },
    { tipo: "Ave 1", fecha: "2023-06-05", hora: "14:00", lugar: "Santiago" },
    { tipo: "Ave 2", fecha: "2023-06-06", hora: "15:00", lugar: "Magallanes" },
    { tipo: "Ave 3", fecha: "2023-06-07", hora: "16:00", lugar: "Valparaíso" },
];

let cantidadPorPagina = 3;
let paginaActual = 1;
let resultados = avistamientos;

function mostrarAvistamientos() {
    let tabla = document.getElementById("tabla-avistamientos");
    tabla.innerHTML = "";

    let inicio = (paginaActual - 1) * cantidadPorPagina;
    let fin = inicio + cantidadPorPagina;
    let resultadosPagina = resultados.slice(inicio, fin);

    for (let i = 0; i < resultadosPagina.length; i++) {
        let avistamiento = resultadosPagina[i];
        let fila = document.createElement("tr");

        fila.innerHTML = 
            "<td>" + avistamiento.tipo + "</td>" +
            "<td>" + avistamiento.fecha + "</td>" +
            "<td>" + avistamiento.hora + "</td>" +
            "<td>" + avistamiento.lugar + "</td>";
        tabla.appendChild(fila);
    }

    mostrarPaginas();
}

function buscar() {
    let tipoAve = document.getElementById("tipoAve").value;
    let orden = document.getElementById("Orden").value;
    let ordenTipo = document.getElementById("OrdenTipo").value;

    resultados = avistamientos.slice();

    if (tipoAve !== "todos") {
        resultados = resultados.filter(function(avistamiento) {
            return avistamiento.tipo === tipoAve;
        });
    }

    resultados.sort(function(a, b) {
        let valorA = a[orden];
        let valorB = b[orden];

        if (valorA < valorB) {
            return ordenTipo === "asc" ? -1 : 1;
        } 
        if (valorA > valorB) {
            return ordenTipo === "asc" ? 1 : -1;
        }
        return 0;
    });

    paginaActual = 1;
    mostrarAvistamientos();
}

function mostrarPaginas() {
    let contenedor = document.getElementById("paginas");
    contenedor.innerHTML = "";

    let cantidadPaginas = Math.ceil(resultados.length / cantidadPorPagina);

    for (let i = 1; i <= cantidadPaginas; i++) {
        let boton = document.createElement("button");
        boton.textContent = i;
        boton.addEventListener("click", function() {
            paginaActual = i;
            mostrarAvistamientos();
        });
        contenedor.appendChild(boton);
    }
}

document.getElementById("form-avistamiento").addEventListener("submit", function(event) {
    event.preventDefault();
    buscar();
});

mostrarAvistamientos();
