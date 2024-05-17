import DataModel from "./DataModel";


export default interface IArticuloManufacturado extends DataModel<IArticuloManufacturado>{
    tiempoEstimadoMinutos: number,
    descripcion:string,
    preparacion:string,
    denominacion:string,
    precioVenta:number,

    idUnidadMedida:number,
}