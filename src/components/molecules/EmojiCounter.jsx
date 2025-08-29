import EmojiPicker from 'emoji-picker-react';
import { useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import styles from '../../styles/components/molecules/EmojiCounter.module.css';
import Emoji from '../atoms/Emoji';

/**
 * 이모지를 추가 및 카운트를 증가시키는 컴포넌트
 * @param {Object[]} props.emojiData
 * @param {string} props.emojiData[].emoji
 * @param {number} props.emojiData[].count
 * @param {number} props.emojiData[].id
 * @returns {JSX.Element}
 */
export default function EmojiCounter({ emojiData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRestOpen, setIsRestOpen] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState(emojiData);
  const pickerRef = useRef(null); // 이모지 피커 참조
  const restPopupRef = useRef(null); // 나머지 이모지 팝업 참조

  // 이모지를 count 기준으로 정렬하고 상위 3개와 나머지로 분리
  const sortedEmojis = [...selectedEmojis].sort((a, b) => b.count - a.count);
  const topEmojis = sortedEmojis.slice(0, 3);
  const restEmojis = sortedEmojis.slice(3);
  const restCount = restEmojis.reduce((sum, emoji) => sum + emoji.count, 0);

  // 이모지 피커는 외부 클릭시 항상 닫기
  useOutsideClick(pickerRef, () => setIsOpen(() => false));
  useOutsideClick(restPopupRef, () => setIsRestOpen(() => false));

  // 이모지 선택 시 이모지 추가 및 카운트 증가
  const handleEmojiClick = event => {
    setSelectedEmojis(prev => {
      const existingEmojiIndex = prev.findIndex(
        item => item.emoji === event.emoji,
      );

      if (existingEmojiIndex > -1) {
        // 이미 존재하는 이모지인 경우 카운트만 증가
        return prev.map((item, index) =>
          index === existingEmojiIndex
            ? { ...item, count: item.count + 1 }
            : item,
        );
      } else {
        // 새로운 이모지인 경우 배열에 추가 (새 ID 생성)
        const newId = Math.max(...prev.map(item => item.id || 0)) + 1;
        return [...prev, { id: newId, emoji: event.emoji, count: 1 }];
      }
    });
    setIsOpen(false);
  };

  // 이모지 클릭 시 카운트 감소
  const handleEmojiDecrease = clickedEmoji => {
    setSelectedEmojis(prev => {
      return prev
        .map(item => {
          if (item.emoji === clickedEmoji && item.count > 0) {
            return { ...item, count: item.count - 1 };
          }
          return item;
        })
        .filter(item => item.count > 0); // 카운트가 0이 된 이모지는 제거
    });
  };

  // 이모지 추가 버튼 클릭 시 이모지 팝업 토글
  const handlePickerButtonClick = () => {
    setIsOpen(prev => !prev);
  };

  // 나머지 이모지 팝업 토글
  const handleRestEmojiClick = () => {
    setIsRestOpen(prev => !prev);
  };

  return (
    <div className={styles.emojiWrapper}>
      <div className={styles.emojiContainer}>
        {topEmojis.map(({ id, emoji, count }) => (
          <Emoji
            key={id}
            size="lg"
            emoji={emoji}
            count={count}
            onClick={handleEmojiDecrease}
          />
        ))}

        {/* 나머지 이모지 추가 */}
        {restCount > 0 && (
          <div className={styles.restEmojiWrapper} ref={restPopupRef}>
            <button
              className={styles.restCountButton}
              onClick={handleRestEmojiClick}
              aria-label="나머지 이모지 보기"
            >
              +{restCount} ..
            </button>
            {restEmojis.length > 0 && isRestOpen && (
              <div className={styles.restEmojiContainer}>
                <div className={styles.restPopup}>
                  {restEmojis.map(({ id, emoji, count }) => (
                    <Emoji
                      key={id}
                      size="sm"
                      emoji={emoji}
                      count={count}
                      onClick={handleEmojiDecrease}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.pickerContainer} ref={pickerRef}>
        <button
          className={styles.pickerButton}
          onClick={handlePickerButtonClick}
          aria-label="이모지 추가"
        >
          <img src={'/assets/icons/emoji-icon.svg'} alt="emoji-icon" />
          <span>추가</span>
        </button>
        <div className={styles.pickerWrapper}>
          {isOpen && (
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              style={{
                position: 'absolute',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
