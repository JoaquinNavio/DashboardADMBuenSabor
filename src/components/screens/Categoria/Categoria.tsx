import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";


import Column from "../../../types/Column";
import Categoria from "../../../types/ICategoria";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import CategoriaService from "../../../services/CategoriaService";
import { setCategoria } from "../../../redux/slices/CategoriaReducer";
import ModalCategoria from "../../ui/Modals/ModalCategoria";

const CategoriaComponent = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();

  //importo la clase CategoriaService para tener los metodos
  const categoriaService = new CategoriaService();
  const globalCategorias = useAppSelector(
    (state) => state.categoria.data
  );

  const [filteredData, setFilteredData] = useState<Categoria[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | undefined>();

  const fetchCategorias = async () => {
    try {
      const categorias = await categoriaService.getAll(url + '/categorias');
      dispatch(setCategoria(categorias));
      setFilteredData(categorias);
    } catch (error) {
      console.error("Error al obtener las Categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [dispatch]);

  const onSearch = (query: string) => {
    handleSearch(query, globalCategorias, 'nombre', setFilteredData);
  };

  const onDeleteCategoria = async (categoria: Categoria) => {
    try {
      await onDelete(
        categoria,
        async (categoriaToDelete: Categoria) => {
          await categoriaService.delete(url + '/categoria', categoriaToDelete.id);
        },
        fetchCategorias,
        () => {
        },
        (error: any) => {
          console.error("Error al eliminar categoria:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar categoria:", error);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setIsEditing(true);
    setCategoriaEditar(categoria)
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddCategoria = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modal" }));
  };



  const columns: Column[] = [
    { id: "denominacion", label: "Denominacion", renderCell: (categoria) => <>{categoria.denominacion}</> },
    { id: "es_insumo", label: "Es Insumo", renderCell: (categoria) => <>{categoria.es_insumo}</> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Categorías
          </Typography>
          <Button
            onClick={handleAddCategoria}
            sx={{
              bgcolor: "#ha4444",
              "&:hover": {
                bgcolor: "#hb6666",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Categoría
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteCategoria} onEdit={handleEdit} />
        <ModalCategoria modalName="modal" initialValues={categoriaEditar || { id: 0, eliminado: false, denominacion: "", es_insumo: false}} isEditMode={isEditing} getCategorias={fetchCategorias} />
      </Container>
    </Box>
  );
};

export default CategoriaComponent;
