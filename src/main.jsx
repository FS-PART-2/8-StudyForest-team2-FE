import { StrictMode, useEffect } from 'react';
import './styles/reset.css';
import './styles/common.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/organisms/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { StudyPage } from './pages/StudyPage';
// import TestPage from './pages/TestPage'; // 프로덕션에서 제거
import FocusPage from './pages/FocusPage';
import { StudyCreatePage } from './pages/StudyCreatePage';
import { StudyModifyPage } from './pages/StudyModifyPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudyDetailPage from './pages/StudyDetailPage';
import HabitPage from './pages/HabitPage';
import { useAuthStore } from './store/authStore';
import ProfilePage from './pages/ProfilePage';

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
            <Route path="/focus" element={<FocusPage />} />
            {/* <Route path="/test" element={<TestPage />} /> 프로덕션에서 제거 */}
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

// React 18 createRoot 중복 호출 방지
const rootElement = document.getElementById('root');
if (rootElement && !rootElement._reactRoot) {
  const root = createRoot(rootElement);
  rootElement._reactRoot = root;
  root.render(<App />);
} else if (rootElement && rootElement._reactRoot) {
  rootElement._reactRoot.render(<App />);
}
