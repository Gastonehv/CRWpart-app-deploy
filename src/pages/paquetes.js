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
        '/demo-media/demo-foto1.jpg',
        '/demo-media/demo-foto2.jpg',
      ],
      video: '/demo-media/demo-video1.mp4',
      poster: '/demo-media/demo-foto2.jpg',
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6e6ff] to-[#fff9d7] overflow-hidden pt-6 sm:pt-10">
      <main className="pt-6 sm:pt-10 w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10 flex flex-col gap-7">
        <div className="flex flex-col items-center mb-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-100 to-purple-100 shadow-lg mb-2 animate-bounce-slow">
            {/* Ícono premium de ticket de fiesta */}
            <svg width="34" height="34" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="7" width="18" height="13" rx="3" fill="#a78bfa" fillOpacity="0.13" stroke="#a21caf" strokeWidth="1.5"/>
              <path d="M6.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm7.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fill="#a21caf"/>
              <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" stroke="#a21caf" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <h1 className="text-3xl font-extrabold text-center mb-2 text-blue-800">Compra de paquetes</h1>
        </div>
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-600">Cargando paquetes...</div>
        ) : error ? (
          <div className="text-center py-12 text-lg text-red-500">{error}</div>
        ) : paquetes.length === 0 ? (
          <div className="text-center py-12 text-lg text-gray-500">No hay paquetes activos disponibles en este momento.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {paquetes.map((p, idx) => (
              <div key={p.nombre} className="rounded-2xl premium-shadow bg-white p-4 mb-6 flex flex-col gap-2 border border-purple-100 hover:border-blue-400 transition-all">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{p.icono}</span>
                  <span className="text-lg font-extrabold text-purple-700">{p.nombre}</span>
                  <span className="ml-auto text-xl font-bold text-green-600">${p.precio}</span>
                  <button
                    className="ml-2 px-2 py-1 rounded-lg bg-gradient-to-r from-fuchsia-100 to-cyan-100 text-fuchsia-700 font-bold text-xs shadow focus:outline-none focus:ring-2 focus:ring-fuchsia-200 hover:scale-105 transition"
                    aria-label={`Ver detalles de ${p.nombre}`}
                    onClick={() => setDetallePaquete(p)}
                  >
                    {/* Ícono de información "i" premium */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2" fill="#f3e8ff"/>
                      <text x="12" y="16" textAnchor="middle" fontSize="13" fontFamily="sans-serif" fill="#a78bfa" fontWeight="bold">i</text>
                    </svg>
                  </button>
                </div>
                <div className="mb-1 text-gray-700 italic text-sm">{p.descripcion}</div>
                <ul className="list-disc ml-6 text-gray-600 text-xs mb-1">
                  {p.beneficios.map((b,i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-6">
          <PaqueteSelector paquetes={paquetes} onChange={handleSelector} />
          <div className="flex flex-col gap-2">
            <label className="block font-semibold mb-1 text-gray-700">¿Para qué festejo es la compra?</label>
            <select
              className="w-full rounded-xl border border-purple-200 px-4 py-3 text-base text-gray-700 bg-white/80 shadow focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all outline-none"
              value={festejo}
              onChange={e => setFestejo(e.target.value)}
            >
              <option value="">Selecciona un festejo</option>
              {festejosEjemplo.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nombre} - {f.fecha}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition disabled:opacity-60"
          disabled={total === 0 || !festejo}
        >
          Comprar
        </button>
        {total === 0 && <div className="text-center text-red-500 mt-2">Selecciona al menos un paquete para continuar.</div>}
        {!festejo && <div className="text-center text-orange-500 mt-2">Selecciona un festejo para asociar la compra.</div>}
      </main>
      <PaqueteDetailModal open={!!detallePaquete} onClose={() => setDetallePaquete(null)} paquete={detallePaquete} />
      <BotonHome />
    </div>
  );
};

export default PaquetesPage;
