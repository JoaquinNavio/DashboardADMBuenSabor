import React from 'react';
import { Link } from 'react-router-dom';
import { cilBarChart, cilBuilding, cilFactory, cilCart, cilPeople, cilLineWeight, cilSwapHorizontal } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';
import { cilDollar } from "@coreui/icons";

const BasicSidebar: React.FC = () => {

    let tipoEmpleado = localStorage.getItem('tipo_empleado');
    if (!tipoEmpleado) {
        tipoEmpleado = 'COCINERO';
        localStorage.setItem('tipo_empleado', tipoEmpleado);
    }
    const isAdmin = tipoEmpleado === 'ADMIN';
    const isCocinero = tipoEmpleado === 'COCINERO';
    const isVisor = tipoEmpleado === 'VISOR';
    return (
        <div>
            <CSidebar className="border-end d-flex flex-column" style={{ height: '100vh' }}>
                <CSidebarNav>
                    <CNavTitle>
                        Dashboard
                    </CNavTitle>
                    

                    {(isAdmin || isVisor) && (
                        <>
                        <CNavItem>
                        <Link to="/inicio" className="nav-link" >
                            <CIcon customClassName="nav-icon" icon={cilBarChart} />
                            Inicio
                        </Link>
                    </CNavItem>
                            <CNavItem>
                                <Link to="/select" className="nav-link" >
                                    <CIcon customClassName="nav-icon" icon={cilSwapHorizontal} />
                                    Cambiar Empresa
                                </Link>
                            </CNavItem>
                            <CNavItem>
                                <Link to="/empresas" className="nav-link">
                                    <CIcon customClassName="nav-icon" icon={cilBuilding} />
                                    Empresas
                                </Link>
                            </CNavItem>
                            <CNavItem>
                                <Link to="/promociones" className="nav-link">
                                    <CIcon customClassName="nav-icon" icon={cilDollar} />
                                    Promociones
                                </Link>
                            </CNavItem>
                            <CNavItem>
                                <Link to="/empleados" className="nav-link" >
                                    <CIcon customClassName="nav-icon" icon={cilPeople} />
                                    Lista de Empleados
                                </Link>
                            </CNavItem>
                        </>
                    )}

                    {(isAdmin || isCocinero || isVisor) && (
                        <>
                            <CNavItem>
                                <Link to="/categorias" className="nav-link">
                                    <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                    Categorías
                                </Link>
                            </CNavItem>
                            <CNavItem>
                                <Link to="/articuloInsumos" className="nav-link">
                                    <CIcon customClassName="nav-icon" icon={cilCart} />
                                    Insumos
                                </Link>
                            </CNavItem>
                            <CNavItem>
                                <Link to="/articulosManufacturados" className="nav-link">
                                    <CIcon customClassName="nav-icon" icon={cilFactory} />
                                    Articulos Manufacturados
                                </Link>
                            </CNavItem>
                            <CNavItem>
                                <Link to="/unidadesMedida" className="nav-link">
                                    <CIcon customClassName="nav-icon" icon={cilLineWeight} />
                                    Unidad Medida
                                </Link>
                            </CNavItem>
                        </>
                    )}
                </CSidebarNav>
            </CSidebar>
        </div>
    );
}

export default BasicSidebar;
