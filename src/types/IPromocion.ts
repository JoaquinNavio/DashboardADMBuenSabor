import DataModel from "./DataModel";
import IPromocionDetalle from "./IPromocionDetalle";


export default interface IPromocion extends DataModel<IPromocion>{
    denominacion: string;
    fechaDesde:string; //maneja las fechas como strings
    fechaHasta:string;
    horaDesde:string;
    horaHasta:string;
    descripcionDescuento:string;
    precioPromocional:number;
    tipoPromocion: number;
    eliminado:boolean;

    //hacia falta esto para el modal
    detalles:IPromocionDetalle[];
} 