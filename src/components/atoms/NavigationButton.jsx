import { Link } from 'react-router-dom';
import styles from '../../styles/components/atoms/NavigationButton.module.css';

/**
 * 네비게이션 버튼 컴포넌트
 * @param {string} to 이동할 경로
 * @param {React.ReactNode} children 내부 텍스트
 * @returns
 */
export default function NavigationButton({ to, children }) {
  return (
    <Link to={to} className={styles.navigationButton}>
      <span>{children}</span>
      <img src="/assets/icons/next.svg" alt="next" aria-hidden="true" />
    </Link>
  );
}
