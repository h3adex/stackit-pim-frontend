import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const updateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const position = {
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      };
      setDropdownPosition(position);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is inside the select trigger
      if (selectRef.current && selectRef.current.contains(target)) {
        return;
      }
      
      // Check if click is inside the dropdown options
      if (optionsRef.current && optionsRef.current.contains(target)) {
        return;
      }
      
      // Click is outside both trigger and dropdown, close it
      setIsOpen(false);
      setHighlightedIndex(-1);
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          updateDropdownPosition();
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    // Immediately close dropdown and update UI for responsive feel
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    // Call onChange asynchronously to decouple from UI update
    setTimeout(() => {
      onChange(optionValue);
    }, 0);
  };

  const toggleOpen = () => {
    if (!disabled) {
      if (!isOpen) {
        updateDropdownPosition();
      }
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div 
      ref={selectRef}
      className={`${styles.selectContainer} ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      {icon && (
        <div className={styles.selectIcon}>
          {icon}
        </div>
      )}
      
      <div
        className={`${styles.selectTrigger} ${disabled ? styles.disabled : ''} ${isOpen ? styles.open : ''}`}
        onClick={toggleOpen}
        style={{
          paddingLeft: icon ? '2.5rem' : '1rem'
        }}
      >
        <span className={`${styles.selectValue} ${!selectedOption ? styles.placeholder : ''}`}>
          {displayValue}
        </span>
        <div className={`${styles.selectArrow} ${isOpen ? styles.rotated : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="m6 8 4 4 4-4"
            />
          </svg>
        </div>
      </div>

      {isOpen && createPortal(
        <div 
          className={styles.selectDropdown}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`
          }}
        >
          <div ref={optionsRef} className={styles.selectOptions}>
            {options.length === 0 ? (
              <div className={styles.selectOption}>No options available</div>
            ) : (
              options.map((option, index) => (
                <div
                  key={option.value}
                  className={`${styles.selectOption} ${
                    option.value === value ? styles.selected : ''
                  } ${
                    index === highlightedIndex ? styles.highlighted : ''
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleOptionClick(option.value);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Select;
