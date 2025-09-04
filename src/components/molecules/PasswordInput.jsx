import React, { useState, useCallback, useId } from "react";
import styles from "../../styles/components/molecules/PasswordInput.module.css";

/**
 * PasswordInput — molecules
 * - 페이지에서 전달한 aria-*가 실제 <input>에 적용되도록 ...rest를 스프레드
 * - 에러 텍스트는 페이지에서 렌더링(이 컴포넌트는 input만 담당)
 */
export default function PasswordInput({
  value,
  onChange,
  onSubmit,
  placeholder = "비밀번호를 입력해 주세요",
  disabled = false,
  label = "비밀번호",
  className = "",     // 필요 시 외부에서 래퍼에 추가 클래스
  ...rest             // aria-invalid, aria-describedby 등
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !disabled) {
        e.preventDefault();
        onSubmit?.(e);
      }
    },
    [disabled, onSubmit]
  );

  const togglePasswordVisibility = useCallback(() => {
    if (!disabled) setShowPassword((v) => !v);
  }, [disabled]);

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="current-password"
          className={styles.input}
          {...rest}  /* ✅ aria-* props가 실제 input에 반영됨 */
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={styles.toggleBtn}
          disabled={disabled}
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          <img
            src={showPassword ? "/assets/icons/pswd-eye-off.svg" : "/assets/icons/pswd-eye.svg"}
            alt=""
            width="20"
            height="20"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
