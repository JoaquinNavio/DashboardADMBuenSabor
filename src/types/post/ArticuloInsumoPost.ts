

export default interface ArticuloInsumoPost{
    denominacion: string,
        precioVenta: number,
        idUnidadMedida: number,
        precioCompra: number,
        stockActual:number,
        stockMaximo:number,
        esParaElaborar:boolean,
        idCategoria: number,
        imagenes: FileList | null
}