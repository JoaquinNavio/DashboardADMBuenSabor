import DataModel from "./DataModel";
import { TipoPromocion } from "./EnumTipoPromocion";
import IArticuloInsumo from "./IArticuloInsumo";

export default interface IPromocion extends DataModel<IPromocion>{
    denominacion: string;
    fechaDesde:string; //maneja las fechas como strings
    fechaHasta:string;
    horaDesde:string;
    horaHasta:string;
    descripcionDescuento:string;
    precioPromocional:number;
    tipoPromocion: TipoPromocion;
    eliminado:boolean;
    insumos:IArticuloInsumo[]
} 