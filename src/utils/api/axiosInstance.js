import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_TEST_URL,
  withCredentials: true,
  timeout: 5000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(promiseCallback => {
    if (error) {
      promiseCallback.reject(error);
    } else {
      promiseCallback.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error),
);

// 응답 인터셉터로 공통 에러 처리 및 토큰 리프레시
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 리프레시 중인 경우 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 리프레시 시도
        const response = await instance.post('/api/users/refresh');
        const { accessToken } = response.data;

        // 새로운 토큰을 헤더에 설정
        instance.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;

        // 큐에 있는 요청들 처리
        processQueue(null, accessToken);

        // 원래 요청 재시도
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 시 로그아웃 처리
        processQueue(refreshError, null);
        delete instance.defaults.headers.common['Authorization'];

        // 로그인 페이지로 리다이렉트를 위해 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('auth:logout'));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error('API 에러:', error.response?.data || error.message);
  },
);

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
