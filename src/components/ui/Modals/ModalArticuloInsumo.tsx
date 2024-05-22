import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import ArticuloInsumoService from '../../../services/ArticuloInsumoService'; 
import ArticuloInsumo from '../../../types/IArticuloInsumo'; 
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import IUnidadMedida from '../../../types/IUnidadMedida';
import { setUnidadMedida } from '../../../redux/slices/UnidadMedidaReducer';
import SelectList from '../SelectList/SelectList';
import ArticuloInsumoPost from '../../../types/post/ArticuloInsumoPost';
import SwitchValue from '../Switch/Switch';
import ICategoria from '../../../types/ICategoria';
import { useAppDispatch } from '../../../hooks/redux';
import CategoriaService from '../../../services/CategoriaService';
import { setCategoria } from '../../../redux/slices/CategoriaReducer';

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

  const unidadMedidaService = new UnidadMedidaService();
  const categoriaService = new CategoriaService(); // Instancia del servicio de categoria

  const [filteredData, setFilteredData] = useState<IUnidadMedida[]>([]);
  const [filteredData2, setFilteredData2] = useState<ICategoria[]>([]);

  const [unidadMedidaDen, setUnidadMedidaDenominacion] = useState<string>('');
  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] = useState<number>(0);

  

  const dispatch = useAppDispatch();
  const url = import.meta.env.VITE_API_URL;


  

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


  const fetchCategorias = async () => {
    try {
      const categorias = await categoriaService.getAll(url + '/categoria');
      dispatch(setCategoria(categorias));
      setFilteredData2(categorias);
    } catch (error) {
      console.error("Error al obtener las Categorias:", error);
    }
  };
  useEffect(() => {
    fetchCategorias();
  }, [])




  const [categoriaDen, setCategoriaDenominacion] = useState<string>('');
  const [selectedCategoriaPadreId, setCategoriaPadreId] = useState<number>(0);

  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {

    const categoriaDenominacion = event.target.value;
    console.log("categoriaDenominacion"+categoriaDenominacion)

    const categoriaSeleccionada = filteredData2.find(articuloCategoria => articuloCategoria.denominacion === categoriaDenominacion);
    console.log("categoriaSeleccionada"+categoriaSeleccionada)

    if (categoriaSeleccionada) {
      setCategoriaPadreId(categoriaSeleccionada.id);
      setCategoriaDenominacion(categoriaSeleccionada.denominacion); 
    }
    console.log(selectedCategoriaPadreId);

  };

const handleUnidadMedidaChange = (event: ChangeEvent<HTMLSelectElement>) => {

  const unidadMedidaDenominacion = event.target.value;
  const unidadMedidaSeleccionada = filteredData.find(unidadMedida => unidadMedida.denominacion === unidadMedidaDenominacion);
  if (unidadMedidaSeleccionada) {
    setSelectedUnidadMedidaId(unidadMedidaSeleccionada.id);
    setUnidadMedidaDenominacion(unidadMedidaSeleccionada.denominacion); 
  }
  console.log(selectedUnidadMedidaId);

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
        idCategoria:selectedCategoriaPadreId
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
          es_insumo:false
        },
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
              selectedValue={unidadMedidaDen}
            />
        </div>
      </div>
      <SwitchValue  title="Es Para Elaborar" handleChange= {handleSwitchChange} selectedValue= {articuloInsumoAEditar?.esParaElaborar || esParaElaborarValue}/>
      <TextFieldValue label="Precio Compra" name="precioCompra" type="number" placeholder="Precio Compra" />
      <TextFieldValue label="Stock Actual" name="stockActual" type="number" placeholder="Stock Actual" />
      <TextFieldValue label="Stock Maximo" name="stockMaximo" type="number" placeholder="Stock Maximo" />
      <SelectList
              title="Categoria padre"
              items={filteredData2.map((categoria: ICategoria) => categoria.denominacion)}
              handleChange={handleCategoriaChange}
              selectedValue={categoriaDen}
            />
    </GenericModal>
  );
};

export default ModalArticuloInsumo; // Exporta el componente ModalEmpresa
