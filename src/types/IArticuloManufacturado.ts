import DataModel from "./DataModel";
import IArticuloManufacturadoDetalle from "./IArticuloManufacturadoDetalle";
import ICategoria from "./ICategoria";
import IImage from "./IImage";
import IUnidadMedida from "./IUnidadMedida";


export default interface IArticuloManufacturado extends DataModel<IArticuloManufacturado>{
    image: IImage,
    tiempoEstimadoMinutos: number,
    descripcion:string,
    preparacion:string,
    eliminado:boolean,
    denominacion:string,
    precioVenta:number,
    unidadMedida: IUnidadMedida,
    categoria: ICategoria
    detalles:IArticuloManufacturadoDetalle[]

}