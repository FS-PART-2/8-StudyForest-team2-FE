import { forwardRef, useEffect, useRef } from "react";
import styles from "../../styles/components/atoms/Chip.module.css";

/**
 * Chip (40rem x 5.5rem, 10px = 1rem)
 *
 * props:
 * - label: string
 * - variant: 'neutral' | 'add'
 *   - neutral: 일반 칩
 *   - add    : 추가용 칩(＋만 표시, 항상 비선택 톤)
 * - selected: boolean      (선택 시 브랜드 블루 배경)
 * - editing : boolean      (편집 중일 때 1px 브랜드 블루 테두리 + input 표시)
 * - disabled: boolean
 *
 * - onClick(): void        칩 클릭(선택/편집 진입 트리거)
 * - onChange(value): void  편집 중 입력 변경
 * - onConfirm(): void      Enter/blur 저장
 * - onCancel(): void       Esc 취소
 */
const Chip = forwardRef(function Chip(
  {
    label = "",
    variant = "neutral",   // 'neutral' | 'add'
    selected = false,
    editing = false,
    disabled = false,
    onClick,
    onChange,
    onConfirm,
    onCancel,
    className = "",
    ...rest
  },
  ref
) {
  const inputRef = useRef(null);

  // 편집 모드 진입 시 자동 포커스 & 전체 선택
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const isAdd = variant === "add";
  // add 변형은 항상 비선택 톤, neutral은 selected에 따라 톤 결정
  const toneClass = !isAdd && selected ? styles.selected : styles.unselected;

  return (
    <button
      type="button"
      ref={ref}
      className={[
        styles.chip,
        toneClass,
        editing ? styles.editing : "",
        disabled ? styles.disabled : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={disabled ? undefined : onClick}
      aria-pressed={!isAdd ? selected : undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...rest}
    >
      {isAdd ? (
        <span className={styles.addSign}>＋</span>
      ) : editing ? (
        <input
          ref={inputRef}
          className={styles.editorInput}
          defaultValue={label}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm?.(e);
            if (e.key === "Escape") onCancel?.(e);
          }}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={(e) => onConfirm?.(e)}
          aria-label="칩 라벨 편집"
        />
      ) : (
        <span className={styles.label}>{label}</span>
      )}
    </button>
  );
});

export default Chip;
