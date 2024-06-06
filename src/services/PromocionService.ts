import IPromocion from "../types/IPromocion";
import IPromocionDetalle from "../types/IPromocionDetalle";
import PromocionPost from "../types/post/PromocionPost";
import BackendClient from "./BackendClient";

export default class PromocionService extends BackendClient<IPromocion> {

  async postx(url: string, data: PromocionPost, token: string): Promise<IPromocion> {
    return this.post(url, data, token);
  }

  async putx(url: string, id: number, data: PromocionPost, token: string): Promise<IPromocion> {
    return this.put(url, id, data, token);
  }

  async getDetallesPromos(url: string, id: number, token: string): Promise<IPromocionDetalle[]> {
    const path = `${url}/${id}/Detalles`;
    return this.requestAll(path, { method: "GET" }, token);
  }
}
