// FILTROS Y ORDENAMIENTO DE PAISES
// BUSCAR PAISES POR NOMBRE

export function buscarPaises(paises, texto) {

    // NOMALIZAR EL TEXTO DE BUSQUEDA
    const textoNormalizado = texto.trim().toLowerCase();

    // VALIDACION SI NO HAY BUSQUEDA
    if (!textoNormalizado) {
        return paises;
    }

    //FILTRAR LOS PAISES 
    return paises.filter((pais) => {
        //NORMALIZACION DEL NOMBRE DEL PAIS
        const nombre = pais.names?.common ?.toLowerCase() ?? "";
        return nombre.includes(textoNormalizado);
    });    
}

//filtrar por continente
export function filtrarPorContinente(paises, continente) {

    // FILTRAR ALL
    if (continente === "all") {
        return paises;
    }
    //FILTRAR POR REGION
    return paises.filter((pais) => { return pais.region === continente; });
}

    //ORDENAMIENTO PAISES
    export function ordenarPaises(paises, criterio) {
       //UTILIZAR SPREAD PARA NO MODIFICAR EL ARRAY ORIGINAL
       const paisesOrdenados = [...paises];
       //ORDDENAR A-Z 
         if (criterio === "az") {
            return paisesOrdenados.sort((a, b) => {
                const nombreA = a.names?.common ?? "";
                const nombreB = b.names?.common ?? "";
                return nombreA.localeCompare(nombreB);
            });
        }
        //ORDENAR Z-A
        if (criterio === "za") {
            return paisesOrdenados.sort((a, b) => {
                const nombreA = a.names?.common ?? "";
                const nombreB = b.names?.common ?? "";
                return nombreB.localeCompare(nombreA);
            });
        }
        return paisesOrdenados;



        
    
    }

    //FUNCION COMBINANDO PROCESAMIENTO DE FILTROS Y ORDENAMIENTO
    export function procesarPaises(paises, texto, continente, criterioOrden) {
        let resultado = buscarPaises(paises, texto);
        resultado = filtrarPorContinente(resultado, continente);
        resultado = ordenarPaises(resultado, criterioOrden);
        return resultado;
    }