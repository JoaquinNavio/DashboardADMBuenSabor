import DataModel from "./DataModel";
import IArticuloManufacturado from "./IArticuloManufacturado";
import IPromocion from "./IPromocion";


export default interface IPromocionArticulo extends DataModel<IPromocionArticulo>{
    articulo:IArticuloManufacturado,
    promocion:IPromocion
    cantidad:number
} 