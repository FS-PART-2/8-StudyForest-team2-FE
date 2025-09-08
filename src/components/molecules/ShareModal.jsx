import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/components/molecules/ShareModal.module.css';

export default function ShareModal({ isOpen, onClose, shareUrl }) {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const inputRef = useRef(null);
  const copyTimerRef = useRef(null);

  // 모달이 열릴 때 URL 입력창에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // 토스트 자동 숨김
  useEffect(() => {
    if (showCopyToast) {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setShowCopyToast(false), 3000);
    }
  }, [showCopyToast]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopyToast(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setShowCopyToast(false), 3000);
    } catch {
      // 마지막 수단
      window.prompt('아래 링크를 복사하세요:', shareUrl);
    }
  };

  const handleOverlayClick = e => {
    // 모달 내부 클릭이 아닌 경우에만 닫기
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className={styles.shareOverlay} onClick={handleOverlayClick}>
        <div
          className={styles.shareModal}
          role="dialog"
          aria-modal="true"
          aria-label="공유하기"
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.shareHeader}>
            <div className={styles.headerContent}>
              <img
                src="/assets/images/logo-ic.svg"
                alt="로고"
                className={styles.logo}
              />
              <span>공유하기</span>
            </div>
            <button className={styles.shareClose} onClick={onClose}>
              닫기
            </button>
          </div>
          <div className={styles.shareBody}>
            <input
              ref={inputRef}
              className={styles.shareInput}
              value={shareUrl}
              readOnly
            />
            <button className={styles.copyBtn} onClick={handleCopy}>
              복사
            </button>
            {/* 모바일에서만 표시되는 닫기 버튼 */}
            <button
              className={`${styles.shareClose} ${styles.mobileClose}`}
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>

      {/* 복사 완료 토스트 */}
      {showCopyToast && (
        <div className={styles.toastContainer}>
          <div className={styles.toast}>링크가 복사되었습니다!</div>
        </div>
      )}
    </>,
    document.body,
  );
}
