import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Chip from '../atoms/Chip.jsx';
import Button from '../atoms/Button.jsx';
import { instance } from '../../utils/api/axiosInstance.js';
import styles from '../../styles/components/organisms/TodayHabitModal.module.css';

export default function TodayHabitModal({ open, onClose, onSave, studyId }) {
  const [chips, setChips] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  // 모달이 열릴 때 습관 목록 로드
  useEffect(() => {
    if (open) {
      loadHabits();
    }
  }, [open, studyId]);

  // 습관 목록 로드 함수 (StudyDetailPage와 동일한 방식)
  const loadHabits = async () => {
    if (!studyId) return;

    try {
      setLoading(true);
      // StudyDetailPage와 동일한 API 사용
      const response = await instance.get(
        `/api/studies/${encodeURIComponent(studyId)}`,
      );
      const studyData = response.data;

      // StudyDetailPage와 동일한 방식으로 습관 데이터 추출
      let habitChips = [];
      if (studyData?.habitHistories && studyData.habitHistories.length > 0) {
        const latestHistory = studyData.habitHistories[0];
        if (latestHistory.habits) {
          habitChips = latestHistory.habits.map(habit => ({
            id: habit.id,
            label: habit.habit || habit.name || '습관',
            isDone: habit.isDone || false,
          }));
        }
      }

      setChips(habitChips);
    } catch (error) {
      console.error('습관 목록 로드 실패:', error);
      setChips([]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // 새 칩 추가 (API 호출 시도 후 로컬 스토리지에 저장)
  const addChip = async () => {
    const label = '새 습관';
    let newChip;

    try {
      // API로 습관 추가 시도
      const response = await instance.post(
        `/api/habits/today/${encodeURIComponent(studyId)}`,
        {
          title: label,
        },
      );

      // API 성공 시 서버에서 받은 데이터 사용
      const serverHabit = response.data;
      newChip = {
        id: serverHabit.id,
        label: serverHabit.title || serverHabit.habit || label,
        isDone: false,
      };

      console.log('습관이 서버에 추가되었습니다:', newChip);
    } catch (error) {
      console.error('습관 추가 API 실패:', error);

      // 409 Conflict 오류 처리 (중복 이름)
      if (error.response?.status === 409) {
        alert('이미 같은 이름의 습관이 존재합니다. 다른 이름을 사용해주세요.');
      } else {
        alert('습관 추가에 실패했습니다. 다시 시도해주세요.');
      }
      return;
    }

    setChips(prev => {
      const next = [...prev, newChip];
      onSave?.(next);
      return next;
    });
    setEditingId(newChip.id);
    setDraft(newChip.label);
  };

  // 칩 삭제 (API 호출 시도 후 로컬 스토리지에 저장)
  const deleteChip = async id => {
    try {
      // API로 습관 삭제 시도
      await instance.delete(
        `/api/habits/today/${encodeURIComponent(studyId)}/${encodeURIComponent(id)}`,
      );

      console.log('습관이 서버에서 삭제되었습니다:', id);
    } catch (error) {
      console.error('습관 삭제 API 실패:', error);
      // API 실패 시 에러 표시하고 삭제하지 않음
      alert('습관 삭제에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    setChips(prev => {
      const next = prev.filter(c => c.id !== id);
      onSave?.(next);
      return next;
    });

    if (editingId === id) {
      setEditingId(null);
      setDraft('');
    }
  };

  // 편집 시작
  const startEdit = id => {
    const cur = chips.find(c => c.id === id);
    setEditingId(id);
    setDraft(cur?.label ?? '');
  };

  // 편집 확정(Enter)
  const confirmEdit = async valueFromChip => {
    if (!editingId) return;
    const value = (valueFromChip ?? draft ?? '').trim();
    if (!value) {
      // 빈 값이면 원복
      setEditingId(null);
      setDraft('');
      return;
    }

    try {
      // API로 습관 이름 수정 시도
      await instance.patch(
        `/api/habits/today/${encodeURIComponent(studyId)}/${encodeURIComponent(editingId)}`,
        { title: value },
      );

      console.log('습관 이름이 서버에서 수정되었습니다:', editingId, value);
    } catch (error) {
      console.error('습관 수정 API 실패:', error);

      // 409 Conflict 오류 처리 (중복 이름)
      if (error.response?.status === 409) {
        alert('이미 같은 이름의 습관이 존재합니다. 다른 이름을 사용해주세요.');
        // 편집 모드 유지 (사용자가 다시 수정할 수 있도록)
        setDraft(value);
        return;
      } else {
        alert('습관 수정에 실패했습니다. 다시 시도해주세요.');
      }
      return;
    }

    // 로컬 상태 업데이트
    setChips(prev => {
      const next = prev.map(c =>
        c.id === editingId ? { ...c, label: value } : c,
      );
      onSave?.(next);
      return next;
    });

    setEditingId(null);
    setDraft('');
  };

  // 편집 취소(ESC)
  const cancelEdit = () => {
    setEditingId(null);
    setDraft('');
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="habit-modal-title" className={styles.title}>
          습관 목록
        </h2>

        {/* 칩 영역 */}
        <div className={styles.list}>
          {loading ? (
            <div className={styles.loading} role="status" aria-live="polite">
              습관 목록을 불러오는 중...
            </div>
          ) : (
            <>
              {chips.map(chip => (
                <div key={chip.id} className={styles.chipWrapper}>
                  <Chip
                    label={editingId === chip.id ? draft : chip.label}
                    selected={editingId === chip.id} // 선택되면 brand-blue 스타일
                    editing={editingId === chip.id} // Chip 내부에서 인풋 활성화
                    onClick={() => startEdit(chip.id)} // 칩 클릭으로 편집 시작
                    onChange={v => setDraft(v)} // 입력 중 초안 갱신
                    onConfirm={(_, v) => confirmEdit(v)} // Enter
                    onCancel={cancelEdit} // ESC
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteChip(chip.id)}
                    aria-label="삭제"
                    title="삭제"
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      alt=""
                      className={styles.deleteIcon}
                    />
                  </button>
                </div>
              ))}

              {/* Add chip */}
              <div className={styles.addRow}>
                <Chip variant="add" onClick={addChip} aria-label="새 칩 추가" />
              </div>
            </>
          )}
        </div>

        {/* 버튼 */}
        <div className={styles.actions}>
          <Button size="cancel" className={styles.cancelBtn} onClick={onClose}>
            취소
          </Button>
          <Button
            size="cancel"
            className={styles.saveBtn} // brand-blue 적용
            onClick={() => {
              onSave?.(chips);
              onClose();
            }}
          >
            수정 완료
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
