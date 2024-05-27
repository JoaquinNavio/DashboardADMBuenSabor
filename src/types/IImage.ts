import DataModel from "./DataModel";

export default interface IImage extends DataModel<IImage>{
    url: string;
    name: string;
  }