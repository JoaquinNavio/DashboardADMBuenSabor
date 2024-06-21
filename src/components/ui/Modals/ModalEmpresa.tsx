import React, { ChangeEvent, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import EmpresaService from '../../../services/EmpresaService'; 
import Empresa from '../../../types/IEmpresa'; 
import { useAuth0 } from "@auth0/auth0-react";
import { TextField } from '@mui/material';

interface ModalEmpresaProps {
  modalName: string;
  initialValues: Empresa;
  isEditMode: boolean;
  getEmpresas: () => Promise<void>;
  empresaAEditar?: Empresa;
}

const ModalEmpresa: React.FC<ModalEmpresaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getEmpresas,
  empresaAEditar,
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
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
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
      }

      
      if (isEditMode) {
        await empresaService.put(`${URL}/empresa`, values.id, formData, token);
      } else {
        await empresaService.post(`${URL}/empresa`, formData, token);
      }
      await getEmpresas();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      throw error;
    }
  };

  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado: false,
      nombre: '',
      razonSocial: '',
      cuil: 0,
      sucursales: [],
      
    };
  }

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Empresa' : 'Añadir Empresa'}
      initialValues={empresaAEditar || initialValues}
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
      </div>
    </GenericModal>
  );
};

export default ModalEmpresa;
