import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import ArticuloManufacturadoService from '../../../services/ArticuloManufacturadoService'; 
import ArticuloManufacturado from '../../../types/IArticuloManufacturado'; 
import SelectList from '../SelectList/SelectList';
import { useAppDispatch } from '../../../hooks/redux';
import IArticuloInsumo from '../../../types/IArticuloInsumo';
import { setArticuloInsumo } from '../../../redux/slices/ArticuloInsumoReducer';
import ArticuloManufacturadoPost from '../../../types/post/ArticuloManufacturadoPost';
import ArticuloInsumoService from '../../../services/ArticuloInsumoService';
import ICategoria from '../../../types/ICategoria';
import CategoriaService from '../../../services/CategoriaService';
import { setCategoria } from '../../../redux/slices/CategoriaReducer';
import ArticuloManufacturadoDetallePost from '../../../types/post/ArticuloManufacturadoDetallePost';
import ArticuloManufacturadoDetalleService from '../../../services/ArticuloManufacturadoDetalleService';
import IArticuloManufacturadoDetalle from '../../../types/IArticuloManufacturadoDetalle';

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

  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    // Validaciones de Yup
  });

  const articuloInsumoService = new ArticuloInsumoService();
  const dispatch = useAppDispatch();
  const [filteredData, setFilteredData] = useState<IArticuloInsumo[]>([]);

  const fetchArticuloInsumos = async () => {
    try {
      const articulos = await articuloInsumoService.getAll(URL + '/ArticuloInsumo');
      dispatch(setArticuloInsumo(articulos));
      setFilteredData(articulos);
      console.log(articulos);
    } catch (error) {
      console.error("Error al obtener las unidades:", error);
    }
  };

  useEffect(() => {
    fetchArticuloInsumos();
  }, []);

  const [articuloInsumos, setArticuloInsumos] = useState<{ denominacion: string, id: number, unidadMedida: string }[]>([]);
  const [cantidades, setCantidades] = useState<number[]>([]);

  //  ESTO ES PARA CDO PONGA EL FETCH const [detalles, setDetalles] = useState<IArticuloManufacturadoDetalle[]>([]);

  const handleArticuloInsumoChange = (event: ChangeEvent<HTMLSelectElement>, index: number) => {
    const articuloInsumoDenominacion = event.target.value;
    const ArticuloInsumoSeleccionado = filteredData.find(articuloInsumo => articuloInsumo.denominacion === articuloInsumoDenominacion);
    if (ArticuloInsumoSeleccionado) {
      const newArticuloInsumos = [...articuloInsumos];
      newArticuloInsumos[index] = { denominacion: ArticuloInsumoSeleccionado.denominacion, id: ArticuloInsumoSeleccionado.id, unidadMedida: ArticuloInsumoSeleccionado.unidadMedida.denominacion };
      setArticuloInsumos(newArticuloInsumos);
    }
  };

  const handleCantidadChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newCantidades = [...cantidades];
    newCantidades[index] = parseFloat(event.target.value);
    setCantidades(newCantidades);
  };

  const addArticuloInsumo = () => {
    setArticuloInsumos([...articuloInsumos, { denominacion: '', id: 0, unidadMedida: '' }]);
    setCantidades([...cantidades, 0]);
  };

  const removeArticuloInsumo = (index: number) => {
    const newArticuloInsumos = articuloInsumos.filter((_, i) => i !== index);
    const newCantidades = cantidades.filter((_, i) => i !== index);
    setArticuloInsumos(newArticuloInsumos);
    setCantidades(newCantidades);
  };


  const [filteredData2, setFilteredData2] = useState<ICategoria[]>([]);
  const [categoriaDenominacion, setCategoriaDenominacion] = useState<string>('');
  const [selectedCategoriaPadreId, setCategoriaPadreId] = useState<number>(0);
  const categoriaService = new CategoriaService(); // Instancia del servicio de categoria

  const fetchCategorias = async () => {
    try {
      const categorias = await categoriaService.getAll(URL + '/categoria');
      dispatch(setCategoria(categorias));
      setFilteredData2(categorias);
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
    const categoriaSeleccionada = filteredData2.find(articuloInsumo => articuloInsumo.denominacion === categoriaDenominacion);
    if (categoriaSeleccionada) {
      // Asignar el ID de la localidad seleccionada
      setCategoriaPadreId(categoriaSeleccionada.id);
      setCategoriaDenominacion(categoriaSeleccionada.denominacion); // Actualizar el nombre de la localidad seleccionada
    }
  };
  const articuloManufacturadoDetalleService= new ArticuloManufacturadoDetalleService();

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
        idCategoria: selectedCategoriaPadreId
      };
  
      if (isEditMode) {
        await articuloManufacturadoService.put(`${URL}/ArticuloManufacturado`, values.id, body);
      } else {
        await articuloManufacturadoService.post(`${URL}/ArticuloManufacturado`, body);
      }
  
      // Obtener el último id de articuloManufacturado
      const articulos = await articuloManufacturadoService.getAll(URL + '/ArticuloManufacturado');
      const ultimoId = articulos[articulos.length - 1].id;
      
      // Crear el array de ArticuloManufacturadoDetallePost
      const detalles: ArticuloManufacturadoDetallePost[] = articuloInsumos.map((articuloInsumo, index) => ({
        cantidad: cantidades[index],
        idArticuloInsumo: articuloInsumo.id,
        idArticuloManufacturado: isEditMode ? values.id : ultimoId
      }));
      
      await Promise.all(detalles.map(async (detalle) => {
        console.log("primero entra");
        await articuloManufacturadoDetalleService.post(`${URL}/ArticuloManufacturadoDetalle`, detalle);
        console.log("despues");
      }));
  

      
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

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar ArticuloManufacturado' : 'Añadir ArticuloManufacturado'}
      initialValues={articuloManufacturadoAEditar || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      <TextFieldValue label="denominacion" name="denominacion" type="text" placeholder="denominacion" />
      <TextFieldValue label="descripcion" name="descripcion" type="text" placeholder="descripcion" />
      <TextFieldValue label="tiempoEstimado" name="tiempoEstimadoMinutos" type="number" placeholder="tiempo estimado" />
      <TextFieldValue label="precioVenta" name="precioVenta" type="number" placeholder="precio de venta" />
      <TextFieldValue label="preparacion" name="preparacion" type="text" placeholder="preparacion" />
      <SelectList
              title="Categoria"
              items={filteredData2.map((categoria: ICategoria) => categoria.denominacion)}
              handleChange={handleCategoriaChange}
              selectedValue={categoriaDenominacion}
              disabled={isEditMode}
            />

      {articuloInsumos.map((articuloInsumo, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <SelectList
            title="Insumo"
            items={filteredData.map((insumo: IArticuloInsumo) => insumo.denominacion)}
            handleChange={(event) => handleArticuloInsumoChange(event, index)}
            selectedValue={articuloInsumo.denominacion}
            disabled={isEditMode}
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
      ))}
      <button type="button" onClick={addArticuloInsumo}>Agregar Insumo</button>
    </GenericModal>
  );
};

export default ModalArticuloManufacturado;
