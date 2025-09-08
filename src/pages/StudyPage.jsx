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

  // API에서 받아오는 배경 경로를 올바른 경로로 매핑
  const mapBackgroundPath = originalPath => {
    if (!originalPath) return null;

    // 기존 잘못된 경로들을 올바른 경로로 매핑
    const pathMapping = {
      '/img/default.png': '/assets/images/card-bg-color-01.svg',
      '/img/img-01.png': '/assets/images/card-bg-color-01.svg',
      '/img/img-02.png': '/assets/images/card-bg-color-02.svg',
      '/img/img-03.png': '/assets/images/card-bg-color-03.svg',
      '/img/img-04.png': '/assets/images/card-bg-color-04.svg',
      '/img/img-05.png': '/assets/images/card-bg-01.svg',
      '/img/img-06.png': '/assets/images/card-bg-02.svg',
      '/img/img-07.png': '/assets/images/card-bg-03.svg',
      '/img/img-08.png': '/assets/images/card-bg-04.svg',
      '/assets/images/bg-desk-1.svg': '/assets/images/card-bg-01.svg',
      '/assets/images/bg-laptop-1.svg': '/assets/images/card-bg-02.svg',
      '/assets/images/bg-tiles-1.svg': '/assets/images/card-bg-03.svg',
      '/assets/images/bg-plant-1.svg': '/assets/images/card-bg-04.svg',
    };

    return pathMapping[originalPath] || originalPath;
  };

  // 최근 조회한 스터디 목록
  const recentStudies = useRecentStudyStore(state => state.recentStudies);
  const clearRecentStudies = useRecentStudyStore(
    state => state.clearRecentStudies,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await studyApi.getStudyApi(studyParams);
        setStudyList(data.studies);
        console.log('API 응답 데이터:', data.studies);
        console.log('총 스터디 개수:', data.totalCount);
        // 각 스터디의 배경 정보 확인
        data.studies.forEach((study, index) => {
          console.log(`스터디 ${index + 1} 배경 정보:`, {
            id: study.id,
            background: study.background,
            img: study.img,
            name: study.name,
            allFields: Object.keys(study), // 모든 필드 확인
          });

          // 배경 이미지 접근 테스트
          if (study.img) {
            const mappedPath = mapBackgroundPath(study.img);
            console.log(`🔄 스터디 ${index + 1} 경로 매핑:`, {
              original: study.img,
              mapped: mappedPath,
            });

            const testImg = new Image();
            testImg.onload = () =>
              console.log(
                `✅ 스터디 ${index + 1} 배경 이미지 로딩 성공:`,
                mappedPath,
              );
            testImg.onerror = () =>
              console.error(
                `❌ 스터디 ${index + 1} 배경 이미지 로딩 실패:`,
                mappedPath,
              );
            testImg.src = mappedPath;
          }
        });
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
              const originalBackground = study.img || study.background;
              const mappedBackground = mapBackgroundPath(originalBackground);

              return (
                <Card
                  key={study.id}
                  backgroundImage={mappedBackground}
                  backgroundColor={mappedBackground}
                  nick={study.nick}
                  title={study.name}
                  createdAt={study?.createdAt?.split('T')[0]}
                  description={study.content}
                  id={study.id}
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
              // API에서 img 필드에 배경 정보가 저장됨
              const originalBackground = study.img || study.background;
              const mappedBackground = mapBackgroundPath(originalBackground);

              return (
                <Card
                  key={study.id}
                  id={study.id}
                  nick={study.nick}
                  title={study.name}
                  points={study?.points[0]?.value || 0}
                  createdAt={study?.createdAt?.split('T')[0]}
                  description={study.content}
                  backgroundColor={mappedBackground}
                  backgroundImage={mappedBackground}
                  preset={mappedBackground}
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
        <Button onClick={handleStudyMore} variant="action" size="lg">
          더보기
        </Button>
      </div>
    </main>
  );
}
