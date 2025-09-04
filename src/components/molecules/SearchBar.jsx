import React from 'react';
import Input from '../atoms/Input.jsx';
import styles from '../../styles/components/molecules/SearchBar.module.css';

export default function SearchBar({
  value,
  onChange = () => {},
  onSubmit,
  placeholder = "검색어를 입력하세요",
  ariaLabel = "검색어", // 접근성을 위한 별도 라벨
  size = "lg",            // "lg" | "mobile"
  autoFocus = false,
  leftIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}) {


  const handleChange = (e) => {
    onChange?.(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent?.isComposing) {
      e.preventDefault();
      // 제출 시 공백 제거
      onSubmit?.(e.target.value.trim());
    }
  };

  return (
    <div className={styles.searchContainer}>
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        type="search"
        role="searchbox"
        aria-label={ariaLabel}
        enterKeyHint="search"
        // 사이즈 토큰 그대로 전달 → Input에서 size-${size}로 변환
        size={size}
        leftSlot={<span className={styles.leftSpace}>{leftIcon}</span>}
        // 검색 아이콘은 클릭 불필요 → leftInteractive 기본 false
      />
    </div>
  );
}