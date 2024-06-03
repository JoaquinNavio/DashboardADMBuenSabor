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
import { Gallery } from '../Gallery/Gallery';
import { TextField } from '@mui/material';
import ImageService from '../../../services/ImageService';
import IImage from '../../../types/IImage';
import { Add } from '@mui/icons-material';

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
  const imageService = new ImageService();
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
      } catch (error) {
        console.error("Error al obtener las unidades:", error);
      }
    };
    fetchArticuloInsumos();
  }, [showModal]);

  const [articulosInsumosItems, setArticulosInsumosItems] = useState<{
    idComponent: number;
    selectedArticuloInsumoId?: number;
    cantidad?: number;
    idDetalle?: number;
  }[]>([]);
  
  const addNewItem = () => {
    setArticulosInsumosItems([...articulosInsumosItems, {idComponent: articulosInsumosItems.length}]);
  }
  
  const removeItem = (idComponent: number, idDetalle: number) => {

    //si tiene idDetalle esta en la base de datos
    //lo que verifica que se muestre la alerta solo en el modal de edicion
    if(idDetalle){
      const userConfirmed = window.confirm('¿Estás seguro, se eliminara permanentemente?');
      if (userConfirmed) {
        articuloManufacturadoDetalleService.delete(`${URL}/ArticuloManufacturadoDetalle`, idDetalle)
      }else{
        return;
      }
    }
    setArticulosInsumosItems(articulosInsumosItems.filter(item => item.idComponent !== idComponent))
  }

  const handleItemChange = (idComponent: number, selectedArticuloInsumoId?: number, cantidad?: number, idDetalle?: number) => {
    setArticulosInsumosItems(articulosInsumosItems.map(item => {
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
  const [imagenCargada, setImagenCargada] = useState<IImage | undefined>(undefined);
  useEffect(() => {
    if(showModal){
      setImagenCargada(initialValues.image?.id!=0? initialValues.image : undefined);
    }
  }, [showModal])

  const handleSubmit = async (values: ArticuloManufacturado) => {
    let imagenGuardada: any;
    if(selectedFiles != null){
      imagenGuardada = await imageService.uploadImagenes(selectedFiles,URL);
    }
    
    const idImage = imagenCargada? imagenCargada.id : (imagenGuardada? imagenGuardada.ids[0] : null)
    try {
      const body: ArticuloManufacturadoPost = {
        tiempoEstimadoMinutos: values.tiempoEstimadoMinutos,
        descripcion: values.descripcion,
        preparacion: values.preparacion,
        eliminado: false,
        denominacion: values.denominacion,
        precioVenta: values.precioVenta,
        idUnidadMedida: 1,
        idCategoria: selectedCategoriaId || initialValues.categoria.id,
        detalles:[],
        idImage
      };
      for (const item of articulosInsumosItems) {
        const detalle = {
            cantidad: item.cantidad || 0,
            idArticuloInsumo: item.selectedArticuloInsumoId || 0,
            idDetalle: item.idDetalle
        };
        body.detalles.push(detalle);
    }
    console.log(body)
      let articuloGuardado: ArticuloManufacturado;
      if (isEditMode) {
        articuloGuardado = await articuloManufacturadoService.putx(`${URL}/ArticuloManufacturado/updateWithDetails`, values.id, body);
      } else {
        articuloGuardado = await articuloManufacturadoService.postx(`${URL}/ArticuloManufacturado/createWithDetails`, body);
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
        id: 0,
        eliminado: false,
        denominacion: '',
        es_insumo: false,
        categoriaPadre: undefined,
        esInsumo: false
      },
      image:{
        url: '',
        name: '',
        id: 0,
        eliminado: false
      },
    };
  }

  const onClose = ()=>{
    setSelectedCategoriaId(undefined);
    setArticulosInsumosItems([]);
    setDetalles([]);
  }

  const [detalles, setDetalles] = useState<IArticuloManufacturadoDetalle[]>([]);
  useEffect(() =>{
    const fetchDetalles = async() =>{
      const detallitos :IArticuloManufacturadoDetalle[] = await articuloManufacturadoService.getDetalles(`${URL}/ArticuloManufacturado`, initialValues.id)
      setDetalles(detallitos)
      setArticulosInsumosItems(
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

  //IMAGEN

   // Estado para almacenar archivos seleccionados para subir
   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
   useEffect(() =>{
    if(showModal){
      setSelectedFiles(null);
    }
  },[showModal]);

   // Manejador de cambio de archivos seleccionados
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     setSelectedFiles(event.target.files);
   };

  const handleDeleteImg = () => {
   setImagenCargada(undefined);
  };
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Articulo Manufacturado' : 'Añadir Articulo Manufacturado'}
      initialValues={articuloManufacturadoAEditar || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onClose}
    >
      
      <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Ingrese denominación" />
      <TextFieldValue label="Descripción" name="descripcion" type="text" placeholder="Ingrese descripción" />
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px'}}>
        <div>
        <TextFieldValue label="Tiempo Estimado" name="tiempoEstimadoMinutos" type="number" placeholder="tiempo estimado" />
        </div>
        <div>
        <TextFieldValue label="Precio Venta" name="precioVenta" type="number" placeholder="precio de venta" />
        </div>
      </div>
      <TextFieldValue label="Preparación" name="preparacion" type="text" placeholder="Ingrese preparación" />
      <div style={{marginBottom: '15px'}}>
      <SelectList
              title="Categoria"
              items={categorias.reduce((mapa, categoria) => {
                mapa.set(categoria.id, categoria.denominacion); 
                return mapa
              }, new Map<number, string>())}
              handleChange={handleCategoriaChange}
              selectedValue={selectedCategoriaId || (initialValues.categoria.id !== 0 ? initialValues.categoria.id : undefined)}
      />
      

      </div>
      

      {
      articulosInsumosItems.map( item => {
        const detalle = detalles.find(detalle => detalle.id === item.idDetalle)
        return (
        <ItemDetalleArticuloManufacturado 
          key={item.idComponent} 
          idComponent={item.idComponent} 
          idDetalle={detalle?.id}
          insumos={articulosInsumo} 
          handleItemChange={handleItemChange}
          removeComponent={removeItem} 
          selectedArticuloInsumoId={item.selectedArticuloInsumoId || detalle?.articuloInsumo.id}
          cantidad={item.cantidad || detalle?.cantidad}
          categorias = {categorias}
          />
          
      )
      })}
      <button type="button" style={{margin: '10px'}} className='btn btn-primary' onClick={addNewItem}>{<Add />} Agregar Insumo</button>
      
      <div>
        <label style={{ fontWeight: 'bold' }}>Imagenes</label>
        {
          (isEditMode && imagenCargada) ? <Gallery images={[imagenCargada]} handleDeleteImg={handleDeleteImg} /> :
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2vh",
                padding: ".4rem",
              }}
            >
              {/* Campo de entrada de archivos */}
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="file"
                onChange={handleFileChange}
                inputProps={{
                  multiple: true,
                }}
              />
            </div>
        }

      </div>

    </GenericModal>
  );
};

export default ModalArticuloManufacturado;
