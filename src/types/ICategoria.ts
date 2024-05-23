import DataModel from "./DataModel";


export default interface ICategoria extends DataModel<ICategoria>{
    categoriaPadre:ICategoria | undefined;
    denominacion:string;
    esInsumo:boolean;
}