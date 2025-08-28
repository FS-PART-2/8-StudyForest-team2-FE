import styles from "../../styles/components/atoms/Toast.module.css";

export default function Toast({
  type = "info",           // 'info' | 'success' | 'error' | 'point'
  role = "status",
  message,
  className = "",
  ...props
}) {
  const allowed = new Set(["info", "success", "error", "point"]);
  const safeType = allowed.has(type) ? type : "info";
  const messageMap = {
    info: "알림",
    success: "완료",
    error: "에러",
    point: "포인트",
  };

  return (
    <div
      className={`${styles.toast} ${styles[safeType]} ${className}`}
      role={role}
      aria-atomic={true}
      {...props}
    >
      <span className={styles.text}>
        {typeof message === "string" && message.trim().length > 0
          ? message
          : messageMap[safeType]}
      </span>
    </div>
  );
}
