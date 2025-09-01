// Tag.jsx
import React from 'react';
import styles from '../../styles/components/atoms/Tag.module.css'; //

export default function Tag({
  points = 310,
  size = 'md', // "sm" | "md" | "lg"
  className = '',
}) {
  const label = `${points}P 획득`;

  // size 클래스 매핑
  const sizeClass = {
    sm: styles.tagSm,
    md: styles.tagMd,
    lg: styles.tagLg,
  }[size];

  return (
    <div className={`${styles.tag} ${sizeClass} ${className}`} title={label}>
      <img
        src="/assets/icons/tag-icon.svg"
        alt="tag-icon"
        aria-hidden="true"
        className={styles.tagIcon}
      />
      <span>{points}P 획득</span>
    </div>
  );
}
