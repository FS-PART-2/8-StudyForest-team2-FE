import { forwardRef, useEffect, useRef } from "react";
import styles from "../../styles/components/atoms/Chip.module.css";

/**
 * Chip Atom
 * - variant: 'neutral' | 'add'
 * - selected: boolean
 * - editing: boolean
 * - disabled: boolean
 * - onClick, onChange, onConfirm(e, value), onCancel(e)
 */
const Chip = forwardRef(function Chip(
  {
    label = "",
    variant = "neutral",
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
  const ignoreNextBlurRef = useRef(false);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const isAdd = variant === "add";
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
      ].filter(Boolean).join(" ")}
      onClick={disabled ? undefined : onClick}
      {...rest}
      aria-pressed={!isAdd ? selected : undefined}
      aria-disabled={disabled || undefined}
      aria-label={isAdd ? "새 칩 추가" : undefined}
      disabled={disabled}
    >
      {isAdd ? (
        <span className={styles.addSign} aria-hidden="true">＋</span>
      ) : editing ? (
        <input
          ref={inputRef}
          className={styles.editorInput}
          defaultValue={label}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onConfirm?.(e, e.currentTarget.value);
            } else if (e.key === "Escape") {
              e.preventDefault();
              ignoreNextBlurRef.current = true;
              onCancel?.(e);
            }
          }}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={(e) => {
            if (ignoreNextBlurRef.current) {
              ignoreNextBlurRef.current = false;
              return;
            }
            onConfirm?.(e, e.currentTarget.value);
          }}
          aria-label="칩 라벨 편집"
        />
      ) : (
        <span className={styles.label}>{label}</span>
      )}
    </button>
  );
});

export default Chip;
