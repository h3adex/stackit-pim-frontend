import React from 'react';
import styles from './Input.module.css';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  type?: 'text' | 'email' | 'password' | 'search';
  autoFocus?: boolean;
  showClearButton?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  onRightIconClick,
  type = 'text',
  autoFocus = false,
  showClearButton = false
}) => {
  const handleClear = () => {
    onChange('');
  };

  const shouldShowClearButton = showClearButton && value.length > 0;

  return (
    <div className={styles.inputGroup}>
      {leftIcon && (
        <span className={styles.leftIcon}>
          {leftIcon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`${styles.input} ${leftIcon ? styles.inputWithLeftIcon : ''} ${className}`}
      />
      {shouldShowClearButton && (
        <button
          type="button"
          onClick={handleClear}
          className={`${styles.clearButton} ${shouldShowClearButton ? styles.clearButtonVisible : ''}`}
          tabIndex={-1}
        >
          ✕
        </button>
      )}
      {rightIcon && (
        <span
          className={styles.leftIcon}
          onClick={onRightIconClick}
          style={{ cursor: onRightIconClick ? 'pointer' : 'default' }}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
};

export default Input;
