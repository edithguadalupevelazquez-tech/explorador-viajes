
/* =========================================
   INTERFAZ DE USUARIO
   Funciones encargadas de actualizar el DOM
========================================= */

/* =========================================
   MOSTRAR ESTADO DE CARGA
========================================= */

export function mostrarCargando(contenedor) {

    contenedor.innerHTML = `
        <div class="
            col-span-full
            bg-white
            border
            border-dashed
            border-slate-300
            rounded-xl
            p-12
            text-center
        ">

            <div class="text-5xl mb-4">
                🌎
            </div>

            <h3 class="
                text-xl
                font-semibold
                text-slate-800
                mb-2
            ">
                Cargando destinos...
            </h3>

            <p class="text-slate-500">
                Estamos consultando información
                de países alrededor del mundo.
            </p>

        </div>
    `;
}
/* =========================================
   MOSTRAR ERROR
========================================= */

export function mostrarError(contenedor) {

    contenedor.innerHTML = `
        <div class="
            col-span-full
            bg-red-50
            border
            border-red-200
            rounded-xl
            p-12
            text-center
        ">

            <div class="text-5xl mb-4">
                ⚠️
            </div>

            <h3 class="
                text-xl
                font-semibold
                text-red-700
                mb-2
            ">
                No fue posible cargar los destinos
            </h3>

            <p class="text-red-600">
                Verifica tu conexión e intenta
                nuevamente.
            </p>

        </div>
    `;
}
/* =========================================
   ACTUALIZAR CONTADOR
========================================= */

export function actualizarContador(total, elementoContador) {

    elementoContador.textContent = `${total} destinos`;

}
/* =========================================
   RENDERIZAR DESTINOS
========================================= */

export function renderPaises(paises, contenedor) {

    const tarjetas = paises.map((pais) => {

        const nombre =
            pais.names?.common ?? "Nombre no disponible";

        const region =
            pais.region ?? "Región no disponible";

        const poblacion =
            pais.population ?? 0;
        
        const poblacionFormateada =
           poblacion.toLocaleString("es-MX");

        const bandera =
            pais.flag?.url_png ?? "";

        const codigo =
            pais.codes?.alpha_3 ?? "";

        console.log(nombre, region, poblacion, bandera, codigo);

      
return `
    <article class="
        bg-white rounded-xl border border-slate-200
        overflow-hidden shadow-sm hover:shadow-md transition
    ">

        <!-- BANDERA -->
        <div class="h-48 bg-slate-100 overflow-hidden">
            <img
                src="${bandera}"
                alt="Bandera de ${nombre}"
                class="w-full h-full object-cover"
                loading="lazy"
            >
        </div>

        <!-- INFORMACIÓN DEL PAÍS -->
        <div class="p-5">

            <div class="
                flex items-start justify-between
                gap-4 mb-4
            ">

                <div>
                    <h3 class="text-xl font-bold text-slate-900">
                        ${nombre}
                    </h3>

                    <p class="text-sm text-slate-500">
                        ${region}
                    </p>
                </div>

                <span class="
                    px-3 py-1 bg-blue-50 text-blue-600
                    text-xs font-medium rounded-full
                ">
                    ${codigo}
                </span>

            </div>

            <!-- POBLACIÓN -->
            <div class="mb-5">
                <p class="text-xs text-slate-500">
                    Población
                </p>

                <p class="text-lg font-semibold text-slate-800">
                    ${poblacionFormateada}
                </p>
            </div>

            <!-- BOTONES -->
            <div class="flex gap-3">

                <button
                    type="button"
                    data-action="detail"
                    data-country-code="${codigo}"
                    class="
                        flex-1 px-4 py-2 bg-blue-600
                        text-white rounded-lg font-medium
                        hover:bg-blue-700 transition
                    "
                >
                    Ver más
                </button>

                <button
                    type="button"
                    data-action="favorite"
                    data-country-code="${codigo}"
                    aria-label="Agregar ${nombre} a favoritos"
                    class="
                        px-4 py-2 border border-slate-300
                        text-slate-600 rounded-lg
                        hover:bg-slate-100 transition
                    "
                >
                    ♡
                </button>

            </div>

        </div>

     </article>
`;

    }).join("");

    contenedor.innerHTML = tarjetas;
}
