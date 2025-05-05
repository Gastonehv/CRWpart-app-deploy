import AnimatedBackground from '../components/AnimatedBackground';
import WowButton from '../components/WowButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center mb-8">
        <Logo />
        <h1 className="text-4xl font-extrabold text-center mb-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>CRW Party</h1>
        <p className="text-lg text-gray-200 text-center mb-4">Organiza, invita y celebra fiestas inolvidables.<br />Plataforma moderna, segura y fácil de usar.</p>
        <div className="flex gap-4">
          <Link href="/auth/login" passHref legacyBehavior>
            <a className="dashboard-btn px-6 py-2 text-lg" aria-label="Iniciar sesión">Iniciar sesión</a>
          </Link>
          <Link href="/auth/register" passHref legacyBehavior>
            <a className="dashboard-btn px-6 py-2 text-lg" aria-label="Crear cuenta">Crear cuenta</a>
          </Link>
        </div>
      </div>
      <style jsx global>{`
        .dashboard-btn {
          background: linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-position 0.2s ease-in-out;
        }
        .dashboard-btn:hover {
          background-position: 100% 0;
        }
      `}</style>
    </div>
  );
}
