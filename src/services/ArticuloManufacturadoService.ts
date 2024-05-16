// Importamos el tipo de dato IArticuloManufactutado y la clase BackendClient

import IArticuloManufacturado from "../types/ArticuloManufactutado";
import  BackendClient  from "./BackendClient";

// Clase ArticuloManufacturadoService que extiende BackendClient para interactuar con la API de articuloManufacturado

export default class ArticuloManufacturadoService extends BackendClient<IArticuloManufacturado> {}