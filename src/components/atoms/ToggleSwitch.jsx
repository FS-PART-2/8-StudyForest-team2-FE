import { useCallback } from "react";
import styles from "../../styles/components/atoms/ToggleSwitch.module.css";

/**
 * ToggleSwitch — On/Off 토글 Atom
 * - 크기: 51 x 31 (thumb 27)
 * - ON: var(--brand-blue), OFF: var(--btn-inactive)
 * - 접근성: role="switch", aria-checked, Space/Enter/←/→
 */
export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  id,
  name,
  className = "",
  onLabel = "공개",
  offLabel = "비공개",
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  ...rest
}) {
  const handleToggle = useCallback(
    (e) => {
      if (disabled) return;
      onChange?.(!checked, e);
    },
    [checked, disabled, onChange]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onChange?.(!checked, e);
      }
      if (e.key === "ArrowLeft" && checked) onChange?.(false, e);
      if (e.key === "ArrowRight" && !checked) onChange?.(true, e);
    },
    [checked, disabled, onChange]
  );

  return (
    <button
      type="button"
      id={id}
      name={name}
      className={`${styles.switch} ${checked ? styles.on : styles.off} ${
        disabled ? styles.disabled : ""
      } ${className}`}
      role="switch"
      aria-checked={checked}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-label={ariaLabelledby ? undefined : checked ? onLabel : offLabel}
      onClick={handleToggle}
      onKeyDown={onKeyDown}
      disabled={disabled}
      {...rest}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} aria-hidden="true" />
      </span>
    </button>
  );
}
