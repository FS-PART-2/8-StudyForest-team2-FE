import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentStudyStore = create(
  persist(
    (set, get) => ({
      recentStudies: [],

      // 스터디를 최근 조회 목록에 추가
      addRecentStudy: study => {
        const { recentStudies } = get();

        // 중복 제거 (같은 id가 있으면 제거)
        const filteredStudies = recentStudies.filter(
          item => item.id !== study.id,
        );

        // 새로운 스터디를 맨 앞에 추가하고 최대 6개까지만 유지
        const newRecentStudies = [study, ...filteredStudies].slice(0, 6);

        set({ recentStudies: newRecentStudies });
      },

      // 최근 조회한 스터디 목록 가져오기
      getRecentStudies: () => {
        return get().recentStudies;
      },

      // 모든 최근 조회 목록 초기화
      clearRecentStudies: () => {
        set({ recentStudies: [] });
      },
    }),
    {
      name: 'recent-study-storage', // 로컬스토리지 키 이름
      getStorage: () => localStorage, // 사용할 스토리지 (localStorage)
    },
  ),
);
