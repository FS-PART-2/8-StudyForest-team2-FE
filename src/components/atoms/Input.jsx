import styles from "./Input.module.css";

/**
 * Pure Input atom — 라벨/헬퍼/에러 문구 없이, 시각 상태만.
 * - invalid: 테두리 빨강 
 * - rightSlot: 아이콘/버튼(예: 비밀번호 토글) 붙일 때 사용
 */
export default function Input({
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  invalid = false,
  rightSlot = null,
  className = "",
  ...rest
}) {
  const hasRight = !!rightSlot;

  return (
    <div className={`${styles.wrap} ${hasRight ? styles.hasRight : ""} ${className}`}>
      <input
        className={`${styles.input} ${invalid ? styles.invalid : ""}`}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {hasRight ? <div className={styles.rightSlot}>{rightSlot}</div> : null}
    </div>
  );
}
