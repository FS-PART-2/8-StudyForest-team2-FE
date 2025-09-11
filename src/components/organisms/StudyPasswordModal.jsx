import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PasswordInput from '../molecules/PasswordInput.jsx';
import Button from '../atoms/Button.jsx';
import Toast from '../atoms/Toast.jsx';
import DynamicStudyTitle from '../atoms/DynamicStudyTitle.jsx';
import styles from '../../styles/components/organisms/StudyPasswordModal.module.css';
import { verifyStudyPassword } from '../../utils/api/study/studyPasswordApi';

export default function StudyPasswordModal({
  isOpen,
  onClose,
  onVerify, // (pw) => Promise<boolean> | boolean  (검증 실패: false, 네트워크 오류: throw)
  studyTitle = '스터디', // 동적 제목을 위한 prop 추가
  mode = 'edit', // 'edit' 또는 'delete'
  nickname,
  studyName,
  backgroundImage,
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

  // Esc로 닫기 비활성화 (나가기 버튼으로만 닫기)
  // useEffect(() => {
  //   if (!isOpen) return;
  //   const onKeyDown = e => {
  //     if (e.key === 'Escape') onClose?.();
  //   };
  //   window.addEventListener('keydown', onKeyDown);
  //   return () => window.removeEventListener('keydown', onKeyDown);
  // }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 락
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!password || submitting) return; // 중복 제출 가드

    console.log('StudyPasswordModal: handleSubmit 호출됨', {
      onVerify: !!onVerify,
    });

    try {
      setSubmitting(true);
      setShowNetworkError(false);
      setShowMismatch(false); // 이전 토스트 숨김
      const ok = (await onVerify?.(password)) ?? false;
      console.log('StudyPasswordModal: onVerify 결과', ok);
      if (!ok) {
        setShowMismatch(true); // 불일치 토스트 표시
        return; // 모달 유지
      }
      // 비밀번호가 맞으면 onVerify에서 모달 닫기 처리
      // onClose는 호출하지 않음 (StudyActions에서 처리)
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
    <div className={styles.modalBackdrop}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="studyPasswordTitle"
        aria-describedby="studyPasswordDesc"
      >
        <DynamicStudyTitle
          id="studyPasswordTitle"
          nickname={nickname}
          studyName={studyName}
          backgroundImage={backgroundImage}
          className={styles.title}
          tag="h1"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        />
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
              autoFocus
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
                    : mode === 'habit'
                      ? '오늘의 습관 확인하러 가기'
                      : '수정하러 가기'}
              </Button>
            </div>
          </form>

          {/* PC: 우상단 absolute / 모바일: 버튼 아래 중앙 (CSS에서 분기) */}
          <button type="button" className={styles.exit} onClick={onClose}>
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
