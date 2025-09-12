import styles from '../../styles/components/atoms/Emoji.module.css';

/**
 * 이모지 컴포넌트
 * @param {'lg' | 'sm'} size
 * @param {string} emoji
 * @param {number} count
 * @param {Function} onClick
 * @returns {JSX.Element}
 */
export default function Emoji({
  id,
  size = 'lg',
  emoji,
  count,
  onClick = () => {},
}) {
  const handleClick = () => {
    onClick({ id, emoji, count });
  };
  // 16진수를 10진수로 변환
  let emojiChar = ''; // 기본값으로 빈 문자열 설정

  // emoji 값이 유효한 문자열인지, 그리고 숫자로 변환 가능한지 확인
  if (emoji && typeof emoji === 'string') {
    const emojiDecimal = parseInt(emoji, 16);

    // parseInt 결과가 유효한 숫자인지 확인
    if (!isNaN(emojiDecimal)) {
      emojiChar = String.fromCodePoint(emojiDecimal);
    }
  }

  return (
    <button
      className={`${styles.emojiContainer} ${styles[size]}`}
      onClick={handleClick}
    >
      <span>{emojiChar}</span>
      <span>{count}</span>
    </button>
  );
}
