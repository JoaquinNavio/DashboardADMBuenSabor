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

    // Añadir los campos del objeto data a FormData
    formData.append('denominacion', data.denominacion);
    formData.append('esParaElaborar', data.esParaElaborar.toString()); // Convertir booleano a string
    formData.append('idCategoria', data.idCategoria.toString());
    formData.append('idUnidadMedida', data.idUnidadMedida.toString());
    formData.append('precioCompra', data.precioCompra.toString());
    formData.append('precioVenta', data.precioVenta.toString());
    formData.append('stockActual', data.stockActual.toString());
    formData.append('stockMaximo', data.stockMaximo.toString());

    // Añadir las imágenes a FormData si fileList está definido
    if (data.imagenes) { // Verifica que data.imagenes no sea null
      Array.from(data.imagenes).forEach((file) => {
        formData.append("files", file); // Utilizar 'files' como clave
      });
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
        // 'Content-Type': no se especifica para permitir que el navegador establezca el límite correcto para multipart/form-data
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
