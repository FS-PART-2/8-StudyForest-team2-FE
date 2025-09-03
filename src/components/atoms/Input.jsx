// src/components/atoms/Input.jsx
import { forwardRef } from "react";
import styles from "../../styles/components/atoms/Input.module.css";

/**
 * Pure Input atom — 라벨/헬퍼/에러 문구 없이 시각 상태만.
 * - invalid: 테두리만 빨강
 * - leftSlot / rightSlot: 아이콘/버튼 오버레이
 * - size: "lg" | "mobile" (내부에서 size-${token} 클래스로 매핑)
 * - leftInteractive: 왼쪽 아이콘을 클릭 가능하게 전환 (기본 false)
 */
const Input = forwardRef(function Input(
  {
    value,
    onChange,
    type = "text",
    placeholder,
    disabled = false,
    invalid = false,
    leftSlot = null,
    rightSlot = null,
    size,                 // "lg" | "mobile"
    leftInteractive = false,
    className = "",
    ...rest
  },
  ref,
) {
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
    >
      {hasLeft ? <div className={styles.leftSlot}>{leftSlot}</div> : null}
      <input
        className={[
          styles.input,
          invalid && styles.invalid,
        ].filter(Boolean).join(" ")}
        {...(value !== undefined ? { value } : {})}
        {...(onChange ? { onChange } : {})}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        ref={ref}
        {...rest}
      />
      {hasRight ? <div className={styles.rightSlot}>{rightSlot}</div> : null}
    </div>
  );
});

export default Input;
