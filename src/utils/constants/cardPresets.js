// 카드 프리셋 정의
export const CARD_PRESETS = {
  // 단색 배경 프리셋
  SOLID_BLUE: {
    id: 'solid-gray',
    name: '파란색',
    type: 'solid',
    backgroundColor: 'var(--card-blue)',
    titleTextColor: 'var(--text-primary)',
    dayTextColor: 'var(--text-gray)',
    descriptionTextColor: 'var(--text-primary)',
    overlayOpacity: 0,
  },
  SOLID_GREEN: {
    id: 'solid-green',
    name: '연두색',
    type: 'solid',
    backgroundColor: '#84CC16',

    overlayOpacity: 0,
  },
  SOLID_MINT: {
    id: 'solid-mint',
    name: '민트색',
    type: 'solid',
    backgroundColor: '#06B6D4',
    textColor: '#FFFFFF',
    overlayOpacity: 0,
  },
  SOLID_PURPLE: {
    id: 'solid-purple',
    name: '보라색',
    type: 'solid',
    backgroundColor: '#8B5CF6',
    textColor: '#FFFFFF',
    overlayOpacity: 0,
  },

  // 이미지 배경 프리셋
  IMAGE_WORKSPACE: {
    id: 'image-workspace',
    name: '작업공간',
    type: 'image',
    backgroundImage: '/assets/images/workspace.jpg',
    textColor: '#FFFFFF',
    overlayOpacity: 0.6,
  },
  IMAGE_LAPTOP: {
    id: 'image-laptop',
    name: '노트북',
    type: 'image',
    backgroundImage: '/assets/images/laptop.jpg',
    textColor: '#FFFFFF',
    overlayOpacity: 0.6,
  },
  IMAGE_PATTERN: {
    id: 'image-pattern',
    name: '패턴',
    type: 'image',
    backgroundImage: '/assets/images/pattern.jpg',
    textColor: '#FFFFFF',
    overlayOpacity: 0.4,
  },
  IMAGE_PLANT: {
    id: 'image-plant',
    name: '식물',
    type: 'image',
    backgroundImage: '/assets/images/plant.jpg',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
  },
};

// 프리셋 배열로 변환 (선택 UI용)
export const CARD_PRESET_LIST = Object.values(CARD_PRESETS);

// 타입별 필터링
export const getSolidPresets = () =>
  CARD_PRESET_LIST.filter(preset => preset.type === 'solid');

export const getImagePresets = () =>
  CARD_PRESET_LIST.filter(preset => preset.type === 'image');
