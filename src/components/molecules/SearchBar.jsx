import React, { useId } from "react";
import styles from "../../styles/components/molecules/SearchBar.module.css";

/**
 * SearchBar
 * - 인풋 높이/폰트: size="sm|md|lg"
 * - 폭 제어:
 *    * widthMode="fixed" (기본): PC 29.5rem / 모바일 27.2rem
 *    * widthMode="fluid": 가로 100%
 *    * pcWidthRem, mobileWidthRem 로 커스텀 고정폭 가능
 *
 * 예)
 * <SearchBar />                              // 기본: PC 29.5rem / 모바일 27.2rem
 * <SearchBar widthMode="fluid" />            // 가로 100%
 * <SearchBar pcWidthRem={36} mobileWidthRem={30} /> // 커스텀 고정폭
 */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "검색어를 입력하세요",
  leftIcon,
  rightButtons,
  disabled = false,
  name,
  size = "md",                // "sm" | "md" | "lg"
  widthMode = "fixed",        // "fixed" | "fluid"
  pcWidthRem,                 // ex) 29.5
  mobileWidthRem,             // ex) 27.2
  className = "",
  style,
  ...rest
}) {
  const inputId = useId();

  // 기본 좌/우 요소
  const defaultLeft = (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );
  const defaultRight = onClear ? (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label="지우기"
      onClick={() => onClear?.()}
      disabled={disabled || !value}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.7 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29l6.3 6.29 6.29-6.3z"/>
      </svg>
    </button>
  ) : null;

  const hasLeft = leftIcon !== null && (leftIcon !== undefined ? !!leftIcon : true);
  const hasRight = rightButtons !== null && (rightButtons !== undefined ? !!rightButtons : !!defaultRight);

  const left = leftIcon === undefined ? defaultLeft : leftIcon;
  const right = rightButtons === undefined ? defaultRight : rightButtons;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value ?? "");
  };

  // CSS 변수로 폭 제어 (모듈 경계 영향 없이)
  const cssVars = {
    "--sb-width-pc": pcWidthRem ? `${pcWidthRem}rem` : "29.5rem",
    "--sb-width-mobile": mobileWidthRem ? `${mobileWidthRem}rem` : "27.2rem",
  };

  return (
    <form
      className={[styles.form, className].filter(Boolean).join(" ")}
      onSubmit={handleSubmit}
      role="search"
      style={{ ...cssVars, ...style }}
    >
      <div
        className={[
          styles.wrap,
          widthMode === "fluid" ? styles.fluid : styles.fixed,
          hasLeft ? styles.hasLeft : "",
          hasRight ? styles.hasRight : "",
          size && styles[`size-${size}`],
        ].filter(Boolean).join(" ")}
      >
        {hasLeft && <span className={styles.leftSpace} aria-hidden>{left}</span>}

        <input
          id={inputId}
          name={name}
          className={styles.input}
          type="search"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          {...rest}
        />

        {hasRight && (right || defaultRight) ? (
          <div className={styles.rightSlot} aria-hidden>
            {right || defaultRight}
          </div>
        ) : null}
      </div>
    </form>
  );
}
