import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../atoms/Button.jsx';
import styles from '../../styles/components/molecules/Popup.module.css';

/**
 * 재사용 팝업 (1버튼 / 2버튼 겸용)
 *
 * props
 * - open: boolean
 * - onClose: () => void
 * - title?: string
 * - message?: string
 * - children?: ReactNode           // message 대신 커스텀 콘텐츠 사용 시
 * - confirmText?: string           // 기본 '확인'
 * - cancelText?: string            // 지정 시 2버튼 모드, 미지정 시 1버튼
 * - onConfirm?: () => void
 * - onCancel?: () => void          // 없으면 onClose
 * - closeOnOverlay?: boolean       // 기본 true
 * - width?: 'lg' | 'md'            // 'lg': PC(64.8rem×25.5rem), 'md': Mobile(34.4rem)
 */
export default function Popup({
  open,
  onClose,
  title,
  message,
  children,
  confirmText = '확인',
  cancelText, // 있으면 2버튼
  onConfirm,
  onCancel,
  closeOnOverlay = true,
  width = 'lg',
}) {
  // ESC 닫힘 + 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) onClose?.();
  };

  const handleCancel = () => (onCancel ? onCancel() : onClose?.());
  const handleConfirm = () => (onConfirm ? onConfirm() : onClose?.());

  const isTwoButtons = Boolean(cancelText);

  // 버튼 폭 클래스 (시안 수치 반영)
  const btnWidthSingle = width === 'lg' ? styles.btnW588 : styles.btnW344; // 1버튼
  const btnWidthHalf   = width === 'lg' ? styles.btnW288 : styles.btnW140; // 2버튼(각)

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'popup-title' : undefined}
    >
      <div className={`${styles.container} ${styles[width]} ${!isTwoButtons ? styles.oneBtn : ''}`}>
        {title && (
          <h3 id="popup-title" className={styles.title}>
            {title}
          </h3>
        )}

        <div className={styles.body}>
          {children ?? <p className={styles.message}>{message}</p>}
        </div>

        <div className={styles.footer}>
          <div className={styles.btnRow}>
            {isTwoButtons ? (
              <>
                {/* 취소: --btn-inactive */}
                <Button
                  variant="control"
                  size="ctrl-lg"
                  className={`${styles.btn} ${styles.btnGray} ${styles.btnH55} ${btnWidthHalf}`}
                  onClick={handleCancel}
                >
                  {cancelText}
                </Button>

                {/* 확인: --brand-blue */}
                <Button
                  variant="control"
                  size="ctrl-lg"
                  className={`${styles.btn} ${styles.btnBlue} ${styles.btnH55} ${btnWidthHalf}`}
                  onClick={handleConfirm}
                >
                  {confirmText}
                </Button>
              </>
            ) : (
              <Button
                variant="control"
                size="ctrl-lg"
                className={`${styles.btn} ${styles.btnBlue} ${styles.btnH55} ${btnWidthSingle}`}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
