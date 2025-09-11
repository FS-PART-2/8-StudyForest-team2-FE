import { create } from 'zustand';
import { postLoginApi } from '../utils/api/user/postLoginApi';
import { postLogoutApi } from '../utils/api/user/postLogoutApi';
import { postRefreshApi } from '../utils/api/user/postRefreshApi';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    set => ({
      isLoggedIn: false,
      user: null,
      isInitialized: false,

      initialize: async () => {
        try {
          const result = await postRefreshApi();

          if (result?.user) {
            set({ isLoggedIn: true, user: result.user, isInitialized: true });
          } else if (result?.isGuest) {
            set({ isLoggedIn: false, user: null, isInitialized: true });
          } else {
            set({ isLoggedIn: false, user: null, isInitialized: true });
          }
        } catch (error) {
          console.error('초기화 실패:', error);
          set({ isLoggedIn: false, user: null, isInitialized: true });
        }
      },

      login: async data => {
        try {
          const response = await postLoginApi(data);
          console.log('로그인 성공');

          set({
            isLoggedIn: true,
            user: response.data.user,
          });
          return response.data;
        } catch (error) {
          console.error('로그인 실패:', error);
          set({ isLoggedIn: false, user: null });
          throw error;
        }
      },

      logout: async () => {
        try {
          // 서버에 로그아웃 요청을 보내 서버 세션을 무효화합니다.
          const response = await postLogoutApi();
          console.log('로그아웃 성공:', response);

          // 클라이언트 상태 초기화
          set({
            isLoggedIn: false,
            user: null,
          });
          console.log('로그아웃 완료');
        } catch (error) {
          console.error('로그아웃 실패:', error);
          // 서버 로그아웃 실패해도 클라이언트 상태는 초기화
          set({
            isLoggedIn: false,
            user: null,
          });
        }
      },

      updateUser: userData => {
        set(state => ({
          ...state,
          user: userData,
        }));
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
