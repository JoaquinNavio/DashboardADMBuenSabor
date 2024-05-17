import React, { useState, useEffect, ChangeEvent } from 'react';
import * as Yup from 'yup';
import GenericModal from '../../ui/Modals/GenericModal';
import TextFieldValue from '../../ui/TextFieldValue/TextFieldValue';
import SucursalService from '../../../services/SucursalService';
import Sucursal from '../../../types/ISucursal';
import LocalidadService from '../../../services/LocalidadService';
import SelectList from '../SelectList/SelectList';
import ILocalidad from '../../../types/ILocalidad';
import SucursalPost from '../../../types/post/SucursalPost';
import ISucursal from '../../../types/ISucursal';
import EmpresaService from '../../../services/EmpresaService';
import IEmpresa from '../../../types/IEmpresa';

interface ModalSucursalProps {
  modalName: string;
  initialValues: SucursalPost | ISucursal;
  isEditMode: boolean;
  getSucursales: () => Promise<void>;
  sucursalAEditar?: Sucursal;
  idEmpresa: number;
  casaMatrizDisabled: boolean; // Nuevo prop para deshabilitar el checkbox de casa matriz
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getSucursales,
  sucursalAEditar,
  idEmpresa,
  casaMatrizDisabled, // Nuevo prop para deshabilitar el checkbox de casa matriz
}) => {
  
  const sucursalService = new SucursalService();
  const URL: string = import.meta.env.VITE_API_URL as string;
  const localidadService = new LocalidadService();
  const empresaService = new EmpresaService();

  const [empresa, setEmpresa] = useState<IEmpresa>()

  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);


  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');
  
  const [casaMatriz, setCasaMatriz] = useState<boolean>(false); // Estado para casa matriz

  const [localidadNombre, setLocalidadNombre] = useState<string>('');
  const [tooltipMessage, setTooltipMessage] = useState<string>(''); // Mensaje para el tooltip

  const fetchEmpresa = async () => {
    try {
      const empre = await empresaService.get(`${URL}/empresa`, idEmpresa);
      setEmpresa(empre);
    } catch (error) {
      console.error('Error al obtener la empresa:', error);
    }
  };

    const fetchLocalidades = async () => {
      try {

          const localidades = await localidadService.getAll(`${URL}/localidad`);
          setLocalidades(localidades);
          console.log(localidades);
        
      } catch (error) {
        console.error('Error al obtener las localidades:', error);
      }
    };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'),
    horarioCierre: Yup.string().required('Campo requerido'),
    horarioApertura: Yup.string().required('Campo requerido'),
    //agregar calle, cp, numero, pais, provincia y localidad 
  });


  useEffect(() => {
    console.log("ME EJECUTO");
    fetchEmpresa();
    fetchLocalidades();
  }, [URL,idEmpresa]);


  // Función para manejar el cambio de localidad
  const handleLocalidadChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const localidadNombre = event.target.value;
    // Buscar la localidad por su nombre en el array de localidades
    const localidadSeleccionada = localidades.find(localidad => localidad.nombre === localidadNombre);
    if (localidadSeleccionada) {
      // Asignar el ID de la localidad seleccionada
      setSelectedLocalidad(localidadSeleccionada.id.toString());
      setLocalidadNombre(localidadSeleccionada.nombre); // Actualizar el nombre de la localidad seleccionada
    }
  };

  // Función para manejar el cambio del checkbox de Casa Matriz
  const handleCasaMatrizChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCasaMatriz(event.target.checked);
  };

  // Mensaje para mostrar en el tooltip cuando se pase el mouse sobre el checkbox deshabilitado
  useEffect(() => {
    if (casaMatrizDisabled) {
      setTooltipMessage('Ya hay una sucursal que es casa matriz');
    } else {
      setTooltipMessage('');
    }
  }, [casaMatrizDisabled]);

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
      esCasaMatriz: false, // Agregar casa matriz con valor predeterminado
    };
  }

  const handleSubmit = async (values: SucursalPost | Sucursal) => {
    try {
      // Crear el objeto de domicilio
      const domicilio = {
        calle: values.domicilio.calle,
        numero: values.domicilio.numero,
        cp: values.domicilio.cp,
        piso: values.domicilio.piso,
        nroDpto: values.domicilio.nroDpto,
        idLocalidad: parseInt(selectedLocalidad), // Convertir a número entero
      };

      let sucursalData: SucursalPost | Sucursal;

      if (isEditMode) {
        // Si estamos en modo de edición, es un objeto Sucursal, así que eliminamos el id del objeto
        const { id, ...rest } = values as Sucursal;
        sucursalData = {
          ...rest,
          domicilio: domicilio,
          esCasaMatriz: casaMatriz,
          idEmpresa: idEmpresa,
        };
        console.log('Data a enviar en modo edición:', sucursalData);
        await sucursalService.put(`${URL}/sucursal`, id, sucursalData);
      } else {
        // Si no estamos en modo de edición, es un objeto SucursalPost y agregamos el id de la empresa
        sucursalData = {
          ...values,
          domicilio: domicilio,
          esCasaMatriz: casaMatriz,
          idEmpresa: idEmpresa,
        };
        console.log('Data a enviar en modo creación:', sucursalData);
        await sucursalService.post(`${URL}/sucursal`, sucursalData);
        window.location.reload(); // Recargar la página después de eliminar la sucursal
      }

      getSucursales();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };






  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Sucursal' :  `Añadir Sucursal a ${empresa?.nombre}`}
      initialValues={sucursalAEditar || initialValues}
      validationSchema={validationSchema}
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
            <TextFieldValue label="Calle" name="domicilio.calle" type="text" placeholder="Calle" disabled={isEditMode} />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Número" name="domicilio.numero" type="number" placeholder="Número" disabled={isEditMode} />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Código Postal" name="domicilio.cp" type="number" placeholder="Código Postal" disabled={isEditMode} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Piso" name="domicilio.piso" type="number" placeholder="Piso" disabled={isEditMode} />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Número de Departamento" name="domicilio.nroDpto" type="number" placeholder="Número de Departamento" disabled={isEditMode} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
            <SelectList
              title="Localidades"
              items={localidades.map((localidad: ILocalidad) => localidad.nombre)}
              handleChange={handleLocalidadChange}
              //selectedValue={selectedLocalidad}
              selectedValue={localidadNombre}
              disabled={isEditMode}
            />
          </div>
        </div>
        {/* Checkbox para indicar si es la casa matriz */}
 
        <label style={{ display: 'flex', alignItems: 'center' }} title={tooltipMessage}>
        <h3 style={{ fontSize: '1.2rem' }}>Es casa matriz?</h3>
          <input
            type="checkbox"
            checked={casaMatriz}
            onChange={handleCasaMatrizChange}
            disabled={casaMatrizDisabled} // Deshabilitar el checkbox si es necesario
            style={{marginLeft:10}}
          />
        </label>
        {casaMatrizDisabled && tooltipMessage && (
          <div style={{ fontSize: '1.1rem', color: 'red' }}>
            {tooltipMessage}
          </div>
        )}
      </div>
    </GenericModal>
  );
};

export default ModalSucursal;

