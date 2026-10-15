//COMUNICACION CON LA API
const API_URL =
    "https://juancognitus.github.io/explorador-viajes-api/paises.json";

//EXPORT ME PERMITE EXPORTAR MI FUNCION O LO QUE ,MANEJO A OTROS ARCHIVOS
export async function obtenerPaises(){

    try{

         //REALIZAR LA PETICION
    const response = await fetch(API_URL);

 //validaciion del ok
    if (!response.ok) {
        throw new Error(`Error HTTP:${response.status}`);

    }
    const result = await response.json();
     
    const paises= result;
    console.log("Paises obtenidos:", paises);
 
    return paises;

    }catch (error) {
        console.error("Error al obtener los paises:", error);
        return [];
    }
    
} 
