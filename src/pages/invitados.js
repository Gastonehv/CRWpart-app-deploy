import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import WowButton from '../components/WowButton';
import QRInvite from '../components/QRInvite';
import { getDisplayName } from '../lib/getDisplayName';
import useFestejos from '../hooks/useFestejos';
import BotonHome from '../components/BotonHome';
import { v4 as uuidv4 } from 'uuid';

export default function Invitados() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [nuevoInvitado, setNuevoInvitado] = useState({ nombre: '', whatsapp: '', mensaje: '' });
  const [agregando, setAgregando] = useState(false);
  const { festejos, loading: loadingFestejos, error: errorFestejos } = useFestejos(user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  const fetchInvitados = async (eventoId) => {
    setLoading(true);
    setError(null);
    setSeleccionado(eventoId);
    const { data, error } = await supabase
      .from('invitados')
      .select('*')
      .eq('festejo_id', eventoId);
    if (error) setError('No se pudieron cargar los invitados.');
    else setInvitados(data);
    setLoading(false);
  };

  const handleNuevoInvitadoChange = (e) => {
    setNuevoInvitado({ ...nuevoInvitado, [e.target.name]: e.target.value });
  };

  const handleAgregarInvitado = async (e) => {
    e.preventDefault();
    if (!seleccionado) {
      setError('Selecciona un evento primero.');
      return;
    }
    setAgregando(true);
    setError(null);
    const qr_token = uuidv4();
    const { data, error: insertError } = await supabase.from('invitados').insert([
      {
        nombre: nuevoInvitado.nombre,
        whatsapp: nuevoInvitado.whatsapp,
        mensaje: nuevoInvitado.mensaje,
        festejo_id: seleccionado,
        estado: 'Pendiente',
        qr_token: qr_token,
      }
    ]);
    if (insertError) setError('No se pudo agregar el invitado.');
    else {
      setNuevoInvitado({ nombre: '', whatsapp: '', mensaje: '' });
      fetchInvitados(seleccionado);
    }
    setAgregando(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#d7fff2] to-[#d7eaff] overflow-hidden pt-6 sm:pt-10">
      <AnimatedBackground />
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
        <h1 className="text-3xl font-extrabold text-center mb-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Invitados</h1>
      </div>
      <div className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-8 flex flex-col items-center justify-center">
        <p className="text-base text-gray-700 text-center mb-4">Gestiona tu lista de invitados y confirma su asistencia.</p>
      </div>
      <BotonHome />
      <main className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10 flex flex-col items-center justify-center">
        <div className="w-full">
          {(loading || loadingFestejos) && <div className="text-center text-gray-500">Cargando...</div>}
          {errorFestejos && <div className="text-center text-red-500 mb-4">{errorFestejos}</div>}
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {/* Mensaje de instrucción premium con icono de usuarios/personas */}
          <div className="flex flex-col items-center mb-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-pink-100 to-fuchsia-200 shadow-lg mb-2 animate-bounce-slow">
              {/* Ícono de usuarios/personas bicolor */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <circle cx="9" cy="7" r="4" stroke="#c026d3" strokeWidth="2"/>
                <path stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/>
                <path stroke="#c026d3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </span>
            <p className="text-center text-gray-600 text-base font-medium bg-white/70 px-4 py-2 rounded-xl shadow border border-fuchsia-100 animate-fadein">
              Para ver y gestionar tu lista de invitados, <b>selecciona un evento</b>.<br/>
              Solo así podrás agregar nuevos invitados y visualizar los que ya están registrados para ese festejo.
            </p>
          </div>
          <div className="mb-4 w-full">
            <label className="block mb-2 text-blue-900 font-semibold" htmlFor="evento-select">Selecciona un evento:</label>
            <select
              id="evento-select"
              className="w-full rounded-lg p-2 border border-blue-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={seleccionado || ''}
              onChange={e => fetchInvitados(e.target.value)}
              aria-label="Selecciona un festejo para agregar invitados"
              aria-required="true"
            >
              <option value="">Selecciona un festejo</option>
              {Array.isArray(festejos) && festejos.map(e => {
                const titulo = e.titulo || e.nombre || e.nombre_festejo || e.title || e.evento || 'Festejo sin título';
                const fecha = e.fecha_tentativa || e.fecha || e.event_date;
                return (
                  <option key={e.id} value={e.id}>
                    {titulo} {fecha ? `(${new Date(fecha).toLocaleDateString()})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <form onSubmit={handleAgregarInvitado} className="space-y-4 mt-4">
            <label className="block mb-1 text-blue-900 font-semibold" htmlFor="nombre">Nombre del invitado</label>
            <input
              id="nombre"
              name="nombre"
              value={nuevoInvitado.nombre}
              onChange={handleNuevoInvitadoChange}
              required
              className="w-full rounded-lg p-2 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Nombre del invitado"
              aria-required="true"
            />
            <label className="block mb-1 text-blue-900 font-semibold" htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              name="whatsapp"
              value={nuevoInvitado.whatsapp}
              onChange={handleNuevoInvitadoChange}
              required
              className="w-full rounded-lg p-2 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="WhatsApp del invitado"
              aria-required="true"
            />
            <label className="block mb-1 text-blue-900 font-semibold" htmlFor="mensaje">Mensaje personalizado (opcional)</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={nuevoInvitado.mensaje}
              onChange={handleNuevoInvitadoChange}
              className="w-full rounded-lg p-2 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Mensaje personalizado para el invitado"
              aria-required="false"
            />
            <button
              type="submit"
              className="w-full py-3 mt-4 font-bold text-white text-lg rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-violet-600 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-400 active:scale-95 disabled:opacity-60 border-2 border-fuchsia-200"
              disabled={agregando || !seleccionado}
              style={{textShadow: '0 1px 8px rgba(0,0,0,0.18)'}}
              aria-label="Agregar invitado"
            >
              {agregando ? 'Agregando...' : 'Agregar invitado'}
            </button>
          </form>
          {invitados.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon" role="img" aria-label="Sin invitados">🫂</span>
              ¡Aún no tienes invitados! Agrega a tus amigos y haz tu festejo inolvidable.
            </div>
          ) : (
            <div className="grid gap-4 mt-2">
              {invitados.map((inv) => {
                let statusColor = 'bg-gray-100 text-gray-600 border-gray-200';
                let statusText = inv.estado || 'Pendiente';
                if (statusText.toLowerCase() === 'confirmado') {
                  statusColor = 'bg-green-100 text-green-700 border-green-200';
                  statusText = 'Confirmado';
                } else if (statusText.toLowerCase() === 'no') {
                  statusColor = 'bg-red-100 text-red-600 border-red-200';
                  statusText = 'No asistirá';
                } else if (statusText.toLowerCase() === 'pendiente') {
                  statusColor = 'bg-gray-100 text-gray-600 border-gray-200';
                  statusText = 'Pendiente';
                }
                return (
                  <div key={inv.id} className="card">
                    <h3 className="text-lg font-bold text-aqua-700 mb-1">{inv.nombre}</h3>
                    <p className="text-gray-600 mb-1">WhatsApp: {inv.whatsapp}</p>
                    {inv.red_social && inv.usuario_red && (
                      <p className="text-gray-500 text-sm">{inv.red_social}: {inv.usuario_red}</p>
                    )}
                    <div className={`inline-block px-3 py-1 rounded-full font-semibold text-sm border mb-2 ${statusColor}`} aria-label={`Estatus: ${statusText}`}>{statusText}</div>
                    <div
                      className="flex flex-col items-center gap-2 mt-2 select-none"
                      style={{ userSelect: 'none', pointerEvents: 'none', WebkitUserSelect: 'none' }}
                      onContextMenu={e => e.preventDefault()}
                    >
                      <QRInvite url={`${window.location.origin}/invitacion/${inv.qr_token}`} size={96} />
                      <div className="mt-2 rounded-xl bg-white/80 shadow p-3 text-center text-gray-700 font-semibold text-sm border border-aqua-100" style={{maxWidth:'270px'}}>
                        ¡Estás invitado a la experiencia exclusiva de <span className='text-aqua-700 font-bold'>CRW Party</span>!<br />
                        Vive una noche única, llena de sorpresas, música y momentos inolvidables.<br />
                        Presenta este código QR en la entrada y prepárate para celebrar como nunca.<br />
                        <span className='text-aqua-700'>¡No faltes, tu presencia hará la fiesta aún más especial!</span>
                      </div>
                    </div>
                    <button
                      className="text-xs text-green-600 underline mt-2 pointer-events-auto focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => {
                        window.open(`https://wa.me/${inv.whatsapp}?text=${encodeURIComponent(`¡Hola ${inv.nombre}! ${inv.mensaje ? inv.mensaje + ' ' : ''}Confirma tu asistencia aquí: ${window.location.origin}/invitacion/${inv.qr_token}`)}`);
                      }}
                      aria-label={`Reenviar QR por WhatsApp a ${inv.nombre}`}
                    >
                      Reenviar QR por WhatsApp
                    </button>
                    <button
                      className="text-xs text-red-500 underline mt-1 pointer-events-auto focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                      style={{ pointerEvents: 'auto' }}
                      onClick={async () => {
                        if (window.confirm(`¿Seguro que deseas eliminar a ${inv.nombre} y cancelar su QR?`)) {
                          await supabase.from('invitados').delete().eq('id', inv.id);
                          fetchInvitados(seleccionado);
                        }
                      }}
                      aria-label={`Eliminar invitado ${inv.nombre}`}
                    >
                      Eliminar invitado y cancelar QR
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
