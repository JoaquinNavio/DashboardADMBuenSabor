import DataModel from "./DataModel";
import IArticuloManufacturado from "./IArticuloManufacturado";

export default interface IPromocionDetalle extends DataModel<IPromocionDetalle>{
    detalle: string;
    eliminado:boolean;
    articulo:IArticuloManufacturado;
    cantidad:number;
}