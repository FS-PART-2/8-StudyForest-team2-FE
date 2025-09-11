import { instance } from '../axiosInstance';

const getStudyApi = async (params = {}) => {
  try {
    const { isActive = true, offset, limit, keyword, sort } = params;

    const queryParams = {
      isActive,
      sort,
      offset,
      limit,
      keyword,
    };

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
