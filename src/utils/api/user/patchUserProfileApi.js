import { instance } from '../axiosInstance';

export const patchUserProfileApi = async profileData => {
  try {
    const response = await instance.patch('/api/users/me', profileData);
    return response.data;
  } catch (error) {
    console.error('프로필 수정 실패:', error);
    throw error;
  }
};
