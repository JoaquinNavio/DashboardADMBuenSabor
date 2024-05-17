import DataModel from "./DataModel";
import IArticuloInsumoDetalle from "./IArticuloInsumoDetalle";


export default interface IArticuloManufacturado extends DataModel<IArticuloManufacturado>{
    tiempoEstimadoMinutos: number,
    descripcion:string,
    preparacion:string
    categoria:number,
    denominacion:string,
    precioVenta:number,

    unidadMedidaId:number,

    idsArticuloManufacturadoDetalles:IArticuloInsumoDetalle[],


}