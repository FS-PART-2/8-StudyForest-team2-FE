import React from "react";
import styles from "../../styles/components/atoms/Dropdown.module.css"; 

const Dropdown = () => {
  return (
    <select className={styles.customDropdown}>
      <option value="recent">최근순</option>
      <option value="oldest">오래된 순</option>
      <option value="highestPoints">많은 포인트 순</option>
      <option value="lowestPoints">적은 포인트 순</option>
    </select>
  );
};

export default Dropdown;
