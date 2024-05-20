import DataModel from "./DataModel";
import IArticuloInsumo from "./IArticuloInsumo";
import IArticuloManufacturado from "./IArticuloManufacturado";


export default interface IArticuloManufacturadoDetalle extends DataModel<IArticuloManufacturadoDetalle>{
    cantidad:number;
    articuloInsumo:IArticuloInsumo;
    articuloManufacturado: IArticuloManufacturado;
}