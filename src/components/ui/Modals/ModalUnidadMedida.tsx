import React from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import IUnidadMedida from '../../../types/IUnidadMedida';
import { useAuth0 } from "@auth0/auth0-react";

interface ModalUnidadMedidaProps {
  modalName: string;
  initialValues: IUnidadMedida;
  isEditMode: boolean;
  getUnidades: () => Promise<void>;
  UnidadAEditar?: IUnidadMedida;
}

const ModalUnidadMedida: React.FC<ModalUnidadMedidaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getUnidades,
  UnidadAEditar,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const unidadMedidaService = new UnidadMedidaService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    denominacion: Yup.string().required('Campo requerido'),
  });

  const handleSubmit = async (values: IUnidadMedida) => {
    try {
      const token = await getAccessTokenSilently();

      if (isEditMode) {
        await unidadMedidaService.put(`${URL}/UnidadMedida`, values.id, values, token);
      } else {
        await unidadMedidaService.post(`${URL}/UnidadMedida`, values, token);
      }
      getUnidades();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado: false,
      denominacion: '',
    };
  }

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Unidad Medida' : 'Añadir Unidad Medida'}
      initialValues={UnidadAEditar || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Ingrese denominación" />
    </GenericModal>
  );
};

export default ModalUnidadMedida;
