import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import Column from '../../../types/Column';
import Sucursal from '../../../types/ISucursal';
import EmpresaService from '../../../services/EmpresaService';
import { toggleModal } from '../../../redux/slices/ModalReducer';
import { handleSearch, onDelete } from '../../../utils/utils';
import SearchBar from '../../ui/common/SearchBar/SearchBar';
import TableComponent from '../../ui/Table/Table';
import { setSucursal } from '../../../redux/slices/SucursalReducer';
import ModalSucursal from '../../ui/Modals/ModalSucursal';
import SucursalService from '../../../services/SucursalService';
import IEmpresa from "../../../types/IEmpresa";
import SucursalPost from "../../../types/post/SucursalPost";
import ISucursal from "../../../types/ISucursal";
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { useAuth0 } from "@auth0/auth0-react";

const SucursalesEmpresa = () => {
  const { empresaId } = useParams<{ empresaId: string }>();
  const [nombreEmpresa, setNombreEmpresa] = useState<string>('');
  const [empresa, setEmpresa] = useState<IEmpresa>();
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const empresaService = new EmpresaService();
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL;

  const sucursalesEmpresa = useAppSelector((state) => state.sucursal.data);
  const [filteredData, setFilteredData] = useState<(ISucursal | SucursalPost)[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [sucursalEditar, setSucursalEditar] = useState<Sucursal | SucursalPost>();
  const [casaMatrizDisabled, setCasaMatrizDisabled] = useState<boolean>(false);

  const fetchSucursal = async () => {
    try {
      if (empresaId !== undefined) {
        const token = await getAccessTokenSilently();
        const empresa = await empresaService.get(`${url}/empresa/sucursales`, parseInt(empresaId), token);
        dispatch(setSucursal(empresa.sucursales));
        setFilteredData(empresa.sucursales);
      } else {
        console.error("Error: empresaId es undefined");
      }
    } catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  };

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        if (empresaId !== undefined) {
          const token = await getAccessTokenSilently();
          const idEmpresa: number = parseInt(empresaId);
          const empresa = await empresaService.get(`${url}/empresa/sucursales`, idEmpresa, token);
          dispatch(setSucursal(empresa.sucursales));
          setFilteredData(empresa.sucursales);
          setNombreEmpresa(empresa.nombre);
          setEmpresa(empresa);

          const hasCasaMatriz = empresa.sucursales.some((sucursal: ISucursal) => sucursal.esCasaMatriz);
          setCasaMatrizDisabled(hasCasaMatriz);
        }
      } catch (error) {
        console.error('Error al obtener la empresa:', error);
      }
    };

    fetchSucursal();
    fetchEmpresa();
  }, [empresaId, url, dispatch]);

  const onSearch = (query: string) => {
    handleSearch(query, sucursalesEmpresa, 'nombre', setFilteredData);
  };

  const onDeleteSucursal = async (sucursal: Sucursal) => {
    try {
      const token = await getAccessTokenSilently();
      await onDelete(
        sucursal,
        async (sucursalToDelete: Sucursal) => {
          await sucursalService.delete(url + '/sucursal', sucursalToDelete.id, token);
        },
        fetchSucursal,
        () => {
          window.location.reload();
        },
        (error: any) => {
          console.error("Error al eliminar sucursal:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar sucursal:", error);
    }
  };

  const handleEdit = (sucursal: Sucursal) => {
    setIsEditing(true);
    setSucursalEditar(sucursal);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddSucursal = () => {
    setIsEditing(false);
    setSucursalEditar(undefined);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const columns: Column[] = [
    { id: 'nombre', label: 'Nombre', renderCell: (sucursal) => <>{sucursal.nombre}</> },
    { id: 'horarioApertura', label: 'Horario de Apertura', renderCell: (sucursal) => <>{sucursal.horarioApertura}</> },
    { id: 'horarioCierre', label: 'Horario de Cierre', renderCell: (sucursal) => <>{sucursal.horarioCierre}</> },
    {
      id: 'direccion',
      label: 'Dirección',
      renderCell: (sucursal) => (
        <div>
          <p>{sucursal.domicilio.calle}, {sucursal.domicilio.numero}</p>
          <p>{sucursal.domicilio.localidad.nombre}, {sucursal.domicilio.localidad.provincia.nombre}, {sucursal.domicilio.localidad.provincia.pais.nombre}</p>
        </div>
      ),
    },
    {
      id: 'casaMatriz',
      label: 'Casa Matriz',
      renderCell: (sucursal) => (
        <div className={sucursal.esCasaMatriz ? 'casa-matriz' : ''}>
          {sucursal.esCasaMatriz ? <CheckCircleOutline color="primary" /> : <HighlightOff color="error" />}
        </div>
      ),
    },
  ];

  const generateInitialSucursal = (idEmpresa: number): SucursalPost => {
    return {
      nombre: '',
      horarioApertura: '',
      horarioCierre: '',
      domicilio: {
        calle: '',
        numero: 0,
        cp: 0,
        piso: 0,
        nroDpto: 0,
        idLocalidad: 0,
      },
      idEmpresa: idEmpresa,
      esCasaMatriz: false
    };
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Sucursales habilitadas de {nombreEmpresa}
          </Typography>
          <Button
            onClick={handleAddSucursal}
            sx={{
              bgcolor: "#ha4444",
              "&:hover": {
                bgcolor: "#hb6666",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Sucursales
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteSucursal} onEdit={handleEdit} />
        <ModalSucursal
          modalName="modal"
          initialValues={sucursalEditar || generateInitialSucursal(empresa?.id || 0)}
          isEditMode={isEditing}
          getSucursales={fetchSucursal}
          idEmpresa={empresa?.id || 0}
          casaMatrizDisabled={casaMatrizDisabled}
        />
      </Container>
    </Box>
  );
};

export default SucursalesEmpresa;
