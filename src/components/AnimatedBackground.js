import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// Generador de degradados pastel alegres, random y orgánicos
function randomPastelGradient() {
  // Tonos pastel alegres: aqua, azul, lavanda, rosa, verde, amarillo, durazno, lila, menta, coral, celeste, etc.
  const pastelColors = [
    '#e3eafc', // azul pastel
    '#eafaf6', // aqua pastel
    '#fbeafc', // rosa pastel
    '#f6f7fb', // blanco azulado
    '#fdf6e3', // amarillo pastel
    '#f6fbe3', // verde lima pastel
    '#e3f6fb', // celeste
    '#fbeee3', // durazno
    '#e9e3fb', // lila
    '#e3fbf6', // menta
    '#fbe3e7', // coral suave
    '#f7e3fb', // lavanda
    '#e3fbe7', // verde menta
    '#f7fbe3', // amarillo muy pálido
  ];
  // Elige 2 o 3 colores random distintos
  const pick = () => pastelColors[Math.floor(Math.random() * pastelColors.length)];
  let c1 = pick(), c2 = pick(), c3 = pick();
  // Asegura que no sean iguales
  while (c2 === c1) c2 = pick();
  while (c3 === c1 || c3 === c2) c3 = pick();
  // Ángulo random para organicidad
  const angle = 120 + Math.floor(Math.random() * 120);
  return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
}

const TRANSITION_DURATION = 8; // segundos por transición

export default function AnimatedBackground() {
  // El primer degradado se genera SOLO en el cliente para evitar errores de hidratación
  const [gradient, setGradient] = React.useState(null);
  const [nextGradient, setNextGradient] = React.useState(null);
  const [showNext, setShowNext] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  // Solo genera el gradiente después del montaje (cliente)
  React.useEffect(() => {
    setGradient(randomPastelGradient());
  }, []);

  // Parallax handler
  React.useEffect(() => {
    function handleMove(e) {
      let x = 0, y = 0;
      if (e.touches && e.touches.length) {
        x = e.touches[0].clientX / window.innerWidth;
        y = e.touches[0].clientY / window.innerHeight;
      } else {
        x = e.clientX / window.innerWidth;
        y = e.clientY / window.innerHeight;
      }
      setOffset({ x: (x - 0.5) * 30, y: (y - 0.5) * 30 });
    }
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  React.useEffect(() => {
    // Programa el siguiente degradado random
    const timeout = setTimeout(() => {
      setNextGradient(randomPastelGradient());
      setShowNext(true);
    }, TRANSITION_DURATION * 1000);
    return () => clearTimeout(timeout);
  }, [gradient]);

  React.useEffect(() => {
    if (!showNext) return;
    const timeout = setTimeout(() => {
      setGradient(nextGradient);
      setShowNext(false);
      setNextGradient(null);
    }, 2000); // Duración del fundido
    return () => clearTimeout(timeout);
  }, [showNext, nextGradient]);

  const parallaxStyle = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`
  };

  if (!gradient) return null;

  return (
    <>
      <motion.div
        key={gradient}
        className="absolute inset-0 -z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: showNext ? 0 : 1 }}
        transition={{ opacity: { duration: 2 } }}
        style={{
          background: gradient,
          filter: 'blur(0.5px)',
          transition: `background ${TRANSITION_DURATION}s cubic-bezier(.4,0,.2,1)`,
          ...parallaxStyle
        }}
      />
      {showNext && nextGradient && (
        <motion.div
          key={nextGradient}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ opacity: { duration: 2 } }}
          style={{
            background: nextGradient,
            filter: 'blur(0.5px)',
            transition: `background ${TRANSITION_DURATION}s cubic-bezier(.4,0,.2,1)`,
            ...parallaxStyle
          }}
        />
      )}
    </>
  );
}
