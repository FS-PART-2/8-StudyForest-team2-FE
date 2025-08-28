import styles from '../../styles/components/atoms/Emoji.module.css';

export default function Emoji({ size = 'lg', emoji, count }) {
  return (
    <div className={`${styles.emojiContainer} ${styles[size]}`}>
      <span>{emoji}</span>
      <span>{count}</span>
    </div>
  );
}
