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
  const url = `/api/studies/${id}`;

  console.log('studyPasswordApi: 비밀번호 검증 요청', {
    studyId,
    encodedId: id,
    url,
    password: password ? '***' : 'empty',
  });

  try {
    // 헤더 방식으로 비밀번호 검증 (HabitPage와 일관성 유지)
    const { data } = await instance.get(url, {
      headers: {
        'x-study-password': password,
      },
      signal: options.signal,
      timeout: options.timeout,
    });

    console.log('studyPasswordApi: API 응답 성공', { hasData: !!data });
    // 데이터가 정상적으로 반환되면 비밀번호가 맞는 것
    return !!data;
  } catch (err) {
    console.error('studyPasswordApi: API 요청 실패', {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
    });

    // 401, 403 등의 인증 오류는 비밀번호가 틀린 것
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      console.log('studyPasswordApi: 인증 오류 - 비밀번호 불일치');
      return false;
    }
    // 404 에러는 스터디가 존재하지 않거나 비밀번호가 틀린 것
    if (err?.response?.status === 404) {
      console.log(
        'studyPasswordApi: 404 오류 - 스터디 없음 또는 비밀번호 불일치',
      );
      return false;
    }
    // 기타 네트워크 오류는 예외로 전파
    console.error('studyPasswordApi: 네트워크 오류 - 예외 전파');
    throw err;
  }
}
