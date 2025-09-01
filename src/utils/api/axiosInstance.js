import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env 파일에 정의된 환경변수 / 변경 필요
  timeout: 5000,
});
