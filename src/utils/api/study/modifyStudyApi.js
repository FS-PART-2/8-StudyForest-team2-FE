import { instance } from '../axiosInstance';

/**
 * 스터디 수정 API
 */
export async function modifyStudy(
  studyId,
  { studyName, description, background, password, isPublic },
) {
  // PATCH 메서드로 시도 (checkPassword 제거)
  try {
    const res = await instance.patch(`/api/studies/${studyId}`, {
      name: studyName,
      content: description,
      img: background,
      password, // 실제 비밀번호 전송
      isActive: isPublic,
    });
    return res.data;
  } catch (error) {
    // PATCH가 실패하면 POST로 시도
    if (error.response?.status === 404 || error.response?.status === 405) {
      console.log('PATCH 실패, POST로 재시도...');
      try {
        const res = await instance.post(`/api/studies/${studyId}/update`, {
          name: studyName,
          content: description,
          img: background,
          password, // 실제 비밀번호 전송
          isActive: isPublic,
        });
        return res.data;
      } catch (postError) {
        console.error('POST도 실패:', postError.response?.data);
        throw postError;
      }
    }
    throw error;
  }
}
