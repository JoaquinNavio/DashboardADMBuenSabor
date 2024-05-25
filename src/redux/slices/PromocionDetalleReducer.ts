

import IPromocionDetalle from '../../types/IPromocionDetalle';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad ArticuloManufacturadoDetalle
const promocionDetalleSlice = createGenericSlice<IPromocionDetalle[]>('promocioDetalleState', { data: [] });

// Exportamos las acciones específicas para el slice de articuloManufacturadoDetalle
export const { setData: setPromocioDetalle, resetData: resetPromocionDetalle } = promocionDetalleSlice.actions;

// Exportamos el reducer específico para el slice de articuloManufacturadoDetalle
export default promocionDetalleSlice.reducer;