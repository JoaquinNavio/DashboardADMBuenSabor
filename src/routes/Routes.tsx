import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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


const Rutas: React.FC = () => {
  return (
    <>
      <div className='navbar'>
      <BaseNavbar />
      </div>
        <div className="sidebar">
          <BasicSidebar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<AuthenticationGuard component={Inicio}></AuthenticationGuard>} />
            <Route path="/empresas" element={<AuthenticationGuard component={Empresa}></AuthenticationGuard>} />
            <Route path="/categorias" element={<AuthenticationGuard component={Categoria }></AuthenticationGuard>} />
            <Route path="/empresas/:empresaId" element={<AuthenticationGuard component={Sucursal}></AuthenticationGuard> } />
            <Route path="/articuloInsumos" element={<AuthenticationGuard component={ArticuloInsumo}></AuthenticationGuard>} />
            <Route path="/articulosManufacturados" element={<AuthenticationGuard component={ArticuloManufacturado}></AuthenticationGuard>} />
            <Route path="/unidadesMedida" element={<AuthenticationGuard component={UnidadMedida}></AuthenticationGuard>} />
            <Route path="/promociones" element={<AuthenticationGuard component={Promocion}></AuthenticationGuard>} />
            <Route path="/cliente/perfil" element={<AuthenticationGuard component={ClientProfilePage}></AuthenticationGuard>} />


            <Route path="/callbasck" element={<CallbackPage></CallbackPage>} />
            <Route path="+" element={<ErrorPage></ErrorPage>} />

          </Routes>
        </div>
    </>
  );
}

export default Rutas;

