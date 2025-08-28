import React from 'react';
import styles from '../../../styles/components/atoms/Toast.module.css';

export default function Toast({ type, point = 0, className = '', ...props }) {
  const messageMap = {
    error: '🚨 집중이 중단되었습니다.',
    mismatch: '🚨 비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
    point: `🎉 ${point}포인트를 획득했습니다!`,
  };

  // 허용 타입 가드 + 안전한 fallback
  const allowedTypes = ['error', 'mismatch', 'point'];
  const safeType = allowedTypes.includes(type) ? type : 'error';

  // ARIA: point는 status/polite, 그 외 alert/assertive
  const role = safeType === 'point' ? 'status' : 'alert';
  const ariaLive = safeType === 'point' ? 'polite' : 'assertive';

  return (
    <div
      className={`${styles.toast} ${styles[safeType]} ${className}`}
      role={role}
      aria-live={ariaLive}
      {...props}
    >
      <span className={styles.text}>{messageMap[safeType]}</span>
    </div>
  );
}
