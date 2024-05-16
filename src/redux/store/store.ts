import { configureStore } from '@reduxjs/toolkit'
import EmpresaReducer from '../slices/EmpresaReducer'
import LocalidadReducer from '../slices/LocalidadReducer'
import ProvinciaReducer from '../slices/ProvinciaReducer'
import ModalReducer from '../slices/ModalReducer'
import PaisReducer from '../slices/PaisReducer'
import SucursalReducer from '../slices/SucursalReducer'
import UnidadMedidaReducer from '../slices/UnidadMedidaReducer'

export const store = configureStore({
  reducer: {
    empresa:EmpresaReducer,
    localidad: LocalidadReducer,
    provincia: ProvinciaReducer,
    pais: PaisReducer,
    modal: ModalReducer,
    sucursal: SucursalReducer,
    unidadMedida:UnidadMedidaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch