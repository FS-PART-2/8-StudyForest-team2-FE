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

  return (
    <button
      className={`${styles.emojiContainer} ${styles[size]}`}
      onClick={handleClick}
    >
      <span>{emoji}</span>
      <span>{count}</span>
    </button>
  );
}
