// 카드 프리셋 정의
export const CARD_PRESETS = {
  // 단색 배경 프리셋
  'img-01': {
    id: 'img-01',
    name: '블루색',
    type: 'solid',
    backgroundColor: 'var(--card-blue)',
    titleTextColor: 'var(--text-primary)',
    nicknameTextColor: 'var(--brand-blue)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
  },
  'img-02': {
    id: 'img-02',
    name: '초록색',
    type: 'solid',
    backgroundColor: 'var(--card-green)',
    titleTextColor: 'var(--text-primary)',
    nicknameTextColor: 'var(--text-forest)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
  },
  'img-03': {
    id: 'img-03',
    name: '민트색',
    type: 'solid',
    backgroundColor: 'var(--card-mintblue)',
    titleTextColor: 'var(--text-primary)',
    nicknameTextColor: 'var(--text-mint)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
  },
  'img-04': {
    id: 'img-04',
    name: '오션색',
    type: 'solid',
    backgroundColor: 'var(--card-ocean)',
    titleTextColor: 'var(--text-primary)',
    nicknameTextColor: 'var(--text-ocean)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
  },

  // 이미지 배경 프리셋
  'img-05': {
    id: 'img-05',
    name: '작업공간',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-01.png',
    titleTextColor: 'var(--background-secondary)',
    nicknameTextColor: 'var(--background-secondary)',
    dayTextColor: 'var(--background-secondary)',
    descriptionTextColor: 'var(--background-secondary)',
    overlayOpacity: 0.8,
  },
  'img-06': {
    id: 'img-06',
    name: '노트북',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-02.png',
    titleTextColor: 'var(--background-secondary)',
    nicknameTextColor: 'var(--background-secondary)',
    dayTextColor: 'var(--background-secondary)',
    descriptionTextColor: 'var(--background-secondary)',
    overlayOpacity: 0.8,
  },
  'img-07': {
    id: 'img-07',
    name: '패턴',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-03.png',
    titleTextColor: 'var(--background-secondary)',
    nicknameTextColor: 'var(--background-secondary)',
    dayTextColor: 'var(--background-secondary)',
    descriptionTextColor: 'var(--background-secondary)',
    overlayOpacity: 0.8,
  },
  'img-08': {
    id: 'img-08',
    name: '식물',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-04.png',
    titleTextColor: 'var(--background-secondary)',
    nicknameTextColor: 'var(--background-secondary)',
    dayTextColor: 'var(--background-secondary)',
    descriptionTextColor: 'var(--background-secondary)',
    overlayOpacity: 0.8,
  },
};

// 프리셋 배열로 변환 (선택 UI용)
export const CARD_PRESET_LIST = Object.values(CARD_PRESETS);

// 타입별 필터링
export const getSolidPresets = () =>
  CARD_PRESET_LIST.filter(preset => preset.type === 'solid');

export const getImagePresets = () =>
  CARD_PRESET_LIST.filter(preset => preset.type === 'image');
