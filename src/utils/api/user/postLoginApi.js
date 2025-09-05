import { instance } from '../axiosInstance.js';

const postLoginApi = async loginData => {
  try {
    const response = await instance.post('/api/users/login', loginData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const userApi = {
  postLoginApi,
};
