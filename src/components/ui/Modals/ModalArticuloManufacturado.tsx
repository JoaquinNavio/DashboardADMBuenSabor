import React from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService'; 
import ArticuloManufacturado from '../../../types/IArticuloManufacturado'; 

// Define las props del componente de modal de articuloManufacturado
interface ModalArticuloManufacturadoProps {
  modalName: string; // Nombre del modal
  initialValues: ArticuloManufacturado; // Valores iniciales del formulario
  isEditMode: boolean; // Indicador de modo de edición
  getArticuloManufacturados: () => Promise<void>; // Función para obtener articuloManufacturados
  articuloManufacturadoAEditar?: ArticuloManufacturado; // ArticuloManufacturado a editar
}

// Componente de modal de articuloManufacturado
const ModalArticuloManufacturado: React.FC<ModalArticuloManufacturadoProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getArticuloManufacturados,
  articuloManufacturadoAEditar,
}) => {

  const articuloManufacturadoService = new ArticuloManufacturadoService(); // Instancia del servicio de articuloManufacturado
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
  const handleSubmit = async (values: ArticuloManufacturado) => {
    try {
      if (isEditMode) {
        await articuloManufacturadoService.put(`${URL}/ArticuloManufacturado`, values.id, values); // Actualiza la articuloManufacturado si está en modo de edición
      } else {
        await articuloManufacturadoService.post(`${URL}/ArticuloManufacturado`, values); // Agrega una nueva articuloManufacturado si no está en modo de edición
      }
      getArticuloManufacturados(); // Actualiza la lista de articuloManufacturados
    } catch (error) {
      console.error('Error al enviar los datos:', error); // Manejo de errores
    }
  };

  // Si no está en modo de edición, se limpian los valores iniciales
  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado:false,

      denominacion:'',
        descripcion:'',
        tiempoEstimadoMinutos:0,
        precioVenta:0,
        preparacion:'',
        idUnidadMedida:0,
    };
  }

  // Renderiza el componente de modal genérico
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar ArticuloManufacturado' : 'Añadir ArticuloManufacturado'}
      initialValues={articuloManufacturadoAEditar || initialValues} // Usa la articuloManufacturado a editar si está disponible, de lo contrario, usa los valores iniciales
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

export default ModalArticuloManufacturado; // Exporta el componente ModalArticuloManufacturado
