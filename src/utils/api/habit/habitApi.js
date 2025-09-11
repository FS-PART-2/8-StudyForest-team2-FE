import { instance } from '../axiosInstance.js';

/**
 * 습관 관련 API 함수들
 * 백엔드 API 문서: https://eight-studyforest-team2-be.onrender.com/api-docs/#/Habits
 */

/**
 * 오늘의 습관 목록 조회
 * @param {string|number} studyId - 스터디 ID
 * @returns {Promise<Array>} 오늘의 습관 목록
 */
export const getHabitsApi = async studyId => {
  try {
    // studyId를 확실히 정수로 변환
    const numericStudyId = parseInt(studyId, 10);
    if (isNaN(numericStudyId) || numericStudyId < 1) {
      throw new Error(`유효하지 않은 studyId: ${studyId}`);
    }

    const response = await instance.get(`/api/habits/today/${numericStudyId}`);
    console.log('getHabitsApi 전체 응답:', response.data);
    console.log('habits 배열:', response.data.habits);
    // 백엔드 응답에서 habits 배열 추출
    return response.data.habits || [];
  } catch (error) {
    // 404 에러는 백엔드 API 미구현으로 정상적인 상황이므로 로그 레벨을 낮춤
    if (error.response?.status === 404) {
      console.log('습관 API 미구현 (404) - fallback으로 처리됩니다');
    } else {
      console.error('습관 목록 조회 실패:', error);
    }
    throw error;
  }
};

/**
 * 오늘의 습관 단일 추가
 * @param {string|number} studyId - 스터디 ID
 * @param {Object} habitData - 습관 데이터
 * @param {string} habitData.title - 습관 이름
 * @returns {Promise<Object>} 생성된 습관 데이터
 */
export const createHabitApi = async (studyId, habitData) => {
  try {
    // studyId를 확실히 정수로 변환
    const numericStudyId = parseInt(studyId, 10);
    if (isNaN(numericStudyId) || numericStudyId < 1) {
      throw new Error(`유효하지 않은 studyId: ${studyId}`);
    }

    const response = await instance.post(
      `/api/habits/today/${numericStudyId}`,
      habitData,
    );
    return response.data;
  } catch (error) {
    console.error('습관 생성 실패:', error);
    throw error;
  }
};

/**
 * 오늘의 습관 이름 변경 (과거 전체 반영)
 * @param {string|number} studyId - 스터디 ID
 * @param {string|number} habitId - 습관 ID
 * @param {Object} habitData - 수정할 습관 데이터
 * @param {string} habitData.title - 습관 이름
 * @returns {Promise<Object>} 수정된 습관 데이터
 */
export const updateHabitApi = async (studyId, habitId, habitData) => {
  try {
    const numericStudyId = parseInt(studyId, 10);
    if (isNaN(numericStudyId) || numericStudyId < 1) {
      throw new Error(`유효하지 않은 studyId: ${studyId}`);
    }

    const url = `/api/habits/today/${numericStudyId}/${encodeURIComponent(habitId)}`;
    console.log('updateHabitApi 호출:', { url, habitData });

    const response = await instance.patch(url, habitData);
    console.log('updateHabitApi 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('습관 수정 실패:', error);
    console.error('에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    throw error;
  }
};

/**
 * 오늘부터 습관 종료 (과거 기록 보존)
 * @param {string|number} studyId - 스터디 ID
 * @param {string|number} habitId - 습관 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteHabitApi = async (studyId, habitId) => {
  try {
    const numericStudyId = parseInt(studyId, 10);
    if (isNaN(numericStudyId) || numericStudyId < 1) {
      throw new Error(`유효하지 않은 studyId: ${studyId}`);
    }

    const response = await instance.delete(
      `/api/habits/today/${numericStudyId}/${encodeURIComponent(habitId)}`,
    );
    return response.data;
  } catch (error) {
    console.error('습관 삭제 실패:', error);
    throw error;
  }
};

/**
 * 습관 완료/미완료 토글 (HabitPage용)
 * @param {string|number} habitId - 습관 ID
 * @returns {Promise<Object>} 토글된 습관 데이터
 */
export const toggleHabitApi = async habitId => {
  try {
    const response = await instance.patch(
      `/api/habits/${encodeURIComponent(habitId)}/toggle`,
    );
    return response.data;
  } catch (error) {
    console.error('습관 토글 실패:', error);
    throw error;
  }
};

/**
 * 주간 습관 기록 조회
 * @param {string|number} studyId - 스터디 ID
 * @returns {Promise<Array>} 주간 습관 데이터
 */
export const getHabitWeekApi = async studyId => {
  try {
    // studyId를 확실히 정수로 변환
    const numericStudyId = parseInt(studyId, 10);
    if (isNaN(numericStudyId) || numericStudyId < 1) {
      throw new Error(`유효하지 않은 studyId: ${studyId}`);
    }

    const response = await instance.get(`/api/habits/week/${numericStudyId}`);
    return response.data;
  } catch (error) {
    console.error('습관 주간 조회 실패:', error);
    throw error;
  }
};
