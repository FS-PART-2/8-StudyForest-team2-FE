import { instance } from '../axiosInstance';

const postRegisterApi = async data => {
  try {
    const response = await instance.post('/api/users/register', data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const userApi = {
  postRegisterApi,
};
