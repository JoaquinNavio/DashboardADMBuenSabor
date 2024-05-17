import DataModel from "./DataModel";
import IUnidadMedida from "./IUnidadMedida";

export default interface IArticuloInsumo extends DataModel<IArticuloInsumo>{
    denominacion: string;
    precioVenta: number;
    unidadMedida: IUnidadMedida;
    esParaElaborar: boolean,
    precioCompra: number,
    stockActual:number,
    stockMaximo: number
    //FALTA CATEGORIAID
}