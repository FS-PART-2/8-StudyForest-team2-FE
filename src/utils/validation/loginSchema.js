// src/utils/validation/loginSchema.js
import { z } from 'zod';

/**
 * 로그인 폼 유효성 검사 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해 주세요')
    .email('올바른 이메일 형식을 입력해 주세요'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해 주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(30, '비밀번호는 최대 30자 이하로 입력해주세요'),
});
