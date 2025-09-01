import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.css';
import './styles/common.css';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/organisms/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { MainPage } from './pages/MainPage';
import { StudyPage } from './pages/StudyPage';
import TestPage from './pages/TestPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/test" element={<TestPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
