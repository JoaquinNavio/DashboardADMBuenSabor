// Importamos el tipo de dato IArticuloInsumo y la clase BackendClient
import IArticuloInsumo from "../types/IArticuloInsumo";
import ArticuloInsumoPost from "../types/post/ArticuloInsumoPost";
import BackendClient from "./BackendClient";

// Clase ArticuloInsumoService que extiende BackendClient para interactuar con la API de personas
export default class ArticuloInsumoService extends BackendClient<IArticuloInsumo> {
  async postx(url: string, data: ArticuloInsumoPost): Promise<IArticuloInsumo> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  async postz(url: string, data: ArticuloInsumoPost): Promise<IArticuloInsumo> {
    const path = url;
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
        // 'Content-Type': no se especifica para permitir que el navegador establezca el límite correcto para multipart/form-data
      },
      body: formData,
    };

    return this.request(path, options);
  }


  async putx(url: string, id: number, data: ArticuloInsumoPost): Promise<IArticuloInsumo> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    console.log(data);
    return this.request(path, options);

  }
}