import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Chip from '../components/atoms/Chip';
import Text from '../components/atoms/Text';
import NavigationButton from '../components/atoms/NavigationButton';
import DynamicStudyTitle from '../components/atoms/DynamicStudyTitle';
import TodayHabitModal from '../components/organisms/TodayHabitModal';
import { instance } from '../utils/api/axiosInstance';
import { habitUpdateApi } from '../utils/api/habit/updateHabitApi';
import styles from '../styles/pages/HabitPage.module.css';

// 메인 HabitPage 컴포넌트
export default function HabitPageMain() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [studyData, setStudyData] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 스터디 습관 데이터 로드
  useEffect(() => {
    if (id) {
      loadStudyHabits();
    }
  }, [id]);

  const loadStudyHabits = async () => {
    try {
      setLoading(true);
      // 스터디 상세 정보 API로 스터디 데이터 가져오기 (StudyDetailPage와 동일)
      const studyResponse = await instance.get(`/api/studies/${encodeURIComponent(id)}`);
      const studyData = studyResponse.data;
      setStudyData(studyData);

      // StudyDetailPage와 동일한 방식으로 습관 데이터 추출
      let habitList = [];
      if (studyData?.habitHistories && studyData.habitHistories.length > 0) {
        const latestHistory = studyData.habitHistories[0];
        if (latestHistory.habits) {
          habitList = latestHistory.habits.map(habit => ({
            id: habit.id,
            name: habit.habit || habit.name,
            isDone: habit.isDone || false,
          }));
        }
      }

      console.log('습관 목록:', habitList);
      setHabits(habitList);
    } catch (error) {
      console.error('습관 목록 로드 실패:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  // 시간을 한국어 형식으로 포맷팅
  const formatTime = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const period = hours >= 12 ? '오후' : '오전';
    const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

    return `${year}-${month}-${day} ${period} ${hour12}:${minutes}`;
  };

  const handleUpdateHabits = () => {
    // 모달에서 습관이 수정되었으므로 데이터를 다시 로드
    loadStudyHabits();
    console.log('습관 목록이 업데이트되었습니다');
  };

  const toggleHabit = async index => {
    const habit = habits[index];
    if (!habit || !habit.id) return;

    // 로컬 상태 업데이트
    const newIsDone = !habit.isDone;
    const updatedHabits = habits.map((h, i) =>
      i === index ? { ...h, isDone: newIsDone } : h,
    );
    setHabits(updatedHabits);

    console.log(
      `습관 "${habit.name}" ${newIsDone ? '완료' : '미완료'}로 업데이트됨`,
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '2rem 0',
      }}
    >
      <div className={styles.page}>
        {/* 제목 + 네비게이션 버튼 (같은 row) */}
        <div className={styles.titleRow}>
          <div className={styles.studyTitleContainer}>
            <DynamicStudyTitle
              nickname={studyData?.nick}
              studyName={studyData?.name}
              backgroundImage={studyData?.img || ''}
              className={styles.studyTitle}
              tag="h1"
            />
          </div>
          <div className={styles.todayButtons}>
            <NavigationButton to="/focus">오늘의 집중</NavigationButton>
            <NavigationButton to="/" variant="home">
              홈
            </NavigationButton>
          </div>
        </div>

        {/* 현재 시간 */}
        <div className={styles.timeSection}>
          <Text size="lg" weight="medium" color="#9ca3af">
            현재 시간
          </Text>
          <Text size="lg" weight="regular" color="#1f2937">
            {formatTime(currentTime)}
          </Text>
        </div>

        {/* 메인 카드 */}
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h2>오늘의 습관</h2>
            <button
              className={styles.editButton}
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              <Text size="sm" weight="regular" color="#9ca3af">
                목록 수정
              </Text>
            </button>
          </div>

          {/* 습관 목록 */}
          <div className={styles.habitsContainer}>
            {loading ? (
              <div className={styles.loading} role="status" aria-live="polite">습관 목록을 불러오는 중...</div>
            ) : habits.length > 0 ? (
              habits.map((habit, index) => (
                <button
                  key={habit.id || index}
                  className={
                    habit.isDone ? styles.activeHabit : styles.inactiveHabit
                  }
                  onClick={() => toggleHabit(index)}
                  aria-pressed={habit.isDone}
                  type="button"
                >
                  {habit.name}
                </button>
              ))
            ) : (
              <div className={styles.emptyHabits}>
                <div className={styles.emptyTitle}>아직 습관이 없어요</div>
                <div className={styles.emptySubtitle}>
                  목록 수정을 눌러 습관을 생성해보세요
                </div>
              </div>
            )}
          </div>
        </div>

        <TodayHabitModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdateHabits}
          studyId={id}
        />
      </div>
    </div>
  );
}
