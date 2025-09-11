/**
 * 배경 이미지에 따라 닉네임 색상을 반환하는 유틸리티 함수
 * 백엔드 실제 저장 형식에 맞게 매핑
 * @param {string} backgroundImage - 배경 이미지 경로
 * @returns {string} CSS 변수명
 */
export function getNicknameColor(backgroundImage) {
  if (!backgroundImage) {
    return 'var(--brand-blue, #0013A7)';
  }

  // CSS 변수 형태 처리 (우선순위 높음)
  if (backgroundImage.includes('--card-mintblue')) {
    return 'var(--text-mint, #418099)'; // Mint Blue
  }
  if (backgroundImage.includes('--card-green')) {
    return 'var(--text-forest, #2F5233)'; // Green
  }
  if (backgroundImage.includes('--card-forest')) {
    return 'var(--text-forest, #2F5233)'; // Forest
  }
  if (backgroundImage.includes('--card-ocean')) {
    return 'var(--text-ocean, #1A365D)'; // Ocean
  }
  if (backgroundImage.includes('--card-blue')) {
    return 'var(--brand-blue, #0013A7)'; // Blue
  }

  // 백엔드 실제 저장 형식에 맞게 매핑
  if (
    backgroundImage.includes('/img/img-01') ||
    backgroundImage.includes('card-bg-color-01')
  ) {
    return 'var(--brand-blue, #0013A7)'; // Blue
  }
  if (
    backgroundImage.includes('/img/img-02') ||
    backgroundImage.includes('card-bg-color-02')
  ) {
    return 'var(--text-forest, #2F5233)'; // Forest
  }
  if (
    backgroundImage.includes('/img/img-03') ||
    backgroundImage.includes('card-bg-color-03')
  ) {
    return 'var(--text-mint, #418099)'; // Mint
  }
  if (
    backgroundImage.includes('/img/img-04') ||
    backgroundImage.includes('card-bg-color-04')
  ) {
    return 'var(--text-ocean, #1A365D)'; // Ocean
  }
  if (
    backgroundImage.includes('/img/img-05') ||
    backgroundImage.includes('card-bg-01')
  ) {
    return 'var(--brand-blue, #0013A7)'; // Card Background 01
  }
  if (
    backgroundImage.includes('/img/img-06') ||
    backgroundImage.includes('card-bg-02')
  ) {
    return 'var(--brand-blue, #0013A7)'; // Card Background 02
  }
  if (
    backgroundImage.includes('/img/img-07') ||
    backgroundImage.includes('card-bg-03')
  ) {
    return 'var(--brand-blue, #0013A7)'; // Card Background 03
  }
  if (
    backgroundImage.includes('/img/img-08') ||
    backgroundImage.includes('card-bg-04')
  ) {
    return 'var(--brand-blue, #0013A7)'; // Card Background 04
  }
  if (backgroundImage.includes('/img/default')) {
    return 'var(--brand-blue, #0013A7)'; // Default
  }

  // 기본값
  return 'var(--brand-blue, #0013A7)';
}

/**
 * 배경 이미지에 따라 닉네임 색상 클래스를 반환하는 함수
 * @param {string} backgroundImage - 배경 이미지 경로
 * @returns {string} CSS 클래스명
 */
export function getNicknameColorClass(backgroundImage) {
  if (!backgroundImage) {
    return 'nickname-blue';
  }

  // CSS 변수 형태 처리 (우선순위 높음)
  if (backgroundImage.includes('--card-mintblue')) {
    return 'nickname-mint'; // Mint Blue
  }
  if (backgroundImage.includes('--card-green')) {
    return 'nickname-forest'; // Green
  }
  if (backgroundImage.includes('--card-forest')) {
    return 'nickname-forest'; // Forest
  }
  if (backgroundImage.includes('--card-ocean')) {
    return 'nickname-ocean'; // Ocean
  }
  if (backgroundImage.includes('--card-blue')) {
    return 'nickname-blue'; // Blue
  }

  // 백엔드 실제 저장 형식에 맞게 매핑
  if (
    backgroundImage.includes('/img/img-01') ||
    backgroundImage.includes('card-bg-color-01')
  ) {
    return 'nickname-blue'; // Blue
  }
  if (
    backgroundImage.includes('/img/img-02') ||
    backgroundImage.includes('card-bg-color-02')
  ) {
    return 'nickname-forest'; // Forest
  }
  if (
    backgroundImage.includes('/img/img-03') ||
    backgroundImage.includes('card-bg-color-03')
  ) {
    return 'nickname-mint'; // Mint
  }
  if (
    backgroundImage.includes('/img/img-04') ||
    backgroundImage.includes('card-bg-color-04')
  ) {
    return 'nickname-ocean'; // Ocean
  }
  if (
    backgroundImage.includes('/img/img-05') ||
    backgroundImage.includes('card-bg-01')
  ) {
    return 'nickname-blue'; // Card Background 01
  }
  if (
    backgroundImage.includes('/img/img-06') ||
    backgroundImage.includes('card-bg-02')
  ) {
    return 'nickname-blue'; // Card Background 02
  }
  if (
    backgroundImage.includes('/img/img-07') ||
    backgroundImage.includes('card-bg-03')
  ) {
    return 'nickname-blue'; // Card Background 03
  }
  if (
    backgroundImage.includes('/img/img-08') ||
    backgroundImage.includes('card-bg-04')
  ) {
    return 'nickname-blue'; // Card Background 04
  }
  if (backgroundImage.includes('/img/default')) {
    return 'nickname-blue'; // Default
  }

  // 기본값
  return 'nickname-blue';
}
