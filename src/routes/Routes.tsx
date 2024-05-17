import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BaseNavbar from '../components/ui/common/Navbar/BaseNavbar';
import BasicSidebar from '../components/ui/common/Sidebar/BasicSidebar';
import Categoria from '../components/screens/Categoria/Categoria';

import './routes.css'; 
import Inicio from '../components/screens/Inicio/Inicio';
import Empresa from '../components/screens/Empresa/Empresa';
import Sucursal from '../components/screens/Sucursal/Sucursal';
import { ArticuloManufacturado } from '../components/screens/ArticuloManufacturado/ArticuloManufacturado';
import UnidadMedida from '../components/screens/UnidadMedida/UnidadMedida';
//import ArticuloInsumo from '../components/screens/ArticuloInsumo/ArticuloInsumo';    <Route path="/articuloInsumos" element={<ArticuloInsumo/>} />


const Rutas: React.FC = () => {
  return (
    <Router>
      <div className='navbar'>
      <BaseNavbar />
      </div>
        <div className="sidebar">
          <BasicSidebar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/empresas" element={<Empresa />} />
            <Route path="/categorias" element={<Categoria />} />
            <Route path="/empresas/:empresaId" element={<Sucursal />} />
            <Route path="/articulosManufacturados" element={<ArticuloManufacturado/>} />
            <Route path="/unidadesMedida" element={<UnidadMedida/>} />
          </Routes>
        </div>
    </Router>
  );
}

export default Rutas;

