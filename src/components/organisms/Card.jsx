import styles from '../../styles/components/organisms/Card.module.css';
import Tag from '../atoms/Tag';
import Text from '../atoms/Text';
import Emoji from '../atoms/Emoji';
import { CARD_PRESETS } from '../../utils/constants/cardPresets';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Card 컴포넌트
 * @param {Object} props
 * @param {string} props.id - 스터디 ID
 * @param {string} props.preset - 프리셋 ID (CARD_PRESETS의 키)
 * @param {string} props.backgroundImage - 커스텀 배경 이미지 URL
 * @param {string} props.backgroundColor - 커스텀 배경색
 * @param {string} props.textColor - 커스텀 텍스트 색상
 * @param {number} props.overlayOpacity - 오버레이 투명도 (0-1)
 * @param {number} props.points - 획득 포인트 (기본값: 310)
 * @param {string} props.nickname - 유저 닉네임
 * @param {string} props.title - 카드 제목
 * @param {string} props.subtitle - 카드 부제목
 * @param {string} props.description - 카드 설명
 * @param {Array} props.emojiData - 이모지 데이터 배열
 * @param {Function} props.onClick - 클릭 핸들러
 * @param {boolean} props.isSelected - 선택 상태
 * @returns {JSX.Element}
 */
export default function Card({
  preset,
  id,
  backgroundImage,
  backgroundColor,
  overlayOpacity,
  nick,
  points = 0,
  title = '스터디 제목',
  createdAt = '2025-00-00',
  description = '스터디 설명',
  emojiData = [
    { emoji: '👍', count: 1 },
    { emoji: '🔥', count: 3 },
    { emoji: '❤️', count: 5 },
  ],
  onClick,
  isSelected = false,
}) {
  const [daysPassed, setDaysPassed] = useState(createdAt);
  const navigate = useNavigate();
  // 프리셋이 있으면 프리셋 사용, 없으면 직접 전달된 props 사용
  const presetData = preset ? CARD_PRESETS[preset] : null;

  const finalBackgroundImage = backgroundImage || presetData?.backgroundImage;
  const finalBackgroundColor = backgroundColor || presetData?.backgroundColor;

  const finalOverlayOpacity =
    overlayOpacity !== undefined
      ? overlayOpacity
      : presetData?.overlayOpacity || 0.6;

  const cardStyle = {
    backgroundImage: finalBackgroundImage
      ? `url(${finalBackgroundImage})`
      : undefined,
    backgroundColor: finalBackgroundColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const overlayStyle = {
    opacity: finalBackgroundImage ? finalOverlayOpacity : 0,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(
        preset || {
          backgroundImage: finalBackgroundImage,
          backgroundColor: finalBackgroundColor,
        },
      );
    }

    navigate(`/study/${id}`);
  };

  const calculateDaysPassed = createdAt => {
    const today = dayjs();
    const createdDate = dayjs(createdAt);
    setDaysPassed(today.diff(createdDate, 'day'));
  };
  useEffect(() => {
    calculateDaysPassed(createdAt);
  }, [createdAt]);

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      style={cardStyle}
      onClick={handleClick}
    >
      {/* 이미지 배경일 때만 오버레이 표시 */}
      {finalBackgroundImage && (
        <div className={styles.overlay} style={overlayStyle} />
      )}

      <div className={styles.cardContent}>
        <div className={styles.tagSection}>
          <Text
            size="lg"
            weight="bold"
            color={presetData?.titleTextColor}
            tag="h3"
          >
            <b style={{ color: presetData?.nicknameTextColor }}>{nick}</b>의{' '}
            {title}
          </Text>
          <Tag points={points} size="sm" />
        </div>

        <div className={styles.textSection}>
          <Text
            size="sm"
            weight="normal"
            color={presetData?.dayTextColor}
            tag="p"
          >
            {`${daysPassed}일째 진행 중`}
          </Text>
          <Text
            size="md"
            weight="normal"
            color={presetData?.descriptionTextColor}
            tag="p"
          >
            {description}
          </Text>
        </div>

        <div className={styles.emojiSection}>
          {emojiData.map((item, index) => (
            <Emoji
              key={index}
              size="sm"
              emoji={item.emoji}
              count={item.count}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
