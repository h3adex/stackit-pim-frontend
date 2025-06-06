import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
}) => {
  // Map variant prop to CSS module class
  const variantClass =
    variant === 'ghost'
      ? styles.buttonGhost
      : variant === 'danger'
      ? styles.buttonDanger
      : variant === 'success'
      ? styles.buttonSuccess
      : variant === 'secondary'
      ? styles.buttonAccent
      : styles.button;

  // Map size prop to CSS module class
  const sizeClass =
    size === 'sm'
      ? styles.buttonSm
      : size === 'lg'
      ? styles.buttonLg
      : styles.buttonMd;

  const allClasses = [
    styles.button,
    variantClass,
    sizeClass,
    className,
    disabled ? styles.disabled : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={allClasses}
    >
      {icon && iconPosition === 'left' && (
        <span style={{ marginRight: size === 'sm' ? '0.375rem' : '0.5rem' }}>
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span style={{ marginLeft: size === 'sm' ? '0.375rem' : '0.5rem' }}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
