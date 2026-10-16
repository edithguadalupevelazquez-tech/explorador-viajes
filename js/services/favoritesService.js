
/* =========================================
   SERVICIO DE FAVORITOS
   Manejo de favoritos con LocalStorage
========================================= */

/* =========================================
   CLAVE DE LOCALSTORAGE
========================================= */

const FAVORITES_KEY = "explorador_viajes_favoritos";

/* =========================================
   OBTENER FAVORITOS
========================================= */

export function obtenerFavoritos() {

    const favoritosGuardados = localStorage.getItem(
        FAVORITES_KEY
    );

    if (!favoritosGuardados) {
        return [];
    }

    try {
        return JSON.parse(favoritosGuardados);
    } catch (error) {
        console.error("Error al leer favoritos:", error);
        return [];
    }

}

/* =========================================
   GUARDAR FAVORITOS
========================================= */

function guardarFavoritos(favoritos) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favoritos)
    );

}

/* =========================================
   VERIFICAR SI UN PAÍS ES FAVORITO
========================================= */

export function esFavorito(codigo) {

    const favoritos = obtenerFavoritos();

    return favoritos.some(
        (pais) => pais.codes?.alpha_3 === codigo
    );

}

/* =========================================
   AGREGAR FAVORITO
========================================= */

export function agregarFavorito(pais) {

    // Obtener los favoritos actuales
    const favoritos = obtenerFavoritos();

    // Obtener el código del país
    const codigo = pais.codes?.alpha_3;

    // Comprobar que tenga código
    if (!codigo) {
        return false;
    }

    // Verificar si ya está guardado
    const yaExiste = favoritos.some(
        (favorito) =>
            favorito.codes?.alpha_3 === codigo
    );

    // Evitar duplicados
    if (yaExiste) {
        return false;
    }

    // Agregar el país al arreglo
    favoritos.push(pais);

    // Guardar los favoritos actualizados
    guardarFavoritos(favoritos);

    return true;
}

/* =========================================
   ELIMINAR FAVORITO
========================================= */

export function eliminarFavorito(codigo) {

    // Obtener favoritos actuales
    const favoritos = obtenerFavoritos();

    // Conservar los países con código diferente
    const favoritosActualizados = favoritos.filter(
        (pais) =>
            pais.codes?.alpha_3 !== codigo
    );

    // Guardar la lista actualizada
    guardarFavoritos(favoritosActualizados);

    return favoritosActualizados;
}





