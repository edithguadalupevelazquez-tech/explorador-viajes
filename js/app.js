console.log('conexion exitosa');

//IMPORTACIONES
 import { obtenerPaises } from "./api/countriesApi.js";
 import {
    mostrarCargando,
    mostrarError,
    renderPaises,
    actualizarContador
} from "./ui/ui.js";
 //estado de la aplicacion
  let paises = [];
//REFERENCIAS DEL DOM
const destinationsContainer = document.querySelector(
    "#destinations-container"
);

const resultsCount = document.querySelector(
    "#results-count"
);

 
/* =========================================
   INICIALIZACIÓN DE LA APLICACIÓN
========================================= */

async function init() {

    console.log("Explorador de Viajes iniciado");

    // 1. Mostrar mensaje de carga
    mostrarCargando(destinationsContainer);

    // 2. Obtener países desde la API
    paises = await obtenerPaises();

    // 3. Mostrar los países en consola
    console.log("Países obtenidos:", paises);

    // 4. Comprobar si recibimos datos
    if (paises.length === 0) {

        mostrarError(destinationsContainer);

        actualizarContador(0, resultsCount);

        return;
    }

    // 5. Crear las tarjetas de los países
    renderPaises(paises, destinationsContainer);

    // 6. Actualizar el contador
    actualizarContador(paises.length, resultsCount);
}

 
  init();
