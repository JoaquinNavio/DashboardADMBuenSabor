import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setEmpleado } from "../../../redux/slices/EmpleadoReducer";
import EmpleadoService from "../../../services/EmpleadoService";
import Column from "../../../types/Column";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { handleSearch, onDelete } from "../../../utils/utils";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import ModalEmpleado from "../../ui/Modals/ModalEmpleado";
import { useAuth0 } from "@auth0/auth0-react";
import IEmpleado from '../../../types/Empleado';

const Empleado = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const empleadoService = new EmpleadoService();
  const globalEmpleados = useAppSelector((state) => state.empleado.data || []);

  const [filteredData, setFilteredData] = useState<IEmpleado[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState<IEmpleado | undefined>();

  const fetchEmpleados = async () => {
    const sucursalId = localStorage.getItem('sucursal_id');

    try {
      const token = await getAccessTokenSilently();
      const empleados = await empleadoService.getAll(`${url}/empleado/sucursal/${sucursalId}`, token);
      dispatch(setEmpleado(empleados));
      setFilteredData(empleados);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, [dispatch]);

  const onSearch = (query: string) => {
    handleSearch(query, globalEmpleados, 'nombre', setFilteredData);
  };

  const onDeleteEmpleado = async (empleado: IEmpleado) => {
    try {
      const token = await getAccessTokenSilently();
      await onDelete(
        empleado,
        async (empleadoToDelete: IEmpleado) => {
          await empleadoService.delete(url + '/empleado', empleadoToDelete.id, token);
        },
        fetchEmpleados,
        () => {},
        (error: any) => {
          console.error("Error al eliminar empleado:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  const handleEdit = (empleado: IEmpleado) => {
    setIsEditing(true);
    setEmpleadoEditar(empleado);
    dispatch(toggleModal({ modalName: "modalEmpleado" }));
  };

  const handleAddEmpleado = () => {
    setIsEditing(false);
    dispatch(toggleModal({ modalName: "modalEmpleado" }));
  };

  const columns: Column[] = [
    { id: "nombre", label: "Nombre", renderCell: (empleado) => <>{empleado.nombre}</> },
    { id: "apellido", label: "Apellido", renderCell: (empleado) => <>{empleado.apellido}</> },
    { id: "telefono", label: "Teléfono", renderCell: (empleado) => <>{empleado.telefono}</> },
    { id: "email", label: "Email", renderCell: (empleado) => <>{empleado.email}</> },
    { id: "tipoEmpleado", label: "Tipo de Empleado", renderCell: (empleado) => <>{empleado.tipoEmpleado}</> },
    { 
      id: "imagenPersona", 
      label: "Imagen", 
      renderCell: (empleado) => (
        <img 
          src={empleado.imagen?.url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png'} 
          width={75} 
          alt="Imagen del empleado" 
        />
      )
    }
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Empleados
          </Typography>
          <Button
            onClick={handleAddEmpleado}
            sx={{
              bgcolor: "#ha4444",
              "&:hover": {
                bgcolor: "#hb6666",
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Añadir Empleado
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteEmpleado} onEdit={handleEdit} />
        <ModalEmpleado
          modalName="modalEmpleado"// @ts-ignore
          initialValues={empleadoEditar || {
            id: 0,
            nombre: "",
            apellido: "",
            telefono: "",
            email: "",
            tipoEmpleado: "Cocinero",
            imagenPersona: { id: 0, url: "", name: "" },
            domicilios: []
          }} 
          isEditMode={isEditing} 
          getEmpleados={fetchEmpleados} // Pasar fetchEmpleados aquí
        />
      </Container>
    </Box>
  );
};

export default Empleado;
