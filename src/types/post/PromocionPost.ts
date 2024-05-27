import { TipoPromocion } from "../EnumTipoPromocion";
import PromocionArticuloPost from "./PromocionArticuloPost";

export default interface PromocionPost{
    denominacion: string;
    fechaDesde:string; 
    fechaHasta:string;
    horaDesde:string;
    horaHasta:string;
    descripcionDescuento:string;
    precioPromocional:number;
    tipoPromocion: TipoPromocion;
    eliminado:boolean;
    articulos:PromocionArticuloPost[]
    //ARRAY DE PromocionArticuloPost
} 