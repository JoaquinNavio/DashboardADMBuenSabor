import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add, CheckCircleOutline, FilterRounded, HighlightOff } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useAuth0 } from "@auth0/auth0-react";

import Column from "../../../types/Column";
import Categoria from "../../../types/ICategoria";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import CategoriaService from "../../../services/CategoriaService";
import ModalCategoria from "../../ui/Modals/ModalCategoria";

const CategoriaComponent = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const categoriaService = new CategoriaService();
  const globalCategorias = useAppSelector((state) => state.categoria.data);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | undefined>();

  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);

  const fetchCategorias = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      // Imprimir el token JWT en la consola
      console.log("Token JWT:", token);

      const sucursalId = localStorage.getItem('sucursal_id');
      console.log(sucursalId);

      if (sucursalId) {
        const categorias = await categoriaService.getAll(`${url}/categoria/sucursal/${sucursalId}`, token);
        setCategorias(categorias);
        setFilteredCategorias(categorias);
      } else {
        console.error("No se encontró el ID de la sucursal en el local storage.");
      }
    } catch (error) {
      console.error("Error al obtener las Categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [dispatch]);

  const onSearch = (query: string) => {
    console.log(categorias);
    if (query === "") {
      setFilteredCategorias(categorias);
    } else {
      const filtered = categorias.filter((categoria) =>
        categoria.denominacion.toLowerCase().includes(query.toLowerCase())
      );
      console.log("FIltrado",filtered);
      setFilteredCategorias(filtered);
    }
  };

  const onDeleteCategoria = async (categoria: Categoria) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      await onDelete(
        categoria,
        async (categoriaToDelete: Categoria) => {
          await categoriaService.delete(url + '/categoria', categoriaToDelete.id, token);
        },
        fetchCategorias,
        () => {},
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
    setCategoriaEditar(categoria);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddCategoria = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const columns: Column[] = [
    { id: "denominacion", label: "Denominacion", renderCell: (categoria) => <>{categoria.denominacion}</> },
    { id: "es_insumo", label: "Es Insumo", renderCell: (categoria) => <>{categoria.esInsumo ? <CheckCircleOutline color="primary" /> : <HighlightOff color="error" />}</> },
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
        <TableComponent data={filteredCategorias} columns={columns} onDelete={onDeleteCategoria} onEdit={handleEdit} />
        <ModalCategoria modalName="modal" initialValues={categoriaEditar || { id: 0, eliminado: false, denominacion: "", esInsumo: false, categoriaPadre: undefined }} isEditMode={isEditing} getCategorias={fetchCategorias} />
      </Container>
    </Box>
  );
};

export default CategoriaComponent;
