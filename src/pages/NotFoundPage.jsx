import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import styles from '../styles/pages/NotFoundPage.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>페이지를 찾을 수 없습니다</p>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Button
          variant="action"
          size="lg"
          onClick={handleGoHome}
          className={styles.button}
        >
          메인으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
