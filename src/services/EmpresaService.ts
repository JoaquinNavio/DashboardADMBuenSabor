import IEmpresa from "../types/IEmpresa";
import BackendClient from "./BackendClient";

export default class EmpresaService extends BackendClient<IEmpresa> {
  async postEmpresa(url: string, data: FormData, token: string): Promise<IEmpresa> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    };
    return this.request(path, options, token);
  }

  async putEmpresa(url: string, id: number, data: FormData, token: string): Promise<IEmpresa> {
    const path = `${url}/update/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    };
    return this.request(path, options, token);
  }

  async deleteEmpresa(url: string, id: number, token: string): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    await this.request(path, options, token);
  }
}
