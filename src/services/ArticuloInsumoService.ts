import IArticuloInsumo from "../types/IArticuloInsumo";
import ArticuloInsumoPost from "../types/post/ArticuloInsumoPost";
import BackendClient from "./BackendClient";

export default class ArticuloInsumoService extends BackendClient<IArticuloInsumo> {
  async postx(url: string, data: ArticuloInsumoPost, token: string): Promise<IArticuloInsumo> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    };
    return this.request(url, options);
  }

  async putx(url: string, id: number, data: ArticuloInsumoPost, token: string): Promise<IArticuloInsumo> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }
}
