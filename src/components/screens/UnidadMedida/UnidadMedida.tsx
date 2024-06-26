import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import UnidadMedidaService from "../../../services/UnidadMedidaService";
import IUnidadMedida from "../../../types/IUnidadMedida";
import { setUnidadMedida } from "../../../redux/slices/UnidadMedidaReducer";
import { Column } from "@coreui/react/dist/esm/components/table/types";
import { Box, Typography, Button } from "@mui/material";
import { Container } from "react-bootstrap";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import ModalUnidadMedida from "../../ui/Modals/ModalUnidadMedida";
import { Add } from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";

const UnidadMedida = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const unidadMedidaService = new UnidadMedidaService();
  const { getAccessTokenSilently } = useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [unidadMedidaEditar, setUnidadMedidaEditar] = useState<IUnidadMedida | undefined>();
  const globalUnidadMedida = useAppSelector((state) => state.unidadMedida.data);
  const [filteredData, setFilteredData] = useState<IUnidadMedida[]>([]);
  const sucursalId = localStorage.getItem('sucursal_id');

  useEffect(() => {
    fetchUnidadMedida();
  }, []);

  const fetchUnidadMedida = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const unidades = await unidadMedidaService.getAll(url + '/UnidadMedida/sucursal/'+ sucursalId, token);
      dispatch(setUnidadMedida(unidades));
      setFilteredData(unidades);
    } catch (error) {
      console.error("Error al obtener las unidades:", error);
    }
  };

  const onSearch = (query: string) => {
    //console.log("GLOBAL",globalUnidadMedida);
    handleSearch(query, globalUnidadMedida, 'denominacion', setFilteredData);
  };

  const onDeleteUnidadMedida = async (unidadMedida: IUnidadMedida) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      await onDelete(
        unidadMedida,
        async (unidadMedidaToDelete: IUnidadMedida) => {
          await unidadMedidaService.delete(url + '/UnidadMedida', unidadMedidaToDelete.id, token);
        },
        fetchUnidadMedida,
        () => {},
        (error: any) => {
          console.error("Error al eliminar unidad de medida:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar unidad de medida:", error);
    }
  };

  const handleAddUnidadMedida = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modalUnidad" }));
  };

  const handleEditUnidadMedida = (unidadMedida: IUnidadMedida) => {
    setUnidadMedidaEditar(unidadMedida);
    setIsEditing(true);
    dispatch(toggleModal({ modalName: "modalUnidad" }));
  };

  const columns: Column[] = [// @ts-ignore
    { id: "Denominacion", label: "Denominacion", renderCell: (unidadMedida) => <>{unidadMedida.denominacion}</> },
  ];

  return (
    <div>
      <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
            <Typography variant="h5" gutterBottom>
              Unidades de medida
            </Typography>
            <Button
              onClick={handleAddUnidadMedida}
              sx={{
                bgcolor: "#ha4444",
                "&:hover": {
                  bgcolor: "#hb6666",
                },
              }}
              variant="contained"
              startIcon={<Add />}
            >
              Unidad Medida
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <SearchBar onSearch={onSearch} />
          </Box>
          <TableComponent data={filteredData} columns={columns} onDelete={onDeleteUnidadMedida} onEdit={handleEditUnidadMedida} />
        </Container>
        <ModalUnidadMedida modalName="modalUnidad" initialValues={unidadMedidaEditar || { id: 0, eliminado: false, denominacion: "" }} isEditMode={isEditing} getUnidades={fetchUnidadMedida} />
      </Box>
    </div>
  );
}

export default UnidadMedida;
