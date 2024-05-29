
import PromocionArticuloPost from "./PromocionArticuloPost";

export default interface PromocionPost{
    denominacion: string;
    fechaDesde:string; 
    fechaHasta:string;
    horaDesde:string;
    horaHasta:string;
    descripcionDescuento:string;
    precioPromocional:number;
    tipoPromocion: number;
    eliminado:boolean;

    detalles:PromocionArticuloPost[]
} 