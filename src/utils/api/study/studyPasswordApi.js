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
    // CORS 문제를 피하기 위해 헤더 대신 쿼리 파라미터만 사용
    const { data } = await instance.get(`/api/studies/${id}`, {
      params: {
        password: password,
        studyPassword: password,
      },
      signal: options.signal,
      timeout: options.timeout,
    });

    // 스터디 정보를 성공적으로 가져왔다면 비밀번호가 맞는 것
    return !!data;
  } catch (err) {
    // 401, 403 등의 인증 오류는 비밀번호가 틀린 것
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return false;
    }
    // CORS 오류나 네트워크 오류는 비밀번호 불일치가 아닌 예외로 처리
    if (err?.code === 'ERR_NETWORK' || err?.message?.includes('CORS')) {
      throw err;
    }
    throw err;
  }
}
