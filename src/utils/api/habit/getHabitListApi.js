import { instance } from '../axiosInstance.js';

/**
 * 사용자의 전체 습관 목록 조회 API
 * @param {Object} options - 추가 옵션 (signal, timeout 등)
 * @returns {Promise<Array>} 습관 목록 배열
 */
export const getHabitListApi = async (options = {}) => {
  try {
    const response = await instance.get('/api/habits', {
      signal: options.signal,
      timeout: options.timeout,
    });
    return response.data;
  } catch (error) {
    console.error('습관 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 새 습관 생성 API
 * @param {Object} habitData - 습관 데이터 { name, description? }
 * @param {Object} options - 추가 옵션
 * @returns {Promise<Object>} 생성된 습관 데이터
 */
export const createHabitApi = async (habitData, options = {}) => {
  try {
    const response = await instance.post('/api/habits', habitData, {
      signal: options.signal,
      timeout: options.timeout,
    });
    return response.data;
  } catch (error) {
    console.error('습관 생성 실패:', error);
    throw error;
  }
};

/**
 * 습관 삭제 API
 * @param {number|string} habitId - 습관 ID
 * @param {Object} options - 추가 옵션
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteHabitApi = async (habitId, options = {}) => {
  try {
    const encodedId = encodeURIComponent(String(habitId));
    const response = await instance.delete(`/api/habits/${encodedId}`, {
      signal: options.signal,
      timeout: options.timeout,
    });
    return response.data;
  } catch (error) {
    console.error('습관 삭제 실패:', error);
    throw error;
  }
};

export const habitListApi = {
  getHabitListApi,
  createHabitApi,
  deleteHabitApi,
};
