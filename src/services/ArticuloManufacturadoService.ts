// Importamos el tipo de dato IArticuloManufactutado y la clase BackendClient

import IArticuloManufacturado from "../types/IArticuloManufacturado";
import ArticuloManufacturadoPost from "../types/post/ArticuloManufacturadoPost";
import  BackendClient  from "./BackendClient";

// Clase ArticuloManufacturadoService que extiende BackendClient para interactuar con la API de articuloManufacturado

export default class ArticuloManufacturadoService extends BackendClient<IArticuloManufacturado | ArticuloManufacturadoPost> {}