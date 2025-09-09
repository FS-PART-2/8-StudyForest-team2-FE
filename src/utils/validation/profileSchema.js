import { z } from 'zod';

export const profileSchema = z
  .object({
    username: z
      .string()
      .min(1, '사용자명을 입력해주세요')
      .min(3, '사용자명은 3자 이상 입력해주세요')
      .max(20, '사용자명은 20자 이하로 입력해주세요'),

    nick: z
      .string()
      .min(1, '닉네임을 입력해주세요')
      .max(10, '닉네임은 10자 이하로 입력해주세요'),

    password: z
      .string()
      .optional()
      .refine(
        value => {
          // 비밀번호가 입력되지 않은 경우 (빈 문자열 또는 undefined) 유효
          if (!value || value === '') return true;
          // 비밀번호가 입력된 경우 유효성 검사
          return /^(?=.*[a-z])(?=.*\d)[a-z\d@$!%*?&]{8,30}$/.test(value);
        },
        {
          message:
            '비밀번호는 영문 소문자, 숫자를 포함하여 8자 이상 30자 이하로 입력해주세요',
        },
      ),

    passwordConfirm: z.string().optional(),
  })
  .refine(
    data => {
      // 비밀번호가 입력되지 않은 경우 확인 비밀번호도 검증하지 않음
      if (!data.password || data.password === '') return true;
      // 비밀번호가 입력된 경우 확인 비밀번호와 일치해야 함
      return data.password === data.passwordConfirm;
    },
    {
      message: '비밀번호가 일치하지 않습니다',
      path: ['passwordConfirm'],
    },
  );
