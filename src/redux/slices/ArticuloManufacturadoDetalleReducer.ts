
import IArticuloManufacturadoDetalle from '../../types/IArticuloManufacturadoDetalle';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad ArticuloManufacturadoDetalle
const articuloManufacturadoDetalleSlice = createGenericSlice<IArticuloManufacturadoDetalle[]>('articuloManufacturadoDetalleState', { data: [] });

// Exportamos las acciones específicas para el slice de articuloManufacturadoDetalle
export const { setData: setArticuloManufacturadoDetalle, resetData: resetArticuloManufacturadoDetalle } = articuloManufacturadoDetalleSlice.actions;

// Exportamos el reducer específico para el slice de articuloManufacturadoDetalle
export default articuloManufacturadoDetalleSlice.reducer;