import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Chip from '../atoms/Chip.jsx';
import Button from '../atoms/Button.jsx';
import { instance } from '../../utils/api/axiosInstance.js';
import styles from '../../styles/components/organisms/TodayHabitModal.module.css';

/**
 * 오늘의 습관을 관리하는 모달 컴포넌트.
 *
 * 모달이 열리면 주어진 studyId에 대한 최신 습관 목록을 로드해 편집, 추가, 삭제할 수 있도록 UI를 제공합니다.
 * 변경사항은 UI 로컬 상태로 즉시 반영되며, 추가/삭제/수정 동작은 가능한 경우 서버 API와 동기화하려 시도합니다(실패 시 로컬 변경만 적용).
 * "수정 완료" 버튼을 누르면 onSave 콜백에 최종 칩 목록이 전달됩니다.
 *
 * @param {object} props
 * @param {boolean} props.open - 모달 표시 여부(true이면 렌더링하고 습관을 로드함).
 * @param {() => void} props.onClose - 모달을 닫기 위한 콜백.
 * @param {(chips: Array<{id:string,label:string,isDone:boolean}>) => void} [props.onSave] - 수정 완료 시 호출되는 선택적 콜백. 현재 칩 배열을 인수로 받음.
 * @param {string} props.studyId - 로드/동기화에 사용하는 스터디 식별자.
 * @returns {JSX.Element|null} 렌더링된 모달 요소 또는 open이 false일 때 null.
 */
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
      // API로 습관 추가 시도 (비밀번호 없이)
      const response = await instance.post(
        `/api/habits/today/${encodeURIComponent(studyId)}`,
        {
          habit: label,
        },
      );

      // API 성공 시 서버에서 받은 데이터 사용
      const serverHabit = response.data;
      newChip = {
        id: serverHabit.id,
        label: serverHabit.habit || label,
        isDone: false,
      };

      console.log('습관이 서버에 추가되었습니다:', newChip);
    } catch (error) {
      console.error('습관 추가 API 실패:', error);

      // API 실패 시 로컬에서만 추가
      const id = crypto.randomUUID?.() ?? `id_${Date.now()}`;
      newChip = { id, label, isDone: false };

      console.log('로컬에서만 습관 추가:', newChip);
    }

    setChips(prev => [...prev, newChip]);
    setEditingId(newChip.id);
    setDraft(newChip.label);
  };

  // 칩 삭제 (API 호출 시도 후 로컬 스토리지에 저장)
  const deleteChip = async id => {
    try {
      // API로 습관 삭제 시도 (비밀번호 없이)
      await instance.delete(
        `/api/habits/today/${encodeURIComponent(studyId)}/${encodeURIComponent(id)}`,
      );

      console.log('습관이 서버에서 삭제되었습니다:', id);
    } catch (error) {
      console.error('습관 삭제 API 실패:', error);
      console.log('로컬에서만 습관 삭제:', id);
    }

    setChips(prev => prev.filter(c => c.id !== id));

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
        { habit: value },
      );

      console.log('습관 이름이 서버에서 수정되었습니다:', editingId, value);
    } catch (error) {
      console.error('습관 수정 API 실패:', error);
      console.log('로컬에서만 습관 수정:', editingId, value);
    }

    // 로컬 상태 업데이트
    setChips(prev =>
      prev.map(c => (c.id === editingId ? { ...c, label: value } : c)),
    );

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
