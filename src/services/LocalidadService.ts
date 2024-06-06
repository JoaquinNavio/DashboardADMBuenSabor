import ILocalidad from "../types/ILocalidad";
import BackendClient from "./BackendClient";

export default class LocalidadService extends BackendClient<ILocalidad> {
  async getByProvincia(url: string, idProvincia: number, token: string): Promise<ILocalidad[]> {
    const path = `${url}/${idProvincia}`;
    return this.requestAll(path, { method: "GET" }, token);
  }
}
