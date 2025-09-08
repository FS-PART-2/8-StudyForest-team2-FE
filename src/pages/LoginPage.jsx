// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/atoms/Input.jsx';
import Button from '../components/atoms/Button.jsx';
import PasswordInput from '../components/molecules/PasswordInput.jsx';
import { loginSchema } from '../utils/validation/loginSchema.js';
import styles from '../styles/pages/LoginPage.module.css';
import { useAuthStore } from '../store/authStore.js';

/**
 * 로그인 페이지
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // 폼 상태 관리
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 로그인 처리
  const onSubmit = async data => {
    try {
      const response = await login(data);
      console.log('로그인 성공:', response);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  // 회원가입 페이지로 이동
  const handleLinkToRegister = () => {
    navigate('/register');
  };

  return (
    <main className={styles.page}>
      <form
        className={styles.card}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            MindMeld에 다시 오신 것을 환영합니다
          </p>
        </div>

        {/* 이메일 */}
        <section className={styles.section}>
          <label className={styles.label} htmlFor="email">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해 주세요"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <div className={styles.errorSlot}>
            {errors.email && (
              <p id="email-error" className={styles.error}>
                {errors.email.message}
              </p>
            )}
          </div>
        </section>

        {/* 비밀번호 */}
        <section className={styles.section}>
          <PasswordInput
            placeholder="비밀번호를 입력해 주세요"
            label="비밀번호"
            autoComplete="current-password"
            {...register('password')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <div className={styles.errorSlot}>
            {errors.password && (
              <p id="password-error" className={styles.error}>
                {errors.password.message}
              </p>
            )}
          </div>
        </section>

        {/* 로그인 버튼 */}
        <div className={styles.cta}>
          <Button
            variant="action"
            size="xl"
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </div>

        {/* 회원가입 링크 */}
        <div className={styles.registerLink}>
          <p>
            아직 계정이 없으신가요?
            <button
              type="button"
              className={styles.linkButton}
              onClick={handleLinkToRegister}
            >
              회원가입하기
            </button>
          </p>
        </div>
      </form>
    </main>
  );
}
