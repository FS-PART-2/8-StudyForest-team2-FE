import { forwardRef } from "react";
import styles from "../../styles/components/atoms/Input.module.css";

/**
 * Pure Input atom — 라벨/헬퍼/에러 문구 없이 시각 상태만.
 * - invalid: 테두리만 빨강
 * - leftSlot/rightSlot: 아이콘/버튼(검색, 비번 토글 등)
 * - forwardRef 지원 (포커스 제어 등)
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
    className = "",
    size, // 선택: "size-lg" / "size-mobile" 등
    ...rest
  },
  ref
) {
  const hasLeft = !!leftSlot;
  const hasRight = !!rightSlot;

  return (
    <div
      className={[
        styles.wrap,
        hasLeft ? styles.hasLeft : "",
        hasRight ? styles.hasRight : "",
        size ? styles[size] : "",
        className,
      ].join(" ").trim()}
    >
      {hasLeft ? <div className={styles.leftSlot}>{leftSlot}</div> : null}

      <input
        className={`${styles.input} ${invalid ? styles.invalid : ""}`}
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
