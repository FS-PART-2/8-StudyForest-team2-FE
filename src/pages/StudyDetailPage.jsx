import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import styles from '../styles/pages/StudyDetailPage.module.css';
import { useRecentStudyStore } from '../store/recentStudyStore';
import { studyApi } from '../utils/api/study/getStudyApi';
import { emojiApi } from '../utils/api/emoji/emojiApi';
import DynamicStudyTitle from '../components/atoms/DynamicStudyTitle';
import EmojiCounter from '../components/molecules/EmojiCounter';
import StudyActions from '../components/organisms/StudyActions';
import StudyIntro from '../components/molecules/StudyIntro';
import StudyPoints from '../components/molecules/StudyPoints';
import HabitRecordTable from '../components/organisms/HabitRecordTable';
import NavigationButton from '../components/atoms/NavigationButton';

export default function StudyDetailPage() {
  const { id } = useParams();
  const addRecentStudy = useRecentStudyStore(state => state.addRecentStudy);
  const [studyData, setStudyData] = useState(null);
  const [emojiData, setEmojiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이모지 데이터 가져오기 함수
  const fetchEmojiData = useCallback(async () => {
    try {
      const data = await emojiApi.getEmojis(id);
      // 데이터 유효성 검사
      if (Array.isArray(data)) {
        setEmojiData(data);
      } else {
        console.warn('이모지 데이터가 배열이 아닙니다:', data);
        setEmojiData([]);
      }
    } catch (error) {
      console.error('이모지 데이터 로딩 실패:', error);
      // 404 에러인 경우 (API 미구현) 스터디 데이터에서 이모지 가져오기
      if (error.response?.status === 404) {
        console.log(
          '이모지 API가 아직 구현되지 않았습니다. 스터디 데이터에서 이모지를 가져옵니다.',
        );
        if (studyData?.studyEmojis && Array.isArray(studyData.studyEmojis)) {
          setEmojiData(studyData.studyEmojis);
        } else {
          setEmojiData([]);
        }
      } else {
        setEmojiData([]);
      }
    }
  }, [id, studyData?.studyEmojis]);

  // 이모지 업데이트 콜백
  const handleEmojiUpdate = () => {
    fetchEmojiData();
  };

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        setLoading(true);
        const data = await studyApi.getStudyDetailApi(id);
        setStudyData(data);
        addRecentStudy(data);

        // 스터디 데이터에서 이모지 데이터 설정 (유효성 검사 포함)
        if (data?.studyEmojis && Array.isArray(data.studyEmojis)) {
          setEmojiData(data.studyEmojis);
        } else {
          setEmojiData([]);
        }
      } catch (error) {
        console.error('스터디 데이터 로딩 실패:', error);
        // 타임아웃 에러인 경우 사용자에게 알림
        if (error.code === 'ECONNABORTED') {
          console.error(
            '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudyData();
    }
  }, [id, addRecentStudy]);

  // 이모지 데이터 로드
  useEffect(() => {
    if (id) {
      fetchEmojiData();
    }
  }, [id, fetchEmojiData]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (!studyData) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>스터디를 찾을 수 없습니다.</div>
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
            emojiData={emojiData}
            studyId={id}
            onEmojiUpdate={handleEmojiUpdate}
          />
        </div>
        <div className={styles.actionsSection}>
          <StudyActions
            studyId={id}
            title={studyData.name}
            nickname={studyData.nick}
          />
        </div>
      </div>

      {/* 스터디 이름 + 네비게이션 버튼 (같은 row) */}
      <div className={styles.titleRow}>
        <div className={styles.studyTitleContainer}>
          <DynamicStudyTitle
            nickname={studyData.nick}
            studyName={studyData.name}
            backgroundImage={studyData.backgroundImage}
            className={styles.studyTitle}
            tag="h1"
          />
        </div>
        <div className={styles.todayButtons}>
          <NavigationButton to={`/habit/${id}`}>오늘의 습관</NavigationButton>
          <NavigationButton to="/focus">오늘의 집중</NavigationButton>
        </div>
      </div>

      {/* 하단 섹션: 소개 + 포인트 */}
      <div className={styles.bottomSection}>
        <div className={styles.introSection}>
          <StudyIntro
            description={studyData.content || studyData.description}
          />
        </div>

        <div className={styles.pointsSection}>
          <StudyPoints
            points={studyData.pointsSum || studyData._count?.points || 0}
          />
        </div>
      </div>

      {/* 습관 기록표 - 공개 스터디인 경우에만 표시 */}
      {studyData.isPublic !== false && (
        <div className={styles.habitTableSection}>
          <HabitRecordTable
            studyId={id}
            rows={(() => {
              const habitRows = [];

              // habitHistories 배열을 순회하면서 각 습관을 개별 행으로 변환
              studyData.habitHistories?.forEach(history => {
                history.habits?.forEach(habit => {
                  // 실제 습관 날짜를 기반으로 요일 계산
                  const habitDate = new Date(habit.date);
                  const dayOfWeek = habitDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일

                  // 요일을 월요일 기준으로 변환 (월요일=0, 화요일=1, ..., 일요일=6)
                  const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

                  // 7일 배열 초기화 (월요일부터 일요일까지)
                  const checks = [
                    false, // 월요일
                    false, // 화요일
                    false, // 수요일
                    false, // 목요일
                    false, // 금요일
                    false, // 토요일
                    false, // 일요일
                  ];

                  // 해당 요일에 습관 완료 상태 설정
                  if (habit.isDone) {
                    checks[mondayBasedDay] = true;
                  }

                  habitRows.push({
                    id: habit.id,
                    name: habit.habit || '습관',
                    checks: checks,
                    isDone: habit.isDone,
                    date: habit.date,
                    habitHistoryId: habit.habitHistoryId,
                  });
                });
              });

              return habitRows;
            })()}
          />
        </div>
      )}
    </div>
  );
}
