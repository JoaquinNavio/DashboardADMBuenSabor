import React from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import Empresa from '../../../types/IEmpresa'; 
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import IUnidadMedida from '../../../types/IUnidadMedida';

// Define las props del componente de modal de empresa
interface ModalUnidadMedidaProps {
  modalName: string; // Nombre del modal
  initialValues: Empresa; // Valores iniciales del formulario
  isEditMode: boolean; // Indicador de modo de edición
  getUnidades: Function; // Función para obtener empresas
  UnidadAEditar?: Empresa; // Empresa a editar
}

// Componente de modal de empresa
const ModalUnidadMedida: React.FC<ModalUnidadMedidaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getUnidades,
  UnidadAEditar,
}) => {

  const unidadMedidaService = new UnidadMedidaService(); // Instancia del servicio de empresa
  const URL = import.meta.env.VITE_API_URL; // URL de la API

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'), // Campo nombre requerido
  });



  // Función para manejar el envío del formulario
  const handleSubmit = async (values: IUnidadMedida) => {
    try {
      if (isEditMode) {
        await unidadMedidaService.put(`${URL}/UnidadMedida`, values.id, values); // Actualiza la empresa si está en modo de edición
      } else {
        await unidadMedidaService.post(`${URL}/UnidadMedida`, values); // Agrega una nueva empresa si no está en modo de edición
      }
      getUnidades(); // Actualiza la lista de empresas
    } catch (error) {
      console.error('Error al enviar los datos:', error); // Manejo de errores
    }
  };

  // Si no está en modo de edición, se limpian los valores iniciales
  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado:false,
      nombre: '',
      razonSocial: '',
      cuil: 0,
      sucursales: [],
    };
  }

  // Renderiza el componente de modal genérico
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Empresa' : 'Añadir Empresa'}
      initialValues={UnidadAEditar || initialValues} // Usa la empresa a editar si está disponible, de lo contrario, usa los valores iniciales
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      {/* Campos del formulario */}
      <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" />
      <TextFieldValue label="Razón Social" name="razonSocial" type="text" placeholder="Razón Social" />
      <TextFieldValue label="CUIL" name="cuil" type="number" placeholder="Ejemplo: 12345678901" />
    </GenericModal>
  );
};

export default ModalUnidadMedida; // Exporta el componente ModalEmpresa
