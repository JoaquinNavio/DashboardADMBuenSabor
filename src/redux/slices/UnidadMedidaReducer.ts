import IUnidadMedida from '../../types/IUnidadMedida';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad Empresa
const unidadMedidaSlice = createGenericSlice<IUnidadMedida[]>('empresaState', { data: [] });

// Exportamos las acciones específicas para el slice de empresa
export const { setData: setUnidadMedida, resetData: resetUnidadMedida } = unidadMedidaSlice.actions;

// Exportamos el reducer específico para el slice de empresa
export default unidadMedidaSlice.reducer;
