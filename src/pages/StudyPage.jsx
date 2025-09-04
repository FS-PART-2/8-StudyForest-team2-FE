import { useEffect, useState } from 'react';
import styles from '../styles/pages/StudyPage.module.css';
import { studyApi } from '../utils/api/study/getStudyApi';
import Card from '../components/organisms/Card';
import Dropdown from '../components/atoms/Dropdown';
import SearchBar from '../components/molecules/SearchBar';
import Button from '../components/atoms/Button';

export function StudyPage() {
  const [studyList, setStudyList] = useState([]);
  const [studyParams, setStudyParams] = useState({
    recentOrder: true,
    offset: 0,
    limit: 6,
    keyword: '',
    pointOrder: '',
    isActive: true,
  });
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
    console.log(value);
    setStudyParams({ ...studyParams, keyword: value });
  };

  const handleDropdownChange = value => {
    console.log(value);
    if (value === 'recent' || value === 'old') {
      setStudyParams({
        ...studyParams,
        recentOrder: value,
        pointOrder: null,
      });
    }
    if (value === 'desc' || value === 'asc') {
      setStudyParams({
        ...studyParams,
        recentOrder: null,
        pointOrder: value,
      });
    }
  };

  const handleStudyMore = () => {
    console.log('스터디 추가');
    setStudyParams({ ...studyParams, limit: studyParams.limit + 6 });
    console.log(studyParams.limit);
  };

  return (
    <main className={styles.studyPageContainer}>
      <section className={styles.studyPageWrapper}>
        <h1 className={styles.studyPageTitle}>최근 조회한 스터디</h1>
        {/* 스터디 리스트 */}
        <div className={styles.studyList}>
          {studyList.map(study => (
            <Card
              key={study.id}
              preset={'img-08'}
              nick={study.nick}
              title={study.name}
              createdAt={study.createdAt.split('T')[0]}
              description={study.content}
            />
          ))}
        </div>
      </section>

      {/* 스터디 둘러보기 */}
      <section className={styles.studyPageWrapper}>
        <h1 className={styles.studyPageTitle}>스터디 둘러보기</h1>
        <div className={styles.studyListFilter}>
          <SearchBar onSubmit={handleSubmit} />
          <Dropdown onChange={handleDropdownChange} />
        </div>
        {studyList.length > 0 ? (
          <div className={styles.studyList}>
            {studyList.map(study => (
              <Card
                key={study.id}
                preset={'img-04'}
                nick={study.nick}
                title={study.name}
                points={study.points[0].value}
                createdAt={study.createdAt.split('T')[0]}
                description={study.content}
              />
            ))}
          </div>
        ) : (
          <div className={styles.studyListEmpty}>
            <p>스터디가 없습니다.</p>
          </div>
        )}
      </section>

      <div className={styles.studyListMore}>
        <Button onClick={handleStudyMore} variant="action" size="lg">
          더보기
        </Button>
      </div>
    </main>
  );
}
