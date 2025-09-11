// src/pages/RegisterPage.jsx
import { useNavigate } from 'react-router-dom';
import Input from '../components/atoms/Input.jsx';
import Button from '../components/atoms/Button.jsx';
import PasswordInput from '../components/molecules/PasswordInput.jsx';
import styles from '../styles/pages/RegisterPage.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../utils/validation/registerSchema.js';
import { postRegisterApi } from '../utils/api/user/postRegisterApi';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';

/**
 * 회원가입 페이지
 */
export default function RegisterPage() {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // 폼 상태
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      nick: '',
    },
  });

  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');
  const mismatchNow = passwordConfirm && password !== passwordConfirm;

  const onSubmit = async data => {
    try {
      const response = await postRegisterApi(data);
      console.log(response);
      navigate('/login');
    } catch (error) {
      console.error(error);
      return; // 에러 발생 시 navigate 실행하지 않음
    }
    console.log(data);
  };

  const handleLinkToLogin = () => {
    navigate('/login');
  };

  return (
    <main className={styles.page}>
      <form
        className={styles.card}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>MindMeld에 오신 것을 환영합니다</p>
        </div>

        {/* 사용자명 */}
        <section className={styles.section}>
          <label className={styles.label} htmlFor="username">
            사용자명
          </label>
          <Input
            id="username"
            placeholder="사용자명을 입력해 주세요"
            {...register('username')}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          <div className={styles.errorSlot}>
            {errors.username && (
              <p id="username-error" className={styles.error}>
                {errors.username.message}
              </p>
            )}
          </div>
        </section>

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
            autoComplete="off"
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

        {/* 비밀번호 확인 */}
        <section className={styles.section}>
          <PasswordInput
            placeholder="비밀번호를 다시 한 번 입력해 주세요"
            label="비밀번호 확인"
            {...register('passwordConfirm')}
            aria-invalid={!!errors.passwordConfirm || mismatchNow}
            aria-describedby={
              errors.passwordConfirm || mismatchNow
                ? 'passwordConfirm-error'
                : undefined
            }
          />
          <div className={styles.errorSlot}>
            {(errors.passwordConfirm || mismatchNow) && (
              <p id="passwordConfirm-error" className={styles.error}>
                {errors.passwordConfirm?.message ||
                  '비밀번호가 일치하지 않습니다'}
              </p>
            )}
          </div>
        </section>

        {/* 닉네임 */}
        <section className={styles.section}>
          <label className={styles.label} htmlFor="nick">
            닉네임
          </label>
          <Input
            id="nick"
            placeholder="닉네임을 입력해 주세요"
            {...register('nick')}
            aria-invalid={!!errors.nick}
            aria-describedby={errors.nick ? 'nick-error' : undefined}
          />
          <div className={styles.errorSlot}>
            {errors.nick && (
              <p id="nick-error" className={styles.error}>
                {errors.nick.message}
              </p>
            )}
          </div>
        </section>

        {/* 회원가입 버튼 */}
        <div className={styles.cta}>
          <Button
            variant="action"
            size="xl"
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </Button>
        </div>

        {/* 로그인 링크 */}
        <div className={styles.loginLink}>
          <p>
            이미 계정이 있으신가요?
            <button
              type="button"
              className={styles.linkButton}
              onClick={handleLinkToLogin}
            >
              로그인하기
            </button>
          </p>
        </div>
      </form>
    </main>
  );
}
