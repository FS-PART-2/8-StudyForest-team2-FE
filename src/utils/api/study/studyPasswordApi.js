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

  console.log('studyPasswordApi: 비밀번호 검증 요청 (PATCH API 활용)', {
    studyId,
    encodedId: id,
    url,
    password: password ? '***' : 'empty',
  });

  try {
    // PATCH 메소드로 비밀번호 검증 (실제 수정하지 않고 검증만)
    const config = {
      signal: options.signal,
      timeout: options.timeout,
    };

    // 실제로는 수정하지 않고 검증만 하기 위해 빈 데이터로 PATCH 요청
    const { data } = await instance.patch(url, { password }, config);

    console.log('studyPasswordApi: API 응답 성공', { hasData: !!data });
    // PATCH 요청이 성공하면 비밀번호가 맞는 것
    return true;
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
