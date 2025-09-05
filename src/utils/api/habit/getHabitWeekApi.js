// src/utils/api/habit/getHabitWeekApi.js
import { instance } from '../axiosInstance.js';

/**
 * GET /api/habits/week/{studyId}
 * @param {number|string} studyId
 * @param {{ weekDate?: string, password?: string }} options
 *
 * 서버가 어디서 비밀번호를 받는지 몰라도 되도록
 * 쿼리(password, studyPassword) + 헤더(x-study-password, x-password) 모두 보냅니다.
 */
const getHabitWeekApi = async (studyId, options = {}) => {
  const { weekDate, password } = options;

  const res = await instance.get(`/api/habits/week/${studyId}`, {
    params: {
      ...(weekDate ? { weekDate } : {}),
      ...(password ? { password } : {}),
      ...(password ? { studyPassword: password } : {}),
    },
    // CORS 문제를 피하기 위해 헤더 제거
  });

  return res.data;
};

export const habitWeekApi = { getHabitWeekApi };
