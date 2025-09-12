import { instance } from '../axiosInstance';

/**
 * 이모지 관련 API
 */
export const emojiApi = {
  /**
   * 스터디의 이모지 목록 조회
   * @param {string} studyId - 스터디 ID
   * @returns {Promise<Array>} StudyEmoji 배열
   */
  // getEmojis: async studyId => {
  //   try {
  //     const id = encodeURIComponent(String(studyId));
  //     const response = await instance.get(`/api/studies/${id}/emojis`);
  //     return response.data;
  //   } catch (error) {
  //     // 404 에러는 백엔드에서 이모지 API가 구현되지 않았을 때 발생
  //     if (error.response?.status === 404) {
  //       console.debug(
  //         '이모지 API가 구현되지 않음. 스터디 데이터에서 이모지를 가져옵니다.',
  //       );
  //       return null; // null을 반환하여 호출하는 곳에서 fallback 처리
  //     }
  //     console.error('이모지 목록 조회 실패:', error);
  //     throw error;
  //   }
  // },

  /**
   * 스터디에 이모지 추가
   * @param {string} studyId - 스터디 ID
   * @param {string} emoji - 이모지
   * @returns {Promise<EmojiUpdated>} 추가된 이모지 데이터
   */
  incrementEmoji: async (studyId, emoji) => {
    try {
      const id = encodeURIComponent(String(studyId));
      const response = await instance.post(
        `/api/studies/${id}/emojis/increment`,
        {
          id: emoji.id,
          emoji: emoji.emoji,
          count: emoji.count,
        },
      );
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('이모지 추가 실패:', error);
      throw error;
    }
  },

  /**
   * 스터디의 이모지 카운트 증가
   * @param {string} studyId - 스터디 ID
   * @param {string} emoji - 이모지
   * @returns {Promise<EmojiUpdated>} 업데이트된 이모지 데이터
   */
  // incrementEmoji: async (studyId, emoji) => {
  //   try {
  //     const id = encodeURIComponent(String(studyId));
  //     const e = encodeURIComponent(emoji);
  //     const response = await instance.patch(
  //       `/api/studies/${id}/emojis/${e}/increment`,
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error('이모지 카운트 증가 실패:', error);
  //     throw error;
  //   }
  // },

  /**
   * 스터디의 이모지 카운트 감소
   * @param {string} studyId - 스터디 ID
   * @param {string} emoji - 이모지
   * @returns {Promise<EmojiActionResult>} EmojiUpdated 또는 EmojiDeleted
   */
  decrementEmoji: async (studyId, emoji) => {
    try {
      const id = encodeURIComponent(String(studyId));
      const response = await instance.post(
        `/api/studies/${id}/emojis/decrement`,
        {
          id: emoji,
        },
      );
      return response.data;
    } catch (error) {
      console.error('이모지 카운트 감소 실패:', error);
      throw error;
    }
  },

  /**
   * 스터디의 이모지 삭제
   * @param {string} studyId - 스터디 ID
   * @param {string} emoji - 이모지
   * @returns {Promise<EmojiDeleted>}
   */
  // deleteEmoji: async (studyId, emoji) => {
  //   try {
  //     const id = encodeURIComponent(String(studyId));
  //     const e = encodeURIComponent(emoji);
  //     const response = await instance.delete(`/api/studies/${id}/emojis/${e}`);
  //     return response.status === 204 ? { deleted: true } : response.data;
  //   } catch (error) {
  //     console.error('이모지 삭제 실패:', error);
  //     throw error;
  //   }
  // },
};
