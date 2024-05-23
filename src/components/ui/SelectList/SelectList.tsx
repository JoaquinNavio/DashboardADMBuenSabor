import './select.css'

interface SelectListProps{
    title: string;
    items: Map<number, string>; //el key es el id, value es el texto de la opcion
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedValue: number | undefined;
    disabled?: boolean
}

export default function SelectList (props:SelectListProps) {
    const options:JSX.Element[] = [];
    props.items.forEach((value, key)=>{
        options.push(<option key={key} value={key}>{value}</option>)
    })
    return (
        <div className="select-list-container">
            <label htmlFor={`${props.title}-select`} className="select-label"><b>{props.title}</b></label>
            <select
                id={`${props.title}-select`}
                className="select-list"
                onChange={props.handleChange}
                value={props.selectedValue}
                disabled={props.disabled}
            >
                <option selected disabled>Seleccione una opción</option>
                {options}
            </select>
        </div>
    );
}
