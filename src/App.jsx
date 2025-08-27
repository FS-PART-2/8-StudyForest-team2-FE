import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/organisms/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { MainPage } from './pages/MainPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;