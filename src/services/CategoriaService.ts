// Importamos el tipo de dato ICategoria y la clase BackendClient
import ICategoria from "../types/ICategoria";
import CategoriaPost from "../types/post/CategoriaPost";
import  BackendClient  from "./BackendClient";

// Clase CategoriaService que extiende BackendClient
export default class CategoriaService extends BackendClient<ICategoria> {

    async postx(url: string, data: CategoriaPost): Promise<ICategoria> {
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
      
      async putx(url: string, id: number, data: CategoriaPost): Promise<ICategoria> {
        const path = `${url}/${id}`;
        const options: RequestInit = {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
        console.log(data);
        return this.request(path, options);
        
      }

    
}