
import ArticuloManufacturado from '../../types/IArticuloManufacturado';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad ArticuloManufacturado
const articuloManufacturadoSlice = createGenericSlice<ArticuloManufacturado[]>('articuloManufacturadoState', { data: [] });

// Exportamos las acciones específicas para el slice de articuloManufacturado
export const { setData: setArticuloManufacturado, resetData: resetArticuloManufacturado } = articuloManufacturadoSlice.actions;

// Exportamos el reducer específico para el slice de articuloManufacturado
export default articuloManufacturadoSlice.reducer;