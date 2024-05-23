import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import CategoriaService from '../../../services/CategoriaService'; 
import Categoria from '../../../types/ICategoria'; 
import SelectList from '../SelectList/SelectList';
import { useAppDispatch } from '../../../hooks/redux';
import { setCategoria } from '../../../redux/slices/CategoriaReducer';
import SelectFieldValue from '../SelectFieldValue/SelectFieldValue';
import CategoriaPost from '../../../types/post/CategoriaPost';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

// Define las props del componente de modal de categoria
interface ModalCategoriaProps {
  modalName: string; // Nombre del modal
  initialValues: Categoria; // Valores iniciales del formulario
  isEditMode: boolean; // Indicador de modo de edición
  getCategorias: () => Promise<void>; // Función para obtener categorias
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
console.log(initialValues)
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  const categoriaService = new CategoriaService(); // Instancia del servicio de categoria
  const URL = import.meta.env.VITE_API_URL; // URL de la API

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    denominacion: Yup.string()
      .required('Campo requerido'), // Campo CUIL requerido
  });

  // Función para manejar el envío del formulario
  const handleSubmit = async (values: Categoria) => {
    const body: CategoriaPost = {
      categoriaPadreId:selectedCategoriaPadreId ,
      denominacion:values.denominacion,
      esInsumo:values.esInsumo,
    }
    try {
      if (isEditMode) {
        await categoriaService.putx(`${URL}/categoria`, values.id, body); // Actualiza la categoria si está en modo de edición
      } else {
        await categoriaService.postx(`${URL}/categoria`, body); // Agrega una nueva categoria si no está en modo de edición
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
      esInsumo: false,
      categoriaPadre:undefined
    };
  }  


  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const [filteredData, setFilteredData] = useState<Categoria[]>([]);
  const [selectedCategoriaPadreId, setCategoriaPadreId] = useState<number | undefined>(0);

  
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categorias = await categoriaService.getAll(url + '/categoria');
        dispatch(setCategoria(categorias));
        setFilteredData(categorias);
      } catch (error) {
        console.error("Error al obtener las Categorias:", error);
      }
    };
    fetchCategorias();
  }, [showModal] );
  
  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const idCategoriaSelected = parseInt(event.target.value);
    // Buscar la localidad por su nombre en el array de localidades
    if (idCategoriaSelected) {
      // Asignar el ID de la localidad seleccionada
      setCategoriaPadreId(idCategoriaSelected);
    }
  };

  function onClose(){
    setCategoriaPadreId(undefined)
  }

  // Renderiza el componente de modal genérico
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Categoria' : 'Añadir Categoria'}
      initialValues={categoriaAEditar || initialValues} // Usa la categoria a editar si está disponible, de lo contrario, usa los valores iniciales
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onClose}
    >
      {/* Campos del formulario */}
      <TextFieldValue label="Denominaciòn" name="denominacion" type="text" placeholder="Denominacion" />
      <SelectList
              title="Categoria padre"
              items={filteredData.reduce((mapa, categoria) => {
                mapa.set(categoria.id, categoria.denominacion); 
                return mapa
              }, new Map<number, string>())}
              handleChange={handleCategoriaChange}
              selectedValue={selectedCategoriaPadreId || (initialValues.categoriaPadre?.id)}
            />
      <SelectFieldValue
        label="Es insumo?"
        name="esInsumo"
        type='text'
        options={[
          { label: 'Sí', value: 'true' },
          { label: 'No', value: 'false' }
        ]}
        placeholder="Es insumo?"
        disabled={isEditMode}
      />
    </GenericModal>
  );
};

export default ModalCategoria; // Exporta el componente ModalCategoria
