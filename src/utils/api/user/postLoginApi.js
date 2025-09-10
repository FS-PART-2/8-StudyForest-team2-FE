import { instance } from '../axiosInstance.js';

export const postLoginApi = async loginData => {
  try {
    const response = await instance.post('/api/users/login', loginData);
    const { accessToken } = response.data;
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
