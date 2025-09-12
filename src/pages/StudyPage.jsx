import { useEffect, useState } from 'react';
import styles from '../styles/pages/StudyPage.module.css';
import { studyApi } from '../utils/api/study/getStudyApi';
import Card from '../components/organisms/Card';
import Dropdown from '../components/atoms/Dropdown';
import SearchBar from '../components/molecules/SearchBar';
import Button from '../components/atoms/Button';
import { useRecentStudyStore } from '../store/recentStudyStore';

const MORE_LIMIT = 6;

const options = [
  { value: 'recent', label: '최근순' },
  { value: 'old', label: '오래된 순' },
  { value: 'points_desc', label: '많은 포인트 순' },
  { value: 'points_asc', label: '적은 포인트 순' },
];

export function StudyPage() {
  const [studyList, setStudyList] = useState([]);
  const [studyParams, setStudyParams] = useState({
    offset: 0,
    limit: 6,
    keyword: '',
    sort: 'recent',
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
    setStudyParams({
      ...studyParams,
      sort: value,
    });
  };

  const handleStudyMore = () => {
    setStudyParams({ ...studyParams, limit: studyParams.limit + MORE_LIMIT });
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
              return (
                <Card
                  key={study.id}
                  preset={study.img}
                  nick={study.nick}
                  title={study.name}
                  points={study.point || 0}
                  createdAt={study?.createdAt?.split('T')[0]}
                  description={study.content}
                  id={study.id}
                  emojiData={(
                    study.studyEmojis?.map(item => ({
                      emoji: item.emoji?.symbol || item.symbol || '🔥',
                      count: item.count || 0,
                    })) || []
                  )
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)}
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
            value={studyParams.sort || 'recent'}
            options={options}
          />
        </div>
        {studyList.length > 0 ? (
          <div className={styles.studyList}>
            {studyList.map(study => {
              return (
                <Card
                  key={study.id}
                  preset={study.img}
                  id={study.id}
                  nick={study.nick}
                  title={study.name}
                  points={study.point || 0}
                  createdAt={study?.createdAt?.split('T')[0]}
                  description={study.content}
                  emojiData={(
                    study.studyEmojis?.map(item => ({
                      emoji: item.emoji?.symbol || item.symbol || '🔥',
                      count: item.count || 0,
                    })) || []
                  )
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)}
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
