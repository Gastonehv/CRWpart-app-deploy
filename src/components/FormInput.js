import { motion } from 'framer-motion';

const pastelShadows = [
  '#22d3ee55', // aqua
  '#7ee7f688', // aqua claro
  '#a5f3fc66', // celeste
  '#f0abfc55', // lavanda
  '#fcd34d66', // amarillo pastel
  '#f9a8d455', // rosa pastel
];
function getRandomShadow() {
  const idx = Math.floor(Math.random() * pastelShadows.length);
  return `0 0 0 3px ${pastelShadows[idx]}, 0 1px 8px #7ee7f655`;
}

export default function FormInput({ label, type, value, onChange, error, optional, ...props }) {
  return (
    <div className="mb-8">
      <label className="block text-base font-semibold mb-2 text-gray-700 dark:text-gray-200 tracking-wide">
        {label} {optional && <span className="text-xs text-gray-400 dark:text-gray-300">(opcional)</span>}
      </label>
      <motion.input
        whileFocus={{ scale: 1.03, boxShadow: getRandomShadow() }}
        className={`w-full px-5 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 border focus:outline-none transition-all text-base shadow-md backdrop-blur-md
          ${error ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'}
          text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500
        `}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 mt-2 text-sm font-semibold">{error}</motion.div>}
    </div>
  );
}
