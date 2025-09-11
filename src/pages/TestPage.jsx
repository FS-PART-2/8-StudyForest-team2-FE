// src/pages/TestPage.jsx
import React, { useState } from 'react';
import styles from '../styles/pages/TestPage.module.css';
import {
  getNicknameColor,
  getNicknameColorClass,
} from '../utils/getNicknameColor';

// Atoms / Molecules / Organisms
import Button from '../components/atoms/Button.jsx';
import Chip from '../components/atoms/Chip.jsx';
import EmojiCounter from '../components/molecules/EmojiCounter';
import StudyPasswordModal from '../components/organisms/StudyPasswordModal.jsx';
import Card from '../components/organisms/Card.jsx';
import SearchBar from '../components/molecules/SearchBar.jsx'; // 주석 해제
import Popup from '../components/molecules/Popup.jsx'; // ✅ 추가
import HabitWeekRow from '../components/molecules/HabitWeekRow.jsx'; // ✅ HabitWeekRow 추가
import HabitRecordTable from '../components/organisms/HabitRecordTable.jsx';

/**
 * 다양한 UI 컴포넌트(EmojiCounter, Chip 편집, StudyPasswordModal, SearchBar, Popup, HabitRecordTable, Card 닉네임 색상 테스트 등)를 시연하는 테스트 페이지를 렌더링합니다.
 *
 * 이 컴포넌트는 내부 상태로 칩 목록과 편집 상태, 검색어, 모달 및 팝업 열림 상태 등을 관리하며 각 데모 UI와 상호작용할 수 있는 핸들러를 제공합니다.
 *
 * @returns {JSX.Element} 데모용 구성 요소들을 포함한 테스트 페이지 엘리먼트
 */
export default function TestPage() {
  /** ------------------------------
   *  EmojiCounter demo
   *  ------------------------------ */
  const emojiData = [
    { id: 1, emoji: '👍', count: 1 },
    { id: 2, emoji: '❤️', count: 1 },
  ];

  /** ------------------------------
   *  Chip demo
   *  ------------------------------ */
  const [chips, setChips] = useState([
    { id: '1', label: '미라클모닝 6시 기상', selected: false },
    { id: '2', label: '운동 30분', selected: false },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  const startEdit = id => {
    const cur = chips.find(c => c.id === id);
    setEditingId(id);
    setDraft(cur ? cur.label : '');
    setChips(prev => prev.map(c => ({ ...c, selected: c.id === id })));
  };

  const confirmEdit = nextLabel => {
    if (!editingId) return;
    const text = (nextLabel ?? draft ?? '').trim();
    setChips(prev =>
      prev.map(c =>
        c.id === editingId ? { ...c, label: text || c.label } : c,
      ),
    );
    setEditingId(null);
    setDraft('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft('');
  };

  const addChip = () => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `id_${Date.now()}`;
    setEditingId(id);
    setDraft('새 습관');
    setChips(prev => [
      ...prev.map(c => ({ ...c, selected: false })),
      { id, label: '새 습관', selected: true },
    ]);
  };

  /** ------------------------------
   *  StudyPasswordModal demo
   *  ------------------------------ */
  const [isOpenStudyModal, setIsOpenStudyModal] = useState(false);
  const handleVerify = async password => {
    if (password !== '1234') return false;
    setIsOpenStudyModal(false);
    return true;
  };

  /** ------------------------------
   *  SearchBar demo
   *  ------------------------------ */
  const [search, setSearch] = useState('');

  /** ------------------------------
   *  Popup demo (1버튼 / 2버튼)
   *  ------------------------------ */
  const [openAlert, setOpenAlert] = useState(false); // 1버튼
  const [openConfirm, setOpenConfirm] = useState(false); // 2버튼

  /** ------------------------------
   *  HabitWeekRow demo
   *  ------------------------------ */
  const habitTestData = [
    {
      name: '독서하기',
      checks: [true, true, false, true, false, true, false],
      activeColor: '#4CAF50',
    },
    {
      name: '운동하기',
      checks: {
        mon: true,
        tue: false,
        wed: true,
        thu: true,
        fri: false,
        sat: true,
        sun: false,
      },
      activeColor: '#FF9800',
    },
    {
      name: '코딩하기',
      checks: [true, true, true, true, true, false, false],
      activeColor: '#2196F3',
    },
    {
      name: '명상하기',
      checks: [false, false, false, false, false, false, false],
      activeColor: '#9C27B0',
    },
  ];

  return (
    <div style={{ display: 'grid', gap: '2rem', padding: '1.6rem' }}>
      <header style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsOpenStudyModal(true)}
        >
          스터디 비밀번호모달
        </Button>

        {/* ✅ Popup 테스트 버튼 2개 */}
        <Button variant="action" size="lg" onClick={() => setOpenAlert(true)}>
          알럿 팝업(1버튼)
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setOpenConfirm(true)}
        >
          컨펌 팝업(2버튼)
        </Button>
      </header>

      {/* SearchBar lg */}
      <section>
        <h2>SearchBar Test</h2>
        <SearchBar
          value={search}
          onChange={v => setSearch(v)}
          onSubmit={v => setSearch(v)}
          placeholder="스터디 검색"
          size="lg"
        />
        <p style={{ marginTop: '1rem' }}>검색어: {search}</p>
      </section>

      {/* HabitWeekRow Test 섹션 제거 */}

      <section>
        <h2>EmojiCounter Test</h2>
        <EmojiCounter emojiData={emojiData} />
      </section>

      <section>
        <h2>HabitRecordTable Test</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <HabitRecordTable
            rows={[
              {
                name: '미라클모닝 6시 기상',
                checks: [true, false, true, true, false, true, false],
              },
              {
                name: '아침 챙겨 먹기',
                checks: [true, false, true, false, false, false, false],
              },
              {
                name: 'React 스터디 책 1챕터 읽기',
                checks: [true, false, true, false, false, false, false],
              },
              {
                name: '스트레칭',
                checks: [false, false, false, false, false, false, false],
              },
              {
                name: '사이드 프로젝트',
                checks: [false, false, false, false, false, false, false],
              },
              {
                name: '물 2L 마시기',
                checks: [false, false, false, false, false, false, false],
              },
            ]}
          />
        </div>
      </section>

      <section>
        <h2>Chip Test</h2>
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {chips.map(c => (
            <Chip
              key={c.id}
              label={c.label}
              selected={c.selected}
              editing={editingId === c.id}
              onClick={() => startEdit(c.id)}
              onChange={v => setDraft(v)}
              onConfirm={(_, v) => confirmEdit(v)}
              onCancel={cancelEdit}
            />
          ))}
          <Chip variant="add" onClick={addChip} aria-label="새 칩 추가" />
          <Card preset="SOLID_GRAY" />
        </div>
      </section>

      {/* Study Password Modal */}
      <StudyPasswordModal
        isOpen={isOpenStudyModal}
        onClose={() => setIsOpenStudyModal(false)}
        onVerify={handleVerify}
      />

      {/* ✅ Popup: 1버튼(알럿) */}
      <Popup
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        message="팝업 관련 메시지가 들어갑니다."
        confirmText="확인" // cancelText 없으면 1버튼 모드
        width="lg" // 큰 사이즈
      />

      {/* ✅ Popup: 2버튼(컨펌) */}
      <Popup
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        message="정말 나가시겠습니까?"
        confirmText="확인"
        cancelText="취소" // 지정하면 2버튼 모드
        onConfirm={() => {
          // TODO: 컨펌 확정 액션
          setOpenConfirm(false);
        }}
        onCancel={() => setOpenConfirm(false)}
        width="md" // 작은 사이즈
      />

      {/* 🎨 배경별 닉네임 색상 테스트 - Card 컴포넌트 사용 */}
      <section className={styles.testSection}>
        <h2 className={styles.sectionTitle}>배경별 닉네임 색상 테스트</h2>
        <p className={styles.sectionDescription}>
          각 배경에 따라 닉네임 색상이 자동으로 변경됩니다
        </p>

        <div className={styles.cardTestGrid}>
          {/* Card Background 01 */}
          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>Card Background 01</h3>
            <Card
              backgroundImage="/img/img-05.png"
              backgroundColor="/img/img-05.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={1}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--brand-blue, #0013A7)' }}
              >
                var(--brand-blue, #0013A7)
              </span>
            </div>
          </div>

          {/* Card Background 02 */}
          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>Card Background 02</h3>
            <Card
              backgroundImage="/img/img-06.png"
              backgroundColor="/img/img-06.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={2}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--text-forest, #2F5233)' }}
              >
                var(--text-forest, #2F5233)
              </span>
            </div>
          </div>

          {/* Card Background 03 */}
          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>Card Background 03</h3>
            <Card
              backgroundImage="/img/img-07.png"
              backgroundColor="/img/img-07.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={3}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--text-mint, #418099)' }}
              >
                var(--text-mint, #418099)
              </span>
            </div>
          </div>

          {/* Card Background 04 */}
          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>Card Background 04</h3>
            <Card
              backgroundImage="/img/img-08.png"
              backgroundColor="/img/img-08.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={4}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--text-ocean, #1A365D)' }}
              >
                var(--text-ocean, #1A365D)
              </span>
            </div>
          </div>

          {/* 색상 배경 테스트 */}
          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>
              Color Background 01 (Forest)
            </h3>
            <Card
              backgroundImage="/img/img-02.png"
              backgroundColor="/img/img-02.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={5}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--text-forest, #2F5233)' }}
              >
                var(--text-forest, #2F5233)
              </span>
            </div>
          </div>

          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>Color Background 02 (Mint)</h3>
            <Card
              backgroundImage="/img/img-03.png"
              backgroundColor="/img/img-03.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={6}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--text-mint, #418099)' }}
              >
                var(--text-mint, #418099)
              </span>
            </div>
          </div>

          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>
              Color Background 03 (Ocean)
            </h3>
            <Card
              backgroundImage="/img/img-04.png"
              backgroundColor="/img/img-04.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={7}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--text-ocean, #1A365D)' }}
              >
                var(--text-ocean, #1A365D)
              </span>
            </div>
          </div>

          <div className={styles.testCardWrapper}>
            <h3 className={styles.testCardTitle}>
              Color Background 04 (Desk - Blue)
            </h3>
            <Card
              backgroundImage="/img/img-01.png"
              backgroundColor="/img/img-01.png"
              nick="아리아"
              title="코딩 공부"
              description="매일 꾸준히 코딩 실력을 향상시켜보세요!"
              createdAt="2025-09-09"
              id={8}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorLabel}>닉네임 색상:</span>
              <span
                className={styles.colorValue}
                style={{ color: 'var(--brand-blue, #0013A7)' }}
              >
                var(--brand-blue, #0013A7)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
