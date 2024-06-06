import IPais from "../types/IPais";
import BackendClient from "./BackendClient";

export default class PaisService extends BackendClient<IPais> {
  async getAll(url: string, token: string): Promise<IPais[]> {
    return this.requestAll(url, { method: "GET" }, token);
  }
}
