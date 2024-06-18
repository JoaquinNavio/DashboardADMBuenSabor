import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
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
    localStorage.setItem('selectedSucursalId', sucursal.id.toString());
    navigate('/articulosManufacturados');
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Typography variant="h5" gutterBottom>
          Selecciona una Empresa
        </Typography>

        <Grid container spacing={3}>
          {empresas.map((empresa) => (
            <Grid item xs={12} sm={6} md={4} key={empresa.id}>
              <Card onClick={() => handleEmpresaSelect(empresa)}>
                <CardMedia
                  component="img"
                  height="140"
                  image="/static/images/cards/empresa-placeholder.png" // Reemplaza con la ruta real de la imagen
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
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
              Sucursales de {selectedEmpresa.nombre}
            </Typography>
            <Grid container spacing={3}>
              {sucursales.map((sucursal) => (
                <Grid item xs={12} sm={6} md={4} key={sucursal.id}>
                  <Card onClick={() => handleSucursalSelect(sucursal)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image="/static/images/cards/sucursal-placeholder.png" // Reemplaza con la ruta real de la imagen
                      alt={sucursal.nombre}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default EmpresaSucursalSelector;
