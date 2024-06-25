import * as Yup from 'yup';
import GenericModal from './GenericModal';
import IPromocion from '../../../types/IPromocion';
import PromocionService from '../../../services/PromocionService';
import PromocionPost from '../../../types/post/PromocionPost';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import SelectFieldValue from '../SelectFieldValue/SelectFieldValue';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import ItemPromocion from '../ItemPromocion/ItemPromocion';
import IPromocionDetalle from '../../../types/IPromocionDetalle';
import CategoriaService from '../../../services/CategoriaService';
import ICategoria from '../../../types/ICategoria';
import { Add } from '@mui/icons-material';
import IArticuloManufacturado from '../../../types/IArticuloManufacturado';
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService';
import PromocionDetalleService from '../../../services/PromocionDetalleService';
import { useAuth0 } from "@auth0/auth0-react";

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
  const { getAccessTokenSilently } = useAuth0();
  const promocionService = new PromocionService();
  const URL = import.meta.env.VITE_API_URL;
  const promocionDetalleService = new PromocionDetalleService;
  const sucursalId = localStorage.getItem('sucursal_id');

  const validationSchema = Yup.object().shape({
    // Define your validation schema here
  });
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  const handleSubmit = async (values: IPromocion) => {
    try {
      const token = await getAccessTokenSilently();
      const body: PromocionPost = {
        denominacion: values.denominacion,
        fechaDesde: values.fechaDesde,
        fechaHasta: values.fechaHasta,
        horaDesde: values.horaDesde,
        horaHasta: values.horaHasta,
        descripcionDescuento: values.descripcionDescuento,
        precioPromocional: values.precioPromocional,
        tipoPromocion: values.tipoPromocion,
        eliminado: false,
        detalles: [],
        sucursal_id: parseInt(sucursalId)
      }
      for (const item of articulosInsumosItems) {
        const detalle = {
          cantidad: item.cantidad || 0,
          articuloId: item.selectedArticuloId || 0,
          detalleId: item.idDetalle
        };
        body.detalles.push(detalle);
      }
      console.log(body)
      if (isEditMode) {
        await promocionService.putx(`${URL}/promociones/updateWithDetails`, values.id, body, token);
      } else {
        await promocionService.postx(`${URL}/promociones/createWithDetails`, body, token);
      }
      getPromociones();
    } catch (e) {
      console.error('Error al enviar los datos:', e);
    }
  };

  const onClose = () => {
    // Optional: handle on close logic if needed
  };

  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const [articulosManufacturado, setArticulosManufacturado] = useState<IArticuloManufacturado[]>([]);
  useEffect(() => {
    const fetchArticuloInsumos = async () => {
      try {
        const token = await getAccessTokenSilently();
        const articulos = await articuloManufacturadoService.getAll(URL + '/ArticuloManufacturado', token);
        setArticulosManufacturado(articulos);
      } catch (error) {
        console.error("Error al obtener las unidades:", error);
      }
    };
    fetchArticuloInsumos();
  }, [showModal]);

  const [articulosInsumosItems, setArticulosInsumosItems] = useState<{
    idComponent: number;
    selectedArticuloId?: number;
    cantidad?: number;
    idDetalle?: number;
  }[]>([]);

  const addNewItem = () => {
    setArticulosInsumosItems([
      ...articulosInsumosItems, 
      { idComponent: articulosInsumosItems.length, selectedArticuloId: undefined, cantidad: undefined, idDetalle: undefined }
    ]);
  }
  

  const removeItem = (idComponent: number, idPromocion: number) => {
    if (idPromocion) {
      const userConfirmed = window.confirm('¿Estás seguro, se eliminara permanentemente?');
      if (userConfirmed) {
        // @ts-ignore
        promocionDetalleService.delete(`${URL}/promocionDetalle`, idPromocion)
      } else {
        return;
      }
    }
    setArticulosInsumosItems(articulosInsumosItems.filter(item => item.idComponent !== idComponent))
  }

  const handleItemChange = (idComponent: number, selectedArticuloId?: number, cantidad?: number, idDetalle?: number) => {
    setArticulosInsumosItems(articulosInsumosItems.map(item => {
      if (item.idComponent === idComponent) {
        return {
          idComponent,
          selectedArticuloId,
          cantidad,
          idDetalle
        }
      }
      return item;
    }))
  }

  const [detalles, setDetalles] = useState<IPromocionDetalle[]>([]);
  useEffect(() => {
    const fetchDetalles = async () => {
      if (isEditMode && initialValues.id) {
        const token = await getAccessTokenSilently();
        const detallitos: IPromocionDetalle[] = await promocionService.getDetallesPromos(`${URL}/promociones`, initialValues.id, token);
        setDetalles(detallitos);
  
        setArticulosInsumosItems(
          //@ts-ignore
          detallitos.filter(det => det !== undefined).map((det, ix) => ({
            idComponent: ix,
            selectedArticuloId: det?.articuloId,
            cantidad: det?.detalle,
            idDetalle: det?.id,
          }))
        );
      }
    };
    fetchDetalles();
  }, [showModal, initialValues.id]);
  

  const categoriaService = new CategoriaService();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = await getAccessTokenSilently();
        const categorias = await categoriaService.getAll(URL + '/categoria', token);
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener las Categorias:", error);
      }
    };
    fetchCategorias();
  }, [showModal]);

  const calcularTotalSubtotales = (): number => {
    let total = 0;
    for (const item of articulosInsumosItems) {
      const subtotalItem = item.cantidad && item.selectedArticuloId ?
        articulosManufacturado.find(articulo => articulo.id === item.selectedArticuloId)?.precioVenta * item.cantidad
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
          
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
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
              { label: 'Promocion', value: '1' },
              { label: 'Happy hour', value: '0' }
            ]}
            placeholder="Tipo de promocion"
            disabled={isEditMode}
          />
        </div>
        {
  articulosInsumosItems.map(item => {
    const detalle = detalles.find(detalle => detalle?.id === item.idDetalle);
    console.log(detalle);  // Asegúrate de que detalle no sea undefined
    return (
      <ItemPromocion
        key={item.idComponent}
        idComponent={item.idComponent}
        idDetalle={detalle?.id}
        // @ts-ignore
        cantidad={detalle?.detalle}
        insumos={articulosManufacturado}
        handleItemChange={handleItemChange}
        removeComponent={removeItem}
        selectedArticuloId={item.selectedArticuloId || detalle?.articulo?.id}
        categorias={categorias}
      />
    )
  })
}
        <button type="button" style={{ margin: '10px' }} className='btn btn-primary' onClick={addNewItem}>{<Add />} Agregar Articulo</button>
        <div style={{ display: 'flex' }}>
          <div>Precio final sin descuento: {calcularTotalSubtotales()}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <TextFieldValue label="Precio Promocional" name="precioPromocional" type="number" placeholder="Precio Promocional" />
        </div>
      </div>
    </GenericModal>
  );
};

export default ModalPromocion;
