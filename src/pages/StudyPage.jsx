import { useEffect, useState } from 'react';
import styles from '../styles/pages/StudyPage.module.css';
import { studyApi } from '../utils/api/study/getStudyApi';
import Card from '../components/organisms/Card';
import Dropdown from '../components/atoms/Dropdown';

export function StudyPage() {
  const [studyList, setStudyList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await studyApi.getStudyApi();
        console.log(data);
        setStudyList(data.studies);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className={styles.studyPageContainer}>
      <section className={styles.studyPageWrapper}>
        <h1 className={styles.studyPageTitle}>최근 조회한 스터디</h1>
        <div className={styles.studyList}>
          {studyList.map(study => (
            <Card
              key={study.id}
              preset={'SOLID_BLUE'}
              nick={study.nick}
              title={study.name}
              createdAt={study.createdAt.split('T')[0]}
              description={study.content}
            />
          ))}
        </div>
      </section>
      <section className={styles.studyPageWrapper}>
        <h1 className={styles.studyPageTitle}>스터디 둘러보기</h1>
        <div className={styles.studyListFilter}>
          <input type="text" />
          <Dropdown />
        </div>
        <div className={styles.studyList}>
          {studyList.map(study => (
            <Card
              key={study.id}
              preset={'SOLID_BLUE'}
              nick={study.nick}
              title={study.name}
              createdAt={study.createdAt.split('T')[0]}
              description={study.content}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
