// Importamos el tipo de dato IArticuloManufactutadoDetalle y la clase BackendClient

import IArticuloManufacturadoDetalle from "../types/IArticuloManufacturadoDetalle";
import ArticuloManufacturadoDetallePost from "../types/post/ArticuloManufacturadoDetallePost";
import  BackendClient  from "./BackendClient";

// Clase ArticuloManufacturadoService que extiende BackendClient para interactuar con la API de articuloManufacturado

export default class ArticuloManufacturadoDetalleService extends BackendClient<IArticuloManufacturadoDetalle> {
    async postx(url: string, data: ArticuloManufacturadoDetallePost): Promise<IArticuloManufacturadoDetalle> {
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
      
      async putx(url: string, id: number, data: ArticuloManufacturadoDetallePost): Promise<IArticuloManufacturadoDetalle> {
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