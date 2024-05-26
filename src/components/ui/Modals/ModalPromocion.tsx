import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import IPromocion from '../../../types/IPromocion';
import PromocionService from '../../../services/PromocionService';
import PromocionPost from '../../../types/post/PromocionPost';
import { TipoPromocion } from '../../../types/EnumTipoPromocion';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import SelectFieldValue from '../SelectFieldValue/SelectFieldValue';
import ArticuloInsumoService from '../../../services/ArticuloInsumoService';
import IArticuloInsumo from '../../../types/IArticuloInsumo';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import SelectList from '../SelectList/SelectList';
import ItemPromocion from '../ItemPromocion/ItemPromocion';
import IPromocionDetalle from '../../../types/IPromocionDetalle';
import CategoriaService from '../../../services/CategoriaService';
import ICategoria from '../../../types/ICategoria';
import { Add } from '@mui/icons-material';
import IArticuloManufacturado from '../../../types/IArticuloManufacturado';
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService';

interface ModalPromocionProps {
  modalName: string;
  initialValues: IPromocion;
  isEditMode: boolean;
  getPromociones: () => Promise<void>;
}

const ModalPromocion: React.FC<ModalPromocionProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getPromociones
}) => {
  const promocionService = new PromocionService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    // Define your validation schema here
  });
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  const handleSubmit = async (values: IPromocion) => {
    try {
      console.log(values)
      const body: PromocionPost = {
        denominacion: values.denominacion,
        fechaDesde: values.fechaDesde,
        fechaHasta: values.fechaHasta,
        horaDesde: values.horaDesde,
        horaHasta: values.horaHasta,
        descripcionDescuento: values.descripcionDescuento,
        precioPromocional: values.precioPromocional,
        tipoPromocion: values.tipoPromocion,
        eliminado: values.eliminado,
      }
      if (isEditMode) {
        await promocionService.putx(`${URL}/promociones`, values.id, body);
      } else {
        await promocionService.postx(`${URL}/promociones`, body);
      }
      getPromociones();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const onClose = () => {
    // Optional: handle on close logic if needed
  };

  //cargo insumos para elegir en la promo
  const articuloManufacturadoService = new ArticuloManufacturadoService();
  // const dispatch = useAppDispatch();
  const [articulosManufacturado, setArticulosManufacturado] = useState<IArticuloManufacturado[]>([]);
  useEffect(() => {
    const fetchArticuloInsumos = async () => {
      try {
        const articulos = await articuloManufacturadoService.getAll(URL + '/ArticuloManufacturado');
        // dispatch(setArticuloInsumo(articulos));
        setArticulosManufacturado(articulos);
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
  
  const removeItem = (idComponent: number, idPromocion: number) => {

    //si tiene idDetalle esta en la base de datos
    //lo que verifica que se muestre la alerta solo en el modal de edicion
    /*if(idDetalle){
      const userConfirmed = window.confirm('¿Estás seguro, se eliminara permanentemente?');
      if (userConfirmed) {
        articuloManufacturadoDetalleService.delete(`${URL}/ArticuloManufacturadoDetalle`, idDetalle)
      }else{
        return;
      }
    }*/
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

 //TRAER Los detalles  PARA Enviarlas al ItemPromocion
  const [detalles, setDetalles] = useState<IPromocionDetalle[]>([]);
  useEffect(() =>{
    const fetchDetalles = async() =>{
      const detallitos :IPromocionDetalle[] = await promocionService.getDetallesPromos(`${URL}/ArticuloManufacturado`, initialValues.id)
      setDetalles(detallitos)
      setArticulosInsumosItems(
        detallitos.map((det, ix /* JOAKO => IX ES UN NUMERO RANDOM */) => ({
          idComponent: ix,
          detalle: det.detalle,
            eliminado:det.eliminado,
            articulo:det.articulo,
        }))
      )
    }
    fetchDetalles();
  },[showModal]);


 //TRAER LAS CATEGORIAS PARA Enviarlas al ItemPromocion
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

//metodo para calcular el total
  const calcularTotalSubtotales = (): number => {
    let total = 0;
    for (const item of articulosInsumosItems) {
      const subtotalItem = item.cantidad && item.selectedArticuloInsumoId ?
        articulosManufacturado.find(articulo => articulo.id === item.selectedArticuloInsumoId)?.precioVenta * item.cantidad
        : 0;
      total += subtotalItem || 0;
    }
    return total;
  };

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Promocion' : 'Añadir Promocion'}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onClose}
    >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ flex: 1 }}>
            <TextFieldValue label="Denominacion" name="denominacion" type="text" placeholder="Denominacion" />
          </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Fecha desde" name="fechaDesde" type="date" placeholder="Fecha desde" />
          </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Fecha hasta" name="fechaHasta" type="date" placeholder="Fecha hasta" />
          </div>
          <div style={{ flex: 1 }}>
          <TextFieldValue label="Hora desde" name="horaDesde" type="time" placeholder="Hora desde" />
           </div>
          <div style={{ flex: 1 }}>
            <TextFieldValue label="Hora hasta" name="horaHasta" type="time" placeholder="Hora hasta" />
          </div>
        </div>
        <div style={{ flex: 1 }}>
            <TextFieldValue label="Descripcion" name="descripcionDescuento" type="text" placeholder="Descripcion" />
        </div>
        <div style={{ flex: 1 }}>
        <SelectFieldValue
            label="Tipo de promocion"
            name="tipoPromocion"
            type='text'
            options={[
              { label: 'Promocion', value: 'true' },
              { label: 'Happy hour', value: 'false' }
            ]}
            placeholder="Tipo de promocion"
            disabled={isEditMode}
            />
        </div>
        {
        articulosInsumosItems.map( item => {
        const detalle = detalles.find(detalle => detalle.id === item.idDetalle)
        return (
        <ItemPromocion 
          key={item.idComponent} 
          idComponent={item.idComponent} 
          idPromocion={detalle?.id}
          insumos={articulosManufacturado} 
          handleItemChange={handleItemChange}
          removeComponent={removeItem} 
          selectedArticuloInsumoId={item.selectedArticuloInsumoId || detalle?.articuloInsumo.id}
          categorias = {categorias}
          />
          
        )
        })}
      <button type="button" style={{margin: '10px'}} className='btn btn-primary' onClick={addNewItem}>{<Add />} Agregar Articulo</button>
      <div style={{ display: 'flex' }}>
        <div>Precio final sin descuento: {calcularTotalSubtotales()}</div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
      <TextFieldValue label="Precio Promocional" name="precioPromocional" type="text" placeholder="Precio Promocional" />
        </div>
        
    </div>
    </GenericModal>
  );
};

export default ModalPromocion;
