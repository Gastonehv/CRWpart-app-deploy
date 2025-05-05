import { motion } from 'framer-motion';

const pastelShadows = [
  '#22d3ee88', // aqua
  '#7ee7f6bb', // aqua claro
  '#a5f3fc99', // celeste
  '#f0abfc88', // lavanda
  '#fcd34d77', // amarillo pastel
  '#f9a8d488', // rosa pastel
];

function getRandomShadow() {
  const idx = Math.floor(Math.random() * pastelShadows.length);
  return `0 2px 8px ${pastelShadows[idx]}, 0 1px 4px #22d3ee22`;
}

export default function FloatingActionButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08, boxShadow: getRandomShadow(), rotate: 5 }}
      whileTap={{ scale: 0.93, rotate: -5 }}
      className="fixed bottom-8 right-6 z-50 bg-gradient-to-br from-aqua-200 via-pink-100 to-yellow-100 text-aqua-700 rounded-full shadow-xl p-5 flex items-center justify-center transition-all hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2 border-2 border-aqua-300"
      style={{
        boxShadow: getRandomShadow(),
        transition: 'box-shadow 0.5s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1)',
      }}
      aria-label="Nuevo festejo"
      tabIndex={0}
    >
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{minWidth:'28px',minHeight:'28px'}} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </motion.button>
  );
}
