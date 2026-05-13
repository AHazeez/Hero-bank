import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputClasses = `
    form-input
    ${error ? 'border-red-500 focus:border-red-500' : ''}
    ${className}
  `.trim();

  return (
    <div className="form-group mb-4.5">
      {label && (
        <label className="form-label text-xs text-text3 tracking-wider uppercase block mb-1.5">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-red text-xs mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-text3 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
