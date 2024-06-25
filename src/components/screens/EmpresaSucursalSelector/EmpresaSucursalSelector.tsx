import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Grid, Paper } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import EmpresaService from '../../../services/EmpresaService';
import Empresa from '../../../types/IEmpresa';
import Sucursal from '../../../types/ISucursal';

const EmpresaSucursalSelector: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const empresaService = new EmpresaService();
  const url = import.meta.env.VITE_API_URL;

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const token = await getAccessTokenSilently();
        const empresas = await empresaService.getAll(`${url}/empresa`, token);
        setEmpresas(empresas);
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };

    fetchEmpresas();
  }, [getAccessTokenSilently, url]);

  const handleEmpresaSelect = async (empresa: Empresa) => {
    setSelectedEmpresa(empresa);

    try {
      const token = await getAccessTokenSilently();
      const empresaConSucursales = await empresaService.get(`${url}/empresa/sucursales`, empresa.id, token);

      setSucursales(empresaConSucursales.sucursales);
    } catch (error) {
      console.error('Error al obtener las sucursales:', error);
    }
  };

  const handleSucursalSelect = (sucursal: Sucursal) => {
    localStorage.setItem('sucursal_id', sucursal.id.toString());
    localStorage.setItem('selectedSucursalNombre', sucursal.nombre);
    navigate('/articulosManufacturados');
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Selecciona una Empresa
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {empresas.map((empresa) => (
            <Grid item xs={12} sm={6} md={4} key={empresa.id}>
              <Card
                onClick={() => handleEmpresaSelect(empresa)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
              // @ts-ignore
                  image={empresa.url_imagen}
                  alt={empresa.nombre}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {empresa.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Razón Social: {empresa.razonSocial}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CUIL: {empresa.cuil}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedEmpresa && (
          <Paper elevation={3} sx={{ mt: 5, p: 3, width: '100%', maxWidth: '800px' }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
              Sucursales de {selectedEmpresa.nombre}
            </Typography>
            <Grid container spacing={3}>
              {sucursales.map((sucursal) => (
                <Grid item xs={12} sm={6} md={4} key={sucursal.id}>
                  <Card
                    onClick={() => handleSucursalSelect(sucursal)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={sucursal.url_imagen}
                      alt={sucursal.nombre}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {sucursal.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Horario de Apertura: {sucursal.horarioApertura}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Horario de Cierre: {sucursal.horarioCierre}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default EmpresaSucursalSelector;
