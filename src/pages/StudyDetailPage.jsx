import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles/pages/StudyDetailPage.module.css';
import { useRecentStudyStore } from '../store/recentStudyStore';
import { studyApi } from '../utils/api/study/getStudyApi';
import EmojiCounter from '../components/molecules/EmojiCounter';
import StudyActions from '../components/molecules/StudyActions';
import StudyIntro from '../components/molecules/StudyIntro';
import StudyPoints from '../components/molecules/StudyPoints';
import HabitRecordTable from '../components/organisms/HabitRecordTable';
import NavigationButton from '../components/atoms/NavigationButton';

export default function StudyDetailPage() {
  const { id } = useParams();
  const addRecentStudy = useRecentStudyStore(state => state.addRecentStudy);
  const [studyData, setStudyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        setLoading(true);
        const data = await studyApi.getStudyDetailApi(id);
        setStudyData(data);
        addRecentStudy(data);
      } catch (error) {
        console.error('스터디 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudyData();
    }
  }, [id, addRecentStudy]);

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

  // 배경 스타일 생성
  const getBackgroundStyle = () => {
    // 로컬 스토리지에서 임시 수정 데이터 확인
    const tempModifyData = localStorage.getItem(`study_modify_${id}`);
    let backgroundValue = null;

    if (tempModifyData) {
      try {
        const tempData = JSON.parse(tempModifyData);
        backgroundValue = tempData.img;
      } catch (error) {
        console.error('로컬 스토리지 데이터 파싱 오류:', error);
      }
    }

    // 로컬 스토리지에 없으면 서버 데이터 사용
    if (!backgroundValue) {
      backgroundValue = studyData.background || studyData.img;
    }

    if (!backgroundValue) return {};

    // 색상인지 이미지인지 확인
    if (backgroundValue.startsWith('#')) {
      return { backgroundColor: backgroundValue };
    } else {
      return {
        backgroundImage: `url(${backgroundValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
  };

  return (
    <div className={styles.page} style={getBackgroundStyle()}>
      {/* 상단: 이모지 카운터 + 스터디 액션 */}
      <div className={styles.topSection}>
        <div className={styles.emojiSection}>
          <EmojiCounter
            emojiData={
              studyData.emojis || [
                { id: 1, emoji: '👍', count: 9 },
                { id: 2, emoji: '❤️', count: 9 },
                { id: 3, emoji: '⭐', count: 11 },
              ]
            }
          />
        </div>
        <div className={styles.actionsSection}>
          <StudyActions studyId={id} title={studyData.name} />
        </div>
      </div>

      {/* 스터디 이름 + 오늘의 습관/집중 버튼 */}
      <div className={styles.titleSection}>
        <h1 className={styles.studyTitle}>{studyData.name}</h1>
        <div className={styles.todayButtons}>
          <NavigationButton to="/habit">오늘의 습관</NavigationButton>
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

      {/* 습관 기록표 */}
      <div className={styles.habitTableSection}>
        <HabitRecordTable studyId={id} />
      </div>
    </div>
  );
}
