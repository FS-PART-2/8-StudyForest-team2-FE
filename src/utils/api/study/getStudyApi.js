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

    const response = await instance.get('/api/studies', {
      params: {
        isActive,
        recentOrder,
        offset,
        limit,
        keyword,
        pointOrder,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getStudyDetailApi = async id => {
  try {
    const response = await instance.get(`/api/studies/${id}`);
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
