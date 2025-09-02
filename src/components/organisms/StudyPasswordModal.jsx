import { useEffect, useState } from "react";
import PasswordInput from "../molecules/PasswordInput.jsx";
import Button from "../atoms/Button.jsx";
import Toast from "../atoms/Toast.jsx";
import styles from "../../styles/components/organisms/StudyPasswordModal.module.css";

export default function StudyPasswordModal({ isOpen, onClose, onVerify }) {
  const [password, setPassword] = useState("");
  const [showMismatch, setShowMismatch] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setShowMismatch(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    try {
      setSubmitting(true);
      const ok = (await onVerify?.(password)) ?? false;
      if (!ok) {
        setShowMismatch(true);
        return;
      }
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    if (showMismatch) setShowMismatch(false);
    setPassword(e.target.value);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className={styles.title}>00연우의 개발공장</h2>
        <p className={styles.subTitle}>권한이 필요해요!</p>

        {/* 추가된 wrapper: 모바일에서 width 31.2rem 제어 */}
        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <PasswordInput
              value={password}
              onChange={handleChange}
              onSubmit={handleSubmit}
              placeholder="비밀번호를 입력해 주세요"
            />

            <div className={styles.actions}>
              <Button
                variant="action"
                size="xl"
                type="submit"
                disabled={!password || submitting}
              >
                {submitting ? "확인 중..." : "수정하러 가기"}
              </Button>
            </div>
          </form>

          {/* 모바일일 때 버튼 아래로 내려가도록 CSS 제어 */}
          <button className={styles.exit} onClick={onClose}>
            나가기
          </button>
        </div>
      </div>

      {/* 토스트: 화면 기준 하단 4rem 고정 */}
      {showMismatch && (
        <div className={styles.toastFixed}>
          <Toast type="mismatch" />
        </div>
      )}
    </div>
  );
}
