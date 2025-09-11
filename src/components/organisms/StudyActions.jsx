// src/components/molecules/StudyActions.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../atoms/Toast.jsx';
import NavigationButton from '../atoms/NavigationButton.jsx';
import styles from '../../styles/components/organisms/StudyActions.module.css';
import StudyPasswordModal from '../organisms/StudyPasswordModal.jsx';
import ShareModal from '../molecules/ShareModal.jsx';
import { verifyStudyPassword } from '../../utils/api/study/studyPasswordApi';
import { deleteStudyApi } from '../../utils/api/study/deleteStudyApi';

/**
 * 스터디 상세 페이지 상단의 액션 바(공유 / 수정 / 삭제)를 렌더링합니다.
 *
 * 상세:
 * - 기본 동작: 공유 모달 오픈, 수정/삭제는 비밀번호 확인 모달을 통해 API 검증 후 라우팅(수정) 또는 삭제 API 호출 및 토스트 표시(삭제).
 * - 각 동작은 대응하는 커스텀 핸들러(prop)로 대체할 수 있습니다.
 *
 * @param {string} [studyId] 스터디 식별자. 제공되면 수정 라우팅(/study/:id/modify)과 비밀번호 검증·삭제 API 호출에 사용됩니다.
 * @param {string} [title] 공유 및 비밀번호 모달에 표시할 스터디 제목.
 * @param {string} nickname 모달에 표시되는 제목 조합에 사용됩니다 (예: `${nickname}의 ${title}`).
 * @param {string} [className] 컨테이너에 추가할 CSS 클래스.
 * @param {Function} [onShare] 공유 동작의 커스텀 핸들러가 있으면 기본 공유 모달 대신 호출됩니다.
 * @param {Function} [onEdit] 수정 동작의 커스텀 핸들러가 있으면 기본 비밀번호 확인/라우팅 대신 호출됩니다.
 * @param {Function} [onDelete] 삭제 동작의 커스텀 핸들러가 있으면 기본 비밀번호 확인/삭제 흐름 대신 호출됩니다.
 * @returns {JSX.Element} 렌더링된 액션 버튼들과 관련 모달들.
 */
export default function StudyActions({
  studyId,
  title,
  nickname,
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
        studyTitle={`${nickname}의 ${title}`}
        mode="edit"
      />

      <StudyPasswordModal
        isOpen={openDeletePwdModal}
        onClose={() => setOpenDeletePwdModal(false)}
        onVerify={handleDeleteVerify}
        studyTitle={`${nickname}의 ${title}`}
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
