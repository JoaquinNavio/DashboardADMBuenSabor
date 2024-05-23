import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toggleModal } from '../../../redux/slices/ModalReducer';
import Swal from 'sweetalert2';
import './modal.css'

interface ModalProps {
  modalName: string;
  title: string;
  initialValues: any;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: any) => void;
  onClose?: () => void;
  children?: React.ReactNode;
  isEditMode: boolean;
}

const GenericModal: React.FC<ModalProps> = ({ modalName, title, initialValues, validationSchema, onSubmit, children, isEditMode, onClose }) => {
  const dispatch = useDispatch();
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  const handleClose = () => {
    if (onClose) onClose();
    dispatch(toggleModal({ modalName }));
  };

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: isEditMode ? 'Cambios guardados exitosamente' : 'Datos añadidos exitosamente',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.',
      });
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} dialogClassName='custom-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<any>) => {
            return (
              <Form onSubmit={formikProps.handleSubmit}>
                {children}
                <Modal.Footer>
                  <Button variant="outline-secondary" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <Button variant="outline-success" type="submit">
                    {isEditMode ? "Guardar Cambios" : "Añadir"}
                  </Button>
                </Modal.Footer>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default GenericModal;
