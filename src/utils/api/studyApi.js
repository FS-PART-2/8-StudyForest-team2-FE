// src/utils/api/studyApi.js
import { instance } from './axiosInstance';

// 스터디 이름 가져오기
export async function getStudyName(studyId) {
  const { data } = await instance.get(`/study/${studyId}`);
  // 백엔드 응답 형태에 맞춰 안전하게 추출
  return data?.name ?? data?.study?.name ?? '';
}

// 비밀번호 검증
export async function verifyStudyPassword(studyId, password) {
  // 백엔드에 검증 라우트가 /study/:id/verify 라고 가정
  // 팀 라우트가 다르면 엔드포인트만 바꾸세요.
  const { data } = await instance.post(`/study/${studyId}/verify`, { password });
  // { valid: true/false } 형태 가정
  return !!data?.valid;
}
