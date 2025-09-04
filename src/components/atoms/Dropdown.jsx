import React from 'react';
import styles from '../../styles/components/atoms/Dropdown.module.css';

const Dropdown = ({ onChange }) => {
  const handleChange = e => {
    onChange?.(e.target.value);
  };

  return (
    <select className={styles.customDropdown} onChange={handleChange}>
      <option value="recent">최근순</option>
      <option value="old">오래된 순</option>
      <option value="desc">많은 포인트 순</option>
      <option value="asc">적은 포인트 순</option>
    </select>
  );
};

export default Dropdown;
