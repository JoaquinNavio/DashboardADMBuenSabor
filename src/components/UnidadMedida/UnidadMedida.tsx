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
    /*const url = import.meta.env.VITE_API_URL;
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

      const columns: Column[] = [
        { id: "Denominacion", label: "Denominacion", renderCell: (unidadMedida) => <>{unidadMedida.nombre}</> },
      ];

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
      };*/
  return (
    <div>
    </div>
  )
}

export default UnidadMedida