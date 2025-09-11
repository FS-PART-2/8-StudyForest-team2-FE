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

  console.log('studyPasswordApi: 비밀번호 검증 요청', {
    studyId,
    encodedId: id,
    password: password ? '***' : 'empty',
  });

  try {
    // x-study-password 헤더를 사용한 GET 요청으로 비밀번호 검증 시도
    const { data } = await instance.get(`/api/studies/${id}`, {
      headers: {
        'x-study-password': password,
      },
      signal: options.signal,
      timeout: options.timeout,
    });

    console.log('studyPasswordApi: 비밀번호 검증 성공 (헤더)', {
      hasData: !!data,
    });
    return true;
  } catch (err) {
    console.error('studyPasswordApi: 비밀번호 검증 실패', {
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
    // 400 에러는 잘못된 요청 (비밀번호 불일치 포함)
    if (err?.response?.status === 400) {
      console.log(
        'studyPasswordApi: 400 오류 - 비밀번호 불일치 또는 잘못된 요청',
      );
      return false;
    }
    // 404 에러는 스터디가 존재하지 않음
    if (err?.response?.status === 404) {
      console.log('studyPasswordApi: 404 오류 - 스터디 없음');
      return false;
    }
    // 기타 네트워크 오류는 예외로 전파
    console.error('studyPasswordApi: 네트워크 오류 - 예외 전파');
    throw err;
  }
}
