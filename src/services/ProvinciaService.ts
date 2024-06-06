import IProvincia from "../types/IProvincia";
import BackendClient from "./BackendClient";

export default class ProvinciaService extends BackendClient<IProvincia> {
  async getByPais(url: string, idPais: number, token: string): Promise<IProvincia[]> {
    const path = `${url}/${idPais}`;
    return this.requestAll(path, { method: "GET" }, token);
  }
}
