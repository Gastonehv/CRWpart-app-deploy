import AnimatedBackground from '../components/AnimatedBackground';
import { motion } from 'framer-motion';
import WowButton from '../components/WowButton';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import PaqueteSelector from '../components/PaqueteSelector';
import BotonHome from '../components/BotonHome';
import PaqueteDetailModal from '../components/PaqueteDetailModal';

const PaquetesPage = () => {
  const [cantidades, setCantidades] = useState([0,0,0]);
  const [total, setTotal] = useState(0);
  const [festejo, setFestejo] = useState(''); // Aquí luego se puede asociar festejo
  const [detallePaquete, setDetallePaquete] = useState(null);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PAQUETES DEMO FIJOS PARA MODO VISUAL/DEMO
  const PAQUETES_DEMO = [
    {
      nombre: 'Flow Total',
      icono: '💎',
      descripcion: 'Todo el ambiente premium: decoración, luces, y acceso VIP para ti y tus invitados.',
      beneficios: [
        'Decoración temática premium',
        'Luces inteligentes y efectos',
        'Zona VIP exclusiva',
        'Staff de apoyo dedicado',
      ],
      precio: 3999,
      fotos: [
        '/paquetes/paquete1.png',
      ],
      video: '',
      poster: '/paquetes/paquete1.png',
    },
    {
      nombre: 'Summer Pool',
      icono: '🏊‍♂️',
      descripcion: 'Ideal para pool parties: inflables, barra de bebidas, música y más.',
      beneficios: [
        'Inflables y flotadores de diseño',
        'Barra de bebidas refrescante',
        'DJ set con playlist premium',
        'Toallas y amenities premium',
      ],
      precio: 2999,
      fotos: [
        '/demo-media/demo-foto2.jpg',
        '/demo-media/demo-foto1.jpg',
      ],
      video: '/demo-media/demo-video1.mp4',
      poster: '/demo-media/demo-foto1.jpg',
    },
    {
      nombre: 'Party Starter',
      icono: '🎉',
      descripcion: 'Lo esencial para arrancar tu festejo con flow y cero estrés.',
      beneficios: [
        'Kit de bienvenida para invitados',
        'Snacks y bebidas básicas',
        'Decoración minimalista',
        'Soporte en la organización',
      ],
      precio: 1599,
      fotos: [
        '/demo-media/demo-foto1.jpg',
        '/demo-media/demo-foto2.jpg',
      ],
      video: '/demo-media/demo-video1.mp4',
      poster: '/demo-media/demo-foto2.jpg',
    },
  ];

  useEffect(() => {
    setPaquetes(PAQUETES_DEMO);
  }, []);

  function handleSelector(nextCantidades, nextTotal) {
    setCantidades(nextCantidades);
    setTotal(nextTotal);
  }

  // Ejemplo de festejos para asociar la compra (luego se conecta a Supabase)
  const festejosEjemplo = [
    { id: 'f1', nombre: 'Proyecto XX', fecha: '2025-11-22' },
    { id: 'f2', nombre: 'Fiesta de Gael', fecha: '2025-08-09' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#e6e6ff] to-[#fff9d7] overflow-hidden pt-2 sm:pt-4 pb-6">
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
        <h1 className="text-3xl font-extrabold text-center mb-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Paquetes</h1>
      </div>
      {/* HEADER BLOQUE BLANCO */}
      <div className="w-full max-w-xs mx-auto flex flex-col items-center">
        <div className="bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-6 w-full flex flex-col items-center">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-purple-600 font-display">Catálogo</h2>
          <p className="text-base text-gray-700 text-center mb-0">Selecciona el paquete ideal para tu evento y descubre todos los beneficios.</p>
        </div>
        {/* LISTA DE PAQUETES */}
        {paquetes && paquetes.length > 0 ? (
          paquetes.map((paquete, idx) => (
            <div key={idx} className="bg-white/90 rounded-3xl shadow-2xl px-4 py-6 mb-6 w-full flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 w-full justify-center">
                <span className="text-2xl">{paquete.icono}</span>
                <span className="text-lg font-bold text-purple-600 text-center">{paquete.nombre}</span>
                <span className="ml-auto text-lg font-extrabold text-green-500">${paquete.precio}</span>
              </div>
              <div className="text-gray-700 text-sm mb-2 text-center w-full">{paquete.descripcion}</div>
              <ul className="list-disc pl-5 text-gray-600 text-xs mb-2 w-full">
                {paquete.beneficios.map((b, i) => (
                  <li key={i} className="text-center w-full">{b}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-6 w-full flex flex-col items-center justify-center text-gray-400">
            No hay paquetes disponibles.
          </div>
        )}
        {/* SELECCIÓN DE PAQUETES Y COMPRA */}
        <div className="w-full flex flex-col items-center">
          <PaqueteSelector paquetes={paquetes} onChange={handleSelector} />
          <div className="flex flex-col gap-2 w-full mt-4">
            <label className="block font-semibold mb-1 text-gray-700 text-center">¿Para qué festejo es la compra?</label>
            <select
              className="w-full rounded-xl border border-purple-200 px-4 py-3 text-base text-gray-700 bg-white/80 shadow focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none text-left"
              value={festejo}
              onChange={e => setFestejo(e.target.value)}
            >
              <option value="">Selecciona un festejo</option>
              {festejosEjemplo.map(f => (
                <option key={f.id} value={f.id} className="text-left">
                  {f.nombre} - {f.fecha}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition disabled:opacity-60"
          disabled={total === 0 || !festejo}
        >
          Comprar
        </button>
        {total === 0 && <div className="text-center text-red-500 mt-2">Selecciona al menos un paquete para continuar.</div>}
        {!festejo && <div className="text-center text-orange-500 mt-2">Selecciona un festejo para asociar la compra.</div>}
      </div>
      <PaqueteDetailModal open={!!detallePaquete} onClose={() => setDetallePaquete(null)} paquete={detallePaquete} />
      <BotonHome />
    </div>
  );
};

export default PaquetesPage;
