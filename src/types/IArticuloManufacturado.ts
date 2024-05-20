import DataModel from "./DataModel";
import ICategoria from "./ICategoria";
import IUnidadMedida from "./IUnidadMedida";


export default interface IArticuloManufacturado extends DataModel<IArticuloManufacturado>{
    tiempoEstimadoMinutos: number,
    descripcion:string,
    preparacion:string,
    eliminado:boolean,
    denominacion:string,
    precioVenta:number,
    unidadMedida: IUnidadMedida,
    categoria: ICategoria
}