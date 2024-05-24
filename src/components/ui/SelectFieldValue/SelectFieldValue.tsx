
import { Field } from 'formik';

interface Props {
  label: string; // Etiqueta del campo
  name: string; // Nombre del campo
  type: string; // Tipo de campo (text, number, etc.)
  placeholder: string; // Placeholder del campo
  disabled: boolean; // Si el campo está deshabilitado
  options: { label: string; value: string | boolean }[]; // Opciones del select
}

const SelectFieldValue: React.FC<Props> = ({ label, name, type, placeholder, options }) => (
  <div className="form-group">
    <label htmlFor={name} style={{
            fontSize: "16px",
            fontWeight: "bold",
          }}>{label}</label>
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
