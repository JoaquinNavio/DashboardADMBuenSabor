import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService'; 
import ArticuloManufacturado from '../../../types/IArticuloManufacturado'; 
import SelectList from '../SelectList/SelectList';
// import { useAppDispatch } from '../../../hooks/redux';
import IArticuloInsumo from '../../../types/IArticuloInsumo';
import ArticuloManufacturadoPost from '../../../types/post/ArticuloManufacturadoPost';
import ArticuloInsumoService from '../../../services/ArticuloInsumoService';
import ICategoria from '../../../types/ICategoria';
import CategoriaService from '../../../services/CategoriaService';
// import { setCategoria } from '../../../redux/slices/CategoriaReducer';
import ArticuloManufacturadoDetallePost from '../../../types/post/ArticuloManufacturadoDetallePost';
import ArticuloManufacturadoDetalleService from '../../../services/ArticuloManufacturadoDetalleService';
import ItemDetalleArticuloManufacturado from '../ItemDetalleArticuloManufacturado/ItemDetalleArticuloManufacturado';
import IArticuloManufacturadoDetalle from '../../../types/IArticuloManufacturadoDetalle';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface ModalArticuloManufacturadoProps {
  modalName: string; 
  initialValues: ArticuloManufacturado; 
  isEditMode: boolean; 
  getArticuloManufacturados: () => Promise<void>; 
  articuloManufacturadoAEditar?: ArticuloManufacturado; 
}

const ModalArticuloManufacturado: React.FC<ModalArticuloManufacturadoProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getArticuloManufacturados,
  articuloManufacturadoAEditar,
}) => {

  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    // Validaciones de Yup
  });

  // BUSQUEDA ARTICULOS INSUMO
  const articuloInsumoService = new ArticuloInsumoService();
  // const dispatch = useAppDispatch();
  const [articulosInsumo, setArticulosInsumo] = useState<IArticuloInsumo[]>([]);
  useEffect(() => {
    const fetchArticuloInsumos = async () => {
      try {
        const articulos = await articuloInsumoService.getAll(URL + '/ArticuloInsumo');
        // dispatch(setArticuloInsumo(articulos));
        setArticulosInsumo(articulos);
        console.log(articulos);
      } catch (error) {
        console.error("Error al obtener las unidades:", error);
      }
    };
    fetchArticuloInsumos();
  }, [showModal]);

  const [articulosInsumosItemsX, setArticulosInsumosItemsX] = useState<{
    idComponent: number;
    selectedArticuloInsumoId?: number;
    cantidad?: number;
    idDetalle?: number;
  }[]>([]);
  
  const addNewItem = () => {
    setArticulosInsumosItemsX([...articulosInsumosItemsX, {idComponent: articulosInsumosItemsX.length}]);
  }
  
  const removeItem = (idComponent: number) => {
    setArticulosInsumosItemsX(articulosInsumosItemsX.filter(item => item.idComponent !== idComponent))
  }

  const handleItemChange = (idComponent: number, selectedArticuloInsumoId?: number, cantidad?: number, idDetalle?: number) => {
    setArticulosInsumosItemsX(articulosInsumosItemsX.map(item => {
      if (item.idComponent === idComponent){
        return {
          idComponent,
          selectedArticuloInsumoId,
          cantidad,
          idDetalle
        }
      }
      return item;
    }))
  }

  // BUSCAR CATEGORIAS
  const categoriaService = new CategoriaService(); // Instancia del servicio de categoria
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categorias = await categoriaService.getAll(URL + '/categoria');
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener las Categorias:", error);
      }
    };
    fetchCategorias();
  }, [showModal])
  
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>(undefined);
  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = parseInt(event.target.value);
    if (categoriaId) {
      // Asignar el ID de la localidad seleccionada
      setSelectedCategoriaId(categoriaId);
    }
  };
  // -------------------------------------------------------------------------------

  const articuloManufacturadoDetalleService = new ArticuloManufacturadoDetalleService();

  const handleSubmit = async (values: ArticuloManufacturado) => {
    try {
      const body: ArticuloManufacturadoPost = {
        tiempoEstimadoMinutos: values.tiempoEstimadoMinutos,
        descripcion: values.descripcion,
        preparacion: values.preparacion,
        eliminado: values.eliminado,
        denominacion: values.denominacion,
        precioVenta: values.precioVenta,
        idUnidadMedida: 1,
        idCategoria: selectedCategoriaId || 0
      };
  
      let articuloGuardado: ArticuloManufacturado;
      if (isEditMode) {
        articuloGuardado = await articuloManufacturadoService.putx(`${URL}/ArticuloManufacturado`, values.id, body);
      } else {
        articuloGuardado = await articuloManufacturadoService.postx(`${URL}/ArticuloManufacturado`, body);
      }
      
      // Crear el array de ArticuloManufacturadoDetallePost
      
      for (const item of articulosInsumosItemsX) {
        const detalle = {
          cantidad: item.cantidad || 0,
          idArticuloInsumo: item.selectedArticuloInsumoId || 0,
          idArticuloManufacturado: articuloGuardado.id
        }
        console.log()
        if (item.idDetalle )
          await articuloManufacturadoDetalleService.putx(`${URL}/ArticuloManufacturadoDetalle`, item.idDetalle, detalle)
        else 
          await articuloManufacturadoDetalleService.postx(`${URL}/ArticuloManufacturadoDetalle`, detalle);
        
      }
      
      getArticuloManufacturados();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };
  
  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado: false,
      denominacion: '',
      descripcion: '',
      tiempoEstimadoMinutos: 0,
      precioVenta: 0,
      preparacion: '',
      unidadMedida: {
        id: 0,
        eliminado: false,
        denominacion: ''
      },
      categoria: {
        id:0,
        eliminado: false,
        denominacion: '',
        es_insumo: false
      },
    };
  }

  const onClose = ()=>{
    setSelectedCategoriaId(undefined);
    setArticulosInsumosItemsX([]);
    setDetalles([]);
  }

  const [detalles, setDetalles] = useState<IArticuloManufacturadoDetalle[]>([]);
  useEffect(() =>{
    const fetchDetalles = async() =>{
      const detallitos :IArticuloManufacturadoDetalle[] = await articuloManufacturadoService.getDetalles(`${URL}/ArticuloManufacturado`, initialValues.id)
      setDetalles(detallitos)
      setArticulosInsumosItemsX(
        detallitos.map((det, ix /* JOAKO => IX ES UN NUMERO RANDOM */) => ({
          idComponent: ix,
          selectedArticuloInsumoId: det.articuloInsumo.id,
          cantidad: det.cantidad,
          idDetalle: det.id,
        }))
      )
    }
    fetchDetalles();
  },[showModal]);

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar ArticuloManufacturado' : 'Añadir ArticuloManufacturado'}
      initialValues={articuloManufacturadoAEditar || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onClose}
    >
      <TextFieldValue label="denominacion" name="denominacion" type="text" placeholder="denominacion" />
      <TextFieldValue label="descripcion" name="descripcion" type="text" placeholder="descripcion" />
      <TextFieldValue label="tiempoEstimado" name="tiempoEstimadoMinutos" type="number" placeholder="tiempo estimado" />
      <TextFieldValue label="precioVenta" name="precioVenta" type="number" placeholder="precio de venta" />
      <TextFieldValue label="preparacion" name="preparacion" type="text" placeholder="preparacion" />
      <SelectList
              title="Categoria"
              items={categorias.reduce((mapa, categoria) => {
                mapa.set(categoria.id, categoria.denominacion); 
                return mapa
              }, new Map<number, string>())}
              handleChange={handleCategoriaChange}
              selectedValue={selectedCategoriaId || (initialValues.categoria.id !== 0 ? initialValues.categoria.id : undefined)}
            />
      {
      
      articulosInsumosItemsX.map( item => {
        const detalle = detalles.find(detalle => detalle.id === item.idDetalle)
        return (
        <ItemDetalleArticuloManufacturado 
          key={item.idComponent} 
          idComponent={item.idComponent} 
          idDetalle={detalle?.id}
          items={articulosInsumo} 
          handleItemChange={handleItemChange}
          removeComponent={removeItem} 
          selectedArticuloInsumoId={item.selectedArticuloInsumoId || detalle?.articuloInsumo.id}
          cantidad={item.cantidad || detalle?.cantidad}/>
      )
      })}
      {/* {articulosInsumosItems.map((articuloInsumo, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <SelectList
            title="Insumo"
            items={articulosInsumo.reduce((mapa, insumo) => {
              mapa.set(insumo.id, insumo.denominacion);
              return mapa
            }, new Map<number, string>())}
            handleChange={handleArticuloInsumoChange}
            selectedValue={articuloInsumo.id}
          />
          <div style={{ marginLeft: '10px' }}>
            <input
              type="number"
              placeholder={`Cantidad en: ${articuloInsumo.unidadMedida}`}
              value={cantidades[index] || ''}
              onChange={(event) => handleCantidadChange(event, index)}
              disabled={isEditMode}
            />
          </div>
          <button 
            type="button" 
            onClick={() => removeArticuloInsumo(index)} 
            style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      ))} */}
      <button type="button" onClick={addNewItem}>Agregar Insumo</button>
    </GenericModal>
  );
};

export default ModalArticuloManufacturado;
