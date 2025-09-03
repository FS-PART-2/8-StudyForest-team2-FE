import { instance } from '../axiosInstance';

const getStudyApi = async () => {
  const response = await instance.get('/api/studies?isActive=true');
  return response.data;
};

export const studyApi = {
  getStudyApi,
};
