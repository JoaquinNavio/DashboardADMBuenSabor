import React, { useState, useEffect, ChangeEvent } from 'react';
import * as Yup from 'yup';
import GenericModal from '../../ui/Modals/GenericModal';
import TextFieldValue from '../../ui/TextFieldValue/TextFieldValue';
import SucursalService from '../../../services/SucursalService';
import SucursalPost from '../../../types/post/SucursalPost';
import ISucursal from '../../../types/ISucursal';
import LocalidadService from '../../../services/LocalidadService';
import SelectList from '../SelectList/SelectList';
import ILocalidad from '../../../types/ILocalidad';
import IProvincia from '../../../types/IProvincia';
import IPais from '../../../types/IPais';
import ProvinciaService from '../../../services/ProvinciaService';
import PaisService from '../../../services/PaisService';
import { useAuth0 } from "@auth0/auth0-react";

interface ModalSucursalProps {
  modalName: string;
  initialValues: SucursalPost | ISucursal;
  isEditMode: boolean;
  getSucursales: () => Promise<void>;
  sucursalAEditar?: SucursalPost | ISucursal;
  idEmpresa: number;
  casaMatrizDisabled: boolean;
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getSucursales,
  sucursalAEditar,
  idEmpresa,
  casaMatrizDisabled,
}) => {
  const sucursalService = new SucursalService();
  const { getAccessTokenSilently } = useAuth0();
  const URL = import.meta.env.VITE_API_URL;

  const [token, setToken] = useState<string | null>(null);

  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

  const [selectedPaisId, setSelectedPaisId] = useState<number | undefined>(undefined);
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | undefined>(undefined);
  const [selectedLocalidadId, setSelectedLocalidadId] = useState<number | undefined>(undefined);

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

  if (!isEditMode) {
    initialValues = {
      nombre: '',
      horarioApertura: '',
      horarioCierre: '',
      domicilio: {
        calle: '',
        numero: 0,
        cp: 0,
        piso: 0,
        nroDpto: 0,
        idLocalidad: 0
      },
      idEmpresa: idEmpresa,
      esCasaMatriz: false,
    };
  }

  const handleSubmit = async (values: SucursalPost | ISucursal) => {
    try {
      if (!token) {
        throw new Error("Token no disponible");
      }

      const domicilio = {
        calle: values.domicilio.calle,
        numero: values.domicilio.numero,
        cp: values.domicilio.cp,
        piso: values.domicilio.piso,
        nroDpto: values.domicilio.nroDpto,
        idLocalidad: selectedLocalidadId || 0,
      };

      let sucursalData: SucursalPost | ISucursal;

      if (isEditMode) {
        const { id, ...rest } = values as ISucursal;
        sucursalData = {
          ...rest,
          domicilio: domicilio,
          esCasaMatriz: casaMatrizDisabled,
          idEmpresa: idEmpresa,
        };
        await sucursalService.put(`${URL}/sucursal`, id, sucursalData, token);
      } else {
        sucursalData = {
          ...values,
          domicilio: domicilio,
          esCasaMatriz: casaMatrizDisabled,
          idEmpresa: idEmpresa,
        };
        await sucursalService.post(`${URL}/sucursal`, sucursalData, token);
      }

      getSucursales();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Sucursal' : `Añadir Sucursal`}
      initialValues={sucursalAEditar || initialValues}
      validationSchema={Yup.object().shape({
        nombre: Yup.string().required('Campo requerido'),
        horarioCierre: Yup.string().required('Campo requerido'),
        horarioApertura: Yup.string().required('Campo requerido'),
      })}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Horario de Apertura" name="horarioApertura" type="time" placeholder="Horario de apertura" />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Horario de Cierre" name="horarioCierre" type="time" placeholder="Horario de cierre" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Calle" name="domicilio.calle" type="text" placeholder="Calle" />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Número" name="domicilio.numero" type="number" placeholder="Número" />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Código Postal" name="domicilio.cp" type="number" placeholder="Código Postal" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Piso" name="domicilio.piso" type="number" placeholder="Piso" />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Número de Departamento" name="domicilio.nroDpto" type="number" placeholder="Número de Departamento" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
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
        </div>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Es casa matriz?</h3>
          <input
            type="checkbox"
            checked={casaMatrizDisabled}
            disabled={casaMatrizDisabled}
            style={{ marginLeft: 10 }}
          />
        </label>
      </div>
    </GenericModal>
  );
};

export default ModalSucursal;
