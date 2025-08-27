import React from 'react';
import styles from './Button.module.css';

/**
 * Variants: 'action' | 'chip' | 'control'
 * Sizes:
 *  - action: 'xl'(600x55), 'lg'(312x55), 'md'(140x55), 'cancel'(288x55), 'study-mobile'(106x35), 'more'(288x55)
 *  - chip: 'chip'(400x55)
 *  - control (rect): 'ctrl-lg'(333x60), 'ctrl-sm'(140x45)
 *  - control (circle): 'circle-lg'(64x64), 'circle-sm'(48x48)
 *
 * Examples:
 * <Button variant="action" size="xl">오늘의 습관으로 가기</Button>
 * <Button variant="action" size="md">확인</Button>
 * <Button variant="action" size="cancel">취소</Button>
 * <Button variant="chip" size="chip" selected>더보기</Button>
 * <Button variant="control" size="ctrl-lg">Stop</Button>
 * <Button variant="control" size="circle-lg" shape="circle" aria-label="Pause">Ⅱ</Button>
 */
function Button({
  children,
  variant = 'action',
  size = 'md',
  shape = 'rect', // 'rect' | 'circle'
  type = 'button',
  disabled = false,
  fullWidth = false,
  selected = false, // chip, 토글성 버튼에 사용
  onClick,
  className = '',
  ...props
}) {
  const isCircle = shape === 'circle' || String(size).startsWith('circle-');

  const classes = [
    styles.btn,
    styles[variant],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : '',
    isCircle ? styles.circle : '',
    selected ? styles.selected : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // chip은 토글성으로 쓰일 수 있어 aria-pressed 부여
  const ariaPressed =
    variant === 'chip' || selected ? { 'aria-pressed': !!selected } : {};

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...ariaPressed}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
