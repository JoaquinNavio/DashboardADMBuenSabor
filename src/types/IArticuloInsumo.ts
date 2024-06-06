import DataModel from "./DataModel";
import ICategoria from "./ICategoria";
import IImage from "./IImage";
import IUnidadMedida from "./IUnidadMedida";

export default interface IArticuloInsumo extends DataModel<IArticuloInsumo>{
    imagenes: IImage[],
    denominacion: string;
    precioVenta: number;
    unidadMedida: IUnidadMedida;
    esParaElaborar: boolean,
    precioCompra: number,
    stockActual:number,
    stockMaximo: number,
    categoria: ICategoria
}