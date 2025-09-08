import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import styles from '../styles/pages/StudyDetailPage.module.css';
import { useRecentStudyStore } from '../store/recentStudyStore';
import { studyApi } from '../utils/api/study/getStudyApi';
import { emojiApi } from '../utils/api/emoji/emojiApi';
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
      setEmojiData(data);
    } catch (error) {
      console.error('이모지 데이터 로딩 실패:', error);
      // 404 에러인 경우 (API 미구현) 빈 배열로 설정
      if (error.response?.status === 404) {
        console.log('이모지 API가 아직 구현되지 않았습니다.');
        setEmojiData([]);
      } else {
        setEmojiData([]);
      }
    }
  }, [id]);

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
      {/* 모바일용 스터디 액션 (이모지 위에) */}
      <div className={styles.mobileActionsSection}>
        <StudyActions studyId={id} title={studyData.name} />
      </div>

      {/* 이모지 카운터 */}
      <div className={styles.emojiSection}>
        <EmojiCounter
          emojiData={emojiData}
          studyId={id}
          onEmojiUpdate={handleEmojiUpdate}
        />
      </div>

      {/* 스터디 이름 + 스터디 액션 (PC/태블릿용) */}
      <div className={styles.titleSection}>
        <h1 className={styles.studyTitle}>{studyData.name}</h1>
        <div className={styles.actionsSection}>
          <StudyActions studyId={id} title={studyData.name} />
        </div>
      </div>

      {/* 오늘의 습관/집중 버튼 */}
      <div className={styles.todayButtonsSection}>
        <div className={styles.todayButtons}>
          <NavigationButton to={`/habit/${id}`}>오늘의 습관</NavigationButton>
          <NavigationButton to="/focus">오늘의 집중</NavigationButton>
        </div>
      </div>

      {/* 소개 */}
      <div className={styles.introSection}>
        <StudyIntro description={studyData.content || studyData.description} />
      </div>

      {/* 포인트 */}
      <div className={styles.pointsSection}>
        <StudyPoints points={studyData.points || 310} />
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
                  // 각 습관의 개별 isDone 상태를 사용
                  // 오늘이 월요일이므로 월요일에만 체크 표시
                  const checks = [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                  ];

                  // 습관이 완료되었다면 월요일에 체크
                  if (habit.isDone) {
                    checks[0] = true; // 월요일
                  }

                  habitRows.push({
                    name: habit.habit || '습관',
                    checks: checks,
                  });
                });
              });

              console.log('습관 데이터 변환:', {
                원본: studyData.habitHistories,
                변환된_데이터: habitRows,
              });
              return habitRows;
            })()}
          />
        </div>
      )}
    </div>
  );
}
