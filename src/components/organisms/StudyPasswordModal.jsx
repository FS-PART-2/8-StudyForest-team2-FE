import { useEffect, useState } from 'react';
import PasswordInput from '../molecules/PasswordInput.jsx';
import Button from '../atoms/Button.jsx';
import Toast from '../atoms/Toast.jsx';
import styles from '../../styles/components/organisms/StudyPasswordModal.module.css';
import { verifyStudyPassword } from '../../utils/api/study/studyPasswordApi';

export default function StudyPasswordModal({
  isOpen,
  onClose,
  onVerify, // (pw) => Promise<boolean> | boolean  (검증 실패: false, 네트워크 오류: throw)
  studyTitle = '스터디', // 동적 제목을 위한 prop 추가
  mode = 'edit', // 'edit' 또는 'delete'
}) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showMismatch, setShowMismatch] = useState(false);
  const [showNetworkError, setShowNetworkError] = useState(false);

  // 열릴 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setSubmitting(false);
      setShowMismatch(false);
      setShowNetworkError(false);
    }
  }, [isOpen]);

  // Esc로 닫기 (접근성)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!password || submitting) return; // 중복 제출 가드

    try {
      setSubmitting(true);
      setShowNetworkError(false);
      const ok = (await onVerify?.(password)) ?? false;
      if (!ok) {
        setShowMismatch(true); // 불일치 토스트
        return;
      }
      onClose?.();
    } catch {
      setShowNetworkError(true); // 네트워크/서버 오류 토스트
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = e => {
    if (showMismatch) setShowMismatch(false); // 재입력 시작 → mismatch 토스트 숨김
    setPassword(e.target.value);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="studyPasswordTitle"
        aria-describedby="studyPasswordDesc"
      >
        <h2 id="studyPasswordTitle" className={styles.title}>
          {studyTitle}
        </h2>
        <p id="studyPasswordDesc" className={styles.subTitle}>
          권한이 필요해요!
        </p>

        {/* 모바일 폭 제어 wrapper */}
        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <PasswordInput
              value={password}
              onChange={handleChange}
              onSubmit={handleSubmit}
              placeholder="비밀번호를 입력해 주세요"
              disabled={submitting}
            />

            <div className={styles.actions}>
              <Button
                variant="action"
                size="xl"
                type="submit"
                disabled={!password || submitting}
              >
                {submitting
                  ? '확인 중...'
                  : mode === 'delete'
                    ? '삭제하기'
                    : '수정하러 가기'}
              </Button>
            </div>
          </form>

          {/* PC: 우상단 absolute / 모바일: 버튼 아래 중앙 (CSS에서 분기) */}
          <button className={styles.exit} onClick={onClose}>
            나가기
          </button>
        </div>
      </div>

      {/* 화면 하단 4rem 고정 토스트 */}
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
