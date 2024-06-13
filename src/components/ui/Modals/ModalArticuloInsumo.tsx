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
import { Gallery } from '../Gallery/Gallery';
import { TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface ModalArticuloInsumoProps {
  modalName: string;
  initialValues: ArticuloInsumo;
  isEditMode: boolean;
  getArticuloInsumos: () => Promise<void>;
}

const ModalArticuloInsumo: React.FC<ModalArticuloInsumoProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getArticuloInsumos,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const articuloInsumoService = new ArticuloInsumoService();
  const URL = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object().shape({
    denominacion: Yup.string().required('Campo requerido'),
    precioVenta: Yup.number().required('Campo requerido'),
    precioCompra: Yup.number().required('Campo requerido'),
    stockActual: Yup.number().required('Campo requerido'),
    stockMaximo: Yup.number().required('Campo requerido')
  });

  const unidadMedidaService = new UnidadMedidaService();
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  useEffect(() => {
    const fetchUnidadMedida = async () => {
      try {
        const token = await getAccessTokenSilently();
        const unidades = await unidadMedidaService.getAll(URL + '/UnidadMedida', token);
        setUnidadesMedida(unidades);
      } catch (error) {
        console.error('Error al obtener las unidades:', error);
      }
    };
    fetchUnidadMedida();
  }, [modalName]);

  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] = useState<number | undefined>(undefined);
  const handleUnidadMedidaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const unidadMedidaId = parseInt(event.target.value);
    if (unidadMedidaId) {
      setSelectedUnidadMedidaId(unidadMedidaId);
    }
  };

  const categoriaService = new CategoriaService();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = await getAccessTokenSilently();
        const categorias = await categoriaService.getAll(URL + '/categoria', token);
        setCategorias(categorias);
      } catch (error) {
        console.error('Error al obtener las Categorias:', error);
      }
    };
    fetchCategorias();
  }, [modalName]);

  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>(undefined);
  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = parseInt(event.target.value);
    if (categoriaId) {
      setSelectedCategoriaId(categoriaId);
    }
  };

  const handleSubmit = async (values: ArticuloInsumo) => {
    try {
      const token = await getAccessTokenSilently();
      const body: ArticuloInsumoPost = {
        denominacion: values.denominacion,
        precioVenta: values.precioVenta,
        idUnidadMedida: selectedUnidadMedidaId || values.unidadMedida.id,
        precioCompra: values.precioCompra,
        stockActual: values.stockActual,
        stockMaximo: values.stockMaximo,
        esParaElaborar: values.esParaElaborar,
        idCategoria: selectedCategoriaId || values.categoria.id,
        imagenes: selectedFiles
      };
      console.log(body);
      console.log(values);
      if (isEditMode) {
        await articuloInsumoService.putx(`${URL}/ArticuloInsumo`, values.id, body, token);
      } else {
        await articuloInsumoService.postz(`${URL}/ArticuloInsumo/crearCompleto`, body, token); // Agrega un nuevo articuloInsumo si no está en modo de edición
      }
      getArticuloInsumos();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado: false,
      denominacion: '',
      precioVenta: 0,
      unidadMedida: {
        id: 0,
        eliminado: false,
        denominacion: ""
      },
      esParaElaborar: false,
      precioCompra: 0,
      stockActual: 0,
      stockMaximo: 0,
      categoria: {
        id: 0,
        eliminado: false,
        denominacion: "",
        esInsumo: false,
        categoriaPadre: undefined,
      },
      imagenes: []
    };
  }

  const onClose = () => {
    setSelectedCategoriaId(undefined);
    setSelectedUnidadMedidaId(undefined);
    setImageInputs([]);
    setSelectedFiles([]);
  };

  // Estado para almacenar archivos seleccionados para subir
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageInputs, setImageInputs] = useState<number[]>([]);
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  useEffect(() => {
    if (showModal) {
      setSelectedFiles([]);
      setImageInputs([]);
    }
  }, [showModal]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => {
        const updatedFiles = [...prev];
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
    // setImagenCargada(undefined);
  };

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Articulo Insumo' : 'Añadir Articulo Insumo'}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      onClose={onClose}
    >
      {/* Campos del formulario */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px', width: '100%' }}>
        <div style={{ flex: '0 0 80%' }}>
          <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Ingrese denominación" />
        </div>
        <div style={{ flex: '1' }}>
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
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
        <div>
          <TextFieldValue label="Precio Compra" name="precioCompra" type="number" placeholder="Precio Compra" />
        </div>
        <div>
          <TextFieldValue label="Precio Venta" name="precioVenta" type="number" placeholder="Precio Venta" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
        <div>
          <TextFieldValue label="Stock Actual" name="stockActual" type="number" placeholder="Stock Actual" />
        </div>
        <div>
          <TextFieldValue label="Stock Maximo" name="stockMaximo" type="number" placeholder="Stock Maximo" />
        </div>
      </div>
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

      <SelectList
        title="Categoria padre"
        items={categorias.reduce((mapa, categoria) => {
          mapa.set(categoria.id, categoria.denominacion);
          return mapa
        }, new Map<number, string>())}
        handleChange={handleCategoriaChange}
        selectedValue={selectedCategoriaId || (initialValues.categoria.id !== 0 ? initialValues.categoria.id : undefined)}
      />

      {/* Campo para subir imágenes */}
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
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={addNewImageInput}>Añadir Nueva Imagen</Button>
        {isEditMode && (
          <Gallery images={initialValues.imagenes} handleDelete={handleDeleteImg} />
        )}
      </div>
    </GenericModal>
  );
};

export default ModalArticuloInsumo;
