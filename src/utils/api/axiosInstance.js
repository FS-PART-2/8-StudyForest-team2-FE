import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 필요하면 인터셉터 추가
// instance.interceptors.request.use((config) => config);
// instance.interceptors.response.use((res) => res, (err) => Promise.reject(err));

// 편의상 같은 걸 http 이름으로도 노출 (기존 코드 호환)
export const http = instance;

// default 도 내보내서 과거 코드도 깨지지 않게
export default instance;
