import IPromocion from "../types/IPromocion";
import IPromocionDetalle from "../types/IPromocionDetalle";
import PromocionPost from "../types/post/PromocionPost";
import BackendClient from "./BackendClient";

export default class PromocionService extends BackendClient<IPromocion> {

    async postx(url: string, data: PromocionPost): Promise<IPromocion> {
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
    
      async putx(url: string, id: number, data: PromocionPost): Promise<IPromocion> {
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
      async getDetallesPromos(url: string, id: number): Promise<IPromocionDetalle[]> {
        const path = `${url}/${id}/Detalles`;
        const options: RequestInit = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        };
        try {
          const response = await fetch(path, options);
    
          if (!response.ok) {
            console.error("Error en la solicitud:", response.statusText);
            throw new Error(response.statusText);
          }
    
          if (response.status === 204 || response.headers.get("Content-Length") === "0") {
            return []; // O algún otro valor predeterminado
          }
    
          return response.json();
        } catch (error) {
          console.error("Error en la solicitud:", error);
          return Promise.reject(error);
        }
      }
}