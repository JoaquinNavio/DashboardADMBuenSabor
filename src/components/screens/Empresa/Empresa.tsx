import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, Tooltip, IconButton } from "@mui/material";
import { Add, Visibility, AddCircle } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setEmpresa } from "../../../redux/slices/EmpresaReducer";
import { useAuth0 } from "@auth0/auth0-react";
import EmpresaService from "../../../services/EmpresaService";
import Column from "../../../types/Column";
import Empresa from "../../../types/IEmpresa";
import { Link } from "react-router-dom";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import ModalEmpresa from "../../ui/Modals/ModalEmpresa";
import ModalSucursal from "../../ui/Modals/ModalSucursal";

const EmpresaComponent = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const empresaService = new EmpresaService();
  const globalEmpresas = useAppSelector((state) => state.empresa.data);

  const [filteredData, setFilteredData] = useState<Empresa[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [empresaEditar, setEmpresaEditar] = useState<Empresa | undefined>();
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | undefined>();

  const fetchEmpresas = async () => {
    try {
      const token = await getAccessTokenSilently();
      const empresas = await empresaService.getAll(url + '/empresa', token);
      dispatch(setEmpresa(empresas));
      setFilteredData(empresas);
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, [dispatch]);

  const onSearch = (query: string) => {
    handleSearch(query, globalEmpresas, 'nombre', setFilteredData);
  };

  const onDeleteEmpresa = async (empresa: Empresa) => {
    try {
      const token = await getAccessTokenSilently();
      await onDelete(
        empresa,
        async (empresaToDelete: Empresa) => {
          await empresaService.delete(url + '/empresa', empresaToDelete.id, token);
        },
        fetchEmpresas,
        () => {},
        (error: any) => {
          console.error("Error al eliminar empresa:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar empresa:", error);
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setIsEditing(true);
    setEmpresaEditar(empresa);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddEmpresa = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddSucursal = (empresa: Empresa) => {
    setSelectedEmpresaId(empresa.id);
    dispatch(toggleModal({ modalName: "modalSucursal" }));
  };

  const columns: Column[] = [
    { id: "nombre", label: "Nombre", renderCell: (empresa) => <>{empresa.nombre}</> },
    { id: "razonSocial", label: "Razón Social", renderCell: (empresa) => <>{empresa.razonSocial}</> },
    { id: "cuil", label: "CUIL", renderCell: (empresa) => <>{empresa.cuil}</> },
    {
      id: "url_imagen",
      label: "Imagen",
      renderCell: (empresa) => (
        <img 
          src={empresa.url_imagen || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png'} 
          width={75} 
          alt="Imagen de la empresa" 
        />
      )
    },
    {
      id: "sucursales",
      label: "Sucursales",
      renderCell: (empresa) => (
        <>
          <Tooltip title="Ver Sucursales">
            <IconButton component={Link} to={`/empresas/${empresa.id}`} aria-label="Ver Sucursales">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar Sucursal">
            <IconButton onClick={() => handleAddSucursal(empresa as Empresa)} aria-label="Agregar Sucursal">
              <AddCircle />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Empresas
          </Typography>
          <Button
            onClick={handleAddEmpresa}
            sx={{
              bgcolor: "#ha4444",
              "&:hover": {
                bgcolor: "#hb6666",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Empresa
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteEmpresa} onEdit={handleEdit} />
        <ModalEmpresa
          modalName="modal"
          initialValues={empresaEditar || { id: 0, eliminado: false, nombre: "", razonSocial: "", cuil: 0, url_imagen: "", sucursales: [] }}
          isEditMode={isEditing}
          getEmpresas={fetchEmpresas}
        />
        <ModalSucursal
          modalName="modalSucursal"
          initialValues={{
            id: 0,
            eliminado: false,
            nombre: "",
            horarioApertura: "",
            horarioCierre: "",
            domicilio: {
              calle: "",
              numero: 0,
              cp: 0,
              piso: 0,
              nroDpto: 0,
              idLocalidad: 0,
            },
            idEmpresa: selectedEmpresaId || 0,
            esCasaMatriz: false,
            url_imagen: "",
          }}
          isEditMode={false}
          getSucursales={fetchEmpresas} // Reutilizando fetchEmpresas para refrescar las sucursales después de agregar una nueva
          idEmpresa={selectedEmpresaId || 0}
          casaMatrizDisabled={false}
        />
      </Container>
    </Box>
  );
};

export default EmpresaComponent;
