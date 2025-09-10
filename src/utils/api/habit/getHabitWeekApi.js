// src/utils/api/habit/getHabitWeekApi.js
import { instance } from '../axiosInstance.js';

/**
 * GET /api/habits/week/{studyId}
 * @param {number|string} studyId
 * @param {{ weekDate?: string, password?: string }} options
 *
 * GET 메소드이므로 쿼리 파라미터로 비밀번호 전송 (기존 API 사용)
 */
const getHabitWeekApi = async (studyId, options = {}) => {
  const { weekDate, password } = options;
  const encodedId = encodeURIComponent(String(studyId));

  const res = await instance.get(`/api/habits/week/${encodedId}`, {
    params: {
      ...(weekDate ? { weekDate } : {}),
      ...(password ? { password } : {}),
    },
  });

  return res.data;
};

export const habitWeekApi = { getHabitWeekApi };
