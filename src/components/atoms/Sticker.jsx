// Sticker.jsx
import React from 'react';
import styles from '../../styles/components/atoms/Sticker.module.css';

/**
 * Sticker 원형 표시 컴포넌트
 * - color: CSS 변수 키 또는 HEX. 예) 'sticker-blue-2' | '--sticker-blue-2' | '#4a67c4'
 * - size: 원 지름 (예: '3.6rem', 36, 36px 모두 허용)
 * - className: 외부 클래스
 * - onClick: 클릭 핸들러
 * - colorIndex: 기존 호환성 유지용 (deprecated)
 */
const circleColors = ['#e8e8e8', '#3a5ab8', '#0a3394', '#4a7ba4'];

function normalizeSize(size) {
  if (size == null) return '3.6rem';
  if (typeof size === 'number') return `${size}px`;
  return String(size);
}

function resolveColor(color, fallbackHex) {
  if (!color) return fallbackHex;
  const c = String(color).trim();
  if (c.startsWith('#')) return c; // HEX 직접 사용
  if (c.startsWith('--')) return `var(${c})`; // '--token'
  return `var(--${c})`; // 'token'
}

const Sticker = ({
  color,
  size,
  className,
  onClick,
  colorIndex = 0, // fallback for legacy usage
  'aria-label': ariaLabel,
}) => {
  const fallback = circleColors[colorIndex % circleColors.length];
  const backgroundColor = resolveColor(color, fallback);
  const diameter = normalizeSize(size);

  return (
    <div
      className={`${styles.sticker} ${className || ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      {...(typeof onClick === 'function'
        ? {
            role: 'button',
            tabIndex: 0,
            onKeyDown: e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            },
          }
        : {})}
    >
      <div
        className={styles.circle}
        style={{ backgroundColor, width: diameter, height: diameter }}
      />
    </div>
  );
};

export default Sticker;
