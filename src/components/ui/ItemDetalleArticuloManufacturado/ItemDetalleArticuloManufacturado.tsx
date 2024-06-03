import { ChangeEvent, useState } from "react";
import SelectList from "../SelectList/SelectList";
import IArticuloInsumo from "../../../types/IArticuloInsumo";
import ICategoria from "../../../types/ICategoria";

/*ItemDetalleArticuloManufacturado es un componente funcional
que se utiliza para gestionar los detalles de un artículo manufacturado, 
específicamente sus insumos y categorías.*/

/*Este componente recibe varias props que definen su comportamiento y los datos que maneja:
idComponent: Número que identifica de manera única este componente.
idDetalle: Número opcional que identifica el detalle del artículo, si está presente.
insumos: Array de objetos IArticuloInsumo que representa los insumos disponibles.
selectedArticuloInsumoId: Número opcional que representa el ID del insumo seleccionado.
cantidad: Número opcional que representa la cantidad del insumo.
handleItemChange: Función que se llama cuando se cambia algún valor en el componente.
removeComponent: Función que se llama para eliminar este componente.
categorias: Array de objetos ICategoria que representa las categorías disponibles. */
export interface ItemDetalleArticuloManufacturadoProps {
    idComponent: number;
    idDetalle?: number;
    insumos: IArticuloInsumo[];
    selectedArticuloInsumoId?: number;
    cantidad?: number;
    handleItemChange: (idComponent: number, selectedArticuloInsumoId?: number, cantidad?: number, idDetalle?: number) => void;
    removeComponent: (idComponent: number,idDetalle? :number ) => void;
    categorias: ICategoria[];
}

export default function ItemDetalleArticuloManufacturado(props: ItemDetalleArticuloManufacturadoProps) {

    /*cantidad: Estado local que maneja la cantidad del insumo.
    selectedId: Estado local que maneja el ID del insumo seleccionado.
    selectedIdCategoria: Estado local que maneja el ID de la categoría seleccionada. */
    const [cantidad, setCantidad] = useState<number | undefined>(props.cantidad);
    const [selectedId, setSelectedId] = useState<number | undefined>(props.selectedArticuloInsumoId);
    const [selectedIdCategoria, setSelectedIdCategoria] = useState<number | undefined>(undefined);

    /*handleArticuloInsumoChange: Maneja los cambios en la selección del insumo.
    Actualiza el estado selectedId.
    Llama a props.handleItemChange con los nuevos valores. */
    const handleArticuloInsumoChange = (event: ChangeEvent<HTMLSelectElement>) => {
        //Obtener el ID del insumo seleccionado
        const articuloInsumoId = parseInt(event.target.value);
        if (articuloInsumoId) {
            //Actualizar el estado local del insumo seleccionado
            setSelectedId(articuloInsumoId);
            //Llamar a la función de manejo de cambio del item
            props.handleItemChange(props.idComponent, articuloInsumoId, cantidad, props.idDetalle);
        }
    };

    //Esta función maneja los cambios en la selección de la categoría en el dropdown correspondiente.
    const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
        //Obtener el ID de la categoría seleccionada
        const categoriaId = parseInt(event.target.value);
        if (categoriaId) {
            //Actualizar el estado local de la categoría seleccionada
            setSelectedIdCategoria(categoriaId);
            //Resetear el estado local del insumo seleccionado
            setSelectedId(undefined);
        }
    };

    /*Filtrado de insumos: filteredInsumos filtra los insumos basándose en la categoría seleccionada (selectedIdCategoria). 
    Solo se muestran los insumos que pertenecen a la categoría seleccionada y que son para elaborar (esParaElaborar). */
    const filteredInsumos = props.insumos.filter(insumo => {
        return !selectedIdCategoria || insumo.categoria.id === selectedIdCategoria && insumo.esParaElaborar;
    });

    //Filtrar las categorÃas para excluir aquellas que tienen un idCategoriaPadre
    const categoriasSinPadre = props.categorias.filter(categoria =>  categoria.esInsumo);

    /*SelectList: Este componente se utiliza para crear dropdowns tanto para las categorías como para los insumos. 
    Los items de los dropdowns se construyen usando el método reduce para crear un Map de ID a denominación. */
    return (
        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '5px', padding: '10px', marginBottom: '20px', boxShadow: '0px -1px 15px -1px rgba(0,0,0,0.45)' }}>
            <div>
            <SelectList
                title="Filtrar insumo por categoría"
                items={categoriasSinPadre.reduce((mapa, categoria) => {
                    mapa.set(categoria.id, categoria.denominacion);
                    return mapa;
                }, new Map<number, string>())}
                handleChange={handleCategoriaChange}
                selectedValue={selectedIdCategoria}
                disabled={!!props.idDetalle}
            />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'start', gap:'10px', width: '100%'}}>
                <div style={{ flex: '0 0 70%' }}>
                <SelectList
                title="Insumo"
                items={filteredInsumos.reduce((mapa, insumo) => {
                    mapa.set(insumo.id, insumo.denominacion);
                    return mapa;
                }, new Map<number, string>())}
                handleChange={handleArticuloInsumoChange}
                selectedValue={selectedId}
                disabled={!!props.idDetalle}
            />
                </div>
            
             <div style={{ flex: '1' }}>
                <label className="select-label" style={{fontWeight: 'bold'}}>Cantidad:
                <input
                    type="number"
                    placeholder={`Cantidad: ${props.insumos.find(element => element.id === selectedId)?.unidadMedida.denominacion}`}
                    value={cantidad}
                    onChange={(event) => {
                        const newCantidad = parseInt(event.target.value);
                        setCantidad(newCantidad);
                        props.handleItemChange(props.idComponent, selectedId, newCantidad, props.idDetalle);
                    }}
                    className="form-control"
                />
                </label>
                </div>
            </div>
           
            <div style={{display: 'flex', justifyContent: 'end'}}>
            <button
                type="button"
                onClick={() => props.removeComponent(props.idComponent, props.idDetalle)}
                className="btn btn-danger"
                style={{color: 'white'}}
            >
                Cancelar
            </button>

            </div>
           
            
        </div>
    );
}
