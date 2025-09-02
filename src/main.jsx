import { StrictMode } from 'react';
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudyPage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/test" element={<TestPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
