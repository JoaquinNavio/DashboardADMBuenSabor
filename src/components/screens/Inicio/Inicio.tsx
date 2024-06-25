import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import EmpleadoService from '../../../services/EmpleadoService';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Charts.css';
import SucursalService from '../../../services/SucursalService';

const Inicio: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [pedidosPorFormaPago, setPedidosPorFormaPago] = useState([]);
    const [pedidosPorMes, setPedidosPorMes] = useState([]);
    const [pedidosPorArticulo, setPedidosPorArticulo] = useState([]);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const token = await getAccessTokenSilently();
                const empleadoService = new EmpleadoService();
                const sucursalService = new SucursalService();
                const empleado = await empleadoService.getEmpleadoByEmail(`${import.meta.env.VITE_API_URL}`, user?.email, token);
                
                if (empleado.tipoEmpleado === 'ADMIN') {
                    localStorage.setItem('tipo_empleado', empleado.tipoEmpleado.toString());
                    localStorage.removeItem('sucursal_id');
                    localStorage.removeItem('selectedSucursalNombre');
                    setLoading(false);
                    navigate('/select');
                } else {
                    localStorage.setItem('sucursal_id', empleado.sucursal_id.toString());
                    localStorage.setItem('tipo_empleado', empleado.tipoEmpleado.toString());

                    const sucursal = await sucursalService.getById(`${import.meta.env.VITE_API_URL}`, empleado.sucursal_id, token);
                    localStorage.setItem('selectedSucursalNombre', sucursal.nombre);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error al verificar el rol del usuario:', error);
                setLoading(false);
            }
        };

        const fetchPedidosPorFormaPago = async () => {
            const response = await axios.get('http://localhost:8080/api/pedidos/por-forma-pago');
            setPedidosPorFormaPago(response.data);
        };

        const fetchPedidosPorMes = async () => {
            const response = await axios.get('http://localhost:8080/api/pedidos/por-mes');
            setPedidosPorMes(response.data);
        };

        const fetchPedidosPorArticulo = async () => {
            const response = await axios.get('http://localhost:8080/api/pedidos/por-articulo');
            setPedidosPorArticulo(response.data);
        };

        checkUserRole();
        fetchPedidosPorFormaPago();
        fetchPedidosPorMes();
        fetchPedidosPorArticulo();
    }, [getAccessTokenSilently, navigate, user]);

    const generarGraficoPorFormaPago = () => {
        const data = [['Forma de Pago', 'Cantidad'], ...pedidosPorFormaPago.map(item => [item.formaPago, item.cantidad])];
        return (
            <div className="chart">
                <div className="chart-title">Pedidos por Forma de Pago</div>
                <div className="chart-content">
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Cargando Gráfico</div>}
                        data={data}
                        options={{ title: 'Pedidos por Forma de Pago' }}
                    />
                </div>
            </div>
        );
    };

    const generarGraficoPorMes = () => {
        const data = [['Mes', 'Cantidad'], ...pedidosPorMes.map(item => [item.mes, item.cantidad])];
        return (
            <div className="chart">
                <div className="chart-title">Pedidos por Mes</div>
                <div className="chart-content">
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="ColumnChart"
                        loader={<div>Cargando Gráfico</div>}
                        data={data}
                        options={{
                            title: 'Pedidos por Mes',
                            legend: { position: 'none' },
                            vAxis: { title: 'Cantidad' },
                            hAxis: { title: 'Mes' },
                        }}
                    />
                </div>
            </div>
        );
    };

    const generarGraficoPorArticulo = () => {
        const data = [['Artículo', 'Cantidad'], ...pedidosPorArticulo.map(item => [item.articulo, item.cantidad])];
        return (
            <div className="chart">
                <div className="chart-title">Pedidos por Artículo</div>
                <div className="chart-content">
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Cargando Gráfico</div>}
                        data={data}
                        options={{ title: 'Pedidos por Artículo' }}
                    />
                </div>
            </div>
        );
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, pt: 10 }}>
            <div className="charts-container">
                {generarGraficoPorFormaPago()}
                {generarGraficoPorMes()}
                {generarGraficoPorArticulo()}
            </div>
        </Box>
    );
};

export default Inicio;
