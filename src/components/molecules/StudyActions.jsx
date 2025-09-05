// src/components/molecules/StudyActions.jsx
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button.jsx';
import Toast from '../atoms/Toast.jsx';
import styles from '../../styles/components/molecules/StudyActions.module.css';
import StudyPasswordModal from '../organisms/StudyPasswordModal.jsx';
import { verifyStudyPassword } from '../../utils/api/study/studyPasswordApi';

/**
 * 스터디 상세 상단 액션(공유하기/수정하기/스터디 삭제하기)
 *
 * 사용법:
 * <StudyActions studyId={id} title={studyTitle} onDelete={openDeleteModal} />
 *
 * props:
 * - studyId?: string           // 제공 시 기본 edit 라우팅(/studies/:id/edit) 사용
 * - title?: string             // 공유하기에 사용할 제목
 * - className?: string
 * - onShare?: () => void       // 공유하기 커스텀 핸들러(있으면 이걸 사용)
 * - onEdit?: () => void        // 수정하기 커스텀 핸들러(없고 studyId 있으면 자동 라우팅)
 * - onDelete?: () => void      // 삭제하기 핸들러 (보통 모달 오픈)
 * - confirmBeforeDelete?: boolean // 삭제 전 confirm (기본 true; onDelete 없을 때만 동작)
 */
export default function StudyActions({
  studyId,
  title,
  className,
  onShare,
  onEdit,
  onDelete,
  confirmBeforeDelete = true,
}) {
  const navigate = useNavigate();
  const [openShare, setOpenShare] = useState(false);
  const [openEditPwdModal, setOpenEditPwdModal] = useState(false);
  const [openDeletePwdModal, setOpenDeletePwdModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const inputRef = useRef(null);

  const shareUrl = useMemo(() => {
    try {
      return window.location?.href ?? '';
    } catch {
      return '';
    }
  }, []);

  const handleShare = () => {
    if (onShare) return onShare();
    setOpenShare(true);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const el = inputRef.current;
        if (el) {
          el.focus();
          el.select();
          document.execCommand('copy');
          el.setSelectionRange(0, 0);
        }
      }
      // 토스트 표시
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    } catch {
      // 마지막 수단
      window.prompt('아래 링크를 복사하세요:', shareUrl);
    }
  };

  const handleEdit = () => {
    if (onEdit) return onEdit();
    if (!studyId) {
      console.warn('[StudyActions] onEdit 또는 studyId가 필요합니다.');
      return;
    }
    setOpenEditPwdModal(true);
  };

  const handleEditVerify = async password => {
    if (!studyId) return false;
    const ok = await verifyStudyPassword(studyId, password);
    if (ok) {
      // StudyModify 페이지로 이동
      navigate(`/study/${studyId}/modify`);
      // 토스트는 표시하지 않음
    }
    return ok;
  };

  const handleDelete = () => {
    if (onDelete) return onDelete();
    if (!studyId) {
      console.warn('[StudyActions] onDelete 또는 studyId가 필요합니다.');
      return;
    }
    setOpenDeletePwdModal(true);
  };

  const handleDeleteVerify = async password => {
    if (!studyId) return false;
    const ok = await verifyStudyPassword(studyId, password);
    if (ok) {
      // 스터디 삭제 처리 (나중에 API 연동)
      console.log('스터디 삭제 처리 (구현 예정)');
      // await deleteStudyApi(studyId);

      // 삭제 완료 토스트 표시
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 3000);

      // navigate('/');
    }
    return ok;
  };

  return (
    <div className={`${styles.actions} ${className || ''}`}>
      <span className={styles.actionLink} onClick={handleShare}>
        공유하기
      </span>
      <span className={styles.separator}>|</span>
      <span className={styles.actionLink} onClick={handleEdit}>
        수정하기
      </span>
      <span className={styles.separator}>|</span>
      <span className={styles.actionLinkDelete} onClick={handleDelete}>
        스터디 삭제하기
      </span>

      {openShare && (
        <div
          className={styles.shareOverlay}
          onClick={() => setOpenShare(false)}
        >
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
              <button
                className={styles.shareClose}
                onClick={() => setOpenShare(false)}
              >
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
            </div>
          </div>
        </div>
      )}

      <StudyPasswordModal
        isOpen={openEditPwdModal}
        onClose={() => setOpenEditPwdModal(false)}
        onVerify={handleEditVerify}
        studyTitle={title}
        mode="edit"
      />

      <StudyPasswordModal
        isOpen={openDeletePwdModal}
        onClose={() => setOpenDeletePwdModal(false)}
        onVerify={handleDeleteVerify}
        studyTitle={title}
        mode="delete"
      />

      {/* 토스트 알림 */}
      {showCopyToast && (
        <div className={styles.toastContainer}>
          <Toast type="copy" />
        </div>
      )}

      {showDeleteToast && (
        <div className={styles.toastContainer}>
          <Toast type="delete" />
        </div>
      )}
    </div>
  );
}
