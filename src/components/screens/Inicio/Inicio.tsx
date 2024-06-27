import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import axios from 'axios';
import { Chart } from 'react-google-charts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Charts.css';


const Inicio: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();


    const [pedidosPorFormaPago, setPedidosPorFormaPago] = useState([]);
    const [pedidosPorMes, setPedidosPorMes] = useState([]);
    const [pedidosPorArticulo, setPedidosPorArticulo] = useState([]);


    useEffect(() => {

        const fetchPedidosPorFormaPago = async () => {
            const response = await axios.get('https://backbuensabor-l60d.onrender.com/api/pedidos/por-forma-pago');
            setPedidosPorFormaPago(response.data);
        };

        const fetchPedidosPorMes = async () => {
            const response = await axios.get('https://backbuensabor-l60d.onrender.com/api/pedidos/por-mes');
            setPedidosPorMes(response.data);
        };

        const fetchPedidosPorArticulo = async () => {
            const response = await axios.get('https://backbuensabor-l60d.onrender.com/api/pedidos/por-articulo');
            setPedidosPorArticulo(response.data);
        };


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
