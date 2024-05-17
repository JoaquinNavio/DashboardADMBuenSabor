import DataModel from "./DataModel";


export default interface IArticuloInsumoDetalle extends DataModel<IArticuloInsumoDetalle>{
    cantidad:number;
    articuloId:number;
}