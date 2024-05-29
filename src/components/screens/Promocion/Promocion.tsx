import { useEffect, useState } from "react";
import { Box, Typography, Button, Container} from "@mui/material";
import { Add} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

import Column from "../../../types/Column";

import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import PromocionService from "../../../services/PromocionService";
import IPromocion from "../../../types/IPromocion";
import { setPromociones } from "../../../redux/slices/PromocionReducer";
import ModalPromocion from "../../ui/Modals/ModalPromocion";
import { TipoPromocion } from "../../../types/EnumTipoPromocion";

export const Promocion = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();

  const promocionService = new PromocionService();

  const globalPromociones = useAppSelector((state) => state.promociones.data);
  const onSearch = (query: string) => {
    handleSearch(query, globalPromociones, 'denominacion', setFilteredData);
  };

  const [filteredData, setFilteredData] = useState<IPromocion[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [promocionEditar, setPromocionEditar] = useState<IPromocion | undefined>();

  const fetchPromociones = async () => {
    try {
      const promociones = await promocionService.getAll(url + '/promociones');
      dispatch(setPromociones(promociones));
      setFilteredData(promociones);
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
    }
  };

  useEffect(() => {
    fetchPromociones();
  }, [dispatch]);

  const onDeletePromocion = async (articuloManufacturado: IPromocion) => {
    try {
      await onDelete(
        articuloManufacturado,
        async (promocionToDelete: IPromocion) => {
          await promocionService.delete(url + '/promociones', promocionToDelete.id);
        },
        fetchPromociones,
        () => {},
        (error: any) => {
          console.error("Error al eliminar promocion:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar promocion:", error);
    }
  };

  enum TipoPromocion {
    HAPPY_HOUR = 0,
    PROMOCION = 1,
    // Agrega otros tipos de promoción si los tienes
}
const handleEdit = (promocion: any) => {
    setIsEditing(true);

    // Asegurar que tipoPromocion se compara como string
    const tipoPromocionStr = promocion.tipoPromocion.toString();
    const updatedPromocion = {
        ...promocion,
        tipoPromocion: tipoPromocionStr === "HAPPY_HOUR" ? TipoPromocion.HAPPY_HOUR : TipoPromocion.PROMOCION,
    };

    console.log(updatedPromocion);
    setPromocionEditar(updatedPromocion);
    dispatch(toggleModal({ modalName: "modalPromocion" }));
};

  const handleAddPromocion = () => {
    setIsEditing(false);
    setPromocionEditar(undefined);
    dispatch(toggleModal({ modalName: "modalPromocion" }));
  };

  const columns: Column[] = [
    { id: "denominacion", label: "Denominacion", renderCell: (promocion) => <>{promocion.denominacion}</> },
    { id: "descripcionDescuento", label: "Descripcion del descuento", renderCell: (promocion) => <>{promocion.descripcionDescuento}</> },
    { id: "fechaDesde", label: "Fecha inicio", renderCell: (promocion) => <>{promocion.fechaDesde}</> },
    { id: "fechaHasta", label: "Fecha fin", renderCell: (promocion) => <>{promocion.fechaHasta}</> },
    { id: "horaDesde", label: "Hora inicio", renderCell: (promocion) => <>{promocion.horaDesde}</> },
    { id: "horaHasta", label: "Hora", renderCell: (promocion) => <>{promocion.horaHasta}</> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Promociones
          </Typography>
          <Button
            onClick={handleAddPromocion}
            sx={{
              bgcolor: "#ha4444",
              "&:hover": {
                bgcolor: "#hb6666",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Promocion
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeletePromocion} onEdit={handleEdit} />
        <ModalPromocion
          modalName="modalPromocion" // Asegúrate de que coincida con el nombre del modal
          initialValues={promocionEditar || {
            id: 0,
            eliminado: false,
            denominacion: "",
            fechaDesde: "",
            fechaHasta: "",
            horaDesde: "",
            horaHasta: "",
            descripcionDescuento: "",
            precioPromocional: 0,
            tipoPromocion: 0,
          }} 
          isEditMode={isEditing} 
          getPromociones={fetchPromociones} 
        />
      </Container>
    </Box>
  );
};
