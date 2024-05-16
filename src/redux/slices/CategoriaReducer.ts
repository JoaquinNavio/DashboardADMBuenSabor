import Categoria from '../../types/ICategoria';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad Categoria
const categoriaSlice = createGenericSlice<Categoria[]>('categoriaState', { data: [] });

// Exportamos las acciones específicas para el slice de categoria
export const { setData: setCategoria, resetData: resetCategoria } = categoriaSlice.actions;

// Exportamos el reducer específico para el slice de categoria
export default categoriaSlice.reducer;
