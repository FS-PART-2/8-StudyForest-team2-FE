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

/**
 * 스터디 상세 페이지를 렌더링하는 React 컴포넌트입니다.
 *
 * 상세 설명:
 * - URL 파라미터 `id`에 해당하는 스터디 상세 데이터를 서버에서 조회하고 로딩/오류 상태를 관리합니다.
 * - 조회된 스터디 데이터를 최근 본 스터디 저장소에 추가(addRecentStudy).
 * - 이모지 데이터는 emoji API를 우선 호출하고, 실패(특히 404)하면 스터디 응답의 `studyEmojis`로 폴백합니다.
 * - 이모지 갱신을 위한 콜백(handleEmojiUpdate)을 제공하여 하위 컴포넌트가 변경 후 데이터를 재로딩할 수 있게 합니다.
 * - 로딩 중에는 로딩 뷰를, 스터디를 찾지 못한 경우에는 안내 뷰를 노출합니다.
 * - 정상 데이터가 있으면 이모지 카운터, 스터디 액션, 동적 타이틀, 소개와 포인트 영역, 그리고 공개·활성 상태인 경우 습관 기록 테이블을 렌더링합니다.
 * - "오늘의 습관"과 "오늘의 집중" 버튼은 각각 `/habit/{id}`와 `/focus/{id}`로 이동하는 네비게이션 버튼입니다.
 *
 * @returns {JSX.Element} 스터디 상세 페이지의 React 엘리먼트
 */
export default function StudyDetailPage() {
  const { id } = useParams();
  const addRecentStudy = useRecentStudyStore(state => state.addRecentStudy);
  const [studyData, setStudyData] = useState(null);
  const [emojiData, setEmojiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이모지 데이터 가져오기 함수 (API 우선, 실패 시 스터디 데이터 사용)
  const fetchEmojiData = useCallback(async () => {
    try {
      // 먼저 이모지 API 시도
      const data = await emojiApi.getEmojis(id);
      if (Array.isArray(data)) {
        setEmojiData(data);
        return;
      }
    } catch (error) {
      // 404 에러인 경우 스터디 데이터에서 이모지 가져오기
      if (error.response?.status === 404) {
        console.log(
          '이모지 API가 구현되지 않음. 스터디 데이터에서 이모지를 가져옵니다.',
        );
      } else {
        console.warn('이모지 API 호출 실패:', error.message);
      }
    }

    // API 실패 시 스터디 데이터에서 이모지 사용
    if (studyData?.studyEmojis && Array.isArray(studyData.studyEmojis)) {
      setEmojiData(studyData.studyEmojis);
    } else {
      setEmojiData([]);
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
      } catch (error) {
        // 404 에러인 경우 조용히 처리 (스터디가 존재하지 않음)
        if (error.response?.status === 404) {
          console.log('스터디를 찾을 수 없습니다.');
          setStudyData(null);
        } else {
          console.error('스터디 데이터 로딩 실패:', error);
          // 타임아웃 에러인 경우 사용자에게 알림
          if (error.code === 'ECONNABORTED') {
            console.error(
              '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
            );
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudyData();
    }
  }, [id, addRecentStudy]);

  // 이모지 데이터 로드 (스터디 데이터 로드 후)
  useEffect(() => {
    if (id && studyData) {
      fetchEmojiData();
    }
  }, [id, studyData, fetchEmojiData]);

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
        <div className={styles.error}>
          <h2>스터디를 찾을 수 없습니다</h2>
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
              emojiData?.map((item, index) => ({
                id: item.id || `emoji-${index}`,
                emoji: item.emoji?.symbol || item.symbol || '🔥',
                count: item.count || 0,
              })) || []
            }
            studyId={id}
            onEmojiUpdate={handleEmojiUpdate}
          />
        </div>
        <div className={styles.actionsSection}>
          <StudyActions
            studyId={id}
            title={studyData?.name || studyData?.title || ''}
            nickname={studyData?.nick || studyData?.nickname || ''}
          />
        </div>
      </div>

      {/* 스터디 이름 + 네비게이션 버튼 (같은 row) */}
      <div className={styles.titleRow}>
        <div className={styles.studyTitleContainer}>
          <DynamicStudyTitle
            nickname={studyData?.nick || studyData?.nickname || ''}
            studyName={studyData?.name || studyData?.title || ''}
            backgroundImage={
              studyData?.img ||
              studyData?.background ||
              studyData?.backgroundImage ||
              ''
            }
            className={styles.studyTitle}
            tag="h1"
          />
        </div>
        <div className={styles.todayButtons}>
          <NavigationButton to={`/habit/${id}`}>오늘의 습관</NavigationButton>
          <NavigationButton to={`/focus/${id}`}>오늘의 집중</NavigationButton>
        </div>
      </div>

      {/* 하단 섹션: 소개 + 포인트 */}
      <div className={styles.bottomSection}>
        <div className={styles.introSection}>
          <StudyIntro
            description={studyData?.content || studyData?.description || ''}
          />
        </div>

        <div className={styles.pointsSection}>
          <StudyPoints
            points={
              studyData?.pointsSum ||
              studyData?._count?.points ||
              studyData?.points ||
              0
            }
          />
        </div>
      </div>

      {/* 습관 기록표 - 공개 스터디인 경우에만 표시 */}
      {studyData?.isPublic !== false && studyData?.isActive !== false && (
        <div className={styles.habitTableSection}>
          <HabitRecordTable
            studyId={id}
            rows={(() => {
              const habitRows = [];

              // 오늘 날짜를 기준으로 요일 계산 (한 번만 계산)
              const mondayBasedDay = ((new Date()).getDay() + 6) % 7;

              // habitHistories 배열을 순회하면서 각 습관을 개별 행으로 변환
              studyData?.habitHistories?.forEach(history => {
                history?.habits?.forEach(habit => {
                  const finalIsDone = habit?.isDone;

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

                  // 해당 요일에 습관 완료 상태 설정 (로컬 변경사항 반영)
                  checks[mondayBasedDay] = !!finalIsDone;

                  habitRows.push({
                    id: habit?.id,
                    name: habit?.habit || '습관',
                    checks: checks,
                    isDone: finalIsDone,
                    date: habit?.date,
                    habitHistoryId: habit?.habitHistoryId,
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
