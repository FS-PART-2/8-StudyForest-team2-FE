import { instance } from '../axiosInstance';

const getStudyApi = async (params = {}) => {
  try {
    const {
      isActive = true,
      recentOrder,
      offset,
      limit,
      keyword,
      pointOrder,
    } = params;

    const queryParams = {
      isActive,
      recentOrder,
      offset,
      limit,
      keyword,
      pointOrder,
    };

    // 개발 환경에서만 캐시 무시 파라미터 추가
    if (import.meta.env.DEV) {
      queryParams._t = Date.now();
    }

    const response = await instance.get('/api/studies', {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getStudyDetailApi = async id => {
  try {
    const encodedId = encodeURIComponent(String(id));
    const response = await instance.get(`/api/studies/${encodedId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const studyApi = {
  getStudyApi,
  getStudyDetailApi,
};
