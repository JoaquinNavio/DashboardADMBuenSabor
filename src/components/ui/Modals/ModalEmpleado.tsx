import React, { useState, useEffect, ChangeEvent } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import EmpleadoService from '../../../services/EmpleadoService';
import IEmpleado from '../../../types/Empleado';
import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { TextField, Button } from '@mui/material';
import SelectFieldValue from '../SelectFieldValue/SelectFieldValue';

interface ModalEmpleadoProps {
  modalName: string;
  initialValues: IEmpleado;
  isEditMode: boolean;
  getEmpleados: () => Promise<void>;
}

const ModalEmpleado: React.FC<ModalEmpleadoProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getEmpleados,
}) => {
  const sucursalId = localStorage.getItem('sucursal_id');
  const { getAccessTokenSilently } = useAuth0();
  const empleadoService = new EmpleadoService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'),
    apellido: Yup.string().required('Campo requerido'),
    telefono: Yup.string().required('Campo requerido'),
    email: Yup.string().email('Email no válido').required('Campo requerido'),
    tipoEmpleado: Yup.string().required('Campo requerido')
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (values: IEmpleado) => {
    try {
      const token = await getAccessTokenSilently();
      const formData = new FormData();
      formData.append('nombre', values.nombre);
      formData.append('apellido', values.apellido);
      formData.append('telefono', values.telefono);
      formData.append('email', values.email);
      formData.append('tipoEmpleado', values.tipoEmpleado.toUpperCase());
      formData.append('sucursal_id', sucursalId || '0');

      if (selectedFile) {
        formData.append('imagen', selectedFile);
      } else if (initialValues.imagen?.url) {
        formData.append('imagenUrl', initialValues.imagen.url);
      }

      if (isEditMode) {
        await empleadoService.putEmpleado(`${URL}/empleado`, values.id, formData, token);
      } else {
        await empleadoService.postEmpleado(`${URL}/empleado/crear`, formData, token);
      }

      getEmpleados(); // Llamar a getEmpleados después de enviar los datos para actualizar la tabla
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const onCloseModal = () => {
    setSelectedFile(null);
  };

  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  useEffect(() => {
    if (showModal) {
      setSelectedFile(null);
    }
  }, [showModal]);

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Empleado' : 'Añadir Empleado'}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onCloseModal}
    >
      {/* Campos del formulario */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px', width: '100%' }}>
        <div style={{ flex: '0 0 50%' }}>
          <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Ingrese nombre" />
        </div>
        <div style={{ flex: '0 0 50%' }}>
          <TextFieldValue label="Apellido" name="apellido" type="text" placeholder="Ingrese apellido" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
        <div>
          <TextFieldValue label="Teléfono" name="telefono" type="text" placeholder="Teléfono" />
        </div>
        <div>
          <TextFieldValue label="Email" name="email" type="email" placeholder="Email" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
        <div>

          <SelectFieldValue
            disabled
            label="Tipo de Empleado"
            name="tipoEmpleado"
            type='text'
            options={[
              { label: 'COCINERO', value: 'COCINERO' },
              { label: 'ADMIN', value: 'ADMIN' },
              { label: 'VISOR', value: 'VISOR' }
            ]}
            placeholder="Seleccione el tipo de empleado"
          />
        </div>
      </div>

      {/* Campo para subir una sola imagen */}
      <div>
        <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Elegir Imagen</label>
        <div
          title="Imagen Persona"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2vh",
            padding: ".4rem",
          }}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            type="file"
            onChange={handleFileChange}
            inputProps={{
              multiple: false,
            }}
          />
          {isEditMode && initialValues.imagen?.url && (
            <img
              src={initialValues.imagen.url}
              alt="Imagen del empleado"
              style={{ width: '75px', height: '75px', objectFit: 'cover' }}
            />
          )}
        </div>
      </div>
    </GenericModal>
  );
};

export default ModalEmpleado;
