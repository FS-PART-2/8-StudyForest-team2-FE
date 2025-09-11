import { useEffect, useState } from 'react';
import styles from '../styles/pages/StudyPage.module.css';
import { studyApi } from '../utils/api/study/getStudyApi';
import Card from '../components/organisms/Card';
import Dropdown from '../components/atoms/Dropdown';
import SearchBar from '../components/molecules/SearchBar';
import Button from '../components/atoms/Button';
import { useRecentStudyStore } from '../store/recentStudyStore';

export function StudyPage() {
  const [studyList, setStudyList] = useState([]);
  const [studyParams, setStudyParams] = useState({
    recentOrder: 'recent',
    offset: 0,
    limit: 6,
    keyword: '',
    pointOrder: '',
    isActive: true,
  });

  // 최근 조회한 스터디 목록
  const recentStudies = useRecentStudyStore(state => state.recentStudies);
  const clearRecentStudies = useRecentStudyStore(
    state => state.clearRecentStudies,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await studyApi.getStudyApi(studyParams);
        console.log(data);
        setStudyList(data.studies);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [studyParams]);

  const handleSubmit = value => {
    setStudyParams({ ...studyParams, keyword: value });
  };

  const handleDropdownChange = value => {
    if (value === 'recent' || value === 'old') {
      setStudyParams({
        ...studyParams,
        recentOrder: value,
        pointOrder: '',
      });
    }
    if (value === 'desc' || value === 'asc') {
      setStudyParams({
        ...studyParams,
        recentOrder: '',
        pointOrder: value,
      });
    }
  };

  const handleStudyMore = () => {
    setStudyParams({ ...studyParams, limit: studyParams.limit + 6 });
  };

  const handleResetRecentStudies = () => {
    clearRecentStudies();
  };

  return (
    <main className={styles.studyPageContainer}>
      <section className={styles.studyPageWrapper}>
        <div className={styles.studyPageWrapperHeader}>
          <h1 className={styles.studyPageTitle}>최근 조회한 스터디</h1>
          <Button
            onClick={handleResetRecentStudies}
            variant="action"
            size="ctrl-sm"
          >
            초기화
          </Button>
        </div>
        {/* 스터디 리스트 */}
        {recentStudies.length > 0 ? (
          <div className={styles.studyList}>
            {recentStudies.map(study => {
              // study.img 값을 올바른 프리셋 키로 매핑
              const mapToPresetKey = (imgValue) => {
                if (!imgValue) return 'img-01'; // 기본값
                
                // 백엔드에서 오는 경로를 프리셋 키로 매핑
                const pathToKeyMapping = {
                  '/assets/images/card-bg-color-01.svg': 'img-01',
                  '/assets/images/card-bg-color-02.svg': 'img-02',
                  '/assets/images/card-bg-color-03.svg': 'img-03',
                  '/assets/images/card-bg-color-04.svg': 'img-04',
                  '/assets/images/card-bg-01.svg': 'img-05',
                  '/assets/images/card-bg-02.svg': 'img-06',
                  '/assets/images/card-bg-03.svg': 'img-07',
                  '/assets/images/card-bg-04.svg': 'img-08',
                };
                
                return pathToKeyMapping[imgValue] || 'img-01';
              };
              
              return (
                <Card
                  key={study.id}
                  preset={mapToPresetKey(study.img)}
                  nick={study.nick}
                  title={study.name}
                  points={study.point || 0}
                  createdAt={study?.createdAt?.split('T')[0]}
                  description={study.content}
                  id={study.id}
                  emojiData={study.studyEmojis?.map(item => ({
                    emoji: item.emoji?.symbol || item.symbol || '🔥',
                    count: item.count || 0,
                  })) || []}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.studyListEmpty}>
            <p>최근 조회한 스터디가 없습니다.</p>
          </div>
        )}
      </section>

      {/* 스터디 둘러보기 */}
      <section className={styles.studyPageWrapper}>
        <h1 className={styles.studyPageTitle}>스터디 둘러보기</h1>
        <div className={styles.studyListFilter}>
          <SearchBar onSubmit={handleSubmit} />
          <Dropdown
            onChange={handleDropdownChange}
            value={
              studyParams.recentOrder || studyParams.pointOrder || 'recent'
            }
          />
        </div>
        {studyList.length > 0 ? (
          <div className={styles.studyList}>
            {studyList.map(study => {
              // study.img 값을 올바른 프리셋 키로 매핑
              const mapToPresetKey = (imgValue) => {
                if (!imgValue) return 'img-01'; // 기본값
                
                // 백엔드에서 오는 경로를 프리셋 키로 매핑
                const pathToKeyMapping = {
                  '/assets/images/card-bg-color-01.svg': 'img-01',
                  '/assets/images/card-bg-color-02.svg': 'img-02',
                  '/assets/images/card-bg-color-03.svg': 'img-03',
                  '/assets/images/card-bg-color-04.svg': 'img-04',
                  '/assets/images/card-bg-01.svg': 'img-05',
                  '/assets/images/card-bg-02.svg': 'img-06',
                  '/assets/images/card-bg-03.svg': 'img-07',
                  '/assets/images/card-bg-04.svg': 'img-08',
                };
                
                return pathToKeyMapping[imgValue] || 'img-01';
              };
              
              return (
                <Card
                  key={study.id}
                  preset={mapToPresetKey(study.img)}
                  id={study.id}
                  nick={study.nick}
                  title={study.name}
                  points={study.point || 0}
                  createdAt={study?.createdAt?.split('T')[0]}
                  description={study.content}
                  emojiData={study.studyEmojis?.map(item => ({
                    emoji: item.emoji?.symbol || item.symbol || '🔥',
                    count: item.count || 0,
                  })) || []}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.studyListEmpty}>
            <p>스터디가 없습니다.</p>
          </div>
        )}
      </section>

      <div className={styles.studyListMore}>
        <Button
          onClick={handleStudyMore}
          variant="outline"
          shape="circle"
          size="lg"
          disabled={
            studyList.length < studyParams.limit || studyList.length === 0
          }
        >
          더보기
        </Button>
      </div>
    </main>
  );
}
