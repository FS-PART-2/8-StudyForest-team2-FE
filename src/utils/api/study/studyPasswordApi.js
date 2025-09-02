import { instance } from '../axiosInstance';

export async function getStudyName(studyId, options = {}) {
  const id = encodeURIComponent(String(studyId));
  try {
    const { data } = await instance.get(`/study/${id}`, {
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
  try {
    const { data } = await instance.post(
      `/study/${id}/verify`,
      { password },
      { signal: options.signal, timeout: options.timeout }
    );
    return !!data?.valid;
  } catch (err) {
    throw err;
  }
}
