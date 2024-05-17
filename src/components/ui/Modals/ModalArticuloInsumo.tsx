import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import ArticuloInsumoService from '../../../services/ArticuloInsumoService'; 
import ArticuloInsumo from '../../../types/IArticuloInsumo'; 
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import IUnidadMedida from '../../../types/IUnidadMedida';
import { useAppDispatch } from '../../../hooks/redux';
import { setUnidadMedida } from '../../../redux/slices/UnidadMedidaReducer';
import SelectList from '../SelectList/SelectList';
import ArticuloInsumoPost from '../../../types/post/ArticuloInsumoPost';
import SwitchValue from '../Switch/Switch';

// Define las props del componente de modal de articuloInsumo
interface ModalArticuloInsumoProps {
  modalName: string; // Nombre del modal
  initialValues: ArticuloInsumo; // Valores iniciales del formulario
  isEditMode: boolean; // Indicador de modo de edición
  getArticuloInsumos: () => Promise<void>; // Función para obtener articulosInsumos
  articuloInsumoAEditar?: ArticuloInsumo; // articuloInsumo a editar
}

// Componente de modal de articuloInsumo
const ModalArticuloInsumo: React.FC<ModalArticuloInsumoProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getArticuloInsumos,
  articuloInsumoAEditar,
}) => {

  const articuloInsumoService = new ArticuloInsumoService(); // Instancia del servicio de articuloInsumo
  const URL = import.meta.env.VITE_API_URL; // URL de la API

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    denominacion: Yup.string().required('Campo requerido'),
    precioVenta: Yup.number().required('Campo requerido'),
    precioCompra: Yup.number().required('Campo requerido'),
    stockActual: Yup.number().required('Campo requerido'),
    stockMaximo: Yup.number().required('Campo requerido')
  });

  const dispatch = useAppDispatch();
  const unidadMedidaService = new UnidadMedidaService();
  const [filteredData, setFilteredData] = useState<IUnidadMedida[]>([]);

  const fetchUnidadMedida = async () => {
    try {
      const unidades = await unidadMedidaService.getAll(URL + '/UnidadMedida');
      dispatch(setUnidadMedida(unidades));
      setFilteredData(unidades);
      console.log(unidades)
    } catch (error) {
      console.error("Error al obtener las unidades:", error);
    }
  };
  useEffect(() => {
    fetchUnidadMedida();
  }, []);

const [unidadMedidaDen, setUnidadMedidaDenominacion] = useState<string>('');
const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] = useState<number>(0);

const handleUnidadMedidaChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const unidadMedidaDenominacion = event.target.value;
  // Buscar la localidad por su nombre en el array de localidades
  const unidadMedidaSeleccionada = filteredData.find(unidadMedida => unidadMedida.denominacion === unidadMedidaDenominacion);
  if (unidadMedidaSeleccionada) {
    // Asignar el ID de la localidad seleccionada
    setSelectedUnidadMedidaId(unidadMedidaSeleccionada.id);
    setUnidadMedidaDenominacion(unidadMedidaSeleccionada.denominacion); // Actualizar el nombre de la localidad seleccionada
  }
};
  const [esParaElaborarValue, setEsParaElaborarValue] = useState<boolean>(false);

 const handleSwitchChange = (event:ChangeEvent) =>{
  setEsParaElaborarValue(event.target.checked);
 }
  // Función para manejar el envío del formulario
  const handleSubmit = async (values: ArticuloInsumo) => {
    try {
      const body: ArticuloInsumoPost = {
        denominacion: values.denominacion,
        precioVenta: values.precioVenta,
        idUnidadMedida: selectedUnidadMedidaId,
        precioCompra: values.precioCompra,
        stockActual:values.stockActual,
        stockMaximo:values.stockMaximo,
        esParaElaborar:esParaElaborarValue,
      }
      if (isEditMode) {
        await articuloInsumoService.put(`${URL}/ArticuloInsumo`, values.id, body); // Actualiza el articuloInsumo si está en modo de edición
      } else {
        await articuloInsumoService.post(`${URL}/ArticuloInsumo`, body); // Agrega un nuevo articuloInsumo si no está en modo de edición
      }
      getArticuloInsumos(); // Actualiza la lista de articuloInsumos
    } catch (error) {
      console.error('Error al enviar los datos:', error); // Manejo de errores
    }
  };

  // Si no está en modo de edición, se limpian los valores iniciales
  if (!isEditMode) {
    initialValues = {
        id:0,
        eliminado: false,
        denominacion: '',
        precioVenta: 0,
        unidadMedida: {
          id:0,
          eliminado: false,
          denominacion: ""
        },
        esParaElaborar: false,
        precioCompra: 0,
        stockActual: 0,
        stockMaximo: 0
    };
  }

  // Renderiza el componente de modal genérico
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar ArticuloInsumo' : 'Añadir ArticuloInsumo'}
      initialValues={articuloInsumoAEditar || initialValues} // Usa el articuloInsumo a editar si está disponible, de lo contrario, usa los valores iniciales
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      {/* Campos del formulario */}
      <TextFieldValue label="Denominacion" name="denominacion" type="text" placeholder="Denominacion" />
      <TextFieldValue label="Precio Venta" name="precioVenta" type="number" placeholder="Precio Venta" />
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
            <SelectList
              title="UnidadMedida"
              items={filteredData.map((unidadMedida: IUnidadMedida) => unidadMedida.denominacion)}
              handleChange={handleUnidadMedidaChange}
              //selectedValue={selectedLocalidad}
              selectedValue={unidadMedidaDen}
            />
        </div>
      </div>
      <SwitchValue  title="Es Para Elaborar" handleChange= {handleSwitchChange} selectedValue= {articuloInsumoAEditar?.esParaElaborar || esParaElaborarValue}/>
      <TextFieldValue label="Precio Compra" name="precioCompra" type="number" placeholder="Precio Compra" />
      <TextFieldValue label="Stock Actual" name="stockActual" type="number" placeholder="Stock Actual" />
      <TextFieldValue label="Stock Maximo" name="stockMaximo" type="number" placeholder="Stock Maximo" />
    </GenericModal>
  );
};

export default ModalArticuloInsumo; // Exporta el componente ModalEmpresa
