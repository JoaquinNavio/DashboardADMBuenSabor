import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import UnidadMedidaService from "../../services/UnidadMedidaService";
import IUnidadMedida from "../../types/IUnidadMedida";
import { setUnidadMedida } from "../../redux/slices/UnidadMedidaReducer";
import { Column } from "@coreui/react/dist/esm/components/table/types";
import { Box, Typography } from "@mui/material";
import { Button, Container } from "react-bootstrap";
import { Add } from "@mui/icons-material";
import SearchBar from "../ui/common/SearchBar/SearchBar";
import TableComponent from "../ui/Table/Table";
import { toggleModal } from "../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../utils/utils";
import ModalUnidadMedida from "../ui/Modals/ModalUnidadMedida";

const UnidadMedida = () => {
    const url = import.meta.env.VITE_API_URL;
    const dispatch = useAppDispatch();
    const  unidadMedidaService = new UnidadMedidaService();

    const [isEditing, setIsEditing] = useState(false);
    const [unidadMedidaEditar, setunidadMedidaEditar] = useState<IUnidadMedida | undefined>();


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

      const generateInitialUnidadMedida = (): IUnidadMedida  => {
        return {
          denominacion:''
        };
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
            style={{ backgroundColor: "blue", color: "white" }}
          >
            Añadir Unidad
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteUnidadMedida} onEdit={handleEdit} />
      </Container>
      <ModalUnidadMedida modalName="modal" initialValues={empresaEditar || { id: 0, eliminado: false, nombre: "", razonSocial: "", cuil: 0, sucursales: [] }} isEditMode={isEditing} getEmpresas={fetchEmpresas} />
        <ModalUnidadMedida
          modalName="modalUnidadMedida"
          initialValues={unidadMedidaEditar ? generateInitialSucursal(empresaEditar.id) : generateInitialSucursal(0)}
          isEditMode={false}
          getSucursales={fetchEmpresas}
          idEmpresa={empresaEditar?.id || 0} 
          casaMatrizDisabled={false}
          />
    </Box>

    </div>
  )
}

export default UnidadMedida