import Input from '@/components/atoms/Input';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  icon,
  disabled = false,
  className = '',
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  return (
    <div className={className}>
      <Input
        label={label}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        required={required}
        icon={icon}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default FormField;