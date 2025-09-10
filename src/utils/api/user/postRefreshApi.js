import { instance } from '../axiosInstance.js';

export const postRefreshApi = async () => {
  try {
    const response = await instance.post('/api/users/refresh', null, {
      headers: { Authorization: null },
    });

    // 응답 데이터 구조 안전하게 접근
    const responseData = response.data?.data || response.data;

    if (!responseData) {
      console.warn('토큰 갱신 응답에 데이터가 없습니다.');
      return null;
    }

    const { accessToken, user } = responseData;

    if (!accessToken) {
      console.warn('응답에 액세스 토큰이 포함되지 않았습니다.');
      return null;
    }

    // Authorization 헤더 설정
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    console.log('refresh 성공');

    return { accessToken, user };
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      delete instance.defaults.headers.common['Authorization']; // 401 (권한 없음) , 403 (권한 부족으로 인해 접근을 거부한 상태) 에러 시 헤더 제거
      return null;
    }
    console.error(error);

    // 에러를 throw하지 않고 null 반환
    return null;
  }
};
