import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/components/organisms/Header.module.css';
import Button from '../atoms/Button';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // 스터디 만들기 버튼 클릭 시 스터디 생성 페이지로 이동
  const handleLinkToCreateStudy = () => {
    navigate('/study/new');
  };

  // 현재 페이지가 스터디 메인페이지 인지 확인
  const isMainPage = location.pathname === '/';

  return (
    <header className={styles.header}>
      <div>
        <Link to="/">
          <picture>
            <source
              srcSet="/assets/images/logo-lg.svg"
              media="(min-width: 1024px)"
            />
            <source
              srcSet="/assets/images/logo-md.svg"
              media="(min-width: 743px)"
            />
            <source
              srcSet="/assets/images/logo-sm.svg"
              media="(min-width: 375px)"
            />
            <img
              src="/assets/images/logo-sm.svg"
              alt="mindmeld 로고"
              className={styles.logo}
            />
          </picture>
        </Link>
      </div>

      {/* 스터디 만들기 버튼 */}
      <div className={styles.headerButtons}>
        <Link className={styles.headerButton} to="/register">
          회원가입
        </Link>
        <Link className={styles.headerButton} to="/login">
          로그인
        </Link>
        {isMainPage && (
          <div>
            <Button
              onClick={handleLinkToCreateStudy}
              variant="action"
              size="ctrl-sm"
            >
              스터디 만들기
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
