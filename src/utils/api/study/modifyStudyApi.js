import { instance } from '../axiosInstance';

/**
 * 스터디 정보를 수정한다. 먼저 PATCH /api/studies/{studyId}로 요청하고,
 * 서버가 PATCH를 지원하지 않거나 404/405을 반환하면 POST /api/studies/{studyId}/update로 재시도한다.
 *
 * @param {string|number} studyId - 수정할 스터디의 식별자.
 * @param {Object} param0 - 수정할 필드들을 포함한 객체.
 * @param {string} [param0.studyName] - 스터디 이름.
 * @param {string} [param0.description] - 스터디 설명(내용).
 * @param {string} [param0.background] - 스터디 배경 이미지 URL 또는 식별자.
 * @param {string} [param0.password] - 스터디 비밀번호(필요한 경우 실제 비밀번호를 전송).
 * @param {boolean} [param0.isPublic] - 스터디 공개 여부(true면 공개).
 * @returns {any} 서버가 반환한 응답 데이터(res.data).
 * @throws {Error} PATCH 요청이 실패하고(404/405 제외) 또는 PATCH/POST 모두 실패한 경우 해당 오류를 그대로 throw한다.
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
