import DataModel from "./DataModel";


export default interface IArticuloManufacturadoDetalle extends DataModel<IArticuloManufacturadoDetalle>{
    cantidad:number;
    articuloInsumoId:number;
    articuloManufacturadoId: number;
}