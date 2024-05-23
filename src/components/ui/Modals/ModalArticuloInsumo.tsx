import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import ArticuloInsumoService from '../../../services/ArticuloInsumoService'; 
import ArticuloInsumo from '../../../types/IArticuloInsumo'; 
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import IUnidadMedida from '../../../types/IUnidadMedida';
import SelectList from '../SelectList/SelectList';
import ArticuloInsumoPost from '../../../types/post/ArticuloInsumoPost';
import ICategoria from '../../../types/ICategoria';
import CategoriaService from '../../../services/CategoriaService';
import SelectFieldValue from '../SelectFieldValue/SelectFieldValue';

// Define las props del componente de modal de articuloInsumo
interface ModalArticuloInsumoProps {
  modalName: string; // Nombre del modal
  initialValues: ArticuloInsumo; // Valores iniciales del formulario
  isEditMode: boolean; // Indicador de modo de edición
  getArticuloInsumos: () => Promise<void>; // Función para obtener articulosInsumos
}

// Componente de modal de articuloInsumo
const ModalArticuloInsumo: React.FC<ModalArticuloInsumoProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getArticuloInsumos
}) => {
  console.log("se esta renderizando el componente modal articulo insumo")
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


  const url = import.meta.env.VITE_API_URL;

// BUSQUEDA DE UNIDADES DE MEDIDA
  const unidadMedidaService = new UnidadMedidaService();
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  useEffect(()=>{
    const fetchUnidadMedida = async () => {
      try {
        const unidades = await unidadMedidaService.getAll(URL + '/UnidadMedida');
        setUnidadesMedida(unidades)
      } catch (error) {
        console.error("Error al obtener las unidades:", error);
      }
    };
    fetchUnidadMedida();
  }, []);

  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] = useState<number | undefined>(undefined);
  const handleUnidadMedidaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const unidadMedidaId = parseInt(event.target.value);
    if (unidadMedidaId) {
      setSelectedUnidadMedidaId(unidadMedidaId);
    }
  };

  // BUSQUEDA DE CATEGORIAS
  const categoriaService = new CategoriaService(); // Instancia del servicio de categoria
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categorias = await categoriaService.getAll(url + '/categoria');
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener las Categorias:", error);
      }
    };
    fetchCategorias();
  }, [])

  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>(undefined);
  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = parseInt(event.target.value);
    if (categoriaId) {
      setSelectedCategoriaId(categoriaId)
    }
  };
// ----------------------------------------------------------------------------------------


  // Función para manejar el envío del formulario
  const handleSubmit = async (values: ArticuloInsumo) => {
    try {
      const body: ArticuloInsumoPost = {
        denominacion: values.denominacion,
        precioVenta: values.precioVenta,
        idUnidadMedida: selectedUnidadMedidaId || values.unidadMedida.id,
        precioCompra: values.precioCompra,
        stockActual:values.stockActual,
        stockMaximo:values.stockMaximo,
        esParaElaborar:values.esParaElaborar,
        idCategoria:selectedCategoriaId || values.categoria.id
      }
      console.log(values)
      if (isEditMode) {
        await articuloInsumoService.putx(`${URL}/ArticuloInsumo`, values.id, body); // Actualiza el articuloInsumo si está en modo de edición
      } else {
        await articuloInsumoService.postx(`${URL}/ArticuloInsumo`, body); // Agrega un nuevo articuloInsumo si no está en modo de edición
      }
      getArticuloInsumos(); // Actualiza la lista de articuloInsumos
    } catch (error) {
      console.error('Error al enviar los datos:', error); // Manejo de errores
    }
  };
  //es para cargar los objetos de la bd
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
        stockMaximo: 0,
        categoria: {
          id:0,
          eliminado: false,
          denominacion: "",
          esInsumo:false,
          categoriaPadre: undefined,
        },
    };
  }

  const onClose = () =>{
    setSelectedCategoriaId(undefined)
    setSelectedUnidadMedidaId(undefined)
  }

  
  // Renderiza el componente de modal genérico
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar ArticuloInsumo' : 'Añadir ArticuloInsumo'}
      initialValues={initialValues} // Usa el articuloInsumo a editar si está disponible, de lo contrario, usa los valores iniciales
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onClose}
    >
      {/* Campos del formulario */}
      <TextFieldValue label="Denominacion" name="denominacion" type="text" placeholder="Denominacion" />
      <TextFieldValue label="Precio Venta" name="precioVenta" type="number" placeholder="Precio Venta" />
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
            <SelectList
              title="UnidadMedida"
              items={unidadesMedida.reduce((mapa, unidadMedida) => {
                mapa.set(unidadMedida.id, unidadMedida.denominacion); 
                return mapa
              }, new Map<number, string>())}
              handleChange={handleUnidadMedidaChange}
              selectedValue={selectedUnidadMedidaId || (initialValues.unidadMedida.id !== 0 ? initialValues.unidadMedida.id : undefined)}
            />
        </div>
      </div>
      <SelectFieldValue
        label="Es Para Elaborar"
        name="esParaElaborar"
        type='text'
        options={[
          { label: 'Sí', value: 'true' },
          { label: 'No', value: 'false' }
        ]}
        placeholder="Es Para Elaborar?"
        disabled={isEditMode}
      />
      <TextFieldValue label="Precio Compra" name="precioCompra" type="number" placeholder="Precio Compra" />
      <TextFieldValue label="Stock Actual" name="stockActual" type="number" placeholder="Stock Actual" />
      <TextFieldValue label="Stock Maximo" name="stockMaximo" type="number" placeholder="Stock Maximo" />
      <SelectList
              title="Categoria padre"
              items={categorias.reduce((mapa, categoria) => {
                mapa.set(categoria.id, categoria.denominacion); 
                return mapa
              }, new Map<number, string>())}
              handleChange={handleCategoriaChange}
              selectedValue={selectedCategoriaId || (initialValues.categoria.id !== 0 ? initialValues.categoria.id : undefined)}
            />
    </GenericModal>
  );
};

export default ModalArticuloInsumo; // Exporta el componente ModalEmpresa
