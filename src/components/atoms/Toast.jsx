import styles from "../../styles/components/atoms/Toast.module.css";

export default function Toast({ type, point = 0, className = "", ...props }) {
  const messageMap = {
    error: "집중이 중단되었습니다.",
    mismatch: "비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
    point: `${point}포인트를 획득했습니다!`,
  };

  const iconMap = {
    error: "🚨",
    mismatch: "🚨",
    point: "🎉",
  };

  const allowedTypes = ["error", "mismatch", "point"];
  const safeType = allowedTypes.includes(type) ? type : "error";

  const role = safeType === "point" ? "status" : "alert";
  const ariaLive = safeType === "point" ? "polite" : "assertive";

  return (
    <div
      className={`${styles.toast} ${styles[safeType]} ${className}`}
      role={role}
      aria-live={ariaLive}
      aria-atomic={true}
    >
      <span aria-hidden="true">{iconMap[safeType]}</span>
      <span className={styles.text}>{messageMap[safeType]}</span>
    </div>
  );
}

Toast.propTypes = {
  type: PropTypes.oneOf(["error", "mismatch", "point"]).isRequired,
  point: PropTypes.number,
  className: PropTypes.string,
};
