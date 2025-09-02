import { useEffect, useState } from "react";
import PasswordInput from "../molecules/PasswordInput.jsx";
import Button from "../atoms/Button.jsx";
import Toast from "../atoms/Toast.jsx";
import styles from "../../styles/components/organisms/StudyPasswordModal.module.css";

export default function StudyPasswordModal({ isOpen, onClose, onVerify }) {
  const [password, setPassword] = useState("");
  const [showMismatch, setShowMismatch] = useState(false);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 모달 열림/닫힘 초기화
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setShowMismatch(false);
      setShowNetworkError(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  // Esc로 닫기 (접근성)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || submitting) return; // ✅ 중복 제출 가드

    try {
      setSubmitting(true);
      setShowNetworkError(false);
      const ok = (await onVerify?.(password)) ?? false;
      if (!ok) {
        setShowMismatch(true); // 비밀번호 불일치
        return;
      }
      onClose?.();
    } catch {
      // 네트워크/서버 오류는 별도 토스트
      setShowNetworkError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    if (showMismatch) setShowMismatch(false); // 다시 입력 시작 → mismatch 토스트 닫기
    setPassword(e.target.value);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="studyPasswordTitle"
        aria-describedby="studyPasswordDesc"
      >
        <h2 id="studyPasswordTitle" className={styles.title}>00연우의 개발공장</h2>
        <p id="studyPasswordDesc" className={styles.subTitle}>권한이 필요해요!</p>

        {/* 모바일 폭 제어 wrapper(.content) 필요 시 CSS에서만 제어 */}
        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <PasswordInput
              value={password}
              onChange={handleChange}
              onSubmit={handleSubmit}
              placeholder="비밀번호를 입력해 주세요"
              disabled={submitting}                /* ✅ 인풋 비활성화 */
            />

            <div className={styles.actions}>
              <Button
                variant="action"
                size="xl"
                type="submit"
                disabled={!password || submitting}   /* ✅ 버튼 비활성화 */
              >
                {submitting ? "확인 중..." : "수정하러 가기"}
              </Button>
            </div>
          </form>

          {/* PC: 우상단 absolute, Mobile: 버튼 아래 중앙 (CSS로 제어) */}
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
      {showNetworkError && (
        <div className={styles.toastFixed}>
          <Toast type="error" />
        </div>
      )}
    </div>
  );
}
