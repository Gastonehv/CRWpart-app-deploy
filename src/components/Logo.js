// Logo original de la app
// Usa el archivo logo.png de la carpeta public

import { motion } from 'framer-motion';
import React from 'react';

const glowColors = [
  '#a259ff', // violeta
  '#00e0ff', // aqua
  '#ff6b00', // naranja
  '#ffe600', // amarillo
  '#ff43c0', // rosa
];

function getRandomGlow() {
  const color = glowColors[Math.floor(Math.random() * glowColors.length)];
  const blur = 80 + Math.random() * 60; // Más blur
  const spread = 36 + Math.random() * 28; // Más grande
  return `0 0 ${blur}px ${spread}px ${color}cc`;
}

export default function Logo() {
  const [shadow, setShadow] = React.useState(getRandomGlow());
  React.useEffect(() => {
    let raf;
    let running = true;
    function animateGlow() {
      setShadow(getRandomGlow());
      if (running) raf = setTimeout(animateGlow, 900 + Math.random() * 900);
    }
    animateGlow();
    return () => { running = false; clearTimeout(raf); };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          width: '100%',
          height: '100%',
          filter: 'blur(0.5px)',
          borderRadius: 0,
        }}
        animate={{
          boxShadow: shadow,
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
      />
      <img
        src="/logo.png"
        alt="Logo CRWapp"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: '88px', // Tamaño responsivo, ajustable
          maxHeight: '88px',
          objectFit: 'contain',
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          zIndex: 2,
          position: 'relative',
          boxShadow: 'none',
        }}
        className="bg-transparent shadow-none border-none p-0 m-0"
      />
    </div>
  );
}
