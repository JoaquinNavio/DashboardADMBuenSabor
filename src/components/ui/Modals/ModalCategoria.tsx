import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import CategoriaService from '../../../services/CategoriaService'; 
import Categoria from '../../../types/ICategoria'; 
import SelectList from '../SelectList/SelectList';
import { useAppDispatch } from '../../../hooks/redux';
import { setCategoria } from '../../../redux/slices/CategoriaReducer';
import ICategoria from '../../../types/ICategoria';

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
    denominacion: Yup.string()
      .required('Campo requerido'), // Campo CUIL requerido
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


  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const [filteredData, setFilteredData] = useState<Categoria[]>([]);
  const [categoriaDenominacion, setCategoriaDenominacion] = useState<string>('');
  const [selectedCategoriaPadreId, setCategoriaPadreId] = useState<number>(0);

  const fetchCategorias = async () => {
    try {
      const categorias = await categoriaService.getAll(url + '/categoria');
      dispatch(setCategoria(categorias));
      setFilteredData(categorias);
    } catch (error) {
      console.error("Error al obtener las Categorias:", error);
    }
  };
  useEffect(() => {
    fetchCategorias();
  }, []);
  
  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoriaDenominacion = event.target.value;
    // Buscar la localidad por su nombre en el array de localidades
    const categoriaSeleccionada = filteredData.find(articuloInsumo => articuloInsumo.denominacion === categoriaDenominacion);
    if (categoriaSeleccionada) {
      // Asignar el ID de la localidad seleccionada
      setCategoriaPadreId(categoriaSeleccionada.id);
      setCategoriaDenominacion(categoriaSeleccionada.denominacion); // Actualizar el nombre de la localidad seleccionada
    }
  };



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
      <SelectList
              title="Categoria padre"
              items={filteredData.map((categoria: ICategoria) => categoria.denominacion)}
              handleChange={handleCategoriaChange}
              selectedValue={categoriaDenominacion}
              disabled={isEditMode}
            />
      <TextFieldValue label="Insumo" name="es_insumo" type="text" placeholder="Es insumo?" />
    </GenericModal>
  );
};

export default ModalCategoria; // Exporta el componente ModalCategoria