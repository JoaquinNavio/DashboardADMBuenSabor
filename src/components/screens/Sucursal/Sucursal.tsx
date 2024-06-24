import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add, CheckCircleOutline, HighlightOff } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Column from "../../../types/Column";
import Sucursal from "../../../types/ISucursal";
import EmpresaService from "../../../services/EmpresaService";
import SucursalService from "../../../services/SucursalService";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import { setSucursal } from "../../../redux/slices/SucursalReducer";
import ModalSucursal from "../../ui/Modals/ModalSucursal";
import { useAuth0 } from "@auth0/auth0-react";

const SucursalComponent = () => {
  const { empresaId } = useParams<{ empresaId: string }>();
  const [nombreEmpresa, setNombreEmpresa] = useState<string>('');
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const empresaService = new EmpresaService();
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL;

  const sucursalesEmpresa = useAppSelector((state) => state.sucursal.data);
  const [filteredData, setFilteredData] = useState<Sucursal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [sucursalEditar, setSucursalEditar] = useState<Sucursal | undefined>();
  const [casaMatrizDisabled, setCasaMatrizDisabled] = useState<boolean>(false);

  const fetchSucursal = async () => {
    try {
      if (empresaId !== undefined) {
        const token = await getAccessTokenSilently();
        const empresa = await empresaService.get(`${url}/empresa/sucursales`, parseInt(empresaId), token);
        dispatch(setSucursal(empresa.sucursales));
        setFilteredData(empresa.sucursales);
        setNombreEmpresa(empresa.nombre);
      } else {
        console.error("Error: empresaId es undefined");
      }
    } catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  };

  useEffect(() => {
    fetchSucursal();
  }, [empresaId]);

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
    { id: "nombre", label: "Nombre", renderCell: (sucursal) => <>{sucursal.nombre}</> },
    { id: "horarioApertura", label: "Horario de Apertura", renderCell: (sucursal) => <>{sucursal.horarioApertura}</> },
    { id: "horarioCierre", label: "Horario de Cierre", renderCell: (sucursal) => <>{sucursal.horarioCierre}</> },
    {
      id: "direccion",
      label: "Dirección",
      renderCell: (sucursal) => (
        <div>
          <p>{sucursal.domicilio.calle}, {sucursal.domicilio.numero}</p>
          <p>{sucursal.domicilio.localidad.nombre}, {sucursal.domicilio.localidad.provincia.nombre}, {sucursal.domicilio.localidad.provincia.pais.nombre}</p>
        </div>
      ),
    },
    {
      id: "esCasaMatriz",
      label: "Casa Matriz",
      renderCell: (sucursal) => (
        <div className={sucursal.esCasaMatriz ? 'casa-matriz' : ''}>
          {sucursal.esCasaMatriz ? <CheckCircleOutline color="primary" /> : <HighlightOff color="error" />}
        </div>
      ),
    },
    {
      id: "url_imagen",
      label: "Imagen",
      renderCell: (sucursal) => (
        <img
          src={sucursal.url_imagen || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png'}
          width={75}
          alt="Imagen de la sucursal"
        />
      ),
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Sucursales de {nombreEmpresa}
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
            Sucursal
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteSucursal} onEdit={handleEdit} />
        <ModalSucursal
          modalName="modal"
          initialValues={sucursalEditar || { nombre: "", horarioApertura: "", horarioCierre: "", domicilio: { calle: "", numero: 0, cp: 0, piso: 0, nroDpto: 0, idLocalidad: 0 }, esCasaMatriz: false, idEmpresa: parseInt(empresaId || "0") }}
          isEditMode={isEditing}
          getSucursales={fetchSucursal}
          idEmpresa={parseInt(empresaId || "0")}
          casaMatrizDisabled={casaMatrizDisabled}
        />
      </Container>
    </Box>
  );
};

export default SucursalComponent;
