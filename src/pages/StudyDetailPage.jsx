import { useParams } from 'react-router-dom';
import styles from '../styles/pages/StudyDetailPage.module.css';
import { useRecentStudyStore } from '../store/recentStudyStore';
import { useEffect } from 'react';
import { studyApi } from '../utils/api/study/getStudyApi';

export default function StudyDetailPage() {
  const { id } = useParams();
  const addRecentStudy = useRecentStudyStore(state => state.addRecentStudy);

  useEffect(() => {
    const fetchStudyAndAddToRecent = async () => {
      try {
        const data = await studyApi.getStudyDetailApi(id);
        addRecentStudy(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudyAndAddToRecent();
  }, [id, addRecentStudy]);

  return (
    <div className={styles.studyDetailPage}>
      <h1 className={styles.studyDetailPageTitle}>StudyDetailPage</h1>
      <span className={styles.studyDetailPageDescription}>
        스터디 상세페이지 입니다. id : <strong>{id}</strong>
      </span>
    </div>
  );
}
