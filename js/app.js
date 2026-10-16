
console.log("conexion exitosa");

// =========================================
// IMPORTACIONES
// =========================================

// Obtener países desde la API
import { obtenerPaises } from "./api/countriesApi.js";

// Funciones de interfaz
import {
    mostrarCargando,
    mostrarError,
    renderPaises,
    actualizarContador,
    mostrarDetalle
} from "./ui/ui.js";

// Funciones del mapa
import {
    crearMapa,
    destruirMapa
} from "./ui/mapUI.js";

// Funciones de búsqueda y filtros
import { procesarPaises } from "./utils/filters.js";
  
 //estado de la aplicacion
  let paises = [];
//REFERENCIAS DEL DOM
const destinationsContainer = document.querySelector(
    "#destinations-container"
);

/* =========================================
   REFERENCIAS DEL MODAL
========================================= */

const detailModal = document.querySelector(
    "#detail-modal"
);

const detailModalContent = document.querySelector(
    "#detail-modal-content"
);


const resultsCount = document.querySelector(
    "#results-count"
);
const searchInput = document.querySelector('#search-input');
const continentFilter = document.querySelector('#continent-filter');
const sortFilter = document.querySelector('#sort-filter');

/* =========================================
   CERRAR MODAL DE DETALLE
========================================= */

function cerrarDetalle() {

    // Ocultar el modal
    detailModal.classList.add("hidden");

    // Eliminar el mapa anterior
    destruirMapa();

    // Limpiar el contenido del modal
    detailModalContent.innerHTML = "";

}


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

    // Eventos de búsqueda y filtros
    searchInput.addEventListener("input", aplicarFiltros);

    continentFilter.addEventListener("change", aplicarFiltros);

    sortFilter.addEventListener("change", aplicarFiltros);

    // =========================================
    // CERRAR MODAL CON EL BOTÓN X
    // =========================================

    detailModal.addEventListener("click", (event) => {

        const botonCerrar = event.target.closest(
            "#btn-close-detail"
        );

        if (botonCerrar) {
            cerrarDetalle();
        }
    });

    // =========================================
    // CERRAR MODAL CON ESCAPE
    // =========================================

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            !detailModal.classList.contains("hidden")
        ) {
            cerrarDetalle();
        }

    });

    // =========================================
    // CERRAR MODAL CON FONDO OSCURO
    // =========================================

    detailModal.addEventListener("click", (event) => {

        if (event.target === detailModal) {
            cerrarDetalle();
        }

    });



    // Detectar clic en las tarjetas
    destinationsContainer.addEventListener("click", (event) => {

        const boton = event.target.closest(
            'button[data-action="detail"]'
        );

        if (!boton) {
            return;
        }

        // Obtener el código del país seleccionado
        const codigo = boton.dataset.countryCode;

        console.log("País seleccionado:", codigo);

        // Buscar el país seleccionado
        const paisSeleccionado = paises.find((pais) => {
            return pais.codes?.alpha_3 === codigo;
        });

        // Comprobar si encontramos el país
        if (!paisSeleccionado) {
            console.warn("No se encontró el país:", codigo);
            return;
        }

        // Mostrar el país encontrado en consola
        console.log("País encontrado:", paisSeleccionado);

        // Mostrar información del país seleccionado
       
        // Verificar que JavaScript encuentre el modal
        console.log("Verificando modal:", detailModal);

        console.log(
            "Verificando contenido del modal:",
            detailModalContent
        );

        // Comprobar las referencias antes de continuar
        if (!detailModal || !detailModalContent) {
            console.error("No se encontraron los elementos del modal");
            return;
        }

        // Mostrar información del país seleccionado
        const datosMapa = mostrarDetalle(
            paisSeleccionado,
            detailModal,
            detailModalContent
        );

        // Comprobar los datos del mapa
        console.log("Datos del mapa:", datosMapa);

        // =========================================
        // CREAR MAPA DEL PAÍS SELECCIONADO
        // =========================================

console.log("¿Latitud válida?",
    Number.isFinite(datosMapa.latitud)
);

console.log("¿Longitud válida?",
    Number.isFinite(datosMapa.longitud)
);


     
        // =========================================
        // CREAR MAPA DEL PAÍS
        // =========================================

        if (
            Number.isFinite(datosMapa.latitud) &&
            Number.isFinite(datosMapa.longitud)
        ) {

            console.log("PASO 1: Coordenadas válidas");

            console.log("PASO 2: Voy a llamar a crearMapa");

            crearMapa(
                datosMapa.latitud,
                datosMapa.longitud,
                datosMapa.nombre
            );

            console.log("PASO 3: Terminó crearMapa");

        } else {

            console.warn(
                "Este país no tiene coordenadas disponibles"
            );

        }


    });



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
