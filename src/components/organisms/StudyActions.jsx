// src/components/molecules/StudyActions.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../atoms/Toast.jsx';
import styles from '../../styles/components/organisms/StudyActions.module.css';
import StudyPasswordModal from '../organisms/StudyPasswordModal.jsx';
import ShareModal from '../molecules/ShareModal.jsx';
import { verifyStudyPassword } from '../../utils/api/study/studyPasswordApi';
import { deleteStudyApi } from '../../utils/api/study/deleteStudyApi';

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
  confirmBeforeDelete = true, // eslint-disable-line no-unused-vars
}) {
  const navigate = useNavigate();
  const [openShare, setOpenShare] = useState(false);
  const [openEditPwdModal, setOpenEditPwdModal] = useState(false);
  const [openDeletePwdModal, setOpenDeletePwdModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const deleteTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const shareUrl = useMemo(() => {
    try {
      return window.location?.href ?? '';
    } catch {
      return '';
    }
  }, []);

  const handleShare = () => {
    console.log('ShareModal 열기 시도');
    if (onShare) return onShare();
    setOpenShare(true);
    console.log('ShareModal 상태:', true);
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

    try {
      const ok = await verifyStudyPassword(studyId, password);
      if (!ok) {
        console.warn('비밀번호가 일치하지 않습니다.');
        return false;
      }
      navigate(`/study/${studyId}/modify`);
      return true;
    } catch (error) {
      console.error('비밀번호 검증 실패:', error);
      return false;
    }
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

    try {
      const ok = await verifyStudyPassword(studyId, password);
      console.log('비밀번호 검증 결과:', ok);

      if (ok) {
        try {
          // 스터디 삭제 API 호출 (비밀번호 포함)
          await deleteStudyApi(studyId, password);
          console.log('스터디 삭제 완료');

          // 삭제 완료 토스트 표시
          setShowDeleteToast(true);
          if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
          deleteTimerRef.current = setTimeout(
            () => setShowDeleteToast(false),
            3000,
          );

          // 메인 화면으로 이동
          setTimeout(() => {
            navigate('/');
          }, 1000); // 토스트가 보인 후 이동
          return true;
        } catch (error) {
          console.error('스터디 삭제 실패:', error);
          return false;
        }
      } else {
        console.log('비밀번호가 일치하지 않습니다.');
        return false;
      }
    } catch (error) {
      console.error('비밀번호 검증 실패:', error);
      return false;
    }
  };

  return (
    <div className={`${styles.actions} ${className || ''}`}>
      <button type="button" className={styles.actionLink} onClick={handleShare}>
        공유하기
      </button>
      <span className={styles.separator}>|</span>
      <button type="button" className={styles.actionLink} onClick={handleEdit}>
        수정하기
      </button>
      <span className={styles.separator}>|</span>
      <button
        type="button"
        className={styles.actionLinkDelete}
        onClick={handleDelete}
      >
        스터디 삭제하기
      </button>

      <ShareModal
        isOpen={openShare}
        onClose={() => {
          console.log('ShareModal 닫기 시도');
          setOpenShare(false);
        }}
        shareUrl={shareUrl}
      />

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
      {showDeleteToast && (
        <div className={styles.toastContainer}>
          <Toast type="delete" />
        </div>
      )}
    </div>
  );
}
