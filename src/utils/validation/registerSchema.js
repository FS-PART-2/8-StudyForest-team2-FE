import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, '사용자명을 입력해주세요')
      .min(3, '사용자명은 3자 이상 입력해주세요')
      .max(20, '사용자명은 20자 이하로 입력해주세요')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        '사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능합니다',
      ),

    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식을 입력해주세요'),

    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .max(30, '비밀번호는 30자 이하로 입력해주세요')
      .regex(
        /^(?=.*[a-z])(?=.*\d)[a-z\d@$!%*?&]{8,30}$/,
        '비밀번호는 영문 소문자, 숫자를 포함하여 8자 이상 30자 이하로 입력해주세요',
      ),

    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),

    nick: z
      .string()
      .min(1, '닉네임을 입력해주세요')
      .max(10, '닉네임은 10자 이하로 입력해주세요'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'], // 에러가 표시될 필드
  });
