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
    // 보안을 위해 POST 본문으로 비밀번호 전송
    const { data } = await instance.post(
      `/api/studies/${id}/verify`,
      { password },
      {
        signal: options.signal,
        timeout: options.timeout,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        },
      },
    );

    // 백엔드에서 ok 필드로 인증 결과 반환
    return !!data?.ok;
  } catch (err) {
    // 401, 403 등의 인증 오류는 비밀번호가 틀린 것
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return false;
    }
    // 네트워크 오류는 예외로 처리
    if (err?.code === 'ERR_NETWORK') {
      throw err;
    }
    throw err;
  }
}
