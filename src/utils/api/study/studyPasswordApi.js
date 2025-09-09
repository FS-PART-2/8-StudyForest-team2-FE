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
    const { data } = await instance.post(`/api/studies/${id}/verify`, {
      password: password,
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
      signal: options.signal,
      timeout: options.timeout,
    });

    return !!data;
  } catch (err) {
    // 401, 403 등의 인증 오류는 비밀번호가 틀린 것
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return false;
    }
    // 인증 오류(401/403) 외에는 모두 예외로 전파
    throw err;
  }
}
