import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import styles from '../styles/pages/StudyDetailPage.module.css';
import { useRecentStudyStore } from '../store/recentStudyStore';
import { studyApi } from '../utils/api/study/getStudyApi';
import { emojiApi } from '../utils/api/emoji/emojiApi';
import { verifyStudyPassword } from '../utils/api/study/studyPasswordApi';
import { habitWeekApi } from '../utils/api/habit/getHabitWeekApi';
import DynamicStudyTitle from '../components/atoms/DynamicStudyTitle';
import EmojiCounter from '../components/molecules/EmojiCounter';
import StudyActions from '../components/organisms/StudyActions';
import StudyIntro from '../components/molecules/StudyIntro';
import StudyPoints from '../components/molecules/StudyPoints';
import HabitRecordTable from '../components/organisms/HabitRecordTable';
import NavigationButton from '../components/atoms/NavigationButton';
import StudyPasswordModal from '../components/organisms/StudyPasswordModal';

// 헬퍼 함수들 (컴포넌트 외부)
const getStudyField = (studyData, field, fallback = '') => {
  return studyData?.[field] || fallback;
};

const getStudyName = studyData =>
  getStudyField(studyData, 'name') || getStudyField(studyData, 'title', '');

const getStudyNickname = studyData =>
  getStudyField(studyData, 'nick') || getStudyField(studyData, 'nickname', '');

const getStudyDescription = studyData =>
  getStudyField(studyData, 'content') ||
  getStudyField(studyData, 'description', '');

const getStudyBackground = studyData =>
  getStudyField(studyData, 'img') ||
  getStudyField(studyData, 'background') ||
  getStudyField(studyData, 'backgroundImage', '');

const getStudyPoints = studyData => {
  const result =
    studyData?.point ??
    studyData?.points ??
    studyData?.pointsSum ??
    studyData?._count?.points ??
    0;
  return typeof result === 'number' ? result : Number(result) || 0;
};

export default function StudyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addRecentStudy = useRecentStudyStore(state => state.addRecentStudy);
  const [studyData, setStudyData] = useState(null);
  // const [emojiData, setEmojiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentHabits, setCurrentHabits] = useState([]); // 현재 활성 습관들
  const verifyAbortRef = useRef(null);

  async function increaseEmojiCount(emoji) {
    console.log(emoji);
    try {
      await emojiApi.incrementEmoji(id, emoji);
      setStudyData(prev => ({
        ...prev,
        studyEmojis: prev.studyEmojis.map(item =>
          item.emoji.id === emoji.id
            ? { ...item, count: item.count + 1 }
            : item,
        ),
      }));
    } catch (error) {
      console.error('이모지 카운트 증가 실패:', error);
    }
  }

  function decreaseEmojiCount(emoji) {
    console.log(emoji);
  }

  // 최신 습관 데이터 가져오기 (현재 활성 습관만)
  const fetchCurrentHabits = useCallback(async () => {
    if (!id) return;

    try {
      console.log('현재 활성 습관 데이터를 가져옵니다...');

      // 1. 현재 활성 습관 목록 가져오기 (삭제되지 않은 습관만)
      const { getHabitsApi } = await import('../utils/api/habit/habitApi');
      const activeHabits = await getHabitsApi(id);
      console.log('현재 활성 습관:', activeHabits);

      // 2. 주간 습관 데이터 가져오기
      const weekData = await habitWeekApi.getHabitWeekApi(id, {
        password: '1234',
      });
      console.log('주간 습관 데이터:', weekData);

      // 3. 활성 습관 ID 목록 생성
      const activeHabitIds = new Set(activeHabits.map(habit => habit.habitId));
      console.log('활성 습관 ID 목록:', activeHabitIds);

      // 4. API 응답에서 활성 습관만 필터링하여 변환
      if (weekData?.days) {
        const habitRows = [];

        // 각 날짜별 습관을 수집 (활성 습관만)
        Object.entries(weekData.days).forEach(([date, habits]) => {
          if (Array.isArray(habits) && habits.length > 0) {
            habits.forEach(habit => {
              // 활성 습관인지 확인
              if (!activeHabitIds.has(habit.habitId)) {
                console.log(
                  `삭제된 습관 제외: ${habit.title} (ID: ${habit.habitId})`,
                );
                return; // 삭제된 습관은 건너뛰기
              }

              // 이미 존재하는 습관인지 확인
              const existingHabit = habitRows.find(h => h.id === habit.habitId);
              if (existingHabit) {
                // 기존 습관에 해당 날짜의 완료 상태 추가
                const dateObj = new Date(date);
                const dayIndex = dateObj.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
                const mondayBasedIndex = (dayIndex + 6) % 7; // 월요일을 0으로 변환
                existingHabit.checks[mondayBasedIndex] = habit.isDone;
              } else {
                // 새로운 습관 추가
                const checks = Array(7).fill(false);
                const dateObj = new Date(date);
                const dayIndex = dateObj.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
                const mondayBasedIndex = (dayIndex + 6) % 7; // 월요일을 0으로 변환
                checks[mondayBasedIndex] = habit.isDone;

                habitRows.push({
                  id: habit.habitId,
                  name: habit.title,
                  checks: checks,
                });
              }
            });
          }
        });

        console.log('필터링된 습관 데이터:', habitRows);
        setCurrentHabits(habitRows);
      } else {
        setCurrentHabits([]);
      }
    } catch (error) {
      console.error('습관 데이터 로드 실패:', error);
      // API 실패 시 빈 배열로 설정
      setCurrentHabits([]);
    }
  }, [id]);

  // 습관 데이터를 HabitRecordTable 형식으로 변환 (주간 데이터)
  const getHabitRows = useCallback(() => {
    // currentHabits가 있으면 그것을 사용 (API에서 가져온 주간 습관 데이터)
    if (currentHabits.length > 0) {
      console.log('주간 습관 데이터 사용:', currentHabits);
      return currentHabits;
    }

    // fallback: 기존 studyData 사용
    if (studyData?.habitHistories && studyData.habitHistories.length > 0) {
      console.log('기존 스터디 데이터의 습관 사용:', studyData.habitHistories);
      return studyData.habitHistories;
    }

    console.log('습관 데이터가 없습니다.');
    return [];
  }, [currentHabits, studyData?.habitHistories]);

  // 이모지 데이터 가져오기 함수 (API 우선, 실패 시 스터디 데이터 사용)
  // const fetchEmojiData = useCallback(async () => {
  //   try {
  //     // 먼저 이모지 API 시도
  //     const data = await emojiApi.getEmojis(id);
  //     if (Array.isArray(data)) {
  //       setEmojiData(data);
  //       return;
  //     }
  //     // data가 null인 경우 (404 에러로 인한 fallback)
  //     if (data === null) {
  //       console.log(
  //         '이모지 API가 구현되지 않음. 스터디 데이터에서 이모지를 가져옵니다.',
  //       );
  //     }
  //   } catch (error) {
  //     // 404 에러인 경우 스터디 데이터에서 이모지 가져오기
  //     if (error.response?.status === 404) {
  //       console.log(
  //         '이모지 API가 구현되지 않음. 스터디 데이터에서 이모지를 가져옵니다.',
  //       );
  //     } else {
  //       console.warn('이모지 API 호출 실패:', error.message);
  //     }
  //   }

  //   // API 실패 시 스터디 데이터에서 이모지 사용
  //   if (studyData?.studyEmojis && Array.isArray(studyData.studyEmojis)) {
  //     setEmojiData(studyData.studyEmojis);
  //   } else {
  //     setEmojiData([]);
  //   }
  // }, [id, studyData?.studyEmojis]);

  // 이모지 업데이트 콜백
  // const handleEmojiUpdate = () => {
  //   fetchEmojiData();
  // };

  // 오늘의 습관 버튼 클릭 핸들러
  const handleHabitClick = () => {
    setIsPasswordModalOpen(true);
  };

  // 비밀번호 검증 핸들러
  const handlePasswordVerify = async password => {
    try {
      const controller = new AbortController();
      verifyAbortRef.current = controller;
      const isValid = await verifyStudyPassword(id, password, {
        timeout: 10000,
        signal: controller.signal,
      });

      if (isValid) {
        setIsPasswordModalOpen(false);
        // 비밀번호 검증 성공 시 HabitPage로 이동 (보안상 비밀번호는 전달하지 않음)
        navigate(`/habit/${id}`, {
          state: {
            studyData: studyData,
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('StudyDetailPage: 비밀번호 검증 실패:', error);
      // 네트워크 오류는 예외를 다시 throw하여 모달에서 처리하도록 함
      throw error;
    } finally {
      verifyAbortRef.current = null;
    }
  };

  useEffect(() => {
    const fetchStudyData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await studyApi.getStudyDetailApi(id);
        setStudyData(data);
        addRecentStudy(data);
      } catch (error) {
        console.error('스터디 데이터 로딩 실패:', error);

        // 에러 타입별 처리
        if (error.response?.status === 404) {
          setError('스터디를 찾을 수 없습니다.');
        } else if (error.code === 'ECONNABORTED') {
          setError('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
        } else if (error.response?.status >= 500) {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError('스터디 정보를 불러오는데 실패했습니다.');
        }
        setStudyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, [id, addRecentStudy]);

  // 언마운트 시 안전 취소
  useEffect(() => () => verifyAbortRef.current?.abort(), []);

  // 이모지 데이터 로드 (스터디 데이터 로드 후)
  // useEffect(() => {
  //   if (id && studyData) {
  //     fetchEmojiData();
  //   }
  // }, [id, studyData, fetchEmojiData]);

  // 최신 습관 데이터 로드 (스터디 데이터 로드 후)
  useEffect(() => {
    if (id && studyData) {
      fetchCurrentHabits();
    }
  }, [id, studyData, fetchCurrentHabits]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (!studyData && !loading) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h2>{error || '스터디를 찾을 수 없습니다'}</h2>
          <p>요청하신 스터디 ID({id})가 존재하지 않습니다.</p>
          <p>스터디 목록에서 다른 스터디를 선택해주세요.</p>
          <div style={{ marginTop: '1rem' }}>
            <NavigationButton to="/">스터디 목록으로 이동</NavigationButton>
          </div>
        </div>
      </div>
    );
  }

  // 배경 스타일 제거 - Card 컴포넌트에서만 배경 적용

  return (
    <div className={styles.page}>
      {/* 이모지 + 스터디 액션 (같은 row) */}
      <div className={styles.topRow}>
        <div className={styles.emojiSection}>
          <EmojiCounter
            emojiData={
              studyData?.studyEmojis?.map(emojiData => ({
                id: emojiData?.emoji?.id,
                emoji: emojiData?.emoji?.symbol,
                count: emojiData?.count || 0,
              })) || []
            }
            studyId={id}
            increaseEmojiCount={increaseEmojiCount}
            decreaseEmojiCount={decreaseEmojiCount}
          />
        </div>
        <div className={styles.actionsSection}>
          <StudyActions
            studyId={id}
            title={getStudyName(studyData)}
            nickname={getStudyNickname(studyData)}
            backgroundImage={getStudyBackground(studyData)}
          />
        </div>
      </div>

      {/* 스터디 이름 + 네비게이션 버튼 (같은 row) */}
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
          <NavigationButton to="/">홈</NavigationButton>
          <NavigationButton onClick={handleHabitClick}>
            오늘의 습관
          </NavigationButton>
          <NavigationButton to={`/focus/${id}`}>오늘의 집중</NavigationButton>
        </div>
      </div>

      {/* 하단 섹션: 소개 + 포인트 */}
      <div className={styles.bottomSection}>
        <div className={styles.introSection}>
          <StudyIntro description={getStudyDescription(studyData)} />
        </div>

        <div className={styles.pointsSection}>
          <StudyPoints points={getStudyPoints(studyData)} />
        </div>
      </div>

      {/* 습관 기록표 - 공개 스터디인 경우에만 표시 */}
      {studyData?.isPublic !== false && studyData?.isActive !== false && (
        <div className={styles.habitTableSection}>
          <HabitRecordTable studyId={id} rows={getHabitRows()} />
        </div>
      )}

      {/* 비밀번호 입력 모달 */}
      <StudyPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onVerify={handlePasswordVerify}
        mode="habit"
        nickname={getStudyNickname(studyData)}
        studyName={getStudyName(studyData)}
        backgroundImage={getStudyBackground(studyData)}
      />
    </div>
  );
}
