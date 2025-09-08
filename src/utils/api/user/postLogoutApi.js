import { instance } from '../axiosInstance.js';

export const postLogoutApi = async () => {
  try {
    const response = await instance.post('/api/users/logout');
    delete instance.defaults.headers.common['Authorization'];
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
