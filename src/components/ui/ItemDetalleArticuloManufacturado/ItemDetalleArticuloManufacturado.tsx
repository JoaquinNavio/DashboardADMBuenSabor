import { ChangeEvent, useState } from "react";
import SelectList from "../SelectList/SelectList";
import IArticuloInsumo from "../../../types/IArticuloInsumo";

export interface ItemDetalleArticuloManufacturadoProps{
    idComponent: number;
    idDetalle?: number;
    items: IArticuloInsumo[];
    selectedArticuloInsumoId?: number;
    cantidad?: number;
    handleItemChange: (idComponent: number, selectedArticuloInsumoId?: number, cantidad?: number, idDetalle?: number) => void;
    removeComponent: (idComponent: number) => void;
}

export default function ItemDetalleArticuloManufacturado (props:ItemDetalleArticuloManufacturadoProps) {
    const [cantidad, setCantidad] = useState<number | undefined>(props.cantidad)
    
    const [selectedId, setSelectedId] = useState<number | undefined>(props.selectedArticuloInsumoId)
    const handleArticuloInsumoChange = (event: ChangeEvent<HTMLSelectElement>) => { 
        const articuloInsumoId = parseInt(event.target.value);
        if (articuloInsumoId){
            setSelectedId(articuloInsumoId);
            props.handleItemChange(props.idComponent, articuloInsumoId, cantidad, props.idDetalle)
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <SelectList
                title="Insumo"
                items={props.items.reduce((mapa, insumo) => {
                    mapa.set(insumo.id, insumo.denominacion);
                    return mapa
                }, new Map<number, string>())}
                handleChange={handleArticuloInsumoChange}
                selectedValue={selectedId}
              />
            <div style={{ marginLeft: '10px' }}>
                <input
                type="number"
                placeholder={`Cantidad en: ${props.items.find(element => element.id === selectedId)?.unidadMedida.denominacion}`}
                value={cantidad}
                onChange={(event) => {
                    setCantidad(parseInt(event.target.value));
                    props.handleItemChange(props.idComponent, selectedId, parseInt(event.target.value))
                }}
                />
            </div>
            <button 
                type="button" 
                onClick={() => props.removeComponent(props.idComponent)} 
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
            >
                &times;
            </button>
        </div>
    )
}