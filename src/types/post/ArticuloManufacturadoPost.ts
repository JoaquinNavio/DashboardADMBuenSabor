
import ArticuloManufacturadoDetallePost from "./ArticuloManufacturadoDetallePost"


export default interface ArticuloManufacturadoPost{
    tiempoEstimadoMinutos: number,
    descripcion:string,
    preparacion:string,
    eliminado:boolean,
    denominacion:string,
    precioVenta:number,
    idUnidadMedida:number,
    idCategoria:number,
    detalles:ArticuloManufacturadoDetallePost[],
    imagenes: FileList | null,
    sucursal_id:number
}