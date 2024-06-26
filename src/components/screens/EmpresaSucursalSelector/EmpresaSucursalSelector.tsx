import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
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

  const handleBackToEmpresas = () => {
    setSelectedEmpresa(null);
    setSucursales([]);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          top: '20%',
        }}
      >
        {!selectedEmpresa && (
          <>
            <Typography variant="h4" sx={{ mt: 6, ml: 0 }} gutterBottom>
              Selecciona una Empresa
            </Typography>
            <Box
              sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
                width: '100%',
                mt: 2,
                ml: 0,
                maxWidth: '1300px',
                p: 2,
                bgcolor: 'background.paper',
                '::-webkit-scrollbar': {
                  width: '10px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '10px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              <Grid container spacing={3}>
                {empresas.map((empresa) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={empresa.id}>
                    <Card
                      onClick={() => handleEmpresaSelect(empresa)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.05)' },
                        boxShadow: 2,
                        height: '100%',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="150"
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
            </Box>
          </>
        )}

        {selectedEmpresa && (
          <>
            <Button variant="contained" sx={{ alignSelf: 'flex-start', mb: 2, ml: 0 }} onClick={handleBackToEmpresas}>
              Volver a Empresas
            </Button>
            <Typography variant="h4" gutterBottom>
              Sucursales de {selectedEmpresa.nombre}
            </Typography>
            <Box
              sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
                width: '100%',
                mt: 2,
                maxWidth: '1300px',
                p: 2,
                bgcolor: 'background.paper',
                '::-webkit-scrollbar': {
                  width: '10px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '10px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              <Grid container spacing={3}>
                {sucursales.map((sucursal) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={sucursal.id}>
                    <Card
                      onClick={() => handleSucursalSelect(sucursal)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.05)' },
                        boxShadow: 2,
                        height: '100%',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="150"
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
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default EmpresaSucursalSelector;
