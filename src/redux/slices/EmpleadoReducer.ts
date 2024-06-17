// redux/slices/EmpleadoReducer.ts
import IEmpleado from '../../types/Empleado';
import { createGenericSlice } from './GenericReducer';

// Creamos el slice específico para la entidad Empleado
const empleadoSlice = createGenericSlice<IEmpleado[]>('empleadoState', { data: [] });

// Exportamos las acciones específicas para el slice de Empleado
export const { setData: setEmpleado, resetData: resetEmpleado } = empleadoSlice.actions;

// Exportamos el reducer específico para el slice de Empleado
export default empleadoSlice.reducer;
