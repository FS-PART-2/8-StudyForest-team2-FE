import React from "react";
import styles from "../../../styles/components/atoms/Toast.module.css";

export default function Toast({ type, point = 0, className = "", ...props }) {
  const messageMap = {
    error: "🚨 집중이 중단되었습니다.",
    mismatch: "🚨 비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
    point: `🎉 ${point}포인트를 획득했습니다!`,
  };

  const role = type === "point" ? "status" : "alert";
  const ariaLive = type === "point" ? "polite" : "assertive";

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${className}`}
      role={role}
      aria-live={ariaLive}
      {...props}
    >
      <span className={styles.text}>{messageMap[type]}</span>
    </div>
  );
}
