import IArticuloManufacturado from "../types/IArticuloManufacturado";
import IArticuloManufacturadoDetalle from "../types/IArticuloManufacturadoDetalle";
import ArticuloManufacturadoPost from "../types/post/ArticuloManufacturadoPost";
import BackendClient from "./BackendClient";

export default class ArticuloManufacturadoService extends BackendClient<IArticuloManufacturado> {
  async postx(url: string, data: ArticuloManufacturadoPost, token: string): Promise<IArticuloManufacturado> {
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

  async postz(url: string, data: ArticuloManufacturadoPost, token: string): Promise<IArticuloManufacturado> {
    const path = url;
    const formData = new FormData();

    formData.append('denominacion', data.denominacion);
    formData.append('descripcion', data.descripcion);
    formData.append('idCategoria', data.idCategoria.toString());
    formData.append('idUnidadMedida', data.idUnidadMedida.toString());
    formData.append('tiempoEstimadoMinutos', data.tiempoEstimadoMinutos.toString());
    formData.append('precioVenta', data.precioVenta.toString());
    formData.append('preparacion', data.preparacion);
    formData.append('sucursal_id', data.sucursal_id.toString());
    
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

    if (data.imagenes) {
      Array.from(data.imagenes).forEach((file) => {
        formData.append("files", file);
      });
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    return this.request(path, options, token);
  }

  async putx(url: string, id: number, data: ArticuloManufacturadoPost, token: string): Promise<IArticuloManufacturado> {
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

  async getDetalles(url: string, id: number, token: string): Promise<IArticuloManufacturadoDetalle[]> {
    const path = `${url}/${id}/Detalles`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    };
    try {
      const response = await fetch(path, options);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        throw new Error(response.statusText);
      }

      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        return [];
      }

      return response.json();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return Promise.reject(error);
    }
  }
}
