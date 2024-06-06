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


const ArticuloManufacturado= () => {
  //url api
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  //Instancia de ArticuloManufacturadoService()
  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const globalArticuloManufacturados = useAppSelector(
    (state) => state.articuloManufacturado.data
  );

  /*hook useState para gestionar el estado del componente. 
  En este caso, se manejan los datos relacionados con los artículos manufacturados y el estado de edición*/
  const [filteredData, setFilteredData] = useState<IArticuloManufacturado[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [articuloManufacturadoEditar, setArticuloManufacturadoEditar] = useState<IArticuloManufacturado | undefined>();

  /*fetchArticuloManufacturados: Se utiliza para obtener todos los artículos manufacturados. 
  Se ejecuta al montar el componente y actualiza el estado con los datos obtenidos.*/
  const fetchArticuloManufacturados = async () => {
    try {
      const articuloManufacturados = await articuloManufacturadoService.getAll(url + '/ArticuloManufacturado');
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

  /*onSearch: Maneja la búsqueda de artículos manufacturados. Filtra los datos en función de un término de búsqueda(denominacion).*/
  const onSearch = (query: string) => {
    handleSearch(query, globalArticuloManufacturados, 'denominacion', setFilteredData);
  };

  /*onDeleteArticuloManufacturado: Maneja la eliminación de un artículo manufacturado. 
  Llama al servicio correspondiente para eliminar el artículo y luego actualiza los datos*/
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


  /*handleEdit: Maneja la edición de un artículo manufacturado. 
  Establece el estado de edición y abre un modal para editar el artículo.*/
  const handleEdit = (articuloManufacturado: IArticuloManufacturado) => {
    setIsEditing(true);
    setArticuloManufacturadoEditar(articuloManufacturado)
    dispatch(toggleModal({ modalName: "modalManu" }));
  };

  /*handleAddArticuloManufacturado: Maneja la adición de un nuevo artículo manufacturado. 
  Establece el estado de edición y abre un modal para añadir un nuevo artículo.*/
  const handleAddArticuloManufacturado = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modalManu" }));
  };


  /*Define las columnas que se mostrarán en la tabla de artículos manufacturados. 
  Cada columna especifica el identificador, etiqueta y función de representación de la celda.*/
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

  /*Renderiza la interfaz de usuario del componente utilizando elementos de Material-UI
   como Box, Typography, Button, Container, etc.
  Incluye un botón para añadir un nuevo artículo manufacturado, una barra de búsqueda, y una tabla 
  que muestra los artículos manufacturados.
  También incluye un modal para editar o añadir artículos manufacturados. */
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
