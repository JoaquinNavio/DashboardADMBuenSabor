import { Box, Grid, Container, Typography } from "@mui/material";
import ChartCard from "../../ui/Cards/ChartCard/ChartCard";
import BaseBar from "../../ui/Charts/BaseBar";
import BasePie from "../../ui/Charts/BasePie";
import InicioCard from "../../ui/Cards/InicioCard/InicioCard";


// Contenido para las tarjetas de inicio
const productosContent = {
    url: 'https://images.unsplash.com/photo-1615996001375-c7ef13294436?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Productos',
    content: 'Añade nuevos platos o actualiza los precios para mejorar la experiencia de tus clientes.',
};

const empresasContent = {
    url: 'https://images.unsplash.com/photo-1524414139215-35c99f80112d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Empresas',
    content: 'Agrega, actualiza o elimina información sobre tus empresas asociadas.'
};

const promocionesContent = {
    url: 'https://images.unsplash.com/photo-1581495701295-13b43b0f4ae8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Promociones',
    content: 'Personaliza tus ofertas y haz que destaquen para que tus clientes no puedan resistirse.',
};

// Estilo para las tarjetas
const cardStyle = {
    width: "100%",
    height: "100%",
};

//Renderización del componente
const Inicio: React.FC = () => {
    return (
        <Box component="main" sx={{ flexGrow: 1, pt: 10}}>
            <Container>
                <Typography component="h1" variant="h5" color="initial" >Bienvenido</Typography>
                        
                <Grid container spacing={3} sx={{ py: 2, alignContent: 'center' , justifyContent: 'center' }}>
                    <Grid item xs={12} md={6}>
                        <ChartCard title="Gráfico de Barras">
                            <BaseBar />
                        </ChartCard>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ChartCard title="Gráfico de Pastel">
                            <BasePie />
                        </ChartCard>
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ alignContent: 'center' , justifyContent: 'center'}}>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={productosContent} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={empresasContent} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={cardStyle}>
                            <InicioCard content={promocionesContent} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Inicio;
