import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chip from '../components/atoms/Chip.jsx';
import Button from '../components/atoms/Button.jsx';
import NavigationButton from '../components/atoms/NavigationButton.jsx';
import styles from '../styles/pages/HabitPage.module.css';

export default function HabitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chips, setChips] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  // 스터디 ID가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    // TODO: API에서 습관 데이터 로드
    setLoading(false);
  }, [id, navigate]);

  // 새 칩 추가
  const addChip = () => {
    const chipId = crypto.randomUUID?.() ?? `id_${Date.now()}`;
    const label = '새 습관';
    setChips(prev => [...prev, { id: chipId, label }]);
    // 추가 직후 편집 모드로 진입
    setEditingId(chipId);
    setDraft(label);
  };

  // 칩 삭제
  const deleteChip = chipId => {
    setChips(prev => prev.filter(c => c.id !== chipId));
    if (editingId === chipId) {
      setEditingId(null);
      setDraft('');
    }
  };

  // 편집 시작
  const startEdit = chipId => {
    const cur = chips.find(c => c.id === chipId);
    setEditingId(chipId);
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

  // 저장
  const handleSave = () => {
    // TODO: API로 습관 데이터 저장
    console.log('습관 저장:', chips);
    navigate(`/study/${id}`);
  };

  // 취소
  const handleCancel = () => {
    navigate(`/study/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>오늘의 습관</h1>
          <div className={styles.navigation}>
            <NavigationButton to={`/study/${id}`}>
              스터디로 돌아가기
            </NavigationButton>
          </div>
        </div>

        {/* 칩 영역 */}
        <div className={styles.list}>
          {chips.map(chip => (
            <div key={chip.id} className={styles.chipWrapper}>
              <Chip
                label={editingId === chip.id ? draft : chip.label}
                selected={editingId === chip.id}
                editing={editingId === chip.id}
                onClick={() => startEdit(chip.id)}
                onChange={v => setDraft(v)}
                onConfirm={(_, v) => confirmEdit(v)}
                onCancel={cancelEdit}
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
          <Button
            size="cancel"
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button size="cancel" className={styles.saveBtn} onClick={handleSave}>
            수정 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
