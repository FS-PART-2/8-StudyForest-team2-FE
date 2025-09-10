import { instance } from '../axiosInstance';

export const patchFocusTimeApi = async (studyId, data) => {
  try {
    const response = await instance.patch(`/api/focus/${studyId}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
