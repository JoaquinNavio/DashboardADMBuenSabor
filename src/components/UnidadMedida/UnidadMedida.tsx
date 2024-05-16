import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import UnidadMedidaService from "../../services/UnidadMedidaService";
import IUnidadMedida from "../../types/UnidadMedida";
import { setUnidadMedida } from "../../redux/slices/UnidadMedidaReducer";
import { Column } from "@coreui/react/dist/esm/components/table/types";
import { Box, Typography } from "@mui/material";
import { Button, Container } from "react-bootstrap";
import { Add } from "@mui/icons-material";
import SearchBar from "../ui/common/SearchBar/SearchBar";
import TableComponent from "../ui/Table/Table";
import { toggleModal } from "../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../utils/utils";

const UnidadMedida = () => {
    const url = import.meta.env.VITE_API_URL;
    const dispatch = useAppDispatch();
    const  unidadMedidaService = new UnidadMedidaService();
    const globalUnidadMedida = useAppSelector(
        (state) => state.unidadMedida.data
      );

      const [filteredData, setFilteredData] = useState<IUnidadMedida[]>([]);

      useEffect(() => {
        fetchUnidadMedida();
    }, []);
    
      const fetchUnidadMedida = async () => {
        try {
          const unidades = await unidadMedidaService.getAll(url + '/UnidadMedida');
          dispatch(setUnidadMedida(unidades));
          setFilteredData(unidades);
        } catch (error) {
          console.error("Error al obtener las unidades:", error);
        }
      };



      const handleAddUnidadMedida = () => {
        dispatch(toggleModal({ modalName: "modal" }));
      };

      const onSearch = (query: string) => {
        handleSearch(query, globalUnidadMedida, 'nombre', setFilteredData);
      };

      const onDeleteUnidadMedida = async (unidadMedida: IUnidadMedida) => {
        try {
          await onDelete(
            unidadMedida,
            async (unidadMedidaToDelete: IUnidadMedida) => {
              await unidadMedidaService.delete(url + '/UnidadMedida', unidadMedidaToDelete.id);
            },
            fetchUnidadMedida,
            () => {
            },
            (error: any) => {
              console.error("Error al eliminar empresa:", error);
            }
          );
        } catch (error) {
          console.error("Error al eliminar empresa:", error);
        }
      };


      const handleEdit = (unidadMedida: IUnidadMedida) => {
      };

      const columns: Column[] = [
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
            Añadir Unidad
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteUnidadMedida} onEdit={handleEdit} />
      </Container>
    </Box>


    </div>
  )
}

export default UnidadMedida