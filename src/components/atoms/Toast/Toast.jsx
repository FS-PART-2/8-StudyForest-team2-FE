import React from 'react';
import styles from './Toast.module.css';

/**
 * Props
 * - type: 'error' | 'point'
 * - message: string
 *
 * 예시:
 * <Toast type="error" message="🚨 집중이 중단되었습니다." />
 * <Toast type="point" message="🎉 50포인트를 획득했습니다!" />
 */
function Toast({ type = 'error', message }) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  );
}

export default Toast;
