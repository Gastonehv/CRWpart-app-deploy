import '../styles/globals.css';
import '../styles/custom.css';
import '../styles/landing-art.css';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

// import ThemeToggle from '../components/ThemeToggle';

function useAutoLogoutOnUserDeleted() {
  const router = useRouter();
  useEffect(() => {
    let interval = setInterval(async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (user) {
        // Verifica si el usuario sigue existiendo en la tabla de perfiles (puedes cambiar a otra tabla si lo deseas)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        if (error || !profile) {
          await supabase.auth.signOut();
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/auth/login?logout=deleted';
        }
      }
    }, 10000); // Chequea cada 10 segundos
    return () => clearInterval(interval);
  }, [router]);
}

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);
  useAutoLogoutOnUserDeleted();
  return (
    <Component {...pageProps} />
  );
}
