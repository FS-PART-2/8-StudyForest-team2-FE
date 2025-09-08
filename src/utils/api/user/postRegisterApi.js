import { instance } from '../axiosInstance';

export const postRegisterApi = async data => {
  try {
    const response = await instance.post('/api/users/register', data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
