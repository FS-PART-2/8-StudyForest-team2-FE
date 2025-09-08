import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/components/organisms/Header.module.css';
import Button from '../atoms/Button';
import { useAuthStore } from '../../store/authStore';
import { postLogoutApi } from '../../utils/api/user/postLogoutApi';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // 스터디 만들기 버튼 클릭 시 스터디 생성 페이지로 이동
  const handleLinkToCreateStudy = () => {
    navigate('/study/new');
  };

  // 현재 페이지가 스터디 메인페이지 인지 확인
  const isMainPage = location.pathname === '/';

  const { isLoggedIn, user, logout } = useAuthStore();
  console.log(isLoggedIn, user);

  const handleLogout = async () => {
    try {
      const response = await postLogoutApi();
      console.log(response);
      if (response.success) {
        logout();
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            <img src="/assets/images/logo-sm.svg" alt="mindmeld 로고" />
          </picture>
        </Link>
      </div>

      {/* 스터디 만들기 버튼 */}
      <div className={styles.headerButtons}>
        {isLoggedIn ? (
          <div>
            <span className={styles.userName}>{user.username + '님 환영'}</span>
            <Button
              variant="secondary"
              size="ctrl-sm"
              className={styles.headerButton}
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <>
            <Link className={styles.headerButton} to="/register">
              회원가입
            </Link>
            <Link className={styles.headerButton} to="/login">
              로그인
            </Link>
          </>
        )}

        {isMainPage && isLoggedIn && (
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
