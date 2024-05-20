// Importamos el tipo de dato IArticuloManufactutadoDetalle y la clase BackendClient

import IArticuloManufacturadoDetalle from "../types/IArticuloManufacturadoDetalle";
import  BackendClient  from "./BackendClient";

// Clase ArticuloManufacturadoService que extiende BackendClient para interactuar con la API de articuloManufacturado

export default class ArticuloManufacturadoDetalleService extends BackendClient<IArticuloManufacturadoDetalle> {}