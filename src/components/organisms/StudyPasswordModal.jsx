import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PasswordInput from '../molecules/PasswordInput.jsx';
import Button from '../atoms/Button.jsx';
import Toast from '../atoms/Toast.jsx';
import styles from '../../styles/components/organisms/StudyPasswordModal.module.css';
import { verifyStudyPassword } from '../../utils/api/study/studyPasswordApi';

/**
 * 스터디 비밀번호 확인용 모달을 포털로 렌더링한다.
 *
 * 모달은 비밀번호 입력 후 onVerify 검사 결과에 따라 닫거나(검증 성공),
 * 불일치 토스트를 표시하거나(검증 실패), 네트워크/서버 오류 토스트를 표시한다.
 * Escape 키 또는 배경/나가기 버튼으로 닫을 수 있으며, isOpen이 false이면 아무것도 렌더링하지 않는다.
 *
 * @param {boolean} isOpen - 모달 열림 상태.
 * @param {Function} onClose - 모달을 닫는 콜백.
 * @param {(pw: string) => Promise<boolean> | boolean} onVerify - 입력한 비밀번호를 검증하는 함수.
 *   true: 검증 성공, false: 비밀번호 불일치, throw: 네트워크/서버 오류로 간주.
 * @param {string} [studyTitle='스터디'] - 모달 상단에 표시할 스터디 제목.
 * @param {'edit'|'delete'} [mode='edit'] - 모달 동작 모드; 'delete'면 제출 버튼에 "삭제하기"를 표시하고,
 *   그 외에는 "수정하러 가기"를 표시한다.
 * @returns {JSX.Element|null} 모달을 포함하는 포털 노드 또는 isOpen이 false일 때 null.
 */
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

  return createPortal(
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
    </div>,
    document.body,
  );
}
