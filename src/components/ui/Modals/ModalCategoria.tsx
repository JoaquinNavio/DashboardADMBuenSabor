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
  const { getAccessTokenSilently } = useAuth0();
  const categoriaService = new CategoriaService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    denominacion: Yup.string().required('Campo requerido'),
  });

  const handleSubmit = async (values: Categoria) => {
    const body: CategoriaPost = {
      categoriaPadreId: selectedCategoriaPadreId,
      denominacion: values.denominacion,
      esInsumo: values.esInsumo,
    };

    try {
      const token = await getAccessTokenSilently();
      if (isEditMode) {
        await categoriaService.putx(`${URL}/categoria`, values.id, body, token);
      } else {
        await categoriaService.postx(`${URL}/categoria`, body, token);
      }
      getCategorias();
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
  const [selectedCategoriaPadreId, setCategoriaPadreId] = useState<number | undefined>(0);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = await getAccessTokenSilently();
        const categorias = await categoriaService.getAll(`${URL}/categoria`, token);
        setFilteredData(categorias);
      } catch (error) {
        console.error("Error al obtener las Categorias:", error);
      }
    };
    fetchCategorias();
  }, [modalName]);

  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const idCategoriaSelected = parseInt(event.target.value);
    if (idCategoriaSelected) {
      setCategoriaPadreId(idCategoriaSelected);
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
          selectedValue={selectedCategoriaPadreId || (initialValuesCopy.categoriaPadre?.id)}
        />
      </div>
    </GenericModal>
  );
};

export default ModalCategoria;
