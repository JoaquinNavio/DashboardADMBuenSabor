import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import CategoriaService from '../../../services/CategoriaService'; 
import Categoria from '../../../types/ICategoria'; 
import SelectList from '../SelectList/SelectList';
import SelectFieldValue from '../SelectFieldValue/SelectFieldValue';
import CategoriaPost from '../../../types/post/CategoriaPost';
import { useAuth0 } from "@auth0/auth0-react";

interface ModalCategoriaProps {
  modalName: string;
  initialValues: Categoria;
  isEditMode: boolean;
  getCategorias: () => Promise<void>;
  categoriaAEditar?: Categoria;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getCategorias,
  categoriaAEditar,
}) => {
  const sucursalId = localStorage.getItem('sucursal_id');

  const { getAccessTokenSilently } = useAuth0();
  const categoriaService = new CategoriaService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    denominacion: Yup.string().required('Campo requerido'),
  });

  const handleSubmit = async (values: Categoria) => {
    const body: CategoriaPost = {
      categoriaPadreId: selectedCategoriaPadreId === 0 ? undefined : selectedCategoriaPadreId,
      denominacion: values.denominacion,
      esInsumo: values.esInsumo,
      sucursal_id: parseInt(sucursalId)
    };

    try {
      const token = await getAccessTokenSilently();
      if (isEditMode) {
        console.log(`PUT request to ${URL}/categoria/${values.id} with body:`, body);
        await categoriaService.putx(`${URL}/categoria`, values.id, body, token);
      } else {
        console.log(`POST request to ${URL}/categoria with body:`, body);
        await categoriaService.postx(`${URL}/categoria`, body, token);
      }
      await getCategorias();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  let initialValuesCopy = { ...initialValues }; // Crear una copia de los valores iniciales para evitar la mutación

  if (!isEditMode) {
    initialValuesCopy = {
      id: 0,
      eliminado: false,
      denominacion: '',
      esInsumo: false,
      categoriaPadre: undefined,
    };
  }

  const [filteredData, setFilteredData] = useState<Categoria[]>([]);
  const [selectedCategoriaPadreId, setCategoriaPadreId] = useState<number | undefined>(initialValues.categoriaPadre?.id);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = await getAccessTokenSilently();
        const categorias = await categoriaService.getAll(`${URL}/categoria/sucursal/${sucursalId}`, token);
        setFilteredData(categorias);
      } catch (error) {
        console.error("Error al obtener las Categorias:", error);
      }
    };
    fetchCategorias();
  }, [modalName]);

  useEffect(() => {
    setCategoriaPadreId(initialValues.categoriaPadre?.id); // Asegurar que el valor inicial del select esté bien definido
  }, [initialValues]);

  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const idCategoriaSelected = parseInt(event.target.value);
    if (!isNaN(idCategoriaSelected)) {
      setCategoriaPadreId(idCategoriaSelected);
    } else {
      setCategoriaPadreId(undefined);
    }
  };

  const onClose = () => {
    setCategoriaPadreId(undefined);
  };

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Categoria' : 'Añadir Categoria'}
      initialValues={categoriaAEditar || initialValuesCopy}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'start', gap:'10px', width: '100%' }}>
        <div style={{ flex: '0 0 80%' }}>
          <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Ingrese denominación"/>
        </div>
        <div style={{ flex: '1' }}>
            <SelectFieldValue
            label="Es insumo"
            name="esInsumo"
            type='text'
            options={[
              { label: 'Sí', value: 'true' },
              { label: 'No', value: 'false' }
            ]}
            placeholder="Es insumo"
            disabled={isEditMode}
            />
        </div>
      </div>
      <div>
        <SelectList
          title="Categoría padre"
          items={filteredData.reduce((mapa, categoria) => {
            mapa.set(categoria.id, categoria.denominacion); 
            return mapa
          }, new Map<number, string>())}
          handleChange={handleCategoriaChange}
          selectedValue={selectedCategoriaPadreId || initialValuesCopy.categoriaPadre?.id}
        />
      </div>
    </GenericModal>
  );
};

export default ModalCategoria;
