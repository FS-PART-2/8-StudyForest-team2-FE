// src/components/molecules/HabitWeekRow.jsx
import React, { useMemo } from 'react';
import styles from '../../styles/components/molecules/HabitWeekRow.module.css';
import Sticker from '../atoms/Sticker.jsx';

/**
 * 한 줄짜리 주간 습관 Row
 * - 왼쪽 이름 칸: 19.8rem x 6.4rem, 오른쪽 정렬
 * - 오른쪽 스티커 7개: padding 1.4rem 4.1rem, 지름 3.6rem
 * - 기본 스티커 색: var(--sticker-area, #E8E8E8)
 * - 완료 칸 색: activeColor (없으면 기본 블루)
 *
 * @param {string} name - 습관 이름
 * @param {Array|Object} checks - 체크 상태 (배열: [true, false, ...] 또는 객체: {mon: true, tue: false, ...})
 * @param {string} activeColor - 완료된 스티커 색상 (선택사항)
 * @param {string} className - 추가 CSS 클래스 (선택사항)
 */
export default function HabitWeekRow({
  name,
  checks = [],
  activeColor,
  className,
  showDaysHeader = false,
}) {
  const days = useMemo(() => {
    if (Array.isArray(checks)) {
      const a = checks.slice(0, 7);
      while (a.length < 7) a.push(false);
      return a;
    }
    const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return order.map(k => !!checks?.[k]);
  }, [checks]);

  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

  if (showDaysHeader) {
    return (
      <div
        className={`${styles.row} ${styles.rowHeader} ${className || ''}`}
        role="row"
        aria-label="요일 헤더"
      >
        <div className={`${styles.name} ${styles.nameSpacer}`} role="cell" />
        <div className={styles.days} role="cell">
          {dayNames.map(d => (
            <span key={d} className={styles.dayLabel} aria-hidden>
              {d}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.row} ${className || ''}`}
      role="row"
      aria-label={`${name} 주간 기록`}
    >
      <div className={styles.name} role="cell" title={name}>
        <span className={styles.nameText}>{name}</span>
      </div>

      <div className={styles.stickers} role="cell">
        {days.map((done, i) => {
          const colorToken = done
            ? activeColor || 'brand-blue'
            : 'sticker-area';
          return (
            <Sticker
              key={i}
              color={colorToken}
              size="3.6rem"
              aria-label={`${dayNames[i]}요일 ${done ? '완료' : '미완료'}`}
            />
          );
        })}
      </div>
    </div>
  );
}
