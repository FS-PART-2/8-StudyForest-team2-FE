// 카드 프리셋 정의
export const CARD_PRESETS = {
  // 색상 배경 프리셋 (이제 이미지로 처리)
  'img-01': {
    id: 'img-01',
    name: '연한 파란색',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-color-01.svg',
    titleTextColor: 'var(--text-primary)',
    nicknameTextColor: 'var(--brand-blue)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
    overlayOpacity: 0.8,
  },
  'img-02': {
    id: 'img-02',
    name: '연한 초록색',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-color-02.svg',
    titleTextColor: 'var(--text-primary)',
    nicknameTextColor: 'var(--text-forest)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
    overlayOpacity: 0.8,
  },
  'img-03': {
    id: 'img-03',
    name: '어두운 회색',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-color-03.svg',
    titleTextColor: 'var(--background-secondary)',
    nicknameTextColor: 'var(--background-secondary)',
    dayTextColor: 'var(--background-secondary)',
    descriptionTextColor: 'var(--background-secondary)',
    overlayOpacity: 0.8,
  },
  'img-04': {
    id: 'img-04',
    name: '연한 보라색',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-color-04.svg',
    titleTextColor: 'var(--text-primary)',
    nicknameTextColor: 'var(--text-ocean)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
    overlayOpacity: 0.8,
  },

  // 이미지 배경 프리셋
  'img-05': {
    id: 'img-05',
    name: '작업공간',
    type: 'image',
    backgroundImage: '/assets/images/card-bg-01.svg',
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
    backgroundImage: '/assets/images/card-bg-02.svg',
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
    backgroundImage: '/assets/images/card-bg-03.svg',
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
    backgroundImage: '/assets/images/card-bg-04.svg',
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
