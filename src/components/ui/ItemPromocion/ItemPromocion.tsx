import { ChangeEvent, useEffect, useState } from "react";
import ICategoria from "../../../types/ICategoria";
import SelectList from "../SelectList/SelectList";
import IArticuloManufacturado from "../../../types/IArticuloManufacturado";


export interface ItemPromocionProps {
    idComponent: number;
    idDetalle?:number;
    insumos: IArticuloManufacturado[];
    cantidad?: number;
    selectedArticuloId?: number;
    handleItemChange: (idComponent: number, selectedArticuloId?: number, cantidad?: number, idPromocion?: number) => void;
    removeComponent: (idComponent: number,idPromocion? :number ) => void;
    categorias: ICategoria[];
}

export default function ItemPromocion(props: ItemPromocionProps) {
    const [cantidad, setCantidad] = useState<number | undefined>(props.cantidad);
    const [selectedId, setSelectedId] = useState<number | undefined>(props.selectedArticuloId);
    const [selectedIdCategoria, setSelectedIdCategoria] = useState<number | undefined>(undefined);
    const [subtotal, setSubtotal] = useState<number | undefined>(0); // Estado para almacenar el subtotal

    const handleArticuloInsumoChange = (event: ChangeEvent<HTMLSelectElement>) => {
    
        const articuloInsumoId = parseInt(event.target.value);
        if (articuloInsumoId) {
            setSelectedId(articuloInsumoId);
            props.handleItemChange(props.idComponent, articuloInsumoId,  props.idDetalle);
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
        return !selectedIdCategoria || insumo.categoria.id === selectedIdCategoria ;
    });

    // Calcular el subtotal multiplicando el precio de venta por la cantidad
    useEffect(() => {
        if (cantidad && selectedId) {
            const selectedInsumo = props.insumos.find(insumo => insumo.id === selectedId);
            if (selectedInsumo) {
                const newSubtotal = selectedInsumo.precioVenta * cantidad;
                setSubtotal(newSubtotal);
            }
        } else {
            setSubtotal(0);
        }
    }, [cantidad, selectedId]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '5px', padding: '10px', marginBottom: '20px', boxShadow: '0px -1px 15px -1px rgba(0,0,0,0.45)' }}>
            <div>
            <SelectList
                title="Filtrar articulo por categoría"
                items={props.categorias.reduce((mapa, categoria) => {
                    if (categoria.esInsumo) {
                        mapa.set(categoria.id, categoria.denominacion);
                    }
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
                title="Articulo Manufacturado"
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
            <div style={{display: 'flex', }}>Subtotal: {subtotal} $</div>
            
        </div>
        
        
    );
}
