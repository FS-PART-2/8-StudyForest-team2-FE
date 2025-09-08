import { instance } from '../axiosInstance.js';

export const postRefreshApi = async () => {
  try {
    const response = await instance.post('/api/users/refresh');
    const { accessToken, user } = response.data.data;
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    console.log('refresh 성공:', response.data);

    return { accessToken, user };
  } catch (error) {
    console.error(error);
    delete instance.defaults.headers.common['Authorization'];

    throw error;
  }
};
