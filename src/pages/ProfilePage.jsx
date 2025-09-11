import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/atoms/Input.jsx';
import Button from '../components/atoms/Button.jsx';
import PasswordInput from '../components/molecules/PasswordInput.jsx';
import { profileSchema } from '../utils/validation/profileSchema.js';
import { useAuthStore } from '../store/authStore.js';
import { getUsersApi } from '../utils/api/user/getUsersApi.js';
import { patchUserProfileApi } from '../utils/api/user/patchUserProfileApi.js';
import styles from '../styles/pages/ProfilePage.module.css';

/**
 * 프로필 수정 페이지
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, updateUser } = useAuthStore();

  // 폼 상태 관리
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      nick: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');
  const mismatchNow = passwordConfirm && password !== passwordConfirm;

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!isLoggedIn) {
        navigate('/login');
        return;
      }

      try {
        const userData = await getUsersApi();
        console.log(userData);
        if (userData?.data) {
          setValue('username', userData.data.username || '');
          setValue('nick', userData.data.nick || '');
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        // 인증 오류 시 로그아웃 처리
        if (error.response?.status === 401) {
          await logout();
          navigate('/login');
        }
      }
    };

    loadUserInfo();
  }, [isLoggedIn, navigate, setValue, logout]);

  // 프로필 수정 처리
  const onSubmit = async data => {
    try {
      // 빈 비밀번호는 제거하고 전송
      const profileData = {
        username: data.username,
        nick: data.nick,
      };

      if (data.password && data.password.trim() !== '') {
        profileData.password = data.password;
      }

      const response = await patchUserProfileApi(profileData);

      // 성공 시 사용자 정보 업데이트
      if (response?.data) {
        updateUser(response.data);
      }

      // 성공 시 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
    }
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <main className={styles.page}>
      <form
        className={styles.card}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.header}>
          <h1 className={styles.title}>프로필 수정</h1>
          <p className={styles.subtitle}>회원 정보를 수정하실 수 있습니다</p>
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

        {/* 새 비밀번호 */}
        <section className={styles.section}>
          <PasswordInput
            placeholder="새 비밀번호 (변경하지 않으려면 비워두세요)"
            label="새 비밀번호"
            autoComplete="new-password"
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

        {/* 새 비밀번호 확인 */}
        {password && password.trim() !== '' && (
          <section className={styles.section}>
            <PasswordInput
              placeholder="새 비밀번호를 다시 한 번 입력해 주세요"
              label="새 비밀번호 확인"
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
        )}

        {/* 버튼 영역 */}
        <div className={styles.buttonGroup}>
          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            취소
          </Button>
          <Button
            variant="action"
            size="lg"
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </form>
    </main>
  );
}
