// components/ui/Modals/ModalEmpleado.tsx
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toggleModal } from '../../../redux/slices/ModalReducer';
import GenericModal from './GenericModal';
import * as Yup from 'yup';
import { Formik, Field, FieldArray, FormikProps, Form } from 'formik';
import { Button, Col, Row, Card } from 'react-bootstrap';
import ILocalidad from '../../../types/ILocalidad';
import { TextField } from '@mui/material';
//import { Add } from '@mui/icons-material';
import './modal.css';
import IEmpleado from '../../../types/Empleado';
import LocalidadService from '../../../services/LocalidadService';
import ProvinciaService from '../../../services/ProvinciaService';
import PaisService from '../../../services/PaisService';
import { useAuth0 } from '@auth0/auth0-react';
import IPais from '../../../types/IPais';
import IProvincia from '../../../types/IProvincia';
import SelectList from '../SelectList/SelectList';


const ModalEmpleado: React.FC<{ initialValues: IEmpleado, isEditMode: boolean, onSubmit: (values: IEmpleado) => Promise<void> }> = ({ initialValues, isEditMode, onSubmit }) => {
  const dispatch = useDispatch();
  const showModal = useSelector((state: RootState) => state.modal.modalEmpleado);
 // const localidades = useSelector((state: RootState) => state.localidad.data);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageInputs, setImageInputs] = useState<number[]>([]);


  const { getAccessTokenSilently } = useAuth0();
  const URL = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    };

    fetchToken();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (showModal) {
      setSelectedFiles([]);
      setImageInputs([]);
    }
  }, [showModal]);

  const validationSchema = Yup.object({
    nombre: Yup.string().required('Nombre es requerido'),
    apellido: Yup.string().required('Apellido es requerido'),
    telefono: Yup.string().required('Teléfono es requerido'),
    email: Yup.string().email('Email no válido').required('Email es requerido'),
    tipoEmpleado: Yup.string().required('Tipo de empleado es requerido'),
    domicilios: Yup.array().of(Yup.object({
      calle: Yup.string().required('Calle es requerida'),
      numero: Yup.number().required('Número es requerido'),
      cp: Yup.number().required('CP es requerido'),
      piso: Yup.number().nullable(),
      nroDpto: Yup.number().nullable(),
      localidad: Yup.object().shape({
        id: Yup.number().required('Localidad es requerida')
      }).required('Localidad es requerida')
    })).required('Al menos un domicilio es requerido')
  });

  const handleClose = () => {
    dispatch(toggleModal({ modalName: 'modalEmpleado' }));
  };

  const handleSubmit = async (values: IEmpleado) => {
    try {
      // Aquí debes agregar la lógica para manejar la subida de imágenes
      const formData = new FormData();
      formData.append('nombre', values.nombre);
      formData.append('apellido', values.apellido);
      formData.append('telefono', values.telefono);
      formData.append('email', values.email);
      formData.append('tipoEmpleado', values.tipoEmpleado);
      formData.append('sucursal', values.sucursal);

      selectedFiles.forEach((file) => {
        formData.append('imagenes', file);
      });

      values.domicilios.forEach((domicilio, index) => {
        formData.append(`domicilios[${index}].calle`, domicilio.calle);
        formData.append(`domicilios[${index}].numero`, String(domicilio.numero));
        formData.append(`domicilios[${index}].cp`, String(domicilio.cp));
        formData.append(`domicilios[${index}].piso`, String(domicilio.piso));
        formData.append(`domicilios[${index}].nroDpto`, String(domicilio.nroDpto));
        formData.append(`domicilios[${index}].localidad.id`, String(domicilio.localidad.id));
      });

      await onSubmit(values);
      handleClose();
    } catch (error) {
      // Aquí puedes añadir una notificación de error, si es necesario
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => {
        const updatedFiles = [...prev];
        updatedFiles[index] = newFiles[0];
        return updatedFiles;
      });
    }
  };

  const addNewImageInput = () => {
    setImageInputs([...imageInputs, imageInputs.length]);
  };

  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

  const [selectedPaisId, setSelectedPaisId] = useState<number | undefined>(undefined);
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | undefined>(undefined);
  const [selectedLocalidadId, setSelectedLocalidadId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchPaises = async () => {
      if (token) {
        try {
          const paisService = new PaisService();
          const paises = await paisService.getAll(`${URL}/pais`, token);
          setPaises(paises);
        } catch (error) {
          console.error('Error al obtener los países:', error);
        }
      }
    };

    fetchPaises();
  }, [token, URL]);

  useEffect(() => {
    const fetchProvincias = async () => {
      if (token && selectedPaisId) {
        try {
          const provinciaService = new ProvinciaService();
          const provincias = await provinciaService.getByPais(`${URL}/provincia/findByPais`, selectedPaisId, token);
          setProvincias(provincias);
        } catch (error) {
          console.error('Error al obtener las provincias:', error);
        }
      }
    };

    fetchProvincias();
  }, [selectedPaisId, token, URL]);

  useEffect(() => {
    const fetchLocalidades = async () => {
      if (token && selectedProvinciaId) {
        try {
          const localidadService = new LocalidadService();
          const localidades = await localidadService.getByProvincia(`${URL}/localidad/findByProvincia`, selectedProvinciaId, token);
          setLocalidades(localidades);
        } catch (error) {
          console.error('Error al obtener las localidades:', error);
        }
      }
    };

    fetchLocalidades();
  }, [selectedProvinciaId, token, URL]);

  const handlePaisChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const paisIdSelected = parseInt(event.target.value);
    setSelectedPaisId(paisIdSelected);
    setSelectedProvinciaId(undefined);
    setSelectedLocalidadId(undefined);
    setProvincias([]);
    setLocalidades([]);
  };

  const handleProvinciaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const provinciaIdSelected = parseInt(event.target.value);
    setSelectedProvinciaId(provinciaIdSelected);
    setSelectedLocalidadId(undefined);
    setLocalidades([]);
  };

  const handleLocalidadChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const localidadIdSelected = parseInt(event.target.value);
    setSelectedLocalidadId(localidadIdSelected);
  };

  return (
    <GenericModal
      modalName="modalEmpleado"
      title={isEditMode ? "Editar Empleado" : "Agregar Empleado"}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps: FormikProps<IEmpleado>) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <Row className="mb-3">
              <Col>
                <label htmlFor="nombre">Nombre</label>
                <Field name="nombre" placeholder="Nombre" className="form-control" />
              </Col>
              <Col>
                <label htmlFor="apellido">Apellido</label>
                <Field name="apellido" placeholder="Apellido" className="form-control" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="telefono">Teléfono</label>
                <Field name="telefono" placeholder="Teléfono" className="form-control" />
              </Col>
              <Col>
                <label htmlFor="email">Email</label>
                <Field name="email" placeholder="Email" type="email" className="form-control" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="tipoEmpleado">Tipo de Empleado</label>
                <Field as="select" name="tipoEmpleado" className="form-control">
                  <option value="Cocinero">Cocinero</option>
                  <option value="Admin">Admin</option>
                  <option value="Visor">Visor</option>
                </Field>
              </Col>
            </Row>
            <FieldArray name="domicilios">
              {({ remove, push }) => (
                <>
                  {formikProps.values.domicilios.map((domicilio, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <Card.Title>Domicilio {index + 1}</Card.Title>
                        <Row className="mb-3">
                          <Col>
                            <label htmlFor={`domicilios[${index}].calle`}>Calle</label>
                            <Field name={`domicilios[${index}].calle`} placeholder="Calle" className="form-control" />
                          </Col>
                          <Col>
                            <label htmlFor={`domicilios[${index}].numero`}>Número</label>
                            <Field name={`domicilios[${index}].numero`} placeholder="Número" className="form-control" />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col>
                            <label htmlFor={`domicilios[${index}].cp`}>CP</label>
                            <Field name={`domicilios[${index}].cp`} placeholder="CP" className="form-control" />
                          </Col>
                          <Col>
                            <label htmlFor={`domicilios[${index}].piso`}>Piso</label>
                            <Field name={`domicilios[${index}].piso`} placeholder="Piso" className="form-control" />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col>
                            <label htmlFor={`domicilios[${index}].nroDpto`}>Nro Dpto</label>
                            <Field name={`domicilios[${index}].nroDpto`} placeholder="Nro Dpto" className="form-control" />
                          </Col>
                          <Col>
                          <SelectList
                          title="País"
                          items={paises.reduce((mapa, pais) => {
                            mapa.set(pais.id, pais.nombre);
                            return mapa;
                          }, new Map<number, string>())}
                          handleChange={handlePaisChange}
                          selectedValue={selectedPaisId}
                        />
                          </Col>
                        </Row>
                        <Row>
                          {selectedPaisId && (
                            <div style={{ flex: 1 }}>
                              <SelectList
                                title="Provincia"
                                items={provincias.reduce((mapa, provincia) => {
                                  mapa.set(provincia.id, provincia.nombre);
                                  return mapa;
                                }, new Map<number, string>())}
                                handleChange={handleProvinciaChange}
                                selectedValue={selectedProvinciaId}
                              />
                            </div>
                          )}
                          {selectedProvinciaId && (
                            <div style={{ flex: 1 }}>
                              <SelectList
                                title="Localidad"
                                items={localidades.reduce((mapa, localidad) => {
                                  mapa.set(localidad.id, localidad.nombre);
                                  return mapa;
                                }, new Map<number, string>())}
                                handleChange={handleLocalidadChange}
                                selectedValue={selectedLocalidadId}
                              />
                            </div>
                          )}
                        </Row>
                        <Button variant="danger" type="button" onClick={() => remove(index)}>Eliminar Domicilio</Button>
                      </Card.Body>
                    </Card>
                  ))}
                  <Button variant="primary" type="button" onClick={() => push({ calle: '', numero: 0, cp: 0, piso: 0, nroDpto: 0, localidad: { id: 0, nombre: '', provincia: { id: 0, nombre: '', pais: { id: 0, nombre: '' } } } })}>
                    Añadir Domicilio
                  </Button>
                </>
              )}
            </FieldArray>
            <Row className="mb-3">
              <Col>
                <label style={{ fontWeight: 'bold', fontSize: '18px' }}></label>
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
                  {imageInputs.map((input, index) => (
                    <div key={index} className="mb-3">
                      <TextField
                        id={`outlined-basic-${index}`}
                        variant="outlined"
                        type="file"
                        onChange={(event) => handleFileChange(event, index)}
                        inputProps={{
                          multiple: false,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Button variant="primary" type="button" onClick={addNewImageInput}>Añadir Nueva Imagen</Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </GenericModal>
  );
};

export default ModalEmpleado;
