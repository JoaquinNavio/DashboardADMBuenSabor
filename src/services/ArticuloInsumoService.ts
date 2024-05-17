// Importamos el tipo de dato IArticuloInsumo y la clase BackendClient
import IArticuloInsumo from "../types/IArticuloInsumo";
import ArticuloInsumoPost from "../types/post/ArticuloInsumoPost";
import  BackendClient  from "./BackendClient";

// Clase ArticuloInsumoService que extiende BackendClient para interactuar con la API de personas
export default class ArticuloInsumoService extends BackendClient<IArticuloInsumo | ArticuloInsumoPost> {
}