import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService'; 
import ArticuloManufacturado from '../../../types/IArticuloManufacturado'; 
import SelectList from '../SelectList/SelectList';
import { useAppDispatch } from '../../../hooks/redux';
import IArticuloInsumo from '../../../types/IArticuloInsumo';
import { setArticuloInsumo } from '../../../redux/slices/ArticuloInsumoReducer';
import ArticuloManufacturadoPost from '../../../types/post/ArticuloManufacturadoPost';
import ArticuloInsumoService from '../../../services/ArticuloInsumoService';
import ArticuloInsumoPost from '../../../types/post/ArticuloInsumoPost';

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
  const articuloInsumoService = new ArticuloInsumoService();
  const dispatch = useAppDispatch();
  const [filteredData, setFilteredData] = useState<IArticuloInsumo[]>([]);

  const fetchArticuloInsumos = async () => {
    try {
      const articulos = await articuloInsumoService.getAll(URL + '/ArticuloInsumo');
      dispatch(setArticuloInsumo(articulos));
      setFilteredData(articulos);
      console.log(articulos)
    } catch (error) {
      console.error("Error al obtener las unidades:", error);
    }
  };
  useEffect(() => {
    fetchArticuloInsumos();
  }, []);

const [articuloInsumoDenominacion, setArticuloInsumoDenominacion] = useState<string>('');
const [selectedArticuloInsumoId, setSelectedArticuloInsumoId] = useState<number>(0);

const handleArticuloInsumoChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const articuloInsumoDenominacion = event.target.value;
  // Buscar la localidad por su nombre en el array de localidades
  const ArticuloInsumoSeleccionado = filteredData.find(articuloInsumo => articuloInsumo.denominacion === articuloInsumoDenominacion);
  if (ArticuloInsumoSeleccionado) {
    // Asignar el ID de la localidad seleccionada
    setSelectedArticuloInsumoId(ArticuloInsumoSeleccionado.id);
    setArticuloInsumoDenominacion(ArticuloInsumoSeleccionado.denominacion); // Actualizar el nombre de la localidad seleccionada
  }
};

  // Función para manejar el envío del formulario
  const handleSubmit = async (values: ArticuloManufacturado) => {
    try {
      const body: ArticuloManufacturadoPost = {
        tiempoEstimadoMinutos: values.tiempoEstimadoMinutos,
        descripcion: values.descripcion,
        preparacion: values.preparacion,
        eliminado:  values.eliminado,
        denominacion: values.denominacion,
        precioVenta: values.precioVenta,
        idUnidadMedida: 1,
        idCategoria: 1
      }
      if (isEditMode) {
        await articuloManufacturadoService.put(`${URL}/ArticuloManufacturado`, values.id, body); // Actualiza la articuloManufacturado si está en modo de edición
      } else {
        await articuloManufacturadoService.post(`${URL}/ArticuloManufacturado`, body); // Agrega una nueva articuloManufacturado si no está en modo de edición
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
        unidadMedida: {
          id:0,
          eliminado:false,
          denominacion: ''
        },
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
      <TextFieldValue label="denominacion" name="denominacion" type="text" placeholder="denominacion" />
      <TextFieldValue label="descripcion" name="descripcion" type="text" placeholder="descripcion" />
      <TextFieldValue label="tiempoEstimado" name="tiempoEstimadoMinutos" type="number" placeholder="tiempo estimado" />
      <TextFieldValue label="precioVenta" name="precioVenta" type="number" placeholder="precio de venta" />
      <TextFieldValue label="preparacion" name="preparacion" type="text" placeholder="preparacion" />
      <SelectList
              title="Insumo"
              items={filteredData.map((insumo: IArticuloInsumo) => insumo.denominacion)}
              handleChange={handleArticuloInsumoChange}
              //selectedValue={selectedLocalidad}
              selectedValue={articuloInsumoDenominacion}
              disabled={isEditMode}
            />
    </GenericModal>
  );
};

export default ModalArticuloManufacturado; // Exporta el componente ModalArticuloManufacturado
