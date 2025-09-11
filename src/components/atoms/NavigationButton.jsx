import { Link } from 'react-router-dom';
import styles from '../../styles/components/atoms/NavigationButton.module.css';

/**
 * 네비게이션 링크 형태의 버튼을 렌더링한다.
 *
 * 지정된 경로로 이동하는 Link 요소를 반환하며, 내부에 텍스트(children)와 다음 화살표 아이콘을 데코레이션으로 표시한다.
 *
 * @param {string} to - 이동할 경로.
 * @param {React.ReactNode} children - 버튼에 표시할 콘텐츠(주로 텍스트).
 * @param {'default'|'home'} [variant='default'] - 'home'일 때 추가 홈 전용 스타일을 적용.
 * @param {string} [className=''] - 추가로 병합할 사용자 정의 CSS 클래스 문자열.
 * @param {...Object} props - Link 컴포넌트에 전달할 추가 속성(예: aria-*, target 등).
 * @returns {JSX.Element} 렌더링된 네비게이션 버튼(Link) 요소.
 */
export default function NavigationButton({
  to,
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const buttonClass = [
    styles.navigationButton,
    variant === 'home' ? styles.homeButton : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Link to={to} className={buttonClass} {...props}>
      <span>{children}</span>
      <img src="/assets/icons/next.svg" alt="" aria-hidden="true" />
    </Link>
  );
}
