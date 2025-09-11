import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Chip from '../components/atoms/Chip';
import Text from '../components/atoms/Text';
import NavigationButton from '../components/atoms/NavigationButton';
import DynamicStudyTitle from '../components/atoms/DynamicStudyTitle';
import TodayHabitModal from '../components/organisms/TodayHabitModal';
import { instance } from '../utils/api/axiosInstance';
import { getHabitsApi, toggleHabitApi } from '../utils/api/habit/habitApi';
import styles from '../styles/pages/HabitPage.module.css';

// 헬퍼 함수들 (컴포넌트 외부)
const getStudyField = (studyData, field, fallback = '') => {
  return studyData?.[field] || fallback;
};

const getStudyName = studyData =>
  getStudyField(studyData, 'name') || getStudyField(studyData, 'title', '');

const getStudyNickname = studyData =>
  getStudyField(studyData, 'nick') || getStudyField(studyData, 'nickname', '');

const getStudyBackground = studyData =>
  getStudyField(studyData, 'img') ||
  getStudyField(studyData, 'background') ||
  getStudyField(studyData, 'backgroundImage', '');

const transformHabitData = habitsData => {
  if (!Array.isArray(habitsData)) return [];

  return habitsData.map(habit => ({
    id: habit.habitId || habit.id, // 백엔드에서 habitId로 제공됨
    name: habit.title || habit.habit || habit.name,
    isDone: habit.isDone || false,
  }));
};

const extractFallbackHabits = studyData => {
  if (!studyData?.habitHistories?.length) return [];

  const latestHistory = studyData.habitHistories[0];
  if (!latestHistory?.habits) return [];

  return latestHistory.habits.map(habit => ({
    id: habit.habitId || habit.id, // 백엔드에서 habitId로 제공됨
    name: habit.title || habit.habit || habit.name,
    isDone: habit.isDone || false,
  }));
};

// 메인 HabitPage 컴포넌트
export default function HabitPageMain() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [studyData, setStudyData] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadStudyHabits = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // 1. 스터디 상세 정보 가져오기
      const studyResponse = await instance.get(
        `/api/studies/${encodeURIComponent(id)}`,
      );
      const studyData = studyResponse.data;
      setStudyData(studyData);

      // 2. 백엔드 습관 API로 습관 목록 가져오기
      try {
        const habitsData = await getHabitsApi(id);
        console.log('백엔드 API 원본 응답:', habitsData);
        const habitList = transformHabitData(habitsData);
        console.log('변환된 습관 목록:', habitList);
        setHabits(habitList);
        console.log('백엔드 습관 API 성공:', habitList);
      } catch (apiError) {
        // 백엔드 API 실패 시 fallback
        if (apiError.response?.status === 404) {
          console.log('백엔드 습관 API 미구현, fallback 사용');
        } else {
          console.error('습관 API 호출 실패:', apiError);
        }

        const habitList = extractFallbackHabits(studyData);
        setHabits(habitList);
        console.log('Fallback 습관 목록:', habitList);
      }
    } catch (error) {
      console.error('스터디 데이터 로드 실패:', error);
      setError('스터디 정보를 불러오는데 실패했습니다.');
      setStudyData(null);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 스터디 습관 데이터 로드
  useEffect(() => {
    if (id) {
      loadStudyHabits();
    }
  }, [id, loadStudyHabits]);

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

  const handleUpdateHabits = (updatedHabits = null) => {
    console.log('handleUpdateHabits 호출됨:', { updatedHabits });
    if (updatedHabits) {
      // TodayHabitModal에서 전달받은 습관들을 처리
      const formattedHabits = updatedHabits.map(habit => ({
        id: habit.id,
        name: habit.label,
        isDone: habit.isDone || false,
      }));

      setHabits(prevHabits => {
        console.log('기존 습관들:', prevHabits);
        console.log('업데이트할 습관들:', formattedHabits);

        // 기존 습관들을 복사
        let finalHabits = [...prevHabits];

        formattedHabits.forEach(updatedHabit => {
          const existingIndex = finalHabits.findIndex(
            h => h.id === updatedHabit.id,
          );

          if (existingIndex !== -1) {
            // 기존 습관이 있으면 업데이트
            console.log(
              `기존 습관 업데이트: ${updatedHabit.name} (ID: ${updatedHabit.id})`,
            );
            finalHabits[existingIndex] = updatedHabit;
          } else {
            // 기존 습관이 없으면 새로 추가 (중복 체크)
            const isNameUnique = !finalHabits.some(
              h => h.name === updatedHabit.name,
            );
            if (isNameUnique) {
              console.log(
                `새 습관 추가: ${updatedHabit.name} (ID: ${updatedHabit.id})`,
              );
              finalHabits.push(updatedHabit);
            } else {
              console.log(
                `중복된 이름으로 인해 습관 추가 건너뜀: ${updatedHabit.name}`,
              );
            }
          }
        });

        console.log('최종 습관 목록:', finalHabits);
        return finalHabits;
      });

      console.log('습관 목록이 업데이트되었습니다:', formattedHabits);
    } else {
      // 모달이 닫힐 때는 API에서 최신 데이터 로드
      loadStudyHabits();
      console.log('습관 목록이 API에서 업데이트되었습니다');
    }
  };

  // 목록 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    // 습관 수정은 비밀번호 없이 바로 TodayHabitModal 열기
    setIsModalOpen(true);
  };

  const toggleHabit = async index => {
    const habit = habits[index];
    console.log('toggleHabit 호출됨:', { index, habit, habitId: habit?.id });

    if (!habit || !habit.id) {
      console.log('습관 또는 ID가 없어서 토글 중단:', {
        habit,
        habitId: habit?.id,
      });
      return;
    }

    // 로컬 상태 먼저 업데이트 (즉시 반응)
    const newIsDone = !habit.isDone;
    console.log('상태 토글:', { from: habit.isDone, to: newIsDone });

    const updatedHabits = habits.map((h, i) =>
      i === index ? { ...h, isDone: newIsDone } : h,
    );
    setHabits(updatedHabits);

    // 백엔드 API로 서버에 상태 업데이트 시도
    try {
      const result = await toggleHabitApi(habit.id);
      console.log(
        `습관 "${habit.name}" ${newIsDone ? '완료' : '미완료'}로 서버에 업데이트됨`,
      );

      // 서버 응답으로 로컬 상태 업데이트 (서버가 최신 상태를 반환하는 경우)
      if (result && typeof result.isDone !== 'undefined') {
        const serverUpdatedHabits = habits.map((h, i) =>
          i === index ? { ...h, isDone: result.isDone } : h,
        );
        setHabits(serverUpdatedHabits);
      }
    } catch (error) {
      console.error('습관 상태 업데이트 실패:', error);

      // 백엔드 API가 구현되지 않은 경우 (404)
      if (error.response?.status === 404) {
        console.log('백엔드 습관 토글 API 미구현, 로컬 상태 유지');
        return; // 404는 로컬 상태 유지
      }

      // API 실패 시 로컬 상태를 원래대로 되돌리기
      const revertedHabits = habits.map((h, i) =>
        i === index ? { ...h, isDone: habit.isDone } : h,
      );
      setHabits(revertedHabits);

      // 사용자에게 에러 메시지 표시
      const errorMessage = error.response?.data?.message;
      if (
        error.response?.status === 400 &&
        errorMessage?.includes('studyId는 1 이상의 정수여야 합니다')
      ) {
        alert('스터디 ID 형식이 올바르지 않습니다. 페이지를 새로고침해주세요.');
      } else if (error.response?.status === 401) {
        alert('인증이 필요합니다. 다시 로그인해주세요.');
      } else {
        alert('습관 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
      }
    }
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
              nickname={getStudyNickname(studyData)}
              studyName={getStudyName(studyData)}
              backgroundImage={getStudyBackground(studyData)}
              className={styles.studyTitle}
              tag="h1"
            />
          </div>
          <div className={styles.todayButtons}>
            <NavigationButton to={`/focus/${id}`}>오늘의 집중</NavigationButton>
            <NavigationButton to={`/study/${id}`}>
              스터디 페이지
            </NavigationButton>
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
            <div className={styles.headerButtons}>
              <button
                className={styles.editButton}
                onClick={handleEditClick}
                type="button"
              >
                <Text size="sm" weight="regular" color="#9ca3af">
                  목록 수정
                </Text>
              </button>
            </div>
          </div>

          {/* 습관 목록 */}
          <div className={styles.habitsContainer}>
            {loading ? (
              <div className={styles.loading} role="status" aria-live="polite">
                습관 목록을 불러오는 중...
              </div>
            ) : error ? (
              <div className={styles.error}>
                <Text size="md" weight="medium" color="#ef4444">
                  {error}
                </Text>
                <button
                  onClick={loadStudyHabits}
                  className={styles.retryButton}
                >
                  다시 시도
                </button>
              </div>
            ) : habits.length > 0 ? (
              habits.map((habit, index) => (
                <Chip
                  key={habit.id || index}
                  label={habit.name}
                  selected={habit.isDone}
                  onClick={() => {
                    console.log(
                      'Chip 클릭됨:',
                      habit.name,
                      '현재 상태:',
                      habit.isDone ? '완료' : '미완료',
                    );
                    toggleHabit(index);
                  }}
                  disabled={false}
                  style={{
                    width: '100%',
                    height: '5.5rem',
                    padding: '1.3rem 2rem',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    fontSize: '1.6rem',
                    pointerEvents: 'auto',
                    // 완료 상태일 때만 브랜드 블루, 미완료는 기본 스타일 유지
                    ...(habit.isDone && {
                      background: 'var(--brand-blue, #3b82f6)',
                      color: 'white',
                      border: 'none',
                    }),
                  }}
                />
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
          onClose={() => {
            setIsModalOpen(false);
            // 모달이 닫힐 때도 데이터 새로고침
            handleUpdateHabits();
          }}
          onSave={handleUpdateHabits}
          studyId={id}
        />
      </div>
    </div>
  );
}
