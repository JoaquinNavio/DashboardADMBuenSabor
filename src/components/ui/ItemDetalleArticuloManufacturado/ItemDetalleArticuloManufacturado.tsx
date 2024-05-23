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
        return !selectedIdCategoria || insumo.categoria.id === selectedIdCategoria;
    });

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <SelectList
                title="Filtrar por categoria"
                items={props.categorias.reduce((mapa, categoria) => {
                    mapa.set(categoria.id, categoria.denominacion);
                    return mapa;
                }, new Map<number, string>())}
                handleChange={handleCategoriaChange}
                selectedValue={selectedIdCategoria}
                disabled={!!props.idDetalle}
            />
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
            <div style={{ marginLeft: '10px' }}>
                <input
                    type="number"
                    placeholder={`Cantidad en: ${props.insumos.find(element => element.id === selectedId)?.unidadMedida.denominacion}`}
                    value={cantidad}
                    onChange={(event) => {
                        const newCantidad = parseInt(event.target.value);
                        setCantidad(newCantidad);
                        props.handleItemChange(props.idComponent, selectedId, newCantidad);
                    }}
                />
            </div>
            <button
                type="button"
                onClick={() => props.removeComponent(props.idComponent, props.idDetalle)}
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
            >
                &times;
            </button>
        </div>
    );
}
