// src/components/molecules/SearchBar.jsx
import React from 'react';
import Input from '../atoms/Input.jsx';
import styles from '../../styles/components/molecules/SearchBar.module.css';

export default function SearchBar({
  value,
  onChange = () => {},
  onSubmit,
  placeholder = '검색어를 입력하세요',
  size = 'lg', // "lg" | "mobile"
  autoFocus = false,
  leftIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}) {
  const handleChange = e => {
    onChange?.(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      // IME(한/중/일) 조합 중 Enter 방지
      if (e.isComposing || e.nativeEvent?.isComposing) return;
      e.preventDefault();
      onSubmit?.(e.target.value);
    }
  };

  return (
    <div className={styles.form}>
      {/* 시각적 라벨이 없으므로 aria-label 부여 */}
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        type="search"
        role="searchbox"
        aria-label={placeholder}
        // 사이즈 토큰 그대로 전달 → Input에서 size-${size}로 변환
        size={size}
        leftSlot={<span className={styles.leftSpace}>{leftIcon}</span>}
        // 검색 아이콘은 클릭 불필요 → leftInteractive 기본 false
      />
    </div>
  );
}
