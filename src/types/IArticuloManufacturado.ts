import DataModel from "./DataModel";
import IUnidadMedida from "./IUnidadMedida";


export default interface IArticuloManufacturado extends DataModel<IArticuloManufacturado>{
    tiempoEstimadoMinutos: number,
    descripcion:string,
    preparacion:string,
    eliminado:boolean,
    denominacion:string,
    precioVenta:number,
    unidadMedida: IUnidadMedida, 
    //FALTA CATEGORIAID
}