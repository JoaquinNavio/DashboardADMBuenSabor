import React, { useState, ChangeEvent, useEffect } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import EmpleadoService from '../../../services/EmpleadoService';
import IEmpleado from '../../../types/Empleado';
import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import SelectList from '../SelectList/SelectList';
import IPais from '../../../types/IPais';
import IProvincia from '../../../types/IProvincia';
import ILocalidad from '../../../types/ILocalidad';
import PaisService from '../../../services/PaisService';
import ProvinciaService from '../../../services/ProvinciaService';
import LocalidadService from '../../../services/LocalidadService';
import { TextField, Button } from '@mui/material';
import SelectFieldValue from '../SelectFieldValue/SelectFieldValue';
import { FieldArray } from 'formik';
import { Card } from 'react-bootstrap';

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

  const paisService = new PaisService();
  const provinciaService = new ProvinciaService();
  const localidadService = new LocalidadService();

  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [selectedPaisId, setSelectedPaisId] = useState<number | undefined>(undefined);
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | undefined>(undefined);
  const [selectedLocalidadId, setSelectedLocalidadId] = useState<number | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const token = await getAccessTokenSilently();
        const paises = await paisService.getAll(`${URL}/pais`, token);
        setPaises(paises);
      } catch (error) {
        console.error('Error al obtener los países:', error);
      }
    };
    fetchPaises();
  }, [modalName]);

  useEffect(() => {
    if (isEditMode && initialValues.domicilios.length > 0) {
      const domicilio = initialValues.domicilios[0];
      setSelectedPaisId(domicilio.localidad.provincia.pais.id);
      setSelectedProvinciaId(domicilio.localidad.provincia.id);
      setSelectedLocalidadId(domicilio.localidad.id);
    }
  }, [isEditMode, initialValues]);

  useEffect(() => {
    const fetchProvincias = async () => {
      if (selectedPaisId) {
        try {
          const token = await getAccessTokenSilently();
          const provincias = await provinciaService.getByPais(`${URL}/provincia/findByPais`, selectedPaisId, token);
          setProvincias(provincias);
        } catch (error) {
          console.error('Error al obtener las provincias:', error);
        }
      }
    };
    fetchProvincias();
  }, [selectedPaisId]);

  useEffect(() => {
    const fetchLocalidades = async () => {
      if (selectedProvinciaId) {
        try {
          const token = await getAccessTokenSilently();
          const localidades = await localidadService.getByProvincia(`${URL}/localidad/findByProvincia`, selectedProvinciaId, token);
          setLocalidades(localidades);
        } catch (error) {
          console.error('Error al obtener las localidades:', error);
        }
      }
    };
    fetchLocalidades();
  }, [selectedProvinciaId]);

  const handlePaisChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const paisId = parseInt(event.target.value);
    setSelectedPaisId(paisId);
    setSelectedProvinciaId(undefined);
    setSelectedLocalidadId(undefined);
  };

  const handleProvinciaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const provinciaId = parseInt(event.target.value);
    setSelectedProvinciaId(provinciaId);
    setSelectedLocalidadId(undefined);
  };

  const handleLocalidadChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const localidadId = parseInt(event.target.value);
    setSelectedLocalidadId(localidadId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      formData.append('tipoEmpleado', values.tipoEmpleado);
      formData.append('sucursal_id', sucursalId || '0');
  
      if (selectedFile) {
        formData.append('imagen', selectedFile);
      } else if (initialValues.imagen?.url) {
        formData.append('imagenUrl', initialValues.imagen.url);
      }
  
      values.domicilios.forEach((domicilio, index) => {
        formData.append(`domicilios[${index}].calle`, domicilio.calle);
        formData.append(`domicilios[${index}].numero`, String(domicilio.numero));
        formData.append(`domicilios[${index}].cp`, String(domicilio.cp));
        formData.append(`domicilios[${index}].piso`, String(domicilio.piso || ''));
        formData.append(`domicilios[${index}].nroDpto`, String(domicilio.nroDpto || ''));
        formData.append(`domicilios[${index}].idLocalidad`, String(selectedLocalidadId || domicilio.localidad.id));
      });
  
      // Log para mostrar los datos que se están enviando
      console.log('Datos del formulario:', values);
      console.log('Contenido de FormData:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
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
    setSelectedPaisId(undefined);
    setSelectedProvinciaId(undefined);
    setSelectedLocalidadId(undefined);
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

      <FieldArray name="domicilios">
        {({ remove, push }) => (
          <>
            {initialValues.domicilios.map((domicilio, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Card.Title>Domicilio {index + 1}</Card.Title>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
                    <div>
                      <TextFieldValue label="Calle" name={`domicilios[${index}].calle`} type="text" placeholder="Calle" />
                    </div>
                    <div>
                      <TextFieldValue label="Número" name={`domicilios[${index}].numero`} type="number" placeholder="Número" />
                    </div>
                    <div>
                      <TextFieldValue label="CP" name={`domicilios[${index}].cp`} type="number" placeholder="Código Postal" />
                    </div>
                    <div>
                      <TextFieldValue label="Piso" name={`domicilios[${index}].piso`} type="number" placeholder="Piso" />
                    </div>
                    <div>
                      <TextFieldValue label="Nro Dpto" name={`domicilios[${index}].nroDpto`} type="number" placeholder="Nro Dpto" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <SelectList
                        title="País"
                        items={paises.reduce((mapa, pais) => {
                          mapa.set(pais.id, pais.nombre);
                          return mapa;
                        }, new Map<number, string>())}
                        handleChange={handlePaisChange}
                        selectedValue={selectedPaisId}
                      />
                    </div>
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
                  </div>
                  <Button variant="danger" type="button" onClick={() => remove(index)}>Eliminar Domicilio</Button>
                </Card.Body>
              </Card>
            ))}
            <Button variant="primary" type="button" onClick={() => push({
              calle: '',
              numero: 0,
              cp: 0,
              piso: 0,
              nroDpto: 0,
              localidad: {
                id: 0,
                nombre: '',
                provincia: {
                  id: 0,
                  nombre: '',
                  pais: {
                    id: 0,
                    nombre: ''
                  }
                }
              }
            })}>
              Añadir Domicilio
            </Button>
          </>
        )}
      </FieldArray>

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
      <Button variant="contained" color="primary" type="submit">
        {isEditMode ? 'Actualizar' : 'Crear'}
      </Button>
    </GenericModal>
  );
};

export default ModalEmpleado;
