import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, '사용자명을 입력해주세요')
      .min(3, '사용자명은 3자 이상 입력해주세요')
      .max(20, '사용자명은 20자 이하로 입력해주세요'),

    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식을 입력해주세요'),

    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .min(6, '비밀번호는 6자 이상이어야 합니다')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
        '비밀번호는 영문 대문자, 소문자, 숫자를 포함하여 6자 이상이어야 합니다',
      ),

    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),

    nick: z
      .string()
      .min(1, '닉네임을 입력해주세요')
      .min(2, '닉네임은 2자 이상 입력해주세요')
      .max(10, '닉네임은 10자 이하로 입력해주세요'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'], // 에러가 표시될 필드
  });
