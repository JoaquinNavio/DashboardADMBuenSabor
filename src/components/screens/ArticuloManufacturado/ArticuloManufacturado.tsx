import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, Tooltip, IconButton } from "@mui/material";
import { Add, Visibility, AddCircle } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setArticuloManufacturado } from "../../../redux/slices/ArticuloManufacturadoReducer";

import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import Column from "../../../types/Column";

import { Link } from "react-router-dom";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import ModalArticuloManufacturado from "../../ui/Modals/ModalArticuloManufacturado";
import ModalSucursal from "../../ui/Modals/ModalSucursal";
import SucursalPost from "../../../types/post/SucursalPost";
import ArticuloManufacturado from "../../../types/IArticuloManufacturado";


const ArticuloManufacturado= () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const globalArticuloManufacturados = useAppSelector(
    (state) => state.articuloManufacturado.data
  );

  const [filteredData, setFilteredData] = useState<ArticuloManufacturado[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [articuloManufacturadoEditar, setArticuloManufacturadoEditar] = useState<ArticuloManufacturado | undefined>();

  const fetchArticuloManufacturados = async () => {
    try {
      const articuloManufacturados = await articuloManufacturadoService.getAll(url + '/articuloManufacturado');
      dispatch(setArticuloManufacturado(articuloManufacturados));
      setFilteredData(articuloManufacturados);
    } catch (error) {
      console.error("Error al obtener las articuloManufacturados:", error);
    }
  };

  useEffect(() => {
    fetchArticuloManufacturados();
  }, [dispatch]);

  const onSearch = (query: string) => {
    handleSearch(query, globalArticuloManufacturados, 'nombre', setFilteredData);
  };

  const onDeleteArticuloManufacturado = async (articuloManufacturado: ArticuloManufacturado) => {
    try {
      await onDelete(
        articuloManufacturado,
        async (articuloManufacturadoToDelete: ArticuloManufacturado) => {
          await articuloManufacturadoService.delete(url + '/articuloManufacturado', articuloManufacturadoToDelete.id);
        },
        fetchArticuloManufacturados,
        () => {
        },
        (error: any) => {
          console.error("Error al eliminar articuloManufacturado:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar articuloManufacturado:", error);
    }
  };

  const handleEdit = (articuloManufacturado: ArticuloManufacturado) => {
    setIsEditing(true);
    setArticuloManufacturadoEditar(articuloManufacturado)
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddArticuloManufacturado = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddSucursal = (articuloManufacturado: ArticuloManufacturado) => {
    dispatch(toggleModal({ modalName: "modalSucursal" }));
    setArticuloManufacturadoEditar(articuloManufacturado);
  };

  const generateInitialSucursal = (idArticuloManufacturado: number): SucursalPost  => {
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
      idArticuloManufacturado: idArticuloManufacturado,
      esCasaMatriz:false
    };
  };

  const columns: Column[] = [
    { id: "nombre", label: "Nombre", renderCell: (articuloManufacturado) => <>{articuloManufacturado.nombre}</> },
    { id: "razonSocial", label: "Razón Social", renderCell: (articuloManufacturado) => <>{articuloManufacturado.razonSocial}</> },
    { id: "cuil", label: "CUIL", renderCell: (articuloManufacturado) => <>{articuloManufacturado.cuil}</> },
    {
      id: "sucursales",
      label: "Sucursales",
      renderCell: (articuloManufacturado) => (
        <>
          <Tooltip title="Ver Sucursales">
            <IconButton component={Link} to={`/articuloManufacturados/${articuloManufacturado.id}`} aria-label="Ver Sucursales">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar Sucursal">
            <IconButton onClick={() => handleAddSucursal(articuloManufacturado as ArticuloManufacturado)} aria-label="Agregar Sucursal">
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
            ArticuloManufacturados
          </Typography>
          <Button
            onClick={handleAddArticuloManufacturado}
            sx={{
              bgcolor: "#ha4444",
              "&:hover": {
                bgcolor: "#hb6666",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            ArticuloManufacturado
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteArticuloManufacturado} onEdit={handleEdit} />
        <ModalArticuloManufacturado
         modalName="modal"
          initialValues={articuloManufacturadoEditar || { id: 0, eliminado: false, nombre: "",
           razonSocial: "", cuil: 0, sucursales: [] }} isEditMode={isEditing} getArticuloManufacturados={fetchArticuloManufacturados} />
        <ModalSucursal
          modalName="modalSucursal"
          initialValues={articuloManufacturadoEditar ? generateInitialSucursal(articuloManufacturadoEditar.id) : generateInitialSucursal(0)}
          isEditMode={false}
          getSucursales={fetchArticuloManufacturados}
          idArticuloManufacturado={articuloManufacturadoEditar?.id || 0} 
          casaMatrizDisabled={false}
          />
      </Container>
    </Box>
  );
};

export default ArticuloManufacturado;
