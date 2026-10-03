let voluntarios = [
    { nombre: "Juan Pérez", region: "Atacama" },
    { nombre: "Ana González", region: "Atacama" },
    { nombre: "Pedro Soto", region: "Valparaíso" },
    { nombre: "María López", region: "Santiago" },
    { nombre: "Carlos Pérez", region: "Santiago" },
    { nombre: "Laura Díaz", region: "Santiago" },
    { nombre: "Diego Rojas", region: "Magallanes" }
];


let avistamientos = [
    { tipo: "Ave 1", fecha: "2023-06-01", hora: "10:00", lugar: "Atacama" },
    { tipo: "Ave 2", fecha: "2023-06-02", hora: "11:00", lugar: "Magallanes" },
    { tipo: "Ave 1", fecha: "2023-06-03", hora: "12:00", lugar: "Valparaíso" },
    { tipo: "Ave 3", fecha: "2023-06-04", hora: "13:00", lugar: "Santiago" },
    { tipo: "Ave 1", fecha: "2023-06-04", hora: "14:00", lugar: "Santiago" },
    { tipo: "Ave 2", fecha: "2023-06-05", hora: "15:00", lugar: "Atacama" }
];

function calcularIndicadores() {
    calcularIndicadoresVoluntarios();
    calcularIndicadoresAvistamientos();
}

function calcularIndicadoresVoluntarios() {
    let totalVoluntarios = voluntarios.length;

    document.getElementById("total-voluntarios").textContent =
        totalVoluntarios;

    let cantidadRegiones = {};

    for (let i = 0; i < voluntarios.length; i++) {
        let region = voluntarios[i].region;
        if (cantidadRegiones[region]) {
            cantidadRegiones[region]++;
        } 
        else {
            cantidadRegiones[region] = 1;
        }
    }

    let regionMasVoluntarios = "";
    let mayorCantidad = 0;

    for (let region in cantidadRegiones) {
        if (cantidadRegiones[region] > mayorCantidad) {
            mayorCantidad = cantidadRegiones[region];
            regionMasVoluntarios = region;
        }
    }

    document.getElementById("region-mas-voluntarios").textContent =
        regionMasVoluntarios + " (" + mayorCantidad + ")";

    mostrarVoluntarios(cantidadRegiones);

    mostrarGrafico(
        cantidadRegiones,
        "grafico-voluntarios"
    );

}

function calcularIndicadoresAvistamientos() {
    let total = avistamientos.length;

    document.getElementById("total-avistamientos").textContent =
        total;

    let cantidadAves = {};

    for (let i = 0; i < avistamientos.length; i++) {
        let tipo = avistamientos[i].tipo;

        if (cantidadAves[tipo]) {
            cantidadAves[tipo]++;
        } 
        else {
            cantidadAves[tipo] = 1;
        }

    }

    let aveMasObservada = "";
    let mayorCantidadAve = 0;

    for (let tipo in cantidadAves) {
        if (cantidadAves[tipo] > mayorCantidadAve) {
            mayorCantidadAve = cantidadAves[tipo];
            aveMasObservada = tipo;
        }
    }


    document.getElementById("ave-mas-observada").textContent =
        aveMasObservada + " (" + mayorCantidadAve + ")";

    let cantidadLugares = {};

    for (let i = 0; i < avistamientos.length; i++) {
        let lugar = avistamientos[i].lugar;

        if (cantidadLugares[lugar]) {
            cantidadLugares[lugar]++;
        } 
        else {
            cantidadLugares[lugar] = 1;
        }
    }

    let lugarMasAvistamientos = "";
    let mayorCantidadLugar = 0;

    for (let lugar in cantidadLugares) {
        if (cantidadLugares[lugar] > mayorCantidadLugar) {
            mayorCantidadLugar = cantidadLugares[lugar];
            lugarMasAvistamientos = lugar;
        }
    }

    document.getElementById("lugar-mas-avistamientos").textContent =
        lugarMasAvistamientos + " (" + mayorCantidadLugar + ")";

    let fechas = [];

    for (let i = 0; i < avistamientos.length; i++) {
        if (!fechas.includes(avistamientos[i].fecha)) {
            fechas.push(avistamientos[i].fecha);
        }
    }

    let promedio = 0;

    if (fechas.length > 0) {
        promedio = total / fechas.length;
    }

    document.getElementById("promedio-dia").textContent =
        promedio.toFixed(2);

    mostrarLugares(cantidadLugares);
    mostrarAves(cantidadAves);

    mostrarGrafico(
        cantidadAves,
        "grafico-aves"
    );

}

function mostrarVoluntarios(cantidadRegiones) {
    let tabla = document.getElementById("tabla-voluntarios");
    tabla.innerHTML = "";

    for (let region in cantidadRegiones) {
        let fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + region + "</td>" +
            "<td>" + cantidadRegiones[region] + "</td>";
        tabla.appendChild(fila);
    }
}

function mostrarLugares(cantidadLugares) {
    let tabla = document.getElementById("tabla-lugares");
    tabla.innerHTML = "";

    for (let lugar in cantidadLugares) {
        let fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + lugar + "</td>" +
            "<td>" + cantidadLugares[lugar] + "</td>";
        tabla.appendChild(fila);
    }
}

function mostrarAves(cantidadAves) {
    let tabla = document.getElementById("tabla-aves");
    tabla.innerHTML = "";

    for (let tipo in cantidadAves) {
        let fila = document.createElement("tr");
        fila.innerHTML =
            "<td>" + tipo + "</td>" +
            "<td>" + cantidadAves[tipo] + "</td>";

        tabla.appendChild(fila);
    }
}

function mostrarGrafico(datos, idGrafico) {

    let grafico = document.getElementById(idGrafico);
    grafico.innerHTML = "";
    let mayor = 0;

    for (let dato in datos) {
        if (datos[dato] > mayor) {
            mayor = datos[dato];
        }
    }

    for (let dato in datos) {
        let contenedor = document.createElement("div");
        contenedor.className = "barra-contenedor";
        let nombre = document.createElement("span");

        nombre.textContent =
            dato + ": " + datos[dato];

        let barra = document.createElement("div");
        barra.className = "barra";

        let ancho = (datos[dato] / mayor) * 100;
        barra.style.width = ancho + "%";


        contenedor.appendChild(nombre);
        contenedor.appendChild(barra);
        grafico.appendChild(contenedor);

    }
}

calcularIndicadores();