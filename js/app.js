console.log("conexion exitosa");

// =========================================
// IMPORTACIONES
// =========================================

// Obtener países desde la API
import { obtenerPaises } from "./api/countriesApi.js";

/* =========================================
   SERVICIO DE FAVORITOS
========================================= */

import {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
  esFavorito,
} from "./services/favoritesService.js";

// Funciones de interfaz
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
  mostrarDetalle,
  mostrarFavoritosVacios,
} from "./ui/ui.js";

// Funciones del mapa
import { crearMapa, destruirMapa } from "./ui/mapUI.js";

// Funciones de búsqueda y filtros
import { procesarPaises } from "./utils/filters.js";

//estado de la aplicacion
let paises = [];

// =========================================
// ESTADO DE LA VISTA ACTUAL
// =========================================

let vistaActual = "explorar";

//REFERENCIAS DEL DOM
const destinationsContainer = document.querySelector("#destinations-container");

/* =========================================
   REFERENCIAS DEL MODAL
========================================= */

const detailModal = document.querySelector("#detail-modal");

const detailModalContent = document.querySelector("#detail-modal-content");

const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#search-input");
const continentFilter = document.querySelector("#continent-filter");
const sortFilter = document.querySelector("#sort-filter");

/* =========================================
   REFERENCIAS DE NAVEGACIÓN
========================================= */

const btnExplorar = document.querySelector("#btn-explorar");

const btnFavoritos = document.querySelector("#btn-favoritos");

const sectionTitle = document.querySelector("#section-title");

const searchForm = document.querySelector("#search-form");

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

/* =========================================
   ACTUALIZAR NAVEGACIÓN
========================================= */

function actualizarNavegacion() {
  if (vistaActual === "explorar") {
    // Botón Explorar activo
    btnExplorar.className = `
            px-4 py-2
            bg-blue-600 text-white
            rounded-lg font-medium
            cursor-pointer
            hover:bg-blue-700 transition
        `;

    // Botón Favoritos inactivo
    btnFavoritos.className = `
            px-4 py-2
            bg-white text-slate-700
            border border-slate-300
            rounded-lg font-medium
            cursor-pointer
            hover:bg-slate-100 transition
        `;
  } else {
    // Botón Explorar inactivo
    btnExplorar.className = `
            px-4 py-2
            bg-white text-slate-700
            border border-slate-300
            rounded-lg font-medium
            cursor-pointer
            hover:bg-slate-100 transition
        `;

    // Botón Favoritos activo
    btnFavoritos.className = `
            px-4 py-2
            bg-blue-600 text-white
            rounded-lg font-medium
            cursor-pointer
            hover:bg-blue-700 transition
        `;
  }
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

/* =========================================
   MOSTRAR VISTA EXPLORAR
========================================= */

function mostrarExplorar() {
  // Cambiar el estado
  vistaActual = "explorar";

  // Actualizar título
  sectionTitle.textContent = "Destinos";

  // Mostrar filtros
  searchForm.classList.remove("hidden");

  // Actualizar navegación
  actualizarNavegacion();

  // Mostrar países
  aplicarFiltros();
}

/* =========================================
   MOSTRAR VISTA FAVORITOS
========================================= */

function mostrarFavoritos() {
  // Cambiar el estado
  vistaActual = "favoritos";

  // Actualizar título
  sectionTitle.textContent = "Mis favoritos";

  // Ocultar filtros
  searchForm.classList.add("hidden");

  // Actualizar navegación
  actualizarNavegacion();

  // Obtener favoritos
  const favoritos = obtenerFavoritos();

  // Comprobar si no hay favoritos
  if (favoritos.length === 0) {
    mostrarFavoritosVacios(destinationsContainer);

    actualizarContador(0, resultsCount);

    return;
  }

  // Mostrar favoritos
  renderPaises(favoritos, destinationsContainer, "favoritos");

  // Actualizar contador
  actualizarContador(favoritos.length, resultsCount);
}

/* =========================================
   BUSCAR PAÍS POR CÓDIGO
========================================= */

function obtenerPaisPorCodigo(codigo) {
  return paises.find((pais) => {
    return pais.codes?.alpha_3 === codigo;
  });
}

/* =========================================
   AGREGAR DESTINO A FAVORITOS
========================================= */

function manejarAgregarFavorito(codigo) {
  // Buscar el país seleccionado
  const pais = obtenerPaisPorCodigo(codigo);

  if (!pais) {
    console.warn("No se encontró el país:", codigo);
    return;
  }

  // Comprobar si ya está guardado
  if (esFavorito(codigo)) {
    Swal.fire({
      icon: "info",
      title: "Ya está en favoritos",
      text: "Este destino ya había sido guardado.",
    });

    return;
  }

  // Guardar el país en LocalStorage
  const agregado = agregarFavorito(pais);

  // Mostrar confirmación
  if (agregado) {
    Swal.fire({
      icon: "success",
      title: "Destino guardado",
      text: `${pais.names?.common ?? "El destino"} fue agregado a favoritos.`,
      timer: 1800,
      showConfirmButton: false,
    });
  }
}

/* =========================================
   ELIMINAR DESTINO DE FAVORITOS
========================================= */

async function manejarEliminarFavorito(codigo) {
  // Buscar el país en favoritos
  const favoritos = obtenerFavoritos();

  const pais = favoritos.find((favorito) => {
    return favorito.codes?.alpha_3 === codigo;
  });

  if (!pais) {
    console.warn("No se encontró el favorito:", codigo);
    return;
  }

  // Preguntar antes de eliminar
  const resultado = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar favorito?",
    text: `¿Deseas eliminar ${pais.names?.common ?? "este destino"} de tus favoritos?`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
  });

  // Si el usuario cancela, no eliminar
  if (!resultado.isConfirmed) {
    return;
  }

  // Eliminar del LocalStorage
  eliminarFavorito(codigo);

  // Actualizar la vista
  mostrarFavoritos();

  // Mostrar confirmación
  await Swal.fire({
    icon: "success",
    title: "Favorito eliminado",
    text: "El destino fue eliminado correctamente.",
    timer: 1800,
    showConfirmButton: false,
  });
}

function registrarEventos() {
  // Eventos de búsqueda y filtros
  searchInput.addEventListener("input", aplicarFiltros);

  continentFilter.addEventListener("change", aplicarFiltros);

  sortFilter.addEventListener("change", aplicarFiltros);

  /* =========================================
       NAVEGACIÓN - EXPLORAR
    ========================================= */

  btnExplorar.addEventListener("click", mostrarExplorar);

  /* =========================================
       NAVEGACIÓN - FAVORITOS
    ========================================= */

  btnFavoritos.addEventListener("click", mostrarFavoritos);

  // =========================================
  // CERRAR MODAL CON EL BOTÓN X
  // =========================================

  detailModal.addEventListener("click", (event) => {
    const botonCerrar = event.target.closest("#btn-close-detail");

    if (botonCerrar) {
      cerrarDetalle();
    }
  });

  // =========================================
  // CERRAR MODAL CON ESCAPE
  // =========================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !detailModal.classList.contains("hidden")) {
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
    // Detectar cualquier botón con data-action
    const boton = event.target.closest("button[data-action]");

    if (!boton) {
      return;
    }

    // Obtener la acción y el código
    const accion = boton.dataset.action;
    const codigo = boton.dataset.countryCode;

    // Guardar favorito
    if (accion === "favorite") {
      manejarAgregarFavorito(codigo);

      return;
    }

    // =========================================
    // ELIMINAR FAVORITO
    // =========================================

    if (accion === "remove-favorite") {
      manejarEliminarFavorito(codigo);

      return;
    }

    // Continuar solamente si es Ver más
    if (accion !== "detail") {
      return;
    }

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

    console.log("Verificando contenido del modal:", detailModalContent);

    // Comprobar las referencias antes de continuar
    if (!detailModal || !detailModalContent) {
      console.error("No se encontraron los elementos del modal");
      return;
    }

    // Mostrar información del país seleccionado
    const datosMapa = mostrarDetalle(
      paisSeleccionado,
      detailModal,
      detailModalContent,
    );

    // Comprobar los datos del mapa
    console.log("Datos del mapa:", datosMapa);

    // =========================================
    // CREAR MAPA DEL PAÍS SELECCIONADO
    // =========================================

    console.log("¿Latitud válida?", Number.isFinite(datosMapa.latitud));

    console.log("¿Longitud válida?", Number.isFinite(datosMapa.longitud));

    // =========================================
    // CREAR MAPA DEL PAÍS
    // =========================================

    if (
      Number.isFinite(datosMapa.latitud) &&
      Number.isFinite(datosMapa.longitud)
    ) {
      console.log("PASO 1: Coordenadas válidas");

      console.log("PASO 2: Voy a llamar a crearMapa");

      crearMapa(datosMapa.latitud, datosMapa.longitud, datosMapa.nombre);

      console.log("PASO 3: Terminó crearMapa");
    } else {
      console.warn("Este país no tiene coordenadas disponibles");
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

  actualizarNavegacion();

  registrarEventos();
}

//INICIAR LA APLICACION
init();
