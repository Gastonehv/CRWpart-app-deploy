import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PaqueteDetailModal({ open, onClose, paquete }) {
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [expandedMedia, setExpandedMedia] = useState(null); // null | { type: 'video'|'foto', src: string }
  // Permitir cerrar con Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Recursos de fallback para demo/responsivo
  const fallbackFotos = [
    // Unsplash demo
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    // Giphy gif demo
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    // Pexels party
    'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&w=400',
    // Pixabay celebration
    'https://cdn.pixabay.com/photo/2016/11/29/05/08/adult-1867485_1280.jpg',
    // Freepik event
    'https://img.freepik.com/free-photo/people-partying-nightclub_53876-14685.jpg?w=400',
    // Placeholder
    'https://placekitten.com/400/220',
    'https://placehold.co/400x220/EEE/222?text=Demo+Image',
  ];
  const fallbackVideo = 'https://www.w3schools.com/html/mov_bbb.mp4';
  const fallbackPoster = fallbackFotos[0];

  if (!open || !paquete) return null;

  // Protección: si paquete es null, retorna null (ya cubierto), pero además:
  // Protección: si paquete es null/undefined, usa objeto vacío para destructuring seguro
  const safePaquete = paquete || {};

  const fotos = Array.isArray(safePaquete.fotos) && safePaquete.fotos.length > 0 ? safePaquete.fotos : fallbackFotos;
  const video = safePaquete.video || fallbackVideo;
  const poster = safePaquete.poster || fallbackPoster;

  // Snap scroll para galería
  const galleryStyle = {
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', bounce: 0.28, duration: 0.35 }}
        className="fixed inset-0 z-50 flex flex-col justify-end bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', bounce: 0.28, duration: 0.35 }}
          className="relative w-full max-w-md mx-auto bg-white/90 rounded-t-3xl shadow-2xl px-2 sm:px-5 pt-4 pb-8 overflow-y-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Handle personalizado */}
          <div className="flex justify-center mb-2">
            <div className="w-14 h-2 rounded-full bg-gradient-to-r from-fuchsia-200 via-cyan-200 to-fuchsia-300 shadow" />
          </div>
          {/* X flotante siempre visible */}
          <button
            className="fixed top-3 right-4 w-10 h-10 rounded-full bg-fuchsia-100 text-fuchsia-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-300 flex items-center justify-center z-[60] transition-transform hover:scale-110 hover:shadow-xl"
            style={{ boxShadow: '0 4px 24px #e879f933' }}
            onClick={onClose}
            aria-label="Cerrar detalle"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="#a21caf" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          <div className="flex flex-col items-center gap-3 mt-6">
            {/* Miniatura de video principal */}
            {video && (
              <div className="relative w-full flex justify-center mb-3">
                <motion.div
                  className="w-full max-w-xs cursor-pointer"
                  style={{ borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 8px 32px #a78bfa33', height: 180 }}
                  onClick={() => setExpandedMedia({ type: 'video', src: video })}
                >
                  <img
                    src={poster}
                    alt="Miniatura del video"
                    className="object-cover w-full h-full"
                    style={{ display: 'block', width: '100%', height: 180, borderRadius: 'inherit' }}
                  />
                  {/* Overlay play icon Apple-like */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                      <svg width="38" height="38" fill="none" viewBox="0 0 38 38"><circle cx="19" cy="19" r="18" fill="#fff" opacity="0.7"/><polygon points="15,12 28,19 15,26" fill="#a21caf"/></svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            {/* Galería de fotos (excluye poster si ya se muestra arriba) */}
            {fotos && fotos.length > 0 && (
              <div className="w-full flex gap-2 overflow-x-auto py-2" style={galleryStyle}>
                {fotos.filter(foto => foto !== poster).map((foto, i) => (
                  <div key={i} className="relative flex-shrink-0" style={{ maxWidth: '40vw', minWidth: 80, scrollSnapAlign: 'center' }}>
                    <img
                      src={foto}
                      alt={`Foto ${i + 1}`}
                      className="w-28 h-20 object-cover rounded-xl shadow-md border-2 border-cyan-100 cursor-pointer"
                      onClick={() => setExpandedMedia({ type: 'foto', src: foto })}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* Modal multimedia expandido (foto o video) */}
            <AnimatePresence>
              {expandedMedia && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                  onClick={() => setExpandedMedia(null)}
                  aria-modal="true"
                  role="dialog"
                >
                  <div className="relative max-w-2xl w-full flex items-center justify-center">
                    <button
                      className="absolute top-2 right-2 w-10 h-10 rounded-full bg-fuchsia-100 text-fuchsia-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-300 flex items-center justify-center z-[110] transition-transform hover:scale-110 hover:shadow-xl"
                      style={{ boxShadow: '0 4px 24px #e879f933' }}
                      onClick={e => { e.stopPropagation(); setExpandedMedia(null); }}
                      aria-label="Cerrar multimedia"
                    >
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="#a21caf" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </button>
                    {expandedMedia.type === 'foto' ? (
                      <img src={expandedMedia.src} alt="Foto ampliada" className="rounded-2xl shadow-2xl max-h-[80vh] max-w-full" />
                    ) : (
                      <video src={expandedMedia.src} autoPlay controls loop className="rounded-2xl shadow-2xl max-h-[80vh] max-w-full bg-black" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
