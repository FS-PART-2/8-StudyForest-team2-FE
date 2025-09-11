import { Link } from 'react-router-dom';
import styles from '../../styles/components/atoms/NavigationButton.module.css';

/**
 * 네비게이션 버튼 컴포넌트
 * @param {string} to 이동할 경로
 * @param {React.ReactNode} children 내부 텍스트
 * @param {string} variant 버튼 스타일 ('default' | 'home')
 * @returns
 */
export default function NavigationButton({
  to,
  children,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) {
  const buttonClass = [
    styles.navigationButton,
    variant === 'home' ? styles.homeButton : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // onClick이 있으면 button으로, 없으면 Link로 렌더링
  if (onClick) {
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={onClick}
        {...props}
      >
        <span>{children}</span>
        <img src="/assets/icons/next.svg" alt="" aria-hidden="true" />
      </button>
    );
  }

  return (
    <Link to={to} className={buttonClass} {...props}>
      <span>{children}</span>
      <img src="/assets/icons/next.svg" alt="" aria-hidden="true" />
    </Link>
  );
}
