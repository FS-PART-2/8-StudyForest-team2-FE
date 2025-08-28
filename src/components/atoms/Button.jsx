import styles from "../../styles/components/atoms/Button.module.css";

/**
 * Variants: 'action' | 'control'
 * Sizes:
 *  - action: 'xl'(600x55), 'lg'(312x55), 'md'(140x55), 'cancel'(288x55), 'study-mobile'(106x35), 'more'(288x55)
 *  - control (rect): 'ctrl-lg'(333x60), 'ctrl-sm'(140x45)
 *  - control (circle): 'circle-lg'(64x64), 'circle-sm'(48x48)
 *
 * Notes:
 * - 기본 type은 "button"입니다. 필요한 경우 type을 명시적으로 지정하세요.
 * - onClick, aria-*, disabled 등 표준 HTMLButtonElement 속성은 `...props`를 통해 그대로 전달됩니다.
 */
export default function Button({
  children,
  variant = "action",
  size = "md",
  shape = "rect",         // 'rect' | 'circle' (control일 때 사용)
  type = "button",        // 안전한 기본값 복원
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  const classes = [
    styles.button,
    variant === "action" ? styles.action : styles.control,
    fullWidth ? styles.fullWidth : "",
    shape === "circle" ? styles.circle : "",
    size ? styles[`size-${size}`] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} type={type} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
