import styles from '../../styles/components/atoms/Toast.module.css';

export default function Toast({
  type,
  point = 0,
  className = '',
  message = '',
}) {
  const messageMap = {
    error: '집중이 중단되었습니다.',
    mismatch: '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
    point: `${point}포인트를 획득했습니다!`,
    basic: message,
  };

  const iconMap = {
    error: '🚨',
    mismatch: '🚨',
    point: '🎉',
  };

  const allowedTypes = ['error', 'mismatch', 'point', 'basic'];
  const safeType = allowedTypes.includes(type) ? type : 'error';

  // role만으로 라이브영역이 암묵 지정됨 (alert=assertive, status=polite)
  const role = safeType === 'point' ? 'status' : 'alert';

  return (
    <div
      className={`${styles.toast} ${styles[safeType]} ${className}`}
      role={role}
      aria-atomic={true}
    >
      {iconMap[safeType] && <span aria-hidden="true">{iconMap[safeType]}</span>}
      <span className={styles.text}>{messageMap[safeType]}</span>
    </div>
  );
}
