import { instance } from '../axiosInstance.js';

/**
 * 습관 완료 상태 업데이트 API
 * @param {number|string} habitId - 습관 ID
 * @param {boolean} isDone - 완료 상태
 * @param {Object} options - 추가 옵션 (signal, timeout 등)
 * @returns {Promise<Object>} 업데이트 결과
 */
export const updateHabitApi = async (habitId, isDone, options = {}) => {
  try {
    const encodedId = encodeURIComponent(String(habitId));
    const response = await instance.patch(
      `/api/habits/${encodedId}`,
      {
        isDone,
      },
      {
        signal: options.signal,
        timeout: options.timeout,
      },
    );
    return response.data;
  } catch (error) {
    console.error('습관 업데이트 실패:', error);
    throw error;
  }
};

/**
 * 여러 습관을 한번에 업데이트하는 API
 * @param {Array} habits - [{habitId, isDone}, ...] 형태의 배열
 * @param {Object} options - 추가 옵션
 * @returns {Promise<Object>} 업데이트 결과
 */
export const updateMultipleHabitsApi = async (habits, options = {}) => {
  try {
    const response = await instance.patch(
      '/api/habits/batch',
      {
        habits,
      },
      {
        signal: options.signal,
        timeout: options.timeout,
      },
    );
    return response.data;
  } catch (error) {
    console.error('다중 습관 업데이트 실패:', error);
    throw error;
  }
};

export const habitUpdateApi = {
  updateHabitApi,
  updateMultipleHabitsApi,
};
