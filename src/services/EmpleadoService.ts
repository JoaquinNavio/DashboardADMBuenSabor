// services/EmpleadoService.ts
import IEmpleado from "../types/Empleado";
import BackendClient from "./BackendClient";


export default class EmpleadoService extends BackendClient<IEmpleado> {
  async postEmpleado(url: string, data: FormData, token: string): Promise<IEmpleado> {
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

  async putEmpleado(url: string, id: number, data: FormData, token: string): Promise<IEmpleado> {
    const path = `${url}/${id}`;
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
}
