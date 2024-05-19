import { useEffect, useState } from "react";
import { Box, Typography, Button, Container} from "@mui/material";
import { Add} from "@mui/icons-material";
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
import IArticuloManufacturado from "../../../types/IArticuloManufacturado";


const ArticuloManufacturado= () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const globalArticuloManufacturados = useAppSelector(
    (state) => state.articuloManufacturado.data
  );

  const [filteredData, setFilteredData] = useState<IArticuloManufacturado[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [articuloManufacturadoEditar, setArticuloManufacturadoEditar] = useState<IArticuloManufacturado | undefined>();

  const fetchArticuloManufacturados = async () => {
    try {
      const articuloManufacturados = await articuloManufacturadoService.getAll(url + '/ArticuloManufacturado');
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

  const onDeleteArticuloManufacturado = async (articuloManufacturado: IArticuloManufacturado) => {
    try {
      await onDelete(
        articuloManufacturado,
        async (articuloManufacturadoToDelete: IArticuloManufacturado) => {
          await articuloManufacturadoService.delete(url + '/ArticuloManufacturado', articuloManufacturadoToDelete.id);
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

  const handleEdit = (articuloManufacturado: IArticuloManufacturado) => {
    setIsEditing(true);
    setArticuloManufacturadoEditar(articuloManufacturado)
    dispatch(toggleModal({ modalName: "modalManu" }));
  };

  const handleAddArticuloManufacturado = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modalManu" }));
  };


  const columns: Column[] = [
    { id: "denominacion", label: "Denominacion", renderCell: (articuloManufacturado) => <>{articuloManufacturado.denominacion}</> },
    { id: "descripcion", label: "Descripcion", renderCell: (articuloManufacturado) => <>{articuloManufacturado.descripcion}</> },
    { id: "preparacion", label: "Preparacion", renderCell: (articuloManufacturado) => <>{articuloManufacturado.preparacion}</> },
    { id: "tiempoEstimadoMinutos", label: "Tiempo Estimado Minutos", renderCell: (articuloManufacturado) => <>{articuloManufacturado.tiempoEstimadoMinutos}</> },
    { id: "precioVenta", label: "Precio Venta", renderCell: (articuloManufacturado) => <>{articuloManufacturado.precioVenta}</> },
    
    { id: "precioVenta", label: "Precio Venta", renderCell: (articuloManufacturado) => <>{articuloManufacturado.precioVenta}</> },

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
          modalName="modalManu"
          initialValues={articuloManufacturadoEditar || {
            id: 0,
            unidadMedida: { id: 0, eliminado: false, denominacion: "" },
            eliminado: false,
            denominacion: "",
            descripcion: "", preparacion: "",
            tiempoEstimadoMinutos: 0, precioVenta: 0
          }} isEditMode={isEditing} getArticuloManufacturados={fetchArticuloManufacturados} />
      </Container>
    </Box>
  );
};

export default ArticuloManufacturado;
