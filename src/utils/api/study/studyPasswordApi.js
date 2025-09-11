import { instance } from '../axiosInstance';

export async function getStudyName(studyId, options = {}) {
  const id = encodeURIComponent(String(studyId));
  try {
    const { data } = await instance.get(`/api/studies/${id}`, {
      signal: options.signal,
      timeout: options.timeout,
    });
    return data?.name ?? data?.study?.name ?? '';
  } catch (err) {
    if (err?.response?.status === 404) return '';
    throw err;
  }
}

/**
 * 스터디 ID와 비밀번호로 서버에 조회해 비밀번호 유효성을 확인한다.
 *
 * 지정한 스터디의 엔드포인트를 GET 요청으로 호출해 응답 데이터의 존재 여부로 비밀번호 일치 여부를 판단한다.
 * 서버가 401/403 또는 404 상태를 반환하면 false를 반환하고, 그 밖의 네트워크/서버 오류는 호출자에게 전파된다.
 *
 * @param {string|number} studyId - 검사할 스터디의 ID(문자열로 변환되어 URL-인코딩됨).
 * @param {string} password - 확인할 비밀번호. 요청의 쿼리 파라미터로 `password` 및 `studyPassword` 두 키로 전송된다.
 * @param {Object} [options] - 요청 제어 옵션.
 * @param {AbortSignal} [options.signal] - 요청 취소용 신호.
 * @param {number} [options.timeout] - 요청 타임아웃(밀리초).
 * @returns {Promise<boolean>} 비밀번호가 일치하면 true, 일치하지 않거나 스터디를 찾을 수 없으면 false.
 */
export async function verifyStudyPassword(studyId, password, options = {}) {
  const id = encodeURIComponent(String(studyId));
  try {
    // 백엔드에서 쿼리 파라미터로 비밀번호 검증을 지원하는 방식 사용
    const { data } = await instance.get(`/api/studies/${id}`, {
      params: {
        password: password,
        studyPassword: password, // 백엔드에서 두 가지 파라미터를 모두 지원할 수 있도록
      },
      headers: {
        'Cache-Control': 'no-store',
      },
      signal: options.signal,
      timeout: options.timeout,
    });

    // 데이터가 정상적으로 반환되면 비밀번호가 맞는 것
    return !!data;
  } catch (err) {
    // 401, 403 등의 인증 오류는 비밀번호가 틀린 것
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return false;
    }
    // 404 에러는 스터디가 존재하지 않거나 비밀번호가 틀린 것
    if (err?.response?.status === 404) {
      return false;
    }
    // 기타 네트워크 오류는 예외로 전파
    throw err;
  }
}