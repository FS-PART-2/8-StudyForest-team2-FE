import { useEffect, useState } from 'react';
import styles from '../styles/pages/StudyPage.module.css';
import { studyApi } from '../utils/api/study/getStudyApi';
import Card from '../components/organisms/Card';
import { CARD_PRESETS } from '../utils/constants/cardPresets';

export function StudyPage() {
  const [studyList, setStudyList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await studyApi.getStudyApi();
      console.log(data);
      setStudyList(data.studies);
    };
    fetchData();
  }, []);

  return (
    <main className={styles.studyPage}>
      <h1 className={styles.studyPageTitle}>스터디 둘러보기</h1>
      <div className={styles.studyList}>
        {studyList.map(study => (
          <Card
            key={study.id}
            preset={'SOLID_GREEN'}
            title={study.name}
            subtitle={study.createdAt.split('T')[0]}
            description={study.content}
          />
        ))}
      </div>
    </main>
  );
}
