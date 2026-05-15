import React from 'react';
import './Input.scss';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  value?: string;
  rows?: number;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  prefix,
  suffix,
  value,
  rows = 4,
  maxLength,
  onChange,
  onBlur,
}) => {
  const inputId = `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`input-group${error ? ' input-group--error' : ''}`}>
      {label && (
        <label className="input-group__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <div className="input-group__wrapper">
        {prefix && <span className="input-group__prefix">{prefix}</span>}
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            className="input-group__control input-group__control--textarea"
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            rows={rows}
          />
        ) : (
          <input
            id={inputId}
            className="input-group__control"
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
        {suffix && <span className="input-group__suffix">{suffix}</span>}
      </div>
      {error && <span className="input-group__error">{error}</span>}
      {hint && !error && <span className="input-group__hint">{hint}</span>}
    </div>
  );
};

export default Input;
