import React, { useEffect, useState } from 'react';
import './switch.css'
import { Switch } from '@mui/material';

interface SwitchProps {
    title: string;
    handleChange: (event: React.ChangeEvent) => void;
    selectedValue: boolean;
    disabled?: boolean
}

const SwitchValue: React.FC<SwitchProps> = ({ title, handleChange, selectedValue, disabled }) => {
    const [currentSelectedValue, setCurrentSelectedValue] = useState(selectedValue);

    useEffect(() => {
        // Actualizar el valor seleccionado actual cuando cambie selectedValue
        setCurrentSelectedValue(selectedValue);
    }, [selectedValue]);

    return (
        <div className="select-list-container">
            <label htmlFor={`${title}-select`} className="select-label"><b>{title}</b></label>
            <Switch
                id={`${title}-switch`}
                onChange={handleChange}
                checked={currentSelectedValue}
                disabled={disabled}  
            />
        </div>
    );
};

export default SwitchValue;
