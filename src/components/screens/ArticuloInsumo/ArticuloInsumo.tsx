import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setArticuloInsumo } from "../../../redux/slices/ArticuloInsumoReducer";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import Column from "../../../types/Column";
import ArticuloInsumo from "../../../types/IArticuloInsumo";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import ModalArticuloInsumo from "../../ui/Modals/ModalArticuloInsumo";
import IUnidadMedida from "../../../types/IUnidadMedida";

const ArticuloInsumoComponent = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const articuloInsumoService = new ArticuloInsumoService();
  const globalArticuloInsumos = useAppSelector(
    (state) => state.articuloInsumo.data
  );

  const [filteredData, setFilteredData] = useState<ArticuloInsumo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [articuloInsumoEditar, setArticuloInsumoEditar] = useState<ArticuloInsumo | undefined>();

  const fetchArticuloInsumos = async () => {
    try {
      const articuloInsumos = await articuloInsumoService.getAll(url + '/ArticuloInsumo');
      console.log(articuloInsumos);
      dispatch(setArticuloInsumo(articuloInsumos));
      setFilteredData(articuloInsumos);
    } catch (error) {
      console.error("Error al obtener los articulos Insumos:", error);
    }
  };

  useEffect(() => {
    fetchArticuloInsumos();
  }, [dispatch]);

  const onSearch = (query: string) => {
    handleSearch(query, globalArticuloInsumos, 'denominacion', setFilteredData);
  };

  const onDeleteArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
    try {
      await onDelete(
        articuloInsumo,
        async (articuloInsumoToDelete: ArticuloInsumo) => {
          await articuloInsumoService.delete(url + '/ArticuloInsumo', articuloInsumoToDelete.id);
        },
        fetchArticuloInsumos,
        () => {
        },
        (error: any) => {
          console.error("Error al eliminar articuloInsumo:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar articuloInsumo:", error);
    }
  };

  const handleEdit = (articuloInsumo: ArticuloInsumo) => {
    setIsEditing(true);
    setArticuloInsumoEditar(articuloInsumo)
    dispatch(toggleModal({ modalName: "modalArticulo" }));
  };

  const handleAddArticuloInsumo = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modalArticulo" }));
  };

  const generateInitialUnidadMedida = (): IUnidadMedida  => {
    return {
      id: 0,
      eliminado: false,
      denominacion: ''
    };
  };

  const columns: Column[] = [
    { id: "image", label: "Imagen", renderCell: (articuloInsumo) => <img src={articuloInsumo.image?.url || "https://imgs.search.brave.com/RWwLZANOOYEVZjIBSJkFbk6jWyf4PAtQ7f5e-vhJ-sM/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9wb3dl/cnVzZXJzLm1pY3Jv/c29mdC5jb20vdDUv/aW1hZ2Uvc2VydmVy/cGFnZS9pbWFnZS1p/ZC85MzQxOWlDNzg1/NUU3OEUzOUZFNjNE/L2ltYWdlLXNpemUv/bGFyZ2UvaXMtbW9k/ZXJhdGlvbi1tb2Rl/L3RydWU_dj12MiZw/eD05OTk.jpeg"} width={75}/> },
    { id: "denominacion", label: "Denominacion", renderCell: (articuloInsumo) => <>{articuloInsumo.denominacion}</> },
    { 
      id: "precioVenta", 
      label: "Precio Venta",
      renderCell: (articuloInsumo) => (
        <>{articuloInsumo.precioVenta === 0 ? "No es para vender" : articuloInsumo.precioVenta}</>
      ) 
    },
    { id: "esParaElaborar", label: "Es Para Elaborar", renderCell: (articuloInsumo) => <>{articuloInsumo.esParaElaborar? "Si":"No"}</> },
    { id: "precioCompra", label: "Precio Compra", renderCell: (articuloInsumo) => <>{articuloInsumo.precioCompra}</> },
    { id: "stockActual", label: "Stock Actual", renderCell: (articuloInsumo) => <>{articuloInsumo.stockActual}</> },
    { id: "stockMaximo", label: "Stock Maximo", renderCell: (articuloInsumo) => <>{articuloInsumo.stockMaximo}</> },
    { id: "unidadMedida", label: "Unidad Medida", renderCell: (articuloInsumo) => (articuloInsumo.unidadMedida.denominacion),},
    { id: "categoria", label: "Categoria", renderCell: (articuloInsumo) => articuloInsumo.categoria ? articuloInsumo.categoria.denominacion : null },

  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Articulo Insumos
          </Typography>
          <Button
            onClick={handleAddArticuloInsumo}
            sx={{
              bgcolor: "#ha4444",
              "&:hover": {
                bgcolor: "#hb6666",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Articulo Insumo
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteArticuloInsumo} onEdit={handleEdit} />
        <ModalArticuloInsumo 
        modalName="modalArticulo" 
        initialValues={articuloInsumoEditar || { 
          id:0,
          image: {id:0, eliminado:false, url: "", name: ""},
          eliminado: false, 
          denominacion: '', 
          precioVenta: 0, 
          unidadMedida: generateInitialUnidadMedida(), 
          categoria: {id: 0, eliminado: false, denominacion:'', es_insumo: false},
          esParaElaborar: false,
          precioCompra: 0, 
          stockActual: 0, 
          stockMaximo: 0 }} 
        isEditMode={isEditing} 
        getArticuloInsumos={fetchArticuloInsumos} />
      </Container>
    </Box>
  );
};

export default ArticuloInsumoComponent;
