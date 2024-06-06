// Importamos el tipo de dato IArticuloManufactutado y la clase BackendClient

import IArticuloManufacturado from "../types/IArticuloManufacturado";
import IArticuloManufacturadoDetalle from "../types/IArticuloManufacturadoDetalle";
import ArticuloManufacturadoPost from "../types/post/ArticuloManufacturadoPost";
import BackendClient from "./BackendClient";

// Clase ArticuloManufacturadoService que extiende BackendClient para interactuar con la API de articuloManufacturado

export default class ArticuloManufacturadoService extends BackendClient<IArticuloManufacturado> {
  async postx(url: string, data: ArticuloManufacturadoPost): Promise<IArticuloManufacturado> {
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

  async postz(url: string, data: ArticuloManufacturadoPost): Promise<IArticuloManufacturado> {
    const path = url;
    const formData = new FormData();

    // Añadir los campos del objeto data a FormData
    formData.append('denominacion', data.denominacion);
    formData.append('descripcion', data.descripcion); // Convertir booleano a string
    formData.append('idCategoria', data.idCategoria.toString());
    formData.append('idUnidadMedida', data.idUnidadMedida.toString());
    formData.append('tiempoEstimadoMinutos', data.tiempoEstimadoMinutos.toString());
    formData.append('precioVenta', data.precioVenta.toString());
    formData.append('preparacion', data.preparacion);

    // Añadir los detalles a FormData
    data.detalles.forEach((detalle, index) => {
      if (detalle.cantidad !== undefined) {
          formData.append(`detalles[${index}].cantidad`, detalle.cantidad.toString());
      }
      if (detalle.idArticuloInsumo !== undefined) {
          formData.append(`detalles[${index}].idArticuloInsumo`, detalle.idArticuloInsumo.toString());
      }
      if (detalle.idArticuloManufacturado !== undefined) {
          formData.append(`detalles[${index}].idArticuloManufacturado`, detalle.idArticuloManufacturado.toString());
      }
  });

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

  async putx(url: string, id: number, data: ArticuloManufacturadoPost): Promise<IArticuloManufacturado> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  async getDetalles(url: string, id: number): Promise<IArticuloManufacturadoDetalle[]> {
    const path = `${url}/${id}/Detalles`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    };
    try {
      const response = await fetch(path, options);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        throw new Error(response.statusText);
      }

      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        return []; // O algún otro valor predeterminado
      }

      return response.json();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return Promise.reject(error);
    }
  }

}