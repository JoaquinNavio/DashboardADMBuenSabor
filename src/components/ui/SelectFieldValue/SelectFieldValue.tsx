
import React, { ChangeEvent } from 'react';
import { Field } from 'formik';

interface Props {
  label: string; // Etiqueta del campo
  name: string; // Nombre del campo
  type: string; // Tipo de campo (text, number, etc.)
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string; // Placeholder del campo
  disabled?: boolean; // Si el campo está deshabilitado
  options: { label: string; value: string | boolean }[]; // Opciones del select
}

const SelectFieldValue: React.FC<Props> = ({ label, name, type, placeholder, options }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <Field as="select" id={name} name={name} type={type} placeholder={placeholder} className="form-control">
      {options.map(option => (
        <option key={option.value.toString()} value={option.value.toString()}>
          {option.label}
        </option>
      ))}
    </Field>
  </div>
);

export default SelectFieldValue;
