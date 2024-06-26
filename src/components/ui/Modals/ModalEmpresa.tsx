import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import EmpresaService from '../../../services/EmpresaService'; 
import Empresa from '../../../types/IEmpresa'; 
import { useAuth0 } from "@auth0/auth0-react";
import { TextField, Button } from '@mui/material';

interface ModalEmpresaProps {
  modalName: string;
  initialValues: Empresa;
  isEditMode: boolean;
  getEmpresas: () => Promise<void>;
}

const ModalEmpresa: React.FC<ModalEmpresaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getEmpresas,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const empresaService = new EmpresaService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'),
    razonSocial: Yup.string().required('Campo requerido'),
    cuil: Yup.string()
      .matches(/^[0-9]+$/, 'CUIL inválido. Solo se permiten números.')
      .matches(/^\d{11}$/, 'CUIL inválido. Debe tener 11 dígitos.')
      .required('Campo requerido'),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (values: Empresa) => {
    try {
      const token = await getAccessTokenSilently();
      const formData = new FormData();
      formData.append('nombre', values.nombre);
      formData.append('razonSocial', values.razonSocial);
      formData.append('cuil', values.cuil.toString());
      if (selectedFile) {
        formData.append('imagen', selectedFile);
      } else if (initialValues.url_imagen) {
                  //@ts-ignore

        formData.append('imagenUrl', initialValues.url_imagen);
      }

      if (isEditMode) {
        await empresaService.putEmpresa(`${URL}/empresa`, values.id, formData, token);
      } else {
        await empresaService.postEmpresa(`${URL}/empresa`, formData, token);
      }
      await getEmpresas();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      throw error;
    }
  };

  // Resetea los valores iniciales cuando no está en modo de edición
  useEffect(() => {
    if (!isEditMode) {
      setSelectedFile(null);
    }
  }, [isEditMode]);

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Empresa' : 'Añadir Empresa'}
      initialValues={isEditMode ? initialValues : {
        id: 0,
        eliminado: false,
        nombre: "",
        razonSocial: "",
        cuil: "",
        url_imagen: "",
        sucursales: []
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" />
      <TextFieldValue label="Razón Social" name="razonSocial" type="text" placeholder="Razón Social" />
      <TextFieldValue label="CUIL" name="cuil" type="number" placeholder="Ejemplo: 12345678901" />
      
      {/* Campo para seleccionar la imagen */}
      <div>
        <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Imagen</label>
        <TextField
          variant="outlined"
          type="file"
          onChange={handleFileChange}
        />
        {isEditMode && initialValues.url_imagen && (
          <img
          //@ts-ignore
            src={initialValues.url_imagen}
            alt="Imagen de la empresa"
            style={{ width: '75px', height: '75px', objectFit: 'cover', marginTop: '10px' }}
          />
        )}
      </div>
      <Button variant="contained" color="primary" type="submit">
        {isEditMode ? 'Actualizar' : 'Crear'}
      </Button>
    </GenericModal>
  );
};

export default ModalEmpresa;