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

/*ModalArticuloManufacturadoProps define las propiedades que se pueden pasar al componente ModalArticuloManufacturado.*/
interface ModalArticuloManufacturadoProps {
  modalName: string;

  /*Esta propiedad representa los valores iniciales que se utilizarán para inicializar el formulario dentro del modal. */
  initialValues: ArticuloManufacturado;
  isEditMode: boolean;

  /*Esta propiedad es una función que se utilizará para actualizar la lista de artículos manufacturados
  después de que se realice una acción en el modal, como crear o editar un artículo manufacturado.  */
  getArticuloManufacturados: () => Promise<void>;

  /*Esta propiedad es opcional y representa el artículo manufacturado que se está editando. 
  Se utiliza específicamente cuando el modal está en modo de edición 
  para proporcionar los datos del artículo que se está editando. */
  articuloManufacturadoAEditar?: ArticuloManufacturado;
}


const ModalArticuloManufacturado: React.FC<ModalArticuloManufacturadoProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getArticuloManufacturados,
  articuloManufacturadoAEditar,
}) => {

  /*Esta línea utiliza el hook useSelector de Redux para obtener el estado global de la aplicación 
  y extraer el valor del modal específico identificado por modalName. 
  useSelector recibe como argumento una función que toma el estado global (state) 
  y devuelve la parte específica del estado que necesitamos. 
  En este caso, state.modal[modalName] busca el valor del modal en el estado global utilizando modalName como clave.*/
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  //instancia del servicio ArticuloManufacturadoService
  const articuloManufacturadoService = new ArticuloManufacturadoService();

  //url api
  const URL = import.meta.env.VITE_API_URL;

  //Se define un esquema de validación utilizando Yup para validar los datos del formulario.
  const validationSchema = Yup.object().shape({
    //TODO Validaciones de Yup
  });

  //ARTICULOS INSUMO
  //---------------------------------------------------------------------------

  //instancia del servicio ArticuloInsumoService.
  const articuloInsumoService = new ArticuloInsumoService();

  /*Se utiliza el hook useState para inicializar un estado local llamado articulosInsumo.
  articulosInsumo es un array que contiene los artículos de insumo obtenidos del backend.
  setArticulosInsumo es una función que se utiliza para actualizar el estado de articulosInsumo. */
  const [articulosInsumo, setArticulosInsumo] = useState<IArticuloInsumo[]>([]);


  /*Se utiliza el hook useEffect para realizar efectos secundarios en el componente.
  Este efecto se ejecutará cada vez que showModal cambie.
  Dentro de este efecto, se define una función fetchArticuloInsumos que se encarga de obtener los artículos de insumo del backend.
  Se realiza una solicitud HTTP GET al endpoint ${URL}/ArticuloInsumo utilizando el servicio articuloInsumoService 
  para obtener los artículos de insumo.
  Una vez que se obtienen los artículos de insumo, se actualiza el estado local articulosInsumo 
  utilizando la función setArticulosInsumo.
  Si ocurre algún error durante la obtención de los artículos de insumo, 
  se captura y se muestra un mensaje de error en la consola. */
  useEffect(() => {
    //obtener los artículos de insumo del backend
    const fetchArticuloInsumos = async () => {
      try {
        //solicitud HTTP GET
        const articulos = await articuloInsumoService.getAll(URL + '/ArticuloInsumo');
        //se actualiza el estado local articulosInsumo
        setArticulosInsumo(articulos);
      } catch (error) {
        console.error("Error al obtener articulos insumo:", error);
      }
    };
    fetchArticuloInsumos();
  }, [showModal]);


  /*Se utiliza el hook useState para inicializar el estado local llamado articulosInsumosItems.
  articulosInsumosItems es un array que contendrá objetos con información sobre los artículos de insumo seleccionados en el componente.
  setArticulosInsumosItems es una función que se utilizará para actualizar el estado de articulosInsumosItems. */
  const [articulosInsumosItems, setArticulosInsumosItems] = useState<{
    idComponent: number;
    selectedArticuloInsumoId?: number;
    cantidad?: number;
    idDetalle?: number;
  }[]>([]);


  /*Esta función se encarga de agregar un nuevo elemento al array articulosInsumosItems.
  Se utiliza el spread operator ... para crear una nueva copia del array articulosInsumosItems y agregar un nuevo objeto al final.
  El nuevo objeto tiene la propiedad idComponent, cuyo valor es igual a la longitud actual del array articulosInsumosItems.
  Finalmente, se actualiza el estado de articulosInsumosItems con el nuevo array que contiene el nuevo elemento agregado.*/
  const addNewItem = () => {
    setArticulosInsumosItems([...articulosInsumosItems, { idComponent: articulosInsumosItems.length }]);
  }


  /*Esta función se encarga de eliminar un elemento del array articulosInsumosItems según su idComponent.
  Si el elemento tiene un idDetalle, significa que está en la base de datos y se solicita confirmación antes de eliminarlo permanentemente.
  Se utiliza window.confirm para mostrar un mensaje de confirmación al usuario.
  Si el usuario confirma la eliminación, se realiza una solicitud HTTP DELETE al endpoint ${URL}/ArticuloManufacturadoDetalle 
  utilizando el servicio articuloManufacturadoDetalleService para eliminar el detalle del artículo manufacturado.
  Después de eliminar el elemento, se actualiza el estado de articulosInsumosItems filtrando el array 
  para excluir el elemento con el idComponent proporcionado. */
  const removeItem = (idComponent: number, idDetalle: number) => {

    //si tiene idDetalle esta en la base de datos
    //lo que verifica que se muestre la alerta solo en el modal de edicion
    if (idDetalle) {
      //solicita confirmación antes de eliminarlo
      const userConfirmed = window.confirm('¿Estás seguro, se eliminara permanentemente?');
      if (userConfirmed) {
        //solicitud HTTP DELETE
        articuloManufacturadoDetalleService.delete(`${URL}/ArticuloManufacturadoDetalle`, idDetalle)
      } else {
        return;
      }
    }
    //actualiza el estado de articulosInsumosItems
    setArticulosInsumosItems(articulosInsumosItems.filter(item => item.idComponent !== idComponent))
  }

  /*Esta función se encarga de manejar los cambios en un elemento del array articulosInsumosItems.
  Recibe como parámetros el idComponent del elemento que se va a modificar, 
  así como los nuevos valores de selectedArticuloInsumoId, cantidad e idDetalle.
  Utiliza map para iterar sobre el array articulosInsumosItems y actualizar el elemento con el idComponent proporcionado.
  Si el idComponent coincide con el elemento que se está modificando, 
  se actualizan las propiedades selectedArticuloInsumoId, cantidad e idDetalle.
  Finalmente, se actualiza el estado de articulosInsumosItems con el nuevo array que contiene los cambios realizados. */
  const handleItemChange = (idComponent: number, selectedArticuloInsumoId?: number, cantidad?: number, idDetalle?: number) => {
    //iterar sobre el array articulosInsumosItems
    setArticulosInsumosItems(articulosInsumosItems.map(item => {
      if (item.idComponent === idComponent) {
        //idComponent coincide
        //se actualizan las propiedades
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

  //CATEGORIAS
  //------------------------------------------------------------------

  // Instancia del servicio de categoria
  const categoriaService = new CategoriaService();

  /*Aquí se define un estado llamado categorias utilizando el hook useState.
  Este estado almacenará un array de objetos de tipo ICategoria.
  Se inicializa con un array vacío []. */
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  /*Se utiliza el hook useEffect para realizar efectos secundarios en el componente, en este caso, la obtención de las categorías.
  La función dentro de useEffect se ejecutará cada vez que cambie la dependencia showModal.
  Dentro de la función, se define una función asincrónica fetchCategorias 
  que realiza una solicitud para obtener todas las categorías a través del servicio categoriaService.
  Si la solicitud es exitosa, se actualiza el estado de categorias utilizando la función setCategorias 
  con el array de categorías obtenido.
  Si ocurre algún error durante la solicitud, se captura y se imprime en la consola. */
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        //solicitud para obtener todas las categorías
        const categorias = await categoriaService.getAll(URL + '/categoria');
        //se actualiza el estado de categorias
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener las Categorias:", error);
      }
    };
    fetchCategorias();
  }, [showModal])

  /*Se define otro estado llamado selectedCategoriaId utilizando el hook useState.
  Este estado almacenará el ID de la categoría seleccionada por el usuario.
  Se inicializa como undefined. */
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>(undefined);

  /*Se define una función llamada handleCategoriaChange que se ejecutará 
  cada vez que cambie la selección en un elemento <select> de HTML.
  Recibe un evento ChangeEvent<HTMLSelectElement> que representa el cambio en el elemento <select>.
  Dentro de la función, se obtiene el valor seleccionado del elemento <select> utilizando event.target.value.
  Se convierte el valor seleccionado a tipo number utilizando parseInt.
  Si el valor es válido (diferente de NaN), se actualiza el estado de selectedCategoriaId con el ID de la categoría seleccionada 
  utilizando la función setSelectedCategoriaId. */
  const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = parseInt(event.target.value);
    if (categoriaId) {
      //actualiza el estado de selectedCategoriaId con el ID de la categoría seleccionada
      setSelectedCategoriaId(categoriaId);
    }
  };

  //ARTICULO MANUFACTURADO
  // -------------------------------------------------------------------------------

  //Instancia de ArticuloManufacturadoDetalleService
  const articuloManufacturadoDetalleService = new ArticuloManufacturadoDetalleService();

  // const [imagenCargada, setImagenCargada] = useState<IImage | undefined>(undefined);
  // useEffect(() => {
  //   if(showModal){
  //     setImagenCargada(initialValues.image?.id!=0? initialValues.image : undefined);
  //   }
  // }, [showModal])


  /*handleSubmit se encarga de manejar el envío de datos del formulario que contiene información sobre el artículo manufacturado.*/
  const handleSubmit = async (values: ArticuloManufacturado) => {
    //Obtencion de imagen
    // let imagenGuardada: any;
    // if(selectedFiles != null){
    //   imagenGuardada = await imageService.uploadImagenes(selectedFiles,URL);
    // }
    // const idImage = imagenCargada? imagenCargada.id : (imagenGuardada? imagenGuardada.ids[0] : null)


    try {
      /*Se crea un objeto body de tipo ArticuloManufacturadoPost 
      que contiene la información del artículo manufacturado a enviar al Backend.
      Se asignan valores de values (los datos del formulario) a las propiedades correspondientes del objeto body.
      Se establece la propiedad idCategoria utilizando selectedCategoriaId si está definida, de lo contrario, 
      se utiliza el ID de la categoría inicial (initialValues.categoria.id).
      Se inicializa la propiedad detalles como un array vacío, que se llenará más adelante en el bucle.
      Se asigna el idImage al objeto body. */
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

      /*Se itera sobre el array articulosInsumosItems que contiene los detalles del artículo manufacturado 
      (por ejemplo, los insumos utilizados).
      Para cada elemento del array, se construye un objeto detalle que contiene 
      la cantidad del insumo (cantidad), el ID del insumo (idArticuloInsumo) y el ID del detalle (si está disponible).
      Este objeto detalle se añade al array detalles del objeto body */
      for (const item of articulosInsumosItems) {
        const detalle = {
          cantidad: item.cantidad || 0,
          idArticuloInsumo: item.selectedArticuloInsumoId || 0,
          idDetalle: item.idDetalle
        };
        //se añade al array detalles del objeto body
        body.detalles.push(detalle);
      }
      /*Si isEditMode es verdadero, se realiza una solicitud PUT utilizando articuloManufacturadoService.putx, 
      que actualiza el artículo manufacturado existente en el servidor.
      De lo contrario, se realiza una solicitud POST 
      utilizando articuloManufacturadoService.postx, que crea un nuevo artículo manufacturado en el servidor.
      Una vez completada la solicitud (ya sea POST o PUT), 
      se llama a la función getArticuloManufacturados para actualizar la lista de artículos manufacturados 
      en el estado de la aplicación.*/

      if (isEditMode) {
        //solicitud PUT
        await articuloManufacturadoService.putx(`${URL}/ArticuloManufacturado/updateWithDetails`, values.id, body);
      } else {
        //una solicitud POST
        await articuloManufacturadoService.postz(`${URL}/ArticuloManufacturado/createWithDetails`, body);
      }
      //actualizar la lista de artículos manufacturados
      getArticuloManufacturados();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  /*Si isEditMode es falso, significa que el modal está en modo de creación de un nuevo artículo manufacturado.
  Se inicializa el objeto initialValues con valores predeterminados para un nuevo artículo manufacturado.
  Todos los campos se establecen en valores predeterminados
  Se inicializan también los objetos unidadMedida y categoria con valores predeterminados.
  El campo image se inicializa con una URL vacía, un nombre vacío, un ID de imagen en 0 y el indicador eliminado en falso. */
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

  /*Esta función se ejecuta cuando se cierra el modal.
  Se encarga de realizar algunas limpiezas y restablecer valores.
  Se establece selectedCategoriaId como undefined.
  Se vacían los arrays articulosInsumosItems y detalles*/
  const onClose = () => {
    setSelectedCategoriaId(undefined);
    setArticulosInsumosItems([]);
    setDetalles([]);
  }

  //Se utiliza el hook useState para inicializar el estado detalles como un array vacío de IArticuloManufacturadoDetalle
  const [detalles, setDetalles] = useState<IArticuloManufacturadoDetalle[]>([]);

  /*Se utiliza el hook useEffect para realizar operaciones después de que el componente se monta y cada vez que showModal cambia.
  Dentro de este efecto, se define una función fetchDetalles 
  que realiza una solicitud al Backend para obtener los detalles del artículo manufacturado.
  Se utiliza el servicio articuloManufacturadoService para obtener los detalles 
  utilizando la URL proporcionada y el ID inicial del artículo manufacturado (initialValues.id).
  Los detalles obtenidos se establecen en el estado detalles y se actualiza el estado articulosInsumosItems 
  con los detalles de los insumos obtenidos, mapeándolos adecuadamente. 
  Cada detalle se convierte en un objeto con las propiedades necesarias para mostrarlos en el formulario del modal. */
  useEffect(() => {
    const fetchDetalles = async () => {
      //obtener los detalles del artículo manufacturado
      const detallitos: IArticuloManufacturadoDetalle[] = await articuloManufacturadoService.getDetalles(`${URL}/ArticuloManufacturado`, initialValues.id)
      setDetalles(detallitos)
      setArticulosInsumosItems(
        detallitos.map((det, ix /*IX ES UN NUMERO RANDOM */) => ({
          idComponent: ix,
          selectedArticuloInsumoId: det.articuloInsumo.id,
          cantidad: det.cantidad,
          idDetalle: det.id,
        }))
      )
    }
    fetchDetalles();
  }, [showModal]);

  //IMAGEN
  //--------------------------------------------------------------------------

  // Estado para almacenar archivos seleccionados para subir
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  useEffect(() => {
    if (showModal) {
      setSelectedFiles(null);
    }
  }, [showModal]);

  // Manejador de cambio de archivos seleccionados
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleDeleteImg = () => {
    console.log("borrar");
    //  setImagenCargada(undefined);
  };
  //---------------------------------------------------------------------------

  /*Se utiliza el componente GenericModal para crear el modal.
  Se pasan varias props al componente:
  modalName: El nombre del modal.
  title: El título del modal, que varía dependiendo de si está en modo de edición (isEditMode) o modo de añadir un nuevo artículo.
  initialValues: Los valores iniciales del artículo manufacturado. 
  Si está en modo de edición, se utilizan los valores del artículo a editar (articuloManufacturadoAEditar),
  de lo contrario, se utilizan los valores iniciales predeterminados.
  validationSchema: El esquema de validación para los datos del formulario.
  onSubmit: La función que se llama cuando se envía el formulario.
  isEditMode: Un indicador booleano que especifica si el modal está en modo de edición.
  onClose: La función que se llama cuando se cierra el modal.*/

  /*Se mapea sobre el array articulosInsumosItems para renderizar los detalles de los artículos insumos.
  Cada detalle se renderiza utilizando el componente ItemDetalleArticuloManufacturado,
  al cual se pasan varias props, como el ID del componente, el ID del detalle, la lista de artículos insumos, etc.
  También se incluye un botón para agregar un nuevo ítem de insumo (Agregar Insumo) 
  que llama a la función addNewItem al hacer clic. */
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


      {
        articulosInsumosItems.map(item => {
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
              categorias={categorias}
            />

          )
        })}
      <button type="button" style={{ margin: '10px' }} className='btn btn-primary' onClick={addNewItem}>{<Add />} Agregar Insumo</button>

      <div>
        <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Imagenes</label>
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
        {/* Componente de galería para mostrar las imágenes */}

        {isEditMode && (
          <Gallery images={initialValues.imagenes} handleDeleteImg={handleDeleteImg} />
        )}

      </div>

    </GenericModal>
  );
};

export default ModalArticuloManufacturado;
