console.log('conexion exitosa');

//IMPORTACIONES
 import { obtenerPaises } from "./api/countriesApi.js";
 import {
    mostrarCargando,
    mostrarError,
    renderPaises,
    actualizarContador
} from "./ui/ui.js";
 import { procesarPaises } from "./utils/filters.js";   

 //estado de la aplicacion
  let paises = [];
//REFERENCIAS DEL DOM
const destinationsContainer = document.querySelector(
    "#destinations-container"
);

const resultsCount = document.querySelector(
    "#results-count"
);
const searchInput = document.querySelector('#search-input');
const continentFilter = document.querySelector('#continent-filter');
const sortFilter = document.querySelector('#sort-filter');

function aplicarFiltros() {
    const texto = searchInput.value;
    //VALOR CONTINENTE
    const continente = continentFilter.value;
    //VALOR ORDENAMIENTO
    const criterioOrden = sortFilter.value;
    const resultados = procesarPaises(paises, texto, continente, criterioOrden);
    renderPaises(resultados, destinationsContainer);
    actualizarContador(resultados.length, resultsCount);
}


//REGISTRAR EVENTOS
function registrarEventos() {
    searchInput.addEventListener('input', aplicarFiltros);
    continentFilter.addEventListener('change', aplicarFiltros);
    sortFilter.addEventListener('change', aplicarFiltros);

}

 
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

    aplicarFiltros();
    

    registrarEventos();
    
}

 //INICIAR LA APLICACION
  init();
