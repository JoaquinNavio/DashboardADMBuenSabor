import { ChangeEvent, useState } from "react";
import SelectList from "../SelectList/SelectList";
import IArticuloInsumo from "../../../types/IArticuloInsumo";
import ICategoria from "../../../types/ICategoria";

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
    const [cantidad, setCantidad] = useState<number | undefined>(props.cantidad);
    const [selectedId, setSelectedId] = useState<number | undefined>(props.selectedArticuloInsumoId);
    const [selectedIdCategoria, setSelectedIdCategoria] = useState<number | undefined>(undefined);

    const handleArticuloInsumoChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const articuloInsumoId = parseInt(event.target.value);
        if (articuloInsumoId) {
            setSelectedId(articuloInsumoId);
            props.handleItemChange(props.idComponent, articuloInsumoId, cantidad, props.idDetalle);
        }
    };

    const handleCategoriaChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const categoriaId = parseInt(event.target.value);
        if (categoriaId) {
            setSelectedIdCategoria(categoriaId);
            setSelectedId(undefined); // Reset selected insumo when category changes
        }
    };

    const filteredInsumos = props.insumos.filter(insumo => {
        return !selectedIdCategoria || insumo.categoria.id === selectedIdCategoria && insumo.esParaElaborar;
    });

    // Filtrar las categorÃas para excluir aquellas que tienen un idCategoriaPadre
    const categoriasSinPadre = props.categorias.filter(categoria =>  categoria.esInsumo);

    console.log(props.categorias)
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
