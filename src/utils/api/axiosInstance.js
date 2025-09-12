import axios from 'axios';

export const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://eight-studyforest-team2-be.onrender.com',

  withCredentials: true,
  timeout: 5000,
});

// 응답 인터셉터로 공통 에러 처리
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API 에러:', error.response?.data || error.message);

    // 에러 타입별 처리
    switch (error.response?.status) {
      case 400:
        console.error('잘못된 요청');
        break;
      case 401:
        console.error('인증 오류');
        break;
      case 403:
        console.error('권한 없음');
        break;
      case 404:
        console.error('리소스를 찾을 수 없음');
        break;
      case 409:
        console.error('리소스 충돌');
        break;
      case 500:
        console.error('내부 서버 오류');
        break;
      case 502:
        console.error('게이트웨이 오류');
        break;
      case 503:
        console.error('서비스 이용 불가');
        break;
      case 504:
        console.error('게이트웨이 시간 초과');
        break;
    }

    return Promise.reject(error);
  },
);
