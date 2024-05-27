// Importamos el tipo de dato IImage y la clase BackendClient
import IImage from "../types/IImage";
import  BackendClient  from "./BackendClient";

// Clase ImageService que extiende BackendClient para interactuar con la API de personas
export default class ImageService extends BackendClient<IImage> {

    async uploadImagenes(imagenes: FileList, path: string) {
        // Crear un objeto FormData y agregar los archivos seleccionados
        const formData = new FormData();
        Array.from(imagenes).forEach((file) => {
            formData.append("uploads", file); // Utilizar 'uploads' como clave
        });

        try {
            // Realizar la petición POST para subir los archivos
            const response = await fetch(`${path}/images/uploads`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                console.error(
                    "Error",
                    "Algo falló al subir las imágenes, inténtalo de nuevo.",
                    "error"
                );
                return null;
            }
            return response.json();

        } catch (error) {
            // Mostrar mensaje de error si ocurre una excepción
            console.error("Error:", error);
        }
    }

}