// Tag.jsx
import React from "react";
import styles from "../../styles/components/atoms/Tag.module.css"; // 

export default function Tag({
  points = 310,
  size = "md", // "sm" | "md" | "lg"
  className = "",
  ariaLabel, // 선택적 커스텀 aria-label
}) {
  const label = `${points}P 획득`;

  // size 클래스 매핑
  const sizeClass = {
    sm: styles.tagSm,
    md: styles.tagMd,
    lg: styles.tagLg,
  }[size];

  return (
    <div
      className={`${styles.tag} ${sizeClass} ${className}`}
      role="status"
      aria-label={ariaLabel || label}
      title={label}
    >
      <span className={styles.tagIcon} aria-hidden="true">
        🥏
      </span>
      <span>{points}P 획득</span>
    </div>
  );
}