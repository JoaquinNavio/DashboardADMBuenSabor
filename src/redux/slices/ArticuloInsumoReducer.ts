import ArticuloInsumo from '../../types/IArticuloInsumo';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad ArticuloInsumo
const articuloInsumoSlice = createGenericSlice<ArticuloInsumo[]>('articuloInsumoState', { data: [] });

// Exportamos las acciones específicas para el slice de articuloInsumo
export const { setData: setArticuloInsumo, resetData: resetArticuloInsumo } = articuloInsumoSlice.actions;

// Exportamos el reducer específico para el slice de articuloInsumo
export default articuloInsumoSlice.reducer;