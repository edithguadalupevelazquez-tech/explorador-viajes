/* =========================================
   MAPA
   Integración de Leaflet
========================================= */

/* =========================================
   INSTANCIA ACTUAL DEL MAPA
========================================= */

let mapaActual = null;
/* =========================================
   DESTRUIR MAPA ACTUAL
========================================= */

export function destruirMapa() {

    if (mapaActual) {

        mapaActual.remove();

        mapaActual = null;

    }
}

/* =========================================
   CREAR MAPA
========================================= */

export function crearMapa(latitud, longitud, nombre) {
console.log("🌎 Entramos a crearMapa");
    // 1. Validar coordenadas
    if (
        typeof latitud !== "number" ||
        typeof longitud !== "number"
    ) {
        console.warn("Coordenadas no disponibles");
        return;
    }

    // 2. Eliminar el mapa anterior
    destruirMapa();

    // 3. Inicializar Leaflet
    mapaActual = L.map("destination-map").setView(
        [latitud, longitud],
        4
    );

    // 4. Agregar OpenStreetMap
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(mapaActual);

    // 5. Agregar marcador
    L.marker([latitud, longitud])
        .addTo(mapaActual)
        .bindPopup(nombre)
        .openPopup();

        // Actualizar el tamaño del mapa
requestAnimationFrame(() => {
    if (mapaActual) {
        mapaActual.invalidateSize();
    }
});

}
