import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import EmpleadoService from '../services/EmpleadoService';
import SucursalService from '../services/SucursalService';

const LoginHandler: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const empleadoService = new EmpleadoService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEmpleado = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const sucursalService = new SucursalService();
          const token = await getAccessTokenSilently();
          const empleado = await empleadoService.getEmpleadoByEmail(`${url}`, user.email, token);
          console.log(empleado)
          if (empleado.tipoEmpleado === "ADMIN") {
            localStorage.setItem('tipo_empleado', empleado.tipoEmpleado.toString());
            localStorage.removeItem('sucursal_id');
            localStorage.removeItem('selectedSucursalNombre');
            navigate('/select');
          } else if(empleado.tipoEmpleado === "COCINERO") {
            localStorage.removeItem('sucursal_id');
            localStorage.removeItem('selectedSucursalNombre');
            localStorage.setItem('sucursal_id', empleado.sucursal_id.toString());
            localStorage.setItem('tipo_empleado', empleado.tipoEmpleado.toString());
            const sucursal = await sucursalService.getById(`${import.meta.env.VITE_API_URL}`, empleado.sucursal_id, token);
            localStorage.setItem('selectedSucursalNombre', sucursal.nombre);
            navigate("/articulosManufacturados");
          }else if(!empleado){
            navigate("/categoria");
          }
        } catch (error) {
          console.error("Error al obtener el empleado:", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    fetchEmpleado();
  }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

  return <div>Cargando...</div>;
};

export default LoginHandler;
