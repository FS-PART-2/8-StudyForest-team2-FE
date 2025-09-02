import React, { useState, useCallback } from "react";
import styles from "../../styles/components/molecules/PasswordInput.module.css";
// 아이콘이 public/assets/icons 안에 있다면 ↓ 이렇게 변경
// import eye from "../../assets/icons/pswd-eye.svg";
// import eyeOff from "../../assets/icons/pswd-eye-off.svg";

const PasswordInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "비밀번호를 입력하세요",
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !disabled) {
        onSubmit?.();
      }
    },
    [disabled, onSubmit]
  );

  const togglePasswordVisibility = useCallback(() => {
    if (!disabled) setShowPassword((v) => !v);
  }, [disabled]);

  return (
    <div className={styles.container}>
      {/* 라벨 추가 */}
      <label className={styles.label}>비밀번호</label>
      <div className={styles.wrapper}>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
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
};

export default PasswordInput;
