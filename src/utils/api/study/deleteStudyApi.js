import { instance } from '../axiosInstance';

/**
 * 스터디 삭제 API
 * @param {string} studyId - 삭제할 스터디 ID
 * @param {string} password - 스터디 비밀번호
 * @param {Object} options - 추가 옵션 (signal, timeout 등)
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteStudyApi = async (studyId, password, options = {}) => {
  try {
    const encodedId = encodeURIComponent(String(studyId));
    const response = await instance.delete(`/api/studies/${encodedId}`, {
      data: {
        password: password,
      },
      signal: options.signal,
      timeout: options.timeout,
    });
    return response.data;
  } catch (error) {
    console.error('스터디 삭제 실패:', error);
    throw error;
  }
};
