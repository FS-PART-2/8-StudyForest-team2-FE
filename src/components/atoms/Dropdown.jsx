import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/components/atoms/Dropdown.module.css';

const Dropdown = ({ onChange, value = 'recent', options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find(option => option.value === value) || options[0];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = optionValue => {
    onChange?.(optionValue);
    console.log(optionValue);
    setIsOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={styles.customDropdown}
        onClick={handleToggle}
        type="button"
      >
        <span className={styles.dropdownText}>{selectedOption.label}</span>
        <img
          src="/assets/icons/down.svg"
          alt="드롭다운"
          className={styles.dropdownIcon}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownOptions}>
          {options.map(option => (
            <button
              key={option.value}
              className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
