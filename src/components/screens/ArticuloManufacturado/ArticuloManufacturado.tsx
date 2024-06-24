import { useEffect, useState } from "react";
import { Box, Typography, Button, Container} from "@mui/material";
import { Add} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setArticuloManufacturado } from "../../../redux/slices/ArticuloManufacturadoReducer";
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import Column from "../../../types/Column";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import ModalArticuloManufacturado from "../../ui/Modals/ModalArticuloManufacturado";
import IArticuloManufacturado from "../../../types/IArticuloManufacturado";
import { useAuth0 } from "@auth0/auth0-react";

const ArticuloManufacturado= () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const globalArticuloManufacturados = useAppSelector(
    (state) => state.articuloManufacturado.data
  );

  const [filteredData, setFilteredData] = useState<IArticuloManufacturado[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [articuloManufacturadoEditar, setArticuloManufacturadoEditar] = useState<IArticuloManufacturado | undefined>();
  const sucursalId = localStorage.getItem('sucursal_id');

  const fetchArticuloManufacturados = async () => {
    try {
      const token = await getAccessTokenSilently();
      const articuloManufacturados = await articuloManufacturadoService.getAll(url + '/ArticuloManufacturado/sucursal/' + sucursalId, token);
      console.log(articuloManufacturados);
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
    handleSearch(query, globalArticuloManufacturados, 'denominacion', setFilteredData);
  };

  const onDeleteArticuloManufacturado = async (articuloManufacturado: IArticuloManufacturado) => {
    try {
      const token = await getAccessTokenSilently();
      await onDelete(
        articuloManufacturado,
        async (articuloManufacturadoToDelete: IArticuloManufacturado) => {
          await articuloManufacturadoService.delete(url + '/ArticuloManufacturado', articuloManufacturadoToDelete.id, token);
        },
        fetchArticuloManufacturados,
        () => {},
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
    setArticuloManufacturadoEditar(articuloManufacturado);
    dispatch(toggleModal({ modalName: "modalManu" }));
  };

  const handleAddArticuloManufacturado = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modalManu" }));
  };

  const columns: Column[] = [
    {
      id: "image",
      label: "Imagen",
      renderCell: (articuloManufacturado) => {
        const imageUrl = articuloManufacturado.imagenes.length > 0
          ? articuloManufacturado.imagenes[0].url
          : "https://imgs.search.brave.com/RWwLZANOOYEVZjIBSJkFbk6jWyf4PAtQ7f5e-vhJ-sM/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9wb3dl/cnVzZXJzLm1pY3Jv/c29mdC5jb20vdDUv/aW1hZ2Uvc2VydmVy/cGFnZS9pbWFnZS1p/ZC85MzQxOWlDNzg1/NUU3OEUzOUZFNjNE/L2ltYWdlLXNpemUv/bGFyZ2UvaXMtbW9k/ZXJhdGlvbi1tb2Rl/L3RydWU_dj12MiZw/eD05OTk.jpeg";
        return <img src={imageUrl} width={75} />;
      }
    },
    { id: "denominacion", label: "Denominacion", renderCell: (articuloManufacturado) => <>{articuloManufacturado.denominacion}</> },
    { id: "descripcion", label: "Descripcion", renderCell: (articuloManufacturado) => <>{articuloManufacturado.descripcion}</> },
    { id: "preparacion", label: "Preparacion", renderCell: (articuloManufacturado) => <>{articuloManufacturado.preparacion}</> },
    { id: "tiempoEstimadoMinutos", label: "Tiempo Estimado Minutos", renderCell: (articuloManufacturado) => <>{articuloManufacturado.tiempoEstimadoMinutos}</> },
    { id: "precioVenta", label: "Precio Venta", renderCell: (articuloManufacturado) => <>{articuloManufacturado.precioVenta}</> },
    { id: "categoria", label: "Categoria", renderCell: (articuloManufacturado) => (articuloManufacturado.categoria.denominacion),},
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Articulo Manufacturado
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
            Articulo Manufacturado
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
            tiempoEstimadoMinutos: 0,
            precioVenta: 0,
            imagenes:[],
            categoria: {id: 0, eliminado: false, denominacion:'', es_insumo: false, categoriaPadre: []},
            detalles:[]
          }} isEditMode={isEditing} getArticuloManufacturados={fetchArticuloManufacturados} />
      </Container>
    </Box>
  );
};

export default ArticuloManufacturado;
