// Importamos el tipo de dato IArticuloInsumo y la clase BackendClient
import IArticuloInsumo from "../types/IArticuloInsumo";
import ArticuloInsumoPost from "../types/post/ArticuloInsumoPost";
import  BackendClient  from "./BackendClient";

// Clase ArticuloInsumoService que extiende BackendClient para interactuar con la API de personas
export default class ArticuloInsumoService extends BackendClient<IArticuloInsumo> {
    async postx(url: string, data: ArticuloInsumoPost): Promise<IArticuloInsumo> {
        const path = url;
        const options: RequestInit = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
        return this.request(path, options);
      }
      
      async putx(url: string, id: number, data: ArticuloInsumoPost): Promise<IArticuloInsumo> {
        const path = `${url}/${id}`;
        const options: RequestInit = {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
        return this.request(path, options);
      }
}