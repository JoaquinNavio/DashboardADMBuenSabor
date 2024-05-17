import React from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import CategoriaService from '../../../services/CategoriaService'; 
import Categoria from '../../../types/ICategoria'; 

// Define las props del componente de modal de categoria
interface ModalCategoriaProps {
  modalName: string; // Nombre del modal
  initialValues: Categoria; // Valores iniciales del formulario
  isEditMode: boolean; // Indicador de modo de edición
  getCategorias: Function; // Función para obtener categorias
  categoriaAEditar?: Categoria; // Categoria a editar
}

// Componente de modal de categoria
const ModalCategoria: React.FC<ModalCategoriaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getCategorias,
  categoriaAEditar,
}) => {

  const categoriaService = new CategoriaService(); // Instancia del servicio de categoria
  const URL = import.meta.env.VITE_API_URL; // URL de la API

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    /*nombre: Yup.string().required('Campo requerido'), // Campo nombre requerido
    razonSocial: Yup.string().required('Campo requerido'), // Campo razón social requerido
    cuil: Yup.string()
      .matches(/^[0-9]+$/, 'CUIL inválido. Solo se permiten números.') // CUIL solo números
      .matches(/^\d{11}$/, 'CUIL inválido. Debe tener 11 dígitos.') // CUIL debe tener 11 dígitos
      .required('Campo requerido'), // Campo CUIL requerido*/
  });



  // Función para manejar el envío del formulario
  const handleSubmit = async (values: Categoria) => {
    try {
      if (isEditMode) {
        await categoriaService.put(`${URL}/categoria`, values.id, values); // Actualiza la categoria si está en modo de edición
      } else {
        await categoriaService.post(`${URL}/categoria`, values); // Agrega una nueva categoria si no está en modo de edición
      }
      getCategorias(); // Actualiza la lista de categorias
    } catch (error) {
      console.error('Error al enviar los datos:', error); // Manejo de errores
    }
  };

  // Si no está en modo de edición, se limpian los valores iniciales
  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado:false,

      denominacion: '',
      es_insumo: false,
    };
  }

  // Renderiza el componente de modal genérico
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Categoria' : 'Añadir Categoria'}
      initialValues={categoriaAEditar || initialValues} // Usa la categoria a editar si está disponible, de lo contrario, usa los valores iniciales
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      {/* Campos del formulario */}
      <TextFieldValue label="Denominaciòn" name="denominacion" type="text" placeholder="Denominacion" />
      <TextFieldValue label="Insumo" name="es_insumo" type="text" placeholder="Es insumo?" />
    </GenericModal>
  );
};

export default ModalCategoria; // Exporta el componente ModalCategoria
