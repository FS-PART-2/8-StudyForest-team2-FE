import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer year={2025} teamName="부캠 2소대" />
    </>
  );
}
