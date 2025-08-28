import styles from "../../styles/components/atoms/Toast.module.css";

const ALLOWED_TYPES = ['error', 'mismatch', 'point'];

/**
 * Toast 컴포넌트
 * @param {Object} props
 * @param {'error'|'mismatch'|'point'} [props.type='error'] - 알림 유형
 * @param {number} [props.point=0] - point 알림일 경우 표시할 값
 * @param {string} [props.message] - 기본 문구 대신 외부에서 전달할 문구
 * @param {string} [props.className] - 추가 className
 */
export default function Toast({
  type = 'error',
  point = 0,
  message,
  className = '',
  ...props
}) {
  const messageMap = {
    error: '집중이 중단되었습니다.',
    mismatch: '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
    point: `${point}포인트를 획득했습니다!`,
  };

  const iconMap = {
    error: '🚨',
    mismatch: '🚨',
    point: '🎉',
  };

  const safeType = ALLOWED_TYPES.includes(type) ? type : 'error';
  const role = safeType === 'point' ? 'status' : 'alert'; // role이 aria-live 내포

  return (
    <div
      {...props} // 외부 aria-*가 내부 a11y를 덮지 않도록 먼저 펼침
      className={`${styles.toast} ${styles[safeType]} ${className}`}
      role={role}
      aria-atomic={true}
    >
      <span aria-hidden="true">{iconMap[safeType]}</span>
      <span className={styles.text}>{message ?? messageMap[safeType]}</span>
    </div>
  );
}
