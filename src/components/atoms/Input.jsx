import React from "react";
import styles from "../../styles/components/atoms/Input.module.css";

/**
 * 기본 Input 컴포넌트 (재사용 가능)
 */
export default function Input({
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  type = "text",
  size, // "lg" | "mobile" 등 (내부에서 size-${size}로 변환)
  autoFocus = false,
  disabled = false,
  className = "",
  leftSlot,
  rightSlot,
  leftInteractive = false,
  style,
  ...rest
}) {
  const hasLeft = !!leftSlot;
  const hasRight = !!rightSlot;

  return (
    <div
      className={[
        styles.wrap,
        hasLeft && styles.hasLeft,
        hasRight && styles.hasRight,
        size && styles[`size-${size}`],
        leftInteractive && styles.leftInteractive,
        className,
      ].filter(Boolean).join(" ")}
      style={style}
    >
      {hasLeft && (
        <div className={styles.leftSlot}>
          {leftSlot}
        </div>
      )}

      <input
        className={styles.input}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type={type}
        autoFocus={autoFocus}
        disabled={disabled}
        {...rest}
      />

      {hasRight && (
        <div className={styles.rightSlot}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}