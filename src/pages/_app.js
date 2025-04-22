import '../styles/globals.css';
import '../styles/custom.css';
import '../styles/landing-art.css';
import { useEffect } from 'react';

// import ThemeToggle from '../components/ThemeToggle';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <Component {...pageProps} />
  );
}
