// Importamos el tipo de dato ICategoria y la clase BackendClient
import ICategoria from "../types/ICategoria";
import  BackendClient  from "./BackendClient";

// Clase CategoriaService que extiende BackendClient
export default class CategoriaService extends BackendClient<ICategoria> {}