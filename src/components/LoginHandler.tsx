import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import EmpleadoService from '../services/EmpleadoService';

const LoginHandler: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const empleadoService = new EmpleadoService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEmpleado = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const token = await getAccessTokenSilently();
          const empleado = await empleadoService.getEmpleadoByEmail(`${url}/empleado/email`, user.email, token);
          
          if (empleado.tipoEmpleado === "ADMIN") {
            navigate("/select");
          } else {
            navigate("/");
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
