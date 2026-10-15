console.log('conexion exitosa');

//IMPORTACIONES
 import { obtenerPaises } from "./api/countriesApi.js";
 //estado de la aplicacion
  let paises = [];
//REFERENCIAS DEL DOM
const destinationsContainer = document.querySelector(
    "#destinations-container"
);

const resultsCount = document.querySelector(
    "#results-count"
);

  const initialMessage = document.querySelector(
    "#initial-message"
);
 
 /* =========================================
   INICIALIZACIÓN DE LA APLICACIÓN
========================================= */

    async function init() {

    console.log("Explorador de Viajes iniciado");

    // Mostrar mensaje de carga
    initialMessage.textContent = "🌎 Cargando destinos...";

    // Obtener países desde la API
    paises = await obtenerPaises();

    // Mostrar los países en consola
    console.log("Países obtenidos:", paises);

    // Actualizar el contador
    resultsCount.textContent = `${paises.length} destinos`;

    // Verificar si recibimos países
    if (paises.length > 0) {

        initialMessage.textContent =
            `✅ Se obtuvieron ${paises.length} destinos correctamente.`;

    } else {

        initialMessage.textContent =
            "⚠️ No fue posible cargar los destinos.";

    }
}
 
  init();
