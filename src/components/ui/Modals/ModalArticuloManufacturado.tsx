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
import ArticuloManufacturadoDetalleService from '../../../services/ArticuloManufacturadoDetalleService';
import ItemDetalleArticuloManufacturado from '../ItemDetalleArticuloManufacturado/ItemDetalleArticuloManufacturado';
import IArticuloManufacturadoDetalle from '../../../types/IArticuloManufacturadoDetalle';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Gallery } from '../Gallery/Gallery';
import { TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuth0 } from "@auth0/auth0-react";

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
  const { getAccessTokenSilently } = useAuth0();
  const showModal = useSelector((state: RootState) => state.modal[modalName]);
  const articuloManufacturadoService = new ArticuloManufacturadoService();
  const URL = import.meta.env.VITE_API_URL;
  const validationSchema = Yup.object().shape({});

  const articuloInsumoService = new ArticuloInsumoService();
  const [articulosInsumo, setArticulosInsumo] = useState<IArticuloInsumo[]>([]);

  useEffect(() => {
    const fetchArticuloInsumos = async () => {
      try {
        const token = await getAccessTokenSilently();
        const articulos = await articuloInsumoService.getAll(URL + '/ArticuloInsumo', token);
        setArticulosInsumo(articulos);
      } catch (error) {
        console.error("Error al obtener articulos insumo:", error);
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
    setArticulosInsumosItems([...articulosInsumosItems, { idComponent: articulosInsumosItems.length }]);
  }

  const removeItem = async (idComponent: number, idDetalle: number) => {
    if (idDetalle) {
      const userConfirmed = window.confirm('¿Estás seguro, se eliminara permanentemente?');
      if (userConfirmed) {
        const token = await getAccessTokenSilently();
        await articuloManufacturadoDetalleService.delete(`${URL}/ArticuloManufacturadoDetalle`, idDetalle, token)
      } else {
        return;
      }
    }
    setArticulosInsumosItems(articulosInsumosItems.filter(item => item.idComponent !== idComponent))
  }

  const handleItemChange = (idComponent: number, selectedArticuloInsumoId?: number, cantidad?: number, idDetalle?: number) => {
    setArticulosInsumosItems(articulosInsumosItems.map(item => {
      if (item.idComponent === idComponent) {
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
  }, [showModal])

  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>(undefined);

  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = parseInt(event.target.value);
    if (categoriaId) {
      setSelectedCategoriaId(categoriaId);
    }
  };

  const articuloManufacturadoDetalleService = new ArticuloManufacturadoDetalleService();

  const handleSubmit = async (values: ArticuloManufacturado) => {
    try {
      const token = await getAccessTokenSilently();
      const body: ArticuloManufacturadoPost = {
        tiempoEstimadoMinutos: values.tiempoEstimadoMinutos,
        descripcion: values.descripcion,
        preparacion: values.preparacion,
        eliminado: false,
        denominacion: values.denominacion,
        precioVenta: values.precioVenta,
        idUnidadMedida: 1,
        idCategoria: selectedCategoriaId || initialValues.categoria.id,
        detalles: [],
        imagenes: selectedFiles
      };

      for (const item of articulosInsumosItems) {
        const detalle = {
          cantidad: item.cantidad || 0,
          idArticuloInsumo: item.selectedArticuloInsumoId || 0,
          idDetalle: item.idDetalle
        };
        body.detalles.push(detalle);
      }

      if (isEditMode) {
        await articuloManufacturadoService.putx(`${URL}/ArticuloManufacturado/updateWithDetails`, values.id, body, token);
      } else {
        await articuloManufacturadoService.postz(`${URL}/ArticuloManufacturado/createWithDetails`, body, token);
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
      detalles: [],
      imagenes: []
    };
  }

  const onClose = () => {
    setSelectedCategoriaId(undefined);
    setArticulosInsumosItems([]);
    setDetalles([]);
  }

  const [detalles, setDetalles] = useState<IArticuloManufacturadoDetalle[]>([]);

  useEffect(() => {
    const fetchDetalles = async () => {
      const token = await getAccessTokenSilently();
      const detallitos: IArticuloManufacturadoDetalle[] = await articuloManufacturadoService.getDetalles(`${URL}/ArticuloManufacturado`, initialValues.id, token);
      setDetalles(detallitos);
      setArticulosInsumosItems(
        detallitos.map((det, ix) => ({
          idComponent: ix,
          selectedArticuloInsumoId: det.articuloInsumo.id,
          cantidad: det.cantidad,
          idDetalle: det.id,
        }))
      );
    };
    fetchDetalles();
  }, [showModal]);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imageInputs, setImageInputs] = useState<number[]>([]);

  useEffect(() => {
    if (showModal) {
      setSelectedFiles(null);
      setImageInputs([]);
    }
  }, [showModal]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => {
        const updatedFiles = prev ? [...prev] : [];
        updatedFiles[index] = newFiles[0];
        return updatedFiles;
      });
    }
  };

  const addNewImageInput = () => {
    setImageInputs([...imageInputs, imageInputs.length]);
  };

  const handleDeleteImg = () => {
    console.log("borrar");
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
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
        <div>
          <TextFieldValue label="Tiempo Estimado" name="tiempoEstimadoMinutos" type="number" placeholder="tiempo estimado" />
        </div>
        <div>
          <TextFieldValue label="Precio Venta" name="precioVenta" type="number" placeholder="precio de venta" />
        </div>
      </div>
      <TextFieldValue label="Preparación" name="preparacion" type="text" placeholder="Ingrese preparación" />
      <div style={{ marginBottom: '15px' }}>
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

      {articulosInsumosItems.map(item => {
        const detalle = detalles.find(detalle => detalle.id === item.idDetalle);
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
            categorias={categorias}
          />
        );
      })}
      <button type="button" style={{ margin: '10px' }} className='btn btn-primary' onClick={addNewItem}>{<Add />} Agregar Insumo</button>

      <div>
        <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Imágenes</label>
        <div
          title="Imagenes"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2vh",
            padding: ".4rem",
          }}
        >
          {imageInputs.map((input, index) => (
            <div key={index}>
              <TextField
                id={`outlined-basic-${index}`}
                variant="outlined"
                type="file"
                onChange={(event) => handleFileChange(event, index)}
                inputProps={{
                  multiple: true,
                }}
              />
            </div>
          ))}
        </div>
        <button type="button" className='btn btn-secondary' onClick={addNewImageInput}>{<Add />} Añadir Nueva Imagen</button>
        {isEditMode && (
          <Gallery images={initialValues.imagenes} handleDeleteImg={handleDeleteImg} />
        )}
      </div>
    </GenericModal>
  );
};

export default ModalArticuloManufacturado;
