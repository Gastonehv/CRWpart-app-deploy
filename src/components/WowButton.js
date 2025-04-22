import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Spinner from './Spinner';

const pastelGradients = [
  'linear-gradient(90deg, #eafaf6 0%, #22d3ee 100%)', // aqua
  'linear-gradient(90deg, #eafaf6 0%, #7ee7f6 100%)', // aqua claro
  'linear-gradient(90deg, #eafaf6 0%, #a5f3fc 100%)', // celeste
  'linear-gradient(90deg, #fbeafc 0%, #f0abfc 100%)', // lavanda
  'linear-gradient(90deg, #fdf6e3 0%, #fcd34d 100%)', // amarillo pastel
  'linear-gradient(90deg, #fbeee3 0%, #f9a8d4 100%)', // rosa pastel
  'linear-gradient(90deg, #eafaf6 0%, #22d3ee 100%)', // aqua (repetido para bucle perfecto)
];

const WowButton = React.forwardRef(function WowButton(props, ref) {
  const [isHovered, setIsHovered] = useState(false);
  const { loading, children, disabled, ...rest } = props;

  return (
    <motion.button
      ref={ref}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      animate={{
        background: disabled
          ? 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)' // gris claro Apple style
          : pastelGradients,
        color: disabled ? '#94a3b8' : '#155e75',
        transition: {
          background: { duration: 8, repeat: Infinity, repeatType: 'loop', ease: 'linear' },
        },
      }}
      className={`w-full py-3 px-6 rounded-xl font-semibold text-base shadow-lg tracking-wide transition-all duration-200 border border-aqua-200 focus:ring-2 focus:ring-aqua-300 focus:ring-offset-2 ${disabled ? 'cursor-not-allowed opacity-60' : 'text-aqua-700'} focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2`}
      style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        letterSpacing: '0.03em',
        ...props.style,
      }}
      aria-label={typeof children === 'string' ? children : undefined}
      tabIndex={0}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner size={20} className="mr-2 -ml-1 align-middle" />}
      <span className={loading ? 'opacity-80' : ''}>{children}</span>
    </motion.button>
  );
});

export default WowButton;
