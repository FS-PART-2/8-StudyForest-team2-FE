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
  const res = await instance.post('/api/studies', {
    nick: nickname,
    name: studyName,
    content: description,
    img: background,
    password,
    checkPassword: passwordConfirm,
    isActive: isPublic,
  });
  return res.data; // { id, ... }
}
