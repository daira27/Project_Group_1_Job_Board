import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function AppLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // Move keyboard and screen reader focus to the new page after navigation.
  useEffect(() => {
    const heading = mainRef.current.querySelector('h1');
    document.title = heading ? `${heading.textContent} | Online Job Portal` : 'Online Job Portal';
    mainRef.current.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main className="container page-content" id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
