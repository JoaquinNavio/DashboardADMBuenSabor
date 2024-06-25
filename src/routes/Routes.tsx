import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import BaseNavbar from '../components/ui/common/Navbar/BaseNavbar';
import BasicSidebar from '../components/ui/common/Sidebar/BasicSidebar';
import Categoria from '../components/screens/Categoria/Categoria';
import './routes.css';
import Inicio from '../components/screens/Inicio/Inicio';
import Empresa from '../components/screens/Empresa/Empresa';
import Sucursal from '../components/screens/Sucursal/Sucursal';
import UnidadMedida from '../components/screens/UnidadMedida/UnidadMedida';
import ArticuloManufacturado from '../components/screens/ArticuloManufacturado/ArticuloManufacturado';
import ArticuloInsumo from '../components/screens/ArticuloInsumo/ArticuloInsumo';
import { Promocion } from '../components/screens/Promocion/Promocion';
import ClientProfilePage from '../components/screens/User/ClientProfilePage';
import CallbackPage from '../components/auth0/CallbackPage';
import ErrorPage from '../components/screens/User/ErrorPage';
import { AuthenticationGuard } from '../components/auth0/AuthenticationGuard';
import Empleado from '../components/screens/Empleado/Empleado';
import EmpresaSucursalSelector from '../components/screens/EmpresaSucursalSelector/EmpresaSucursalSelector';
import LoginHandler from '../components/LoginHandler'; // Importa LoginHandler

const Rutas: React.FC = () => {
  const location = useLocation();
  const hideNavbarAndSidebar = location.pathname === '/select';

  return (
    <>
      {!hideNavbarAndSidebar && <BaseNavbar />}
      {!hideNavbarAndSidebar && <BasicSidebar />}
      <div className={hideNavbarAndSidebar ? "full-content" : "content"}>
        <Routes>
          <Route path="/" element={<AuthenticationGuard component={LoginHandler} />} />
          <Route path="/inicio" element={<AuthenticationGuard component={Inicio} />} />
          <Route path="/empresas" element={<AuthenticationGuard component={Empresa} />} />
          <Route path="/categorias" element={<AuthenticationGuard component={Categoria} />} />
          <Route path="/empresas/:empresaId" element={<AuthenticationGuard component={Sucursal} />} />
          <Route path="/articuloInsumos" element={<AuthenticationGuard component={ArticuloInsumo} />} />
          <Route path="/articulosManufacturados" element={<AuthenticationGuard component={ArticuloManufacturado} />} />
          <Route path="/unidadesMedida" element={<AuthenticationGuard component={UnidadMedida} />} />
          <Route path="/promociones" element={<AuthenticationGuard component={Promocion} />} />
          <Route path="/cliente/perfil" element={<AuthenticationGuard component={ClientProfilePage} />} />
          <Route path="/empleados" element={<AuthenticationGuard component={Empleado} />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/select" element={<AuthenticationGuard component={EmpresaSucursalSelector} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default Rutas;
