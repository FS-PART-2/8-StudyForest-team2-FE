import styles from '../../styles/components/atoms/Toast.module.css';

export default function Toast({
  type,
  point = 0,
  className = '',
  message = '',
}) {
  const messageMap = {
    error: '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
    mismatch: '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
    point: `${point}포인트를 획득했습니다!`,
    basic: message,
    delete: '삭제가 완료되었습니다!',
    copy: '링크가 복사되었습니다.',
  };

  const iconMap = {
    error: '🚨',
    mismatch: '🚨',
    point: '🎉',
    delete: (
      <img src="/assets/images/logo-ic.svg" alt="로고" width="20" height="20" />
    ),
    copy: (
      <img src="/assets/images/logo-ic.svg" alt="로고" width="20" height="20" />
    ),
  };

  const allowedTypes = [
    'error',
    'mismatch',
    'point',
    'basic',
    'delete',
    'copy',
  ];
  const safeType = allowedTypes.includes(type) ? type : 'error';

  const politeTypes = new Set(['point', 'copy', 'basic']);
  const role = politeTypes.has(safeType) ? 'status' : 'alert';
  const ariaLive = role === 'status' ? 'polite' : 'assertive';

  return (
    <div
      className={`${styles.toast} ${styles[safeType]} ${className}`}
      role={role}
      aria-atomic={true}
      aria-live={ariaLive}
    >
      {iconMap[safeType] && <span aria-hidden="true">{iconMap[safeType]}</span>}
      <span className={styles.text}>{messageMap[safeType]}</span>
    </div>
  );
}
