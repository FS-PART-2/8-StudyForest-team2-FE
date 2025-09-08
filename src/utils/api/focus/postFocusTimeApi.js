import { instance } from '../axiosInstance';

const postFocusTimeApi = async data => {
  try {
    const response = await instance.post('/api/focus/time', data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const focusApi = {
  postFocusTimeApi,
};
