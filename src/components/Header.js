import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';

export default function Header() {
  const router = useRouter();
  // Si estamos en el dashboard, no mostrar logo (el logo va centrado en esa página)
  const isDashboard = router.pathname === '/dashboard';
  if (isDashboard) {
    return (
      <header className="w-full flex items-center justify-end py-2 px-6 fixed top-0 left-0 z-30 bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-md border-b border-white/20 dark:border-black/30">
        {/* Aquí puedes poner un botón de perfil, menú, etc. */}
        <div className="flex-1" /> {/* Espaciador flexible para separar logo y toggle */}
        {/* El toggle de tema debe ir aquí, alineado a la derecha, lo añado en _app.js para control global */}
      </header>
    );
  }
  return (
    <header className="w-full flex items-center justify-between py-2 px-6 fixed top-0 left-0 z-30 bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-md border-b border-white/20 dark:border-black/30">
      <Link href="/">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
          <Logo />
          <span className="ml-3 text-2xl font-bold tracking-tight text-aqua-700 font-display">CRWapp</span>
        </motion.div>
      </Link>
      <div className="flex-1" /> {/* Espaciador flexible para separar logo y toggle */}
      {/* El toggle de tema debe ir aquí, alineado a la derecha, lo añado en _app.js para control global */}
    </header>
  );
}
