import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            focused || hasValue
              ? 'top-2 text-xs text-primary font-medium'
              : 'top-1/2 -translate-y-1/2 text-sm text-surface-500'
          }`}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          disabled={disabled}
          className={`w-full px-3 py-3 border rounded-md transition-all duration-200 ${
            icon ? 'pl-10' : ''
          } ${
            label ? 'pt-6 pb-2' : ''
          } ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger'
              : focused
              ? 'border-primary focus:border-primary focus:ring-primary'
              : 'border-surface-300 hover:border-surface-400'
          } ${
            disabled ? 'bg-surface-50 cursor-not-allowed' : 'bg-white'
          } focus:outline-none focus:ring-2 focus:ring-offset-0`}
          {...props}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-danger flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;