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
