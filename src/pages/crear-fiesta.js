import { useState, useEffect } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import WowButton from '../components/WowButton';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { getDisplayName } from '../lib/getDisplayName';
import useFestejos from '../hooks/useFestejos';
import BotonHome from '../components/BotonHome';

const paquetes = [
  { nombre: 'Flow Total', icono: '💎', descripcion: 'Decoración premium, luces y acceso VIP.', precio: 3999 },
  { nombre: 'Summer Pool', icono: '🏊‍♂️', descripcion: 'Pool party: inflables, barra y DJ.', precio: 2999 },
  { nombre: 'Party Starter', icono: '🎉', descripcion: 'Lo esencial para arrancar tu festejo.', precio: 1599 },
];

const musica = [
  { id: 1, nombre: 'Happy', artista: 'Pharrell Williams', genero: 'Pop' },
  { id: 2, nombre: 'Uptown Funk', artista: 'Mark Ronson ft. Bruno Mars', genero: 'Funk' },
  { id: 3, nombre: 'Can\'t Stop the Feeling!', artista: 'Justin Timberlake', genero: 'Pop' },
];

export default function CrearFestejo() {
  const [form, setForm] = useState({
    nombre: '',
    fecha: '',
    paquete: '',
    notas: '',
    cantidades: [0, 0, 0],
  });
  const [logoUrl, setLogoUrl] = useState('');
  const [estado, setEstado] = useState('borrador'); // borrador | pendiente_pago | creado
  const [guardado, setGuardado] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const { festejos, loading: loadingFestejos, error: errorFestejos } = useFestejos(currentUserId);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;
      setUser(user);
      setCurrentUserId(user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error) setProfile(data);
    }
    fetchProfile();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const puedeCrearMasEventos = () => {
    if (profile?.rol === 'admin' || profile?.rol === 'staff') return true;
    if (!festejos || !Array.isArray(festejos)) return true;
    if (!form.fecha) return true;
    const fechaNueva = new Date(form.fecha);
    const año = fechaNueva.getFullYear();
    const semana = getWeekNumber(fechaNueva);
    const eventosEstaSemana = festejos.filter(f => {
      if (!f.fecha_tentativa) return false;
      const fechaExistente = new Date(f.fecha_tentativa);
      return fechaExistente.getFullYear() === año && getWeekNumber(fechaExistente) === semana;
    });
    return eventosEstaSemana.length < 2;
  };

  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }

  const MIN_HOURS_ANTICIPACION = 2;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    const now = new Date();
    const fechaSeleccionada = new Date(form.fecha);
    const diffMs = fechaSeleccionada - now;
    const diffHrs = diffMs / (1000 * 60 * 60);
    if (diffHrs < MIN_HOURS_ANTICIPACION) {
      setFeedback(`Debes reservar con al menos ${MIN_HOURS_ANTICIPACION} horas de anticipación. Recuerda: reservación no pagada no es asegurada.`);
      setLoading(false);
      return;
    }
    if (!puedeCrearMasEventos()) {
      setFeedback('Solo puedes crear hasta 2 festejos por semana. Si necesitas más, contacta a tu administrador.');
      setLoading(false);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setFeedback('Debes iniciar sesión para crear un festejo.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('festejos').insert([
      {
        user_id: user.id,
        nombre_festejo: form.nombre,
        fecha_tentativa: form.fecha,
        paquetes_cantidades: form.cantidades, // array de cantidades por paquete
        notas: form.notas,
        estado: 'pendiente_pago',
      },
    ]);
    setLoading(false);
    if (error) {
      setFeedback('Error al guardar el festejo: ' + error.message);
      return;
    }
    setEstado('pendiente_pago');
    setGuardado(true);
    setForm({
      nombre: '',
      fecha: '',
      paquete: '',
      notas: '',
      cantidades: [0, 0, 0],
    });
    setFeedback('¡Tu plan de festejo ha sido guardado! Recuerda que debes completar el pago para activarlo.');
  };

  const totalPaquetes = form.cantidades.reduce((a, b) => a + b, 0);
  const totalMonto = form.cantidades.reduce((sum, cant, idx) => sum + cant * paquetes[idx].precio, 0);

  function handleCantidad(idx, val) {
    const next = form.cantidades.slice();
    next[idx] = Math.max(0, val);
    setForm(f => ({ ...f, cantidades: next }));
  }

  if (estado === 'pendiente_pago') {
    // Calcula resumen de compra
    const resumenPaquetes = paquetes
      .map((p, idx) => form.cantidades[idx] > 0 ? ({ ...p, cantidad: form.cantidades[idx], subtotal: form.cantidades[idx] * p.precio }) : null)
      .filter(Boolean);
    const totalPaquetes = resumenPaquetes.reduce((a, b) => a + b.cantidad, 0);
    const totalMonto = resumenPaquetes.reduce((a, b) => a + b.subtotal, 0);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="flex justify-center mt-6 mb-4">
          <img src="/logo.png" alt="Logo CRWapp" className="h-16 w-auto drop-shadow-lg rounded-xl" style={{ objectFit: 'contain' }} />
        </div>
        <main className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10 flex flex-col items-center">
          <h1 className="text-2xl font-extrabold text-orange-500 mb-4 text-center">¡Reserva recibida!</h1>
          <div className="text-center text-gray-700 text-base mb-4">Tu evento ha sido registrado, pero <span className='font-bold text-orange-600'>NO está confirmado</span> hasta que realices el pago.<br/>Por ahora tu reservación es <span className='font-bold'>sin compromiso</span> y podría liberarse si no se paga a tiempo.</div>
          {/* RESUMEN DE COMPRA */}
          <div className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
            <div className="font-bold text-orange-700 mb-2 text-center">Resumen de tu reserva</div>
            <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Festejo:</span> {form.nombre}</div>
            <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Fecha tentativa:</span> {form.fecha}</div>
            <div className="text-sm text-gray-700 mb-2"><span className="font-semibold">Notas:</span> {form.notas || <span className='italic text-gray-400'>Sin notas</span>}</div>
            <div className="mb-2">
              <div className="font-semibold text-orange-600 text-xs mb-1">Paquetes reservados:</div>
              {resumenPaquetes.length === 0 ? (
                <div className="text-gray-400 italic text-xs">No seleccionaste paquetes.</div>
              ) : (
                <ul className="text-xs text-gray-700 space-y-1">
                  {resumenPaquetes.map(p => (
                    <li key={p.nombre} className="flex items-center gap-2">
                      <span className="text-lg">{p.icono}</span>
                      <span>{p.nombre} x{p.cantidad}</span>
                      <span className="ml-auto font-bold">${p.subtotal.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-orange-100 text-sm font-bold">
                <span>Total:</span>
                <span className="text-green-600">${totalMonto.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <a href="#" className="mb-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 shadow-2xl font-bold text-base hover:scale-105 transition-all opacity-90 hover:opacity-100" style={{minWidth: 180, textAlign: 'center', pointerEvents: 'none', cursor: 'not-allowed'}}>Realizar pago (próximamente)</a>
          <div className="text-xs text-gray-500 mb-4 text-center">El pago no es obligatorio en este momento. Tu reservación queda registrada sin compromiso hasta que decidas confirmarla pagando.</div>
          <a href="/dashboard" className="rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-400 text-white px-6 py-3 shadow-2xl font-bold text-base hover:scale-105 transition-all border-2 border-fuchsia-700 drop-shadow-lg">
            Ir a mi espacio
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fffbe0] to-[#ffd6d6] overflow-hidden pt-6 sm:pt-10">
      <div className="flex flex-col items-center justify-center mb-6 mt-10" style={{ minHeight: '144px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex items-center justify-center w-36 h-36 rounded-2xl relative p-0"
          style={{ margin: '0 auto', background: 'none', boxShadow: 'none' }}
        >
          <img src="/logo.png" alt="CRW party logo" className="w-[97%] h-[97%] object-contain p-0 m-0" style={{ zIndex: 2 }} />
        </motion.div>
      </div>
      <h1 className="text-3xl font-extrabold text-center mb-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Crear Fiesta</h1>
      <div className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-yellow-500 font-display">Crear Festejo</h2>
        <p className="text-base text-gray-700 text-center mb-4">Completa los datos para crear tu evento premium.</p>
      </div>
      <main className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10 flex flex-col items-center justify-center">
        <div className="text-center text-gray-700 text-sm mb-6">Tus festejos existentes:</div>
        {/* ...listado de festejos... */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre">Nombre del festejo</label>
            <input name="nombre" id="nombre" value={form.nombre} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 shadow-md transition-all" aria-label="Nombre del festejo" aria-required="true" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha">Fecha del evento</label>
            <input name="fecha" id="fecha" type="date" value={form.fecha} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 shadow-md transition-all" aria-label="Fecha del evento" aria-required="true" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paquetes</label>
            <div className="flex flex-col gap-3 mb-2">
              {paquetes.map((p, idx) => (
                <div key={p.nombre} className="flex items-center gap-2 px-4 py-3 rounded-xl border shadow-sm bg-white/60 border-gray-200">
                  <span className="text-2xl">{p.icono}</span>
                  <span className="flex-1">
                    <div className="font-bold text-gray-700">{p.nombre}</div>
                    <div className="text-xs text-gray-500">{p.descripcion}</div>
                    <div className="text-xs text-aqua-700 font-bold mt-1">${p.precio.toLocaleString()} MXN</div>
                  </span>
                  <button type="button" aria-label={`Quitar ${p.nombre}`} className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center hover:bg-orange-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" onClick={() => handleCantidad(idx, form.cantidades[idx] - 1)}>-</button>
                  <span className="w-6 text-center font-mono">{form.cantidades[idx]}</span>
                  <button type="button" aria-label={`Agregar ${p.nombre}`} className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center hover:bg-orange-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" onClick={() => handleCantidad(idx, form.cantidades[idx] + 1)}>+</button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 px-2 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 font-semibold text-sm">
              <span>Paquetes: <span className="font-bold">{totalPaquetes}</span></span>
              <span>Total: <span className="font-bold text-green-600">${totalMonto}</span></span>
            </div>
            <div className="mt-2 text-xs text-orange-600 text-center font-semibold">¡Tendremos todo listo en tu mesa! Puedes agregar más paquetes después desde tu dashboard.</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notas">Notas o peticiones especiales <span className="text-gray-400">(opcional)</span></label>
            <textarea name="notas" id="notas" value={form.notas} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 shadow-md transition-all" placeholder="Ej: Quiero inflables extra, DJ de reggaetón, etc." rows={3} aria-label="Notas o peticiones especiales" aria-required="false" />
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`premium-feedback mt-4 text-center text-base ${feedback.startsWith('¡Fiesta creada') ? 'text-green-600' : 'text-fuchsia-700'}`}
              role="alert"
            >
              {feedback}
            </motion.div>
          )}
          <WowButton loading={loading} disabled={loading || !puedeCrearMasEventos()} aria-label="Crear festejo">{loading ? 'Guardando...' : 'Crear festejo'}</WowButton>
        </form>
      </main>
      <div className="fixed bottom-5 right-5 z-50">
        <BotonHome animateOscillation />
      </div>
    </div>
  );
}
