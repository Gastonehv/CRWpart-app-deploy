import AnimatedBackground from '../components/AnimatedBackground';
import WowButton from '../components/WowButton';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden bg-white">
      <div className="animated-bg">
        <div className="bubble bubble1"></div>
        <div className="bubble bubble2"></div>
        <div className="bubble bubble3"></div>
      </div>
      <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-white/70 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="logo-glow mb-4 flex justify-center">
            <img src="/logo.png" alt="Logo CRWapp" style={{height: '6rem', width: 'auto', display: 'block', maxWidth: '90vw'}} />
          </div>
          <div
            className="slogan text-center font-extrabold text-2xl mb-2 text-purple-800 drop-shadow-lg"
            style={{
              color: '#4c1d95',
              letterSpacing: '0.04em',
              textShadow: '0 2px 8px #e0e7ef, 0 1px 0 #fff'
            }}
          >
            Celebra fácil. Celebra a tu manera.
          </div>
          <h1
            className="text-4xl font-extrabold mb-2 font-display text-center animated-gradient-home"
          >
            Bienvenido a CRWapp
          </h1>
          <p className="text-lg text-gray-500 mb-6 text-center max-w-sm" style={{fontSize: '1.18rem'}}>
            Organiza, invita y celebra con estilo. Una experiencia única, moderna y fácil de usar.
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <Link href="/auth/login" passHref legacyBehavior>
            <a className="btn-accent text-center py-3 text-lg font-bold">Iniciar sesión</a>
          </Link>
          <Link href="/auth/register" passHref legacyBehavior>
            <a className="btn-accent text-center py-3 text-lg font-bold">Crear cuenta</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
