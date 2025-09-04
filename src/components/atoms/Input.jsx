// src/components/atoms/Input.jsx
import { forwardRef } from "react";
import styles from "../../styles/components/atoms/Input.module.css";

/**
 * Pure Input atom
 * - invalid prop 또는 aria-invalid 둘 다 지원
 * - leftSlot / rightSlot: 오버레이 아이콘/버튼
 * - size: "lg" | "mobile"  (높이/폰트 스케일)
 * - leftInteractive: 왼쪽 슬롯 클릭 가능 (기본 false)
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
    size, // "lg" | "mobile"
    leftInteractive = false,
    className = "",
    ...rest
  },
  ref
) {
  const hasLeft = !!leftSlot;
  const hasRight = !!rightSlot;

  // aria-invalid 우선, 없으면 invalid prop 사용
  const restAriaInvalid = rest["aria-invalid"];
  const ariaInvalid =
    restAriaInvalid !== undefined ? restAriaInvalid : (invalid ? true : undefined);

  const isInvalidClass =
    invalid || ariaInvalid === true || ariaInvalid === "true";

  return (
    <div
      className={[
        styles.wrap,
        hasLeft && styles.hasLeft,
        hasRight && styles.hasRight,
        size && styles[`size-${size}`],
        leftInteractive && styles.leftInteractive,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasLeft ? <div className={styles.leftSlot}>{leftSlot}</div> : null}

      <input
        className={[styles.input, isInvalidClass && styles.invalid]
          .filter(Boolean)
          .join(" ")}
        {...(value !== undefined ? { value } : {})}
        {...(onChange ? { onChange } : {})}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        ref={ref}
        {...rest}
      />

      {hasRight ? <div className={styles.rightSlot}>{rightSlot}</div> : null}
    </div>
  );
});

export default Input;
