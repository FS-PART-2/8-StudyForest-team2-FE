import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Chip from '../atoms/Chip.jsx';
import Button from '../atoms/Button.jsx';
import { instance } from '../../utils/api/axiosInstance.js';
import {
  getHabitsApi,
  createHabitApi,
  updateHabitApi,
  deleteHabitApi,
} from '../../utils/api/habit/habitApi.js';
import styles from '../../styles/components/organisms/TodayHabitModal.module.css';

export default function TodayHabitModal({ open, onClose, onSave, studyId }) {
  const [chips, setChips] = useState([]);
  const [originalChips, setOriginalChips] = useState([]); // 원본 데이터 저장
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  // 모달이 열릴 때 습관 목록 로드
  useEffect(() => {
    const loadHabits = async () => {
      if (!studyId) return;

      try {
        setLoading(true);

        // 백엔드 습관 API로 습관 목록 가져오기
        console.log(
          'TodayHabitModal 백엔드 습관 API 호출 시도 - studyId:',
          studyId,
          'type:',
          typeof studyId,
        );
        const habitsData = await getHabitsApi(studyId);
        console.log('TodayHabitModal 백엔드 습관 API 응답:', habitsData);

        // 백엔드 응답 데이터 구조 디버깅
        if (Array.isArray(habitsData) && habitsData.length > 0) {
          console.log('첫 번째 습관 원본 데이터:', habitsData[0]);
          console.log(
            '첫 번째 습관의 모든 키:',
            Object.keys(habitsData[0] || {}),
          );
        }

        // 백엔드 API 응답 형식에 맞게 데이터 변환
        const habitChips = Array.isArray(habitsData)
          ? habitsData.map(habit => ({
              id: habit.habitId, // 백엔드에서 habitId로 제공됨
              label: habit.title, // 백엔드에서 title로 제공됨
              isDone: habit.isDone || false,
            }))
          : [];

        console.log('TodayHabitModal 변환된 칩 데이터:', habitChips);
        setChips(habitChips);
        setOriginalChips([...habitChips]); // 원본 데이터 저장
      } catch (error) {
        console.error('습관 목록 로드 실패:', error);

        // 백엔드 API가 구현되지 않은 경우 (404) 또는 기타 에러의 경우
        if (error.response?.status === 404) {
          console.log(
            'TodayHabitModal: 백엔드 습관 API가 구현되지 않음. 기존 방식으로 fallback합니다.',
          );
        }

        // 백엔드 API 실패 시 기존 방식으로 fallback
        try {
          const response = await instance.get(
            `/api/studies/${encodeURIComponent(studyId)}`,
          );
          const studyData = response.data;

          // StudyDetailPage와 동일한 방식으로 습관 데이터 추출
          let habitChips = [];
          if (
            studyData?.habitHistories &&
            studyData.habitHistories.length > 0
          ) {
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
          setOriginalChips([...habitChips]); // 원본 데이터 저장
          console.log('TodayHabitModal Fallback 습관 목록:', habitChips);
        } catch (fallbackError) {
          console.error(
            'TodayHabitModal Fallback 습관 로드도 실패:',
            fallbackError,
          );
          setChips([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadHabits();
    }
  }, [open, studyId]);

  if (!open) return null;

  // 새 칩 추가 (백엔드 API 사용)
  const addChip = () => {
    console.log('로컬에서 새 칩 추가');

    // 임시 ID로 새 칩 생성
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const newChip = {
      id: tempId,
      label: '',
      isDone: false,
      isNew: true, // 새로 생성된 습관임을 표시
    };

    console.log('새로 생성된 칩:', newChip);

    setChips(prev => [...prev, newChip]);
    setEditingId(newChip.id);
    setDraft(newChip.label);
  };

  // 칩 삭제 (백엔드 API 사용)
  const deleteChip = id => {
    console.log('로컬에서 습관 삭제:', { id });

    // 로컬에서만 삭제 (확인 버튼에서 일괄 처리)
    setChips(prev => {
      const next = prev.filter(c => c.id !== id);
      return next;
    });

    if (editingId === id) {
      setEditingId(null);
      setDraft('');
    }
  };

  // 편집 시작
  const startEdit = async id => {
    // 현재 편집 중인 칩이 있다면 먼저 저장
    if (editingId && editingId !== id) {
      // 현재 편집 중인 칩이 새로운 칩인지 확인
      const currentChip = chips.find(c => c.id === editingId);
      if (currentChip && draft.trim()) {
        // 새로운 칩에 라벨이 입력되어 있으면 임시 저장
        console.log('새로운 칩의 라벨을 임시 저장합니다:', draft);
        setChips(prevChips =>
          prevChips.map(chip =>
            chip.id === editingId
              ? { ...chip, label: draft.trim() || chip.label }
              : chip,
          ),
        );
      }
      await confirmEdit(draft);
    }

    const cur = chips.find(c => c.id === id);
    setEditingId(id);
    setDraft(cur?.label ?? '');
  };

  // 편집 확정(Enter) - 백엔드 API 사용
  const confirmEdit = async (valueFromChip, explicitDraft) => {
    console.log('confirmEdit 함수 호출됨:', {
      valueFromChip,
      editingId,
      draft,
      explicitDraft,
    });

    // 이미 편집 중이면 중복 실행 방지
    if (!editingId) {
      console.log('편집 중인 칩이 없어서 confirmEdit 종료');
      return;
    }

    const value = (valueFromChip ?? explicitDraft ?? draft ?? '').trim();
    if (!value) {
      // 빈 값이면 원복
      setEditingId(null);
      setDraft('');
      return;
    }

    // editingId로 해당 칩을 찾기
    const targetChip = chips.find(chip => chip.id === editingId);

    if (!targetChip) {
      console.log('editingId로 해당 칩을 찾을 수 없어서 confirmEdit 종료:', {
        editingId,
        availableIds: chips.map(c => c.id),
      });
      return;
    }

    const currentEditingId = targetChip.id;
    const isNewChip =
      targetChip?.isNew || String(targetChip?.id || '').startsWith('temp_');
    console.log('편집할 칩 찾음:', {
      currentEditingId,
      value,
      targetChip,
      isNewChip,
    });
    console.log('전체 chips 배열:', chips);
    console.log('첫 번째 칩의 구조:', chips[0]);
    console.log('targetChip의 모든 키:', Object.keys(targetChip || {}));

    if (isNewChip) {
      const normalized = value.trim().toLowerCase();
      const hasDup = chips.some(
        c =>
          c.id !== currentEditingId &&
          (c.label || '').trim().toLowerCase() === normalized,
      );
      if (hasDup) {
        alert('이미 존재하는 습관 이름입니다. 다른 이름을 사용해주세요.');
        return;
      }
      // 신규 칩은 현재 칩의 label만 갱신하고 isNew 유지
      setChips(prev =>
        prev.map(c =>
          c.id === currentEditingId ? { ...c, label: value, isNew: true } : c,
        ),
      );
      setEditingId(null);
      setDraft('');
      return;
    }

    // 로컬에서만 습관 수정 (확인 버튼에서 일괄 처리)
    console.log('로컬에서 습관 수정:', {
      currentEditingId,
      value,
    });

    // 로컬 상태 업데이트 (확인 버튼에서 일괄 처리)
    setChips(prev => {
      const next = prev.map(c =>
        c.id === currentEditingId
          ? { ...c, label: value, isModified: true }
          : c,
      );
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
    <div
      className={styles.overlay}
      onClick={() => {
        // 모달 닫기 시에는 편집 중인 내용을 저장하지 않음
        // (엔터 키로만 저장하도록 함)
        onClose();
      }}
    >
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
            <div key="chips-list">
              {chips.map((chip, index) => (
                <div
                  key={chip.id || `chip-${index}`}
                  className={styles.chipWrapper}
                >
                  <Chip
                    label={chip.label}
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
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className={styles.actions}>
          <Button
            size="cancel"
            className={styles.cancelBtn}
            onClick={() => {
              // 모든 변경사항 취소 - 원본 데이터로 복원
              console.log('모든 변경사항 취소 - 원본 데이터로 복원');
              setChips([...originalChips]);
              setEditingId(null);
              setDraft('');
              onClose();
            }}
          >
            취소
          </Button>
          <Button
            size="cancel"
            className={styles.saveBtn} // brand-blue 적용
            onClick={async () => {
              try {
                console.log('모든 변경사항을 백엔드에 저장합니다...');

                // 1. 새로 추가된 습관들 생성 (수정된 새 습관 포함)
                const newHabits = chips.filter(chip => chip.isNew);
                console.log('생성할 새 습관들:', newHabits);
                console.log('studyId:', studyId, 'type:', typeof studyId);

                for (const habit of newHabits) {
                  try {
                    console.log(
                      `습관 생성 시도: "${habit.label}" (studyId: ${studyId})`,
                    );
                    const result = await createHabitApi(studyId, {
                      title: habit.label,
                    });
                    console.log('새 습관 생성 성공:', result);
                    // 임시 ID를 실제 ID로 교체
                    habit.id = result.habitId || result.id;
                    delete habit.isNew;
                    delete habit.isModified; // 새로 생성된 습관의 수정 플래그도 제거
                  } catch (error) {
                    console.error('새 습관 생성 실패:', error);
                    console.error('생성 실패 상세:', {
                      habit: habit,
                      studyId: studyId,
                      error: error.response?.data || error.message,
                    });
                    if (error.response?.status === 409) {
                      alert(
                        `습관 "${habit.label}"은 이미 존재합니다. 다른 이름을 사용해주세요.`,
                      );
                      return;
                    }
                    throw error;
                  }
                }

                // 2. 수정된 습관들 업데이트 (새로 생성된 습관이 아닌 기존 습관만)
                const modifiedHabits = chips.filter(
                  chip =>
                    chip.isModified &&
                    !chip.isNew &&
                    chip.id &&
                    !String(chip.id).startsWith('temp_'),
                );
                console.log('수정할 습관들:', modifiedHabits);

                for (const habit of modifiedHabits) {
                  try {
                    console.log(
                      `습관 수정 시도: "${habit.label}" (habitId: ${habit.id}, studyId: ${studyId})`,
                    );
                    await updateHabitApi(studyId, habit.id, {
                      title: habit.label,
                    });
                    console.log('습관 수정 성공:', habit.id);
                    delete habit.isModified;
                  } catch (error) {
                    console.error('습관 수정 실패:', error);
                    console.error('수정 실패 상세:', {
                      habit: habit,
                      studyId: studyId,
                      error: error.response?.data || error.message,
                    });
                    if (error.response?.status === 409) {
                      alert(
                        `습관 "${habit.label}"은 이미 존재합니다. 다른 이름을 사용해주세요.`,
                      );
                      return;
                    }
                    throw error;
                  }
                }

                // 3. 삭제된 습관들 처리 (원본에서 현재에 없는 것들)
                const currentIds = chips.map(chip => chip.id);
                const deletedHabits = originalChips.filter(
                  original =>
                    original.id &&
                    !String(original.id).startsWith('temp_') &&
                    !currentIds.includes(original.id),
                );
                console.log('삭제할 습관들:', deletedHabits);

                for (const habit of deletedHabits) {
                  try {
                    console.log(
                      `습관 삭제 시도: "${habit.label}" (habitId: ${habit.id}, studyId: ${studyId})`,
                    );
                    await deleteHabitApi(studyId, habit.id);
                    console.log('습관 삭제 성공:', habit.id);
                  } catch (error) {
                    console.error('습관 삭제 실패:', error);
                    console.error('삭제 실패 상세:', {
                      habit: habit,
                      studyId: studyId,
                      error: error.response?.data || error.message,
                    });
                    // 삭제 실패는 무시하고 계속 진행
                  }
                }

                // 4. 최종 결과를 부모 컴포넌트에 전달
                const formattedChips = chips.map(chip => ({
                  id: chip.id,
                  label: chip.label,
                  isDone: chip.isDone || false,
                }));
                onSave?.(formattedChips);
                onClose();

                console.log('모든 변경사항이 성공적으로 저장되었습니다.');
              } catch (error) {
                console.error('변경사항 저장 실패:', error);
                console.error('에러 상세 정보:', {
                  message: error.message,
                  status: error.response?.status,
                  statusText: error.response?.statusText,
                  data: error.response?.data,
                  url: error.config?.url,
                  method: error.config?.method,
                  studyId: studyId,
                  chips: chips,
                  originalChips: originalChips,
                });

                // 더 구체적인 에러 메시지 제공
                let errorMessage = '변경사항 저장에 실패했습니다.';
                if (error.response?.status === 409) {
                  errorMessage =
                    '이미 존재하는 습관 이름이 있습니다. 다른 이름을 사용해주세요.';
                } else if (error.response?.status === 404) {
                  errorMessage = '스터디를 찾을 수 없습니다.';
                } else if (error.response?.status >= 500) {
                  errorMessage =
                    '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                } else if (error.message) {
                  errorMessage = `오류: ${error.message}`;
                }

                alert(errorMessage);
              }
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
