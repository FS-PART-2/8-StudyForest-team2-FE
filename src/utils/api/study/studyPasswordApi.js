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
    // 백엔드의 전용 비밀번호 검증 API 사용
    const { data } = await instance.post(`/api/studies/${id}/verify-password`, {
      password,
    }, {
      signal: options.signal,
      timeout: options.timeout,
    });

    console.log('studyPasswordApi: 비밀번호 검증 성공', {
      isPasswordValid: data?.isPasswordValid,
    });
    
    return data?.isPasswordValid === true;
  } catch (err) {
    console.error('studyPasswordApi: 비밀번호 검증 실패', {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
    });

    // 400 에러는 비밀번호 누락 또는 잘못된 요청
    if (err?.response?.status === 400) {
      console.log('studyPasswordApi: 400 오류 - 비밀번호 누락 또는 잘못된 요청');
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
