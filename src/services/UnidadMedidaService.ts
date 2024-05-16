// Importamos el tipo de dato IUnidadMedida y la clase BackendClient
import IUnidadMedida from "../types/UnidadMedida";
import  BackendClient  from "./BackendClient";

// Clase UnidadMedidaService que extiende BackendClient para interactuar con la API de UNIDADMEDIDA
export default class UnidadMedidaService extends BackendClient<IUnidadMedida> {}