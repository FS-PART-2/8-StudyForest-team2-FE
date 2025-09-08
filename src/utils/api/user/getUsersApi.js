import { instance } from '../axiosInstance';

export const getUsersApi = async () => {
  try {
    const response = await instance.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error(error);
    if (instance.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};
