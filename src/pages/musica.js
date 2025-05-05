import { useState, useEffect, useRef } from 'react';
import useFestejos from '../hooks/useFestejos';
import { supabase } from '../lib/supabaseClient';
import BotonHome from '../components/BotonHome';
import CustomSelect from '../components/CustomSelect';
import { motion } from 'framer-motion';

const FESTIVE_PLAYLISTS = [
  {
    name: 'Fusión Electrónica',
    desc: 'Beats modernos y sofisticados para animar la pista.',
    gradient: 'linear-gradient(90deg,#a78bfa,#38bdf8,#a3e635)',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M18 3v12.18A3 3 0 1 0 20 18V7h2V3h-4ZM6 5v10.18A3 3 0 1 0 8 18V7h2V5H6Z" fill="#38bdf8"/></svg>
    ),
  },
  {
    name: 'Lounge Chic',
    desc: 'Sonidos elegantes para un ambiente premium y relajado.',
    gradient: 'linear-gradient(90deg,#f472b6,#a78bfa,#38bdf8)',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#a78bfa" opacity="0.6"/><path d="M8 14s1.5-2 4-2 4 2 4 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
  },
  {
    name: 'Pop Moderno',
    desc: 'Hits actuales para celebrar a lo grande.',
    gradient: 'linear-gradient(90deg,#38bdf8,#f472b6,#a3e635)',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#f472b6" opacity="0.7"/><path d="M9 15l6-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
  },
  {
    name: 'Fiesta Selecta',
    desc: 'Curaduría exclusiva para eventos inolvidables.',
    gradient: 'linear-gradient(90deg,#a3e635,#a78bfa,#38bdf8)',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22" fill="#a3e635" opacity="0.7"/><circle cx="12" cy="17" r="2" fill="#fff"/></svg>
    ),
  },
];

const PAQUETES = [
  {
    nombre: 'Flow Total',
    icono: '💎',
    descripcion: 'Todo el ambiente premium: decoración, luces, y acceso VIP para ti y tus invitados.',
    beneficios: ['Decoración temática premium', 'Luces inteligentes y efectos', 'Zona VIP exclusiva', 'Staff de apoyo dedicado'],
    precio: 3999,
  },
  {
    nombre: 'Summer Pool',
    icono: '🏊‍♂️',
    descripcion: 'Ideal para pool parties: inflables, barra de bebidas, música y más.',
    beneficios: ['Inflables y flotadores de diseño', 'Barra de bebidas refrescante', 'DJ set con playlist premium', 'Toallas y amenities premium'],
    precio: 2999,
  },
  {
    nombre: 'Kids Party',
    icono: '🎈',
    descripcion: 'Diversión asegurada para los más pequeños con animadores y juegos.',
    beneficios: ['Animadores profesionales', 'Juegos y actividades', 'Mesa de dulces', 'Regalos sorpresa'],
    precio: 2499,
  },
];

export default function Musica() {
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
      setCurrentUserId(data?.user?.id || "NO_AUTH");
    });
  }, []);
  const { festejos, loading } = useFestejos(user?.id);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [playlist, setPlaylist] = useState('');
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const bgRef = useRef(null);
  const [cantidades, setCantidades] = useState([0, 0, 0]);
  const [musicaFavorita, setMusicaFavorita] = useState(['', '', '', '', '']);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      let x = 0, y = 0;
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        x = (touch.clientX / window.innerWidth - 0.5) * 32;
        y = (touch.clientY / window.innerHeight - 0.5) * 32;
      } else {
        x = (e.clientX / window.innerWidth - 0.5) * 32;
        y = (e.clientY / window.innerHeight - 0.5) * 32;
      }
      setParallax({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  // Cargar la música guardada al seleccionar evento
  useEffect(() => {
    if (!selectedEvent) return;
    setIsModified(false);
    supabase
      .from('festejos')
      .select('musica_favorita')
      .eq('id', selectedEvent)
      .single()
      .then(({ data, error }) => {
        if (!error && data && Array.isArray(data.musica_favorita)) {
          // Rellenar hasta 5 valores
          const arr = data.musica_favorita.concat(Array(5).fill('')).slice(0, 5);
          setMusicaFavorita(arr);
        } else {
          setMusicaFavorita(['', '', '', '', '']);
        }
      });
  }, [selectedEvent]);

  // Función para deseleccionar playlist
  const handlePlaylistClick = (name) => {
    if (playlist === name) setPlaylist('');
    else setPlaylist(name);
  };

  function handleCantidad(idx, val) {
    const next = cantidades.slice();
    next[idx] = Math.max(0, val);
    setCantidades(next);
  }

  // Calcula el total de paquetes y el monto total
  const totalPaquetes = cantidades.reduce((a, b) => a + b, 0);
  const totalMonto = cantidades.reduce((sum, cant, idx) => sum + cant * PAQUETES[idx].precio, 0);

  const maxRenglones = 5;

  useEffect(() => {
    if (musicaFavorita.length !== maxRenglones) {
      setMusicaFavorita((prev) => prev.slice(0, maxRenglones).concat(Array(maxRenglones).fill('')).slice(0, maxRenglones));
    }
  }, [musicaFavorita]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#b8f3ff] to-[#d7ffe7] overflow-hidden pt-2 sm:pt-4 pb-6">
      <div className="flex flex-col items-center mb-8 mt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex items-center justify-center w-36 h-36 relative p-0"
        >
          <img src="/logo.png" alt="CRW party logo" className="w-[97%] h-[97%] object-contain p-0 m-0" style={{ zIndex: 2 }} />
          <div className="absolute inset-0 rounded-2xl shadow-[0_0_28px_5px_rgba(167,139,250,0.16)] pointer-events-none" style={{ zIndex: 1 }} />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-center mb-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Música</h1>
      </div>
      {/* HEADER BLOQUE BLANCO */}
      <div className="w-full max-w-xs mx-auto flex flex-col items-center">
        <div className="bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-6 w-full flex flex-col items-center">
          <p className="text-base text-gray-700 text-center mb-0">Selecciona tu evento para elegir la playlist perfecta y marcar el ritmo de la noche.</p>
        </div>
        {/* SELECT EVENTO */}
        <div id="bloque-select-evento" className="bg-white/90 rounded-3xl shadow-2xl px-4 py-6 mb-10 w-full flex flex-col items-center max-w-xs mx-auto">
          <CustomSelect
            options={
              [{ value: '', label: 'Selecciona un evento', disabled: true }].concat(
                (festejos || []).map(f => ({ value: f.id, label: f.titulo || f.nombre_festejo || 'Sin título' }))
              )
            }
            value={selectedEvent}
            onChange={val => setSelectedEvent(val)}
            label={"Selecciona tu evento:"}
            dropdownWidthClass="max-w-xs w-full"
            alignLeft={true}
          />
        </div>
        {/* INPUTS DE MÚSICA */}
        {selectedEvent && (
          <div className="bg-white/90 rounded-3xl shadow-2xl px-4 py-6 mb-8 w-full flex flex-col items-center">
            <div className="font-bold text-xl text-center text-blue-900 mb-4">Música para: {festejos.find(f => f.id === selectedEvent)?.titulo || festejos.find(f => f.id === selectedEvent)?.nombre_festejo || 'Sin título'}</div>
            {musicaFavorita.slice(0, maxRenglones).map((cancion, index) => (
              <div key={index} className="mb-4 w-full flex flex-col items-center">
                <label className="block text-base font-semibold text-gray-700 mb-1 text-center">Canción o género favorito #{index+1}</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-blue-100 shadow focus:ring-2 focus:ring-blue-300 bg-white/80 text-gray-700 text-base text-center"
                  value={cancion || ''}
                  onChange={e => {
                    const nuevas = [...musicaFavorita];
                    nuevas[index] = e.target.value;
                    setMusicaFavorita(nuevas);
                    setIsModified(true);
                  }}
                  maxLength={50}
                />
              </div>
            ))}
            <button
              className={`w-full mt-4 py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-200 ${isModified ? 'bg-gradient-to-r from-cyan-400 to-green-400 text-white hover:from-cyan-500 hover:to-green-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={!isModified || isSaving}
              onClick={async () => {
                setIsSaving(true);
                setSaveStatus("");
                if (!selectedEvent) {
                  setSaveStatus('No hay evento seleccionado.');
                  setIsSaving(false);
                  return;
                }
                // Al menos un valor no vacío
                const tieneMusica = musicaFavorita.some(m => m && m.trim() !== '');
                if (!tieneMusica) {
                  setSaveStatus('Debes ingresar al menos una canción o género.');
                  setIsSaving(false);
                  return;
                }
                setSaveStatus('Guardando...');
                const { error } = await supabase
                  .from('festejos')
                  .update({ musica_favorita: musicaFavorita.slice(0, maxRenglones) })
                  .eq('id', selectedEvent);
                if (!error) {
                  setIsModified(false);
                  setSaveStatus('¡Lista musical guardada con éxito!');
                  // Refresca para mostrar lo guardado
                  supabase
                    .from('festejos')
                    .select('musica_favorita')
                    .eq('id', selectedEvent)
                    .single()
                    .then(({ data, error }) => {
                      if (!error && data && Array.isArray(data.musica_favorita)) {
                        const arr = data.musica_favorita.concat(Array(maxRenglones).fill('')).slice(0, maxRenglones);
                        setMusicaFavorita(arr);
                      }
                    });
                } else {
                  setSaveStatus('Error al guardar la lista musical: ' + error.message);
                }
                setIsSaving(false);
              }}
            >
              {isSaving ? 'Guardando...' : 'Confirmar y guardar lista musical'}
            </button>
          </div>
        )}
      </div>
      <BotonHome className="fixed bottom-6 right-6 z-50 animate-float shadow-xl" />
    </div>
  );
}
