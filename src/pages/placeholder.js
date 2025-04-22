import AnimatedBackground from '../components/AnimatedBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Placeholder({ icon, title, description, cta, ctaHref }) {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden bg-white">
      <AnimatedBackground />
      <main className="z-10 w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex flex-col items-center">
          <span className="text-6xl mb-4">{icon}</span>
          <h2 className="text-2xl font-extrabold text-gray-700 mb-2 text-center font-display">{title}</h2>
          <p className="text-lg text-gray-500 mb-6 text-center max-w-sm">{description}</p>
          {cta && ctaHref && (
            <Link href={ctaHref} passHref legacyBehavior>
              <a className="px-6 py-3 rounded-xl bg-aqua-100 text-aqua-700 font-bold text-base shadow hover:scale-105 transition-all">{cta}</a>
            </Link>
          )}
          <Link href="/dashboard" passHref legacyBehavior>
            <a className="mt-8 text-aqua-600 underline">Volver al dashboard</a>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
