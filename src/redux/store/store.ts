// redux/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import EmpresaReducer from '../slices/EmpresaReducer';
import LocalidadReducer from '../slices/LocalidadReducer';
import ProvinciaReducer from '../slices/ProvinciaReducer';
import ModalReducer from '../slices/ModalReducer';
import PaisReducer from '../slices/PaisReducer';
import SucursalReducer from '../slices/SucursalReducer';
import CategoriaReducer from '../slices/CategoriaReducer';
import UnidadMedidaReducer from '../slices/UnidadMedidaReducer';
import ArticuloInsumoReducer from '../slices/ArticuloInsumoReducer';
import ArticuloManufacturadoReducer from '../slices/ArticuloManufacturadoReducer';
import ArticuloManufacturadoDetalleReducer from '../slices/ArticuloManufacturadoDetalleReducer';
import PromocionReducer from '../slices/PromocionReducer';
import PromocionDetalleReducer from '../slices/PromocionDetalleReducer';
import EmpleadoReducer from '../slices/EmpleadoReducer';  // Importar el nuevo reducer de Empleado

export const store = configureStore({
  reducer: {
    empresa: EmpresaReducer,
    localidad: LocalidadReducer,
    provincia: ProvinciaReducer,
    pais: PaisReducer,
    modal: ModalReducer,
    sucursal: SucursalReducer,
    categoria: CategoriaReducer,
    unidadMedida: UnidadMedidaReducer,
    articuloInsumo: ArticuloInsumoReducer,
    articuloManufacturado: ArticuloManufacturadoReducer,
    articuloManufacturadoDetalle: ArticuloManufacturadoDetalleReducer,
    promociones: PromocionReducer,
    promocionDetalle: PromocionDetalleReducer,
    empleado: EmpleadoReducer  // Añadir el nuevo reducer de Empleado
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
