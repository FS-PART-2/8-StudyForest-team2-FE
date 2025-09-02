import React, { useState, useCallback, useId } from "react";
import styles from "../../styles/components/molecules/PasswordInput.module.css";

const PasswordInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "비밀번호를 입력하세요",
  disabled = false,
  label = "비밀번호",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId(); // 라벨-입력 연계 (접근성)

  // Enter: 이벤트 전달 + 기본동작 방지(중복 submit 방지)
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
    <div className={styles.container}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>

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
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={styles.toggleBtn}
          disabled={disabled}
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          <img
            src={
              showPassword
                ? "/assets/icons/pswd-eye-off.svg"
                : "/assets/icons/pswd-eye.svg"
            }
            alt=""
            width="20"
            height="20"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
