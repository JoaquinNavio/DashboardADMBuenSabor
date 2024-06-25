import ISucursal from "../types/ISucursal";
import BackendClient from "./BackendClient";

export default class SucursalService extends BackendClient<ISucursal> {
  async postSucursal(url: string, data: FormData, token: string): Promise<ISucursal> {
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

  async putSucursal(url: string, id: number, data: FormData, token: string): Promise<ISucursal> {
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

  async deleteSucursal(url: string, id: number, token: string): Promise<void> {
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
