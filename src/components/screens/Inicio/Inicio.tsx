import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import EmpleadoService from '../../../services/EmpleadoService';



const Inicio: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const token = await getAccessTokenSilently();
                const empleadoService = new EmpleadoService();
                const empleado = await empleadoService.getEmpleadoByEmail(`${import.meta.env.VITE_API_URL}`, user?.email, token);

                if (empleado.tipoEmpleado === 'ADMIN') {
                    navigate('/select');
                    
                } else {
                    localStorage.setItem('sucursal_id', empleado.sucursal_id.toString());

                    setLoading(false);
                }
            } catch (error) {
                console.error('Error al verificar el rol del usuario:', error);
                setLoading(false);
            }
        };

        checkUserRole();
    }, [getAccessTokenSilently, navigate, user]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, pt: 10 }}>
            
        </Box>
    );
};

export default Inicio;
