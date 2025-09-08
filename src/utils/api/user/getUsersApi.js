import { instance } from '../axiosInstance';

export const getUsersApi = async () => {
  try {
    const response = await instance.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
