import AnimatedBackground from '../../components/AnimatedBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RegisterType() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden bg-white">
      <AnimatedBackground />
      <main className="z-10 w-full max-w-md mx-auto px-4 py-12 flex flex-col items-center">
        <motion.img
          src="/logo.svg"
          alt="CRW party logo"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring' }}
          className="w-28 h-28 mb-6 drop-shadow-xl rounded-3xl bg-white/30 p-2"
          style={{ objectFit: 'contain' }}
        />
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl font-extrabold text-gray-700 mb-4 text-center font-display">
          ¿Cómo quieres registrarte?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mb-8 text-center text-gray-500">
          Elige tu rol para vivir la mejor experiencia CRW Party:
        </motion.p>
        <div className="grid gap-6 w-full">
          <Link href="/auth/register?type=festejado" passHref legacyBehavior>
            <a className="block w-full py-5 rounded-2xl bg-aqua-100 text-aqua-700 font-bold text-xl shadow-lg hover:scale-105 transition-all text-center border border-aqua-200">
              🎉 Soy festejado/a
              <div className="text-base font-normal text-gray-600 mt-2">Quiero celebrar mi festejo y organizar mi evento</div>
            </a>
          </Link>
          <Link href="/auth/register?type=invitado" passHref legacyBehavior>
            <a className="block w-full py-5 rounded-2xl bg-white/90 text-aqua-700 font-bold text-xl shadow-lg hover:scale-105 transition-all text-center border border-aqua-100">
              🙌 Soy invitado/a
              <div className="text-base font-normal text-gray-600 mt-2">Solo asistiré a una fiesta, sin organizar evento</div>
            </a>
          </Link>
        </div>
        <Link href="/auth/login" passHref legacyBehavior>
          <a className="mt-10 text-aqua-600 underline">¿Ya tienes cuenta? Inicia sesión</a>
        </Link>
      </main>
    </div>
  );
}
