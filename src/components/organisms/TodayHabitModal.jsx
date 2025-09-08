import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Chip from '../atoms/Chip.jsx';
import Button from '../atoms/Button.jsx';
import styles from '../../styles/components/organisms/TodayHabitModal.module.css';

export default function TodayHabitModal({ open, onClose, onSave }) {
  const [chips, setChips] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  if (!open) return null;

  // 새 칩 추가
  const addChip = () => {
    const id = crypto.randomUUID?.() ?? `id_${Date.now()}`;
    const label = '새 습관';
    setChips(prev => [...prev, { id, label }]);
    // 추가 직후 편집 모드로 진입
    setEditingId(id);
    setDraft(label);
  };

  // 칩 삭제
  const deleteChip = id => {
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
  const confirmEdit = valueFromChip => {
    if (!editingId) return;
    const value = (valueFromChip ?? draft ?? '').trim();
    if (!value) {
      // 빈 값이면 원복
      setEditingId(null);
      setDraft('');
      return;
    }
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
