import { StrictMode, useEffect } from 'react';
import './styles/reset.css';
import './styles/common.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/organisms/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { StudyPage } from './pages/StudyPage';
import TestPage from './pages/TestPage';
import FocusPage from './pages/FocusPage';
import { StudyCreatePage } from './pages/StudyCreatePage';
import { StudyModifyPage } from './pages/StudyModifyPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudyDetailPage from './pages/StudyDetailPage';
import HabitPage from './pages/HabitPage';
import { useAuthStore } from './store/authStore';
import ProfilePage from './pages/ProfilePage';

/**
 * 애플리케이션의 루트 React 컴포넌트 — 라우터와 전역 레이아웃을 설정합니다.
 *
 * 렌더링 시 BrowserRouter와 Routes를 구성하여 주요 페이지 경로들을 연결합니다.
 * 초기 마운트 시 localStorage의 'hasLoggedIn' 값이 존재하면 인증 상태 초기화를 위해 useAuthStore의 initialize를 호출합니다.
 *
 * 제공하는 주요 라우트:
 * - / (index): StudyPage
 * - /focus/:id: FocusPage
 * - /test: TestPage
 * - /study/new: StudyCreatePage
 * - /study/:id: StudyDetailPage
 * - /study/:id/modify: StudyModifyPage
 * - /habit/:id: HabitPage
 * - /register: RegisterPage
 * - /login: LoginPage
 * - /profile: ProfilePage
 * - *: NotFoundPage
 *
 * @returns {JSX.Element} 앱의 루트 JSX 요소
 */
export function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // localStorage에 로그인 기록이 있을 때만 initialize 실행
    const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    if (hasLoggedIn) {
      initialize();
    }
  }, [initialize]);

  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StudyPage />} />
            <Route path="/focus/:id" element={<FocusPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/study/new" element={<StudyCreatePage />} />
            <Route path="/study/:id" element={<StudyDetailPage />} />
            <Route path="/study/:id/modify" element={<StudyModifyPage />} />
            <Route path="/habit/:id" element={<HabitPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);
