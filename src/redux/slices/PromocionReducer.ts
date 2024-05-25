

import IPromocion from '../../types/IPromocion';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad ArticuloManufacturadoDetalle
const promocionSlice = createGenericSlice<IPromocion[]>('articuloManufacturadoDetalleState', { data: [] });

// Exportamos las acciones específicas para el slice de articuloManufacturadoDetalle
export const { setData: setPromociones, resetData: resetPromociones } = promocionSlice.actions;

// Exportamos el reducer específico para el slice de articuloManufacturadoDetalle
export default promocionSlice.reducer;