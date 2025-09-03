import React, { useRef } from "react";
import Input from "../atoms/Input.jsx";

function MagnifierIcon(props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M21 21l-4.2-4.2m1.2-5.3a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
        stroke="#8A8A8A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "검색어를 입력하세요",
  size = "lg",
  debounceMs = 0,
  autoFocus = false,
}) {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit?.(e.target.value);
    }
  };

  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      size={`size-${size}`}   /* "size-lg" / "size-mobile" */
      leftSlot={<MagnifierIcon />}  /* ← 왼쪽으로 이동 */
      autoFocus={autoFocus}
      type="text"
    />
  );
}
