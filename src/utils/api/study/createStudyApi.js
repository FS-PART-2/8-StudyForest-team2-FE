import { instance } from '../axiosInstance';

/**
 * 스터디 생성 API
 */
export async function createStudy({
  nickname,
  studyName,
  description,
  background, // URL 또는 HEX
  password,
  passwordConfirm,
  isPublic,
}) {
  const requestData = {
    nick: nickname,
    name: studyName,
    content: description,
    img: background,
    password,
    checkPassword: passwordConfirm,
    isActive: isPublic,
  };

  console.log('API 요청 데이터:', {
    ...requestData,
    password: '***',
    checkPassword: '***',
    isPublic,
    isActive: isPublic,
  });

  const res = await instance.post('/api/studies', requestData);
  return res.data; // { id, ... }
}
