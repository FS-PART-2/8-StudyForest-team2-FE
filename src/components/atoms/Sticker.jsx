// Sticker.jsx
import React from 'react';
import styles from '../../styles/components/atoms/Sticker.module.css';

// 지정된 원 색상 리스트
const circleColors = ['#E8E8E8', '#3A5AB8', '#0A3394', '#4A7BA4'];

const Sticker = ({ colorIndex = 0 }) => {
  const backgroundColor = circleColors[colorIndex % circleColors.length];

  return (
    <div className={styles.sticker}>
      <div
        className={styles.circle}
        style={{ backgroundColor }}
      ></div>
    </div>
  );
};

export default Sticker;
