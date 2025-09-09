import { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';
import NavigationButton from '../components/atoms/NavigationButton';
import styles from '../styles/pages/HabitPage.module.css';

// HabitPage 모달 컴포넌트
const HabitPage = ({ isOpen, onClose, habits, onUpdateHabits }) => {
  const [localHabits, setLocalHabits] = useState(habits);

  useEffect(() => {
    if (isOpen) {
      setLocalHabits(habits);
    }
  }, [isOpen, habits]);

  if (!isOpen) return null;

  const handleRemoveHabit = (index) => {
    setLocalHabits(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddHabit = () => {
    setLocalHabits(prev => [...prev, { name: '', active: true }]);
  };

  const handleHabitNameChange = (index, name) => {
    setLocalHabits(prev =>
      prev.map((habit, i) =>
        i === index ? { ...habit, name } : habit
      )
    );
  };

  const handleSave = () => {
    onUpdateHabits(localHabits.filter(habit => habit.name.trim() !== ''));
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleCancel}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <Text size="lg" weight="medium" tag="h2">목록 수정</Text>
        </div>
        
        <div className={styles.habitList}>
          {localHabits.map((habit, index) => (
            <div key={index} className={styles.habitItem}>
              <input
                type="text"
                value={habit.name}
                onChange={(e) => handleHabitNameChange(index, e.target.value)}
                placeholder="습관을 입력하세요"
                className={styles.habitInput}
              />
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveHabit(index)}
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          ))}
          
          <button className={styles.addButton} onClick={handleAddHabit}>
            +
          </button>
        </div>
        
        <div className={styles.modalActions}>
          <Button variant="control" size="cancle" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="control" size="action" onClick={handleSave}>
            수정 완료
          </Button>
        </div>
      </div>
    </div>
  );
};

// 메인 HabitPage 컴포넌트
export default function HabitPageMain() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [habits, setHabits] = useState([
    { name: '미라클모닝 6시 기상', active: true },
    { name: '아침 챙겨 먹기', active: true },
    { name: 'React 스터디 책 1챕터 읽기', active: false },
    { name: '스트레칭', active: false },
    { name: '영양제 챙겨 먹기', active: false },
    { name: '사이드 프로젝트', active: false },
    { name: '물 2L 먹기', active: false }
  ]);

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 시간을 한국어 형식으로 포맷팅
  const formatTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const period = hours >= 12 ? '오후' : '오전';
    const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    
    return `${year}-${month}-${day} ${period} ${hour12}:${minutes}`;
  };

  const handleUpdateHabits = (newHabits) => {
    setHabits(newHabits);
    console.log('습관이 업데이트되었습니다:', newHabits);
  };

  const toggleHabit = (index) => {
    const updatedHabits = habits.map((habit, i) => 
      i === index ? {...habit, active: !habit.active} : habit
    );
    setHabits(updatedHabits);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <Text size="3xl" weight="bold" color="#1f2937">연우의 개발공장</Text>
        <div className={styles.headerNav}>
          <NavigationButton to="/focus">
            오늘의 집중
          </NavigationButton>
          <NavigationButton to="/plan">
            홈
          </NavigationButton>
        </div>
      </div>

      {/* 현재 시간 */}
      <div className={styles.timeSection}>
        <Text size="lg" weight="regular" color="#9ca3af">현재 시간</Text>
        <Text size="base" weight="regular" color="#1f2937">{formatTime(currentTime)}</Text>
      </div>

      {/* 메인 카드 */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <Text size="2xl" weight="bold" >오늘의 습관</Text>
          <button 
            className={styles.editButton}
            onClick={() => setIsModalOpen(true)}
          >
            <Text size="sm" weight="regular" color="#9ca3af">습관 수정</Text>
          </button>
        </div>

        {/* 습관 목록 */}
        <div className={styles.habitsContainer}>
          {habits.map((habit, index) => (
            <button
              key={index}
              className={habit.active ? styles.activeHabit : styles.inactiveHabit}
              onClick={() => toggleHabit(index)}
            >
              <Text size="base" weight="regular" color={habit.active ? "white" : "#9ca3af"}>
                {habit.name}
              </Text>
            </button>
          ))}
        </div>
      </div>

      <HabitPage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habits={habits}
        onUpdateHabits={handleUpdateHabits}
      />
    </div>
  );
}