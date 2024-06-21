import DataModel from "./DataModel";
import IImage from "./IImage";
import ISucursal from "./ISucursal";

export default interface IEmpresa extends DataModel<IEmpresa> {
    nombre: string;
    razonSocial: string;
    cuil: number;
    url_imagen: IImage;

    sucursales: ISucursal[];
}