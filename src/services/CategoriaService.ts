import ICategoria from "../types/ICategoria";
import CategoriaPost from "../types/post/CategoriaPost";
import BackendClient from "./BackendClient";

export default class CategoriaService extends BackendClient<ICategoria> {

  async postx(url: string, data: CategoriaPost, token: string): Promise<ICategoria> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options, token);
  }

  async putx(url: string, id: number, data: CategoriaPost, token: string): Promise<ICategoria> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options, token);
  }

  // Otros métodos si es necesario
}
