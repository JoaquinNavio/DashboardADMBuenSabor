// types/IEmpleado.ts
import DataModel from "./DataModel";
import IDomicilio from "./IDomicilio";
import IImage from "./IImage";

export default interface IEmpleado extends DataModel<IEmpleado> {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  tipoEmpleado: string;
  imagenPersona: IImage;
  domicilios: IDomicilio[];
}
