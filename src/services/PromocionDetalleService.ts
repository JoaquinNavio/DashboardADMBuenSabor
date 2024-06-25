import IPromocionDetalle from "../types/IPromocionDetalle";
import PromocionDetallePost from "../types/post/PromocionDetallePost";
import BackendClient from "./BackendClient";

export default class PromocionDetalleService extends BackendClient<IPromocionDetalle> {

    async postx(url: string, data: PromocionDetallePost): Promise<IPromocionDetalle> {
        const path = url;
        const options: RequestInit = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };          // @ts-ignore

        return this.request(path, options);
      }
    
      async putx(url: string, id: number, data: PromocionDetallePost): Promise<IPromocionDetalle> {
        const path = `${url}/${id}`;
        const options: RequestInit = {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };          // @ts-ignore

        return this.request(path, options);
      }

      
}