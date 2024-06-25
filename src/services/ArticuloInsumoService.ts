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
    return this.request(url, options, token);
  }

  async postz(url: string, data: ArticuloInsumoPost, token: string): Promise<IArticuloInsumo> {
    const formData = new FormData();

    formData.append('denominacion', data.denominacion);
    formData.append('esParaElaborar', data.esParaElaborar ? 'true' : 'false');
    formData.append('idCategoria', data.idCategoria.toString());
    formData.append('idUnidadMedida', data.idUnidadMedida.toString());
    formData.append('precioCompra', data.precioCompra.toString());
    formData.append('precioVenta', data.precioVenta.toString());
    formData.append('stockActual', data.stockActual.toString());
    formData.append('stockMaximo', data.stockMaximo.toString());

      // @ts-ignore
    formData.append('sucursal_id', data.sucursal_id.toString());
// @ts-ignore
    if (data.files) {
        // @ts-ignore
      Array.from(data.files).forEach((file) => {
          // @ts-ignore
        formData.append("files", file);
      });
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: formData,
    };

    return this.request(url, options, token);
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
    console.log(data);
    return this.request(path, options, token);
  }
}