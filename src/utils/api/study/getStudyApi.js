import { instance } from '../axiosInstance';

const getStudyApi = async () => {
  const response = await instance.get('/study');
  return response.data;
};

export const studyApi = {
  getStudyApi,
};
