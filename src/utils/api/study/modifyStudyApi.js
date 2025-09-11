import { instance } from '../axiosInstance';

/**
 * 스터디 수정 API
 */
export async function modifyStudy(
  studyId,
  { studyName, description, background, password, isPublic },
) {
  // PATCH 메서드로 시도 (비밀번호를 헤더로 전송)
  try {
    const encodedId = encodeURIComponent(String(studyId));
    const requestData = {
      name: studyName,
      content: description,
      img: background,
      isActive: isPublic,
      password: password || '', // 백엔드에서 요구하는 password 필드 추가
    };

    const safeRequestData = {
      ...requestData,
      password: requestData.password ? '***' : undefined,
    };
    console.log('modifyStudy API 요청 데이터:', {
      studyId,
      requestData: safeRequestData,
      hasPassword: !!password,
    });

    // requestData 상세 내용 확인
    console.log('requestData 상세:', {
      name: requestData.name,
      content: requestData.content,
      img: requestData.img,
      isActive: requestData.isActive,
      isActiveType: typeof requestData.isActive,
    });

    const res = await instance.patch(`/api/studies/${encodedId}`, requestData);
    return res.data;
  } catch (error) {
    console.error('modifyStudy PATCH 오류:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // 백엔드 오류 상세 정보 확인
    if (error.response?.data?.error?.details) {
      console.error('백엔드 오류 상세:', error.response.data.error.details);

      // fields 배열 상세 확인
      if (error.response.data.error.details.fields) {
        console.error('오류 필드들:', error.response.data.error.details.fields);
        error.response.data.error.details.fields.forEach((field, index) => {
          console.error(`필드 ${index}:`, field);
        });
      }
    }

    // PATCH가 실패하면 POST로 시도
    if (error.response?.status === 404 || error.response?.status === 405) {
      console.log('PATCH 실패, POST로 재시도...');
      try {
        const res = await instance.post(
          `/api/studies/${encodedId}/update`,
          requestData,
        );
        return res.data;
      } catch (postError) {
        console.error('POST도 실패:', postError.response?.data);
        throw postError;
      }
    }
    throw error;
  }
}
