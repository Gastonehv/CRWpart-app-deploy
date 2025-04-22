import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import WowButton from '../components/WowButton';
import AnimatedBackground from '../components/AnimatedBackground';
import Link from 'next/link';
import BotonHome from '../components/BotonHome';
import Spinner from '../components/Spinner';
import { getDisplayName } from '../lib/getDisplayName';
import { PAQUETES } from '../components/PaqueteSelector';

// Importa los paquetes premium correctos, idénticos a los de PaqueteSelector y paquetes.js
const paquetesDisponibles = PAQUETES;

function formatDatetimeLocal(dateStr) {
  if (!dateStr) return '';
  // Si ya está en formato con T, recorta segundos
  if (dateStr.includes('T')) return dateStr.slice(0,16);
  // Si solo es fecha, agrega hora por defecto
  if (dateStr.length === 10) return dateStr + 'T18:00';
  // Si es ISO o fecha local, convertir a local para input
  const d = new Date(dateStr);
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d.getTime() - tzOffset).toISOString().slice(0,16);
  return localISO;
}

function formatFechaDisplay(dateStr) {
  // Mostrar fecha y hora en formato local, igual que el input
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function EditFestejoForm({ festejo, onCancel, onSave }) {
  const [nombreFestejo, setNombreFestejo] = useState(festejo.nombre_festejo || '');
  const [notas, setNotas] = useState(festejo.notas || '');
  const [fecha, setFecha] = useState(formatDatetimeLocal(festejo.fecha_tentativa));
  const [cantidades, setCantidades] = useState(festejo.paquetes_cantidades || paquetesDisponibles.map(() => 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNombreFestejo(festejo.nombre_festejo || '');
    setNotas(festejo.notas || '');
    setFecha(formatDatetimeLocal(festejo.fecha_tentativa));
    setCantidades(festejo.paquetes_cantidades || paquetesDisponibles.map(() => 0));
  }, [festejo]);

  function handleCantidad(idx, val) {
    const next = cantidades.slice();
    next[idx] = Math.max(0, val);
    setCantidades(next);
  }

  // Calcula el total, evitando errores si el paquete no existe
  const total = cantidades.reduce((acc, cant, idx) => {
    const paquete = paquetesDisponibles[idx];
    if (!paquete || typeof paquete.precio !== 'number') return acc;
    return acc + cant * paquete.precio;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreFestejo.trim()) {
      setError('El nombre del festejo es obligatorio.');
      return;
    }
    if (!fecha) {
      setError('La fecha y hora son obligatorias.');
      return;
    }
    setSaving(true);
    setError('');
    let fechaISO = '';
    try {
      const d = new Date(fecha);
      fechaISO = d.toISOString();
    } catch {
      setError('Fecha inválida'); setSaving(false); return;
    }
    // Solo enviar los campos estrictamente necesarios
    const updatePayload = {
      nombre_festejo: nombreFestejo,
      notas,
      fecha_tentativa: fechaISO,
      paquetes_cantidades: cantidades
    };
    console.log('Intentando actualizar festejo:', festejo.id, updatePayload);
    const { error } = await supabase
      .from('festejos')
      .update(updatePayload)
      .eq('id', festejo.id)
      .select();
    setSaving(false);
    if (error) {
      setError('No se pudo guardar. Detalle: ' + error.message);
      console.error('Supabase update error:', error);
    } else {
      onSave({ ...festejo, ...updatePayload });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-2">
        <label className="block font-semibold mb-1" htmlFor="nombreFestejo">Nombre del festejo <span className="text-red-500">*</span></label>
        <input id="nombreFestejo" name="nombreFestejo" type="text" value={nombreFestejo} onChange={e => setNombreFestejo(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base" aria-label="Nombre del festejo" aria-required="true" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold mb-1" htmlFor="fecha">Fecha y hora <span className="text-red-500">*</span></label>
        <input id="fecha" name="fecha" type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base" aria-label="Fecha y hora del festejo" aria-required="true" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold mb-1" htmlFor="notas">Notas (opcional)</label>
        <textarea id="notas" name="notas" value={notas} onChange={e => setNotas(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base" aria-label="Notas del festejo" aria-required="false" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold mb-1">Paquetes</label>
        <div className="flex flex-col gap-5">
          {paquetesDisponibles.map((p, idx) => (
            <div
              key={p.nombre}
              className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-6 flex flex-col gap-2 border border-purple-100 hover:border-blue-400 transition-all premium-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{p.icono}</span>
                <span className="text-xl font-bold text-purple-700">{p.nombre}</span>
                <span className="ml-auto text-2xl font-extrabold text-green-600">${p.precio.toLocaleString('es-MX')}</span>
              </div>
              <div className="italic text-gray-500 text-sm mb-1">{p.descripcion}</div>
              <ul className="list-disc text-gray-700 text-sm ml-6 mb-2">
                {p.beneficios && p.beneficios.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="flex items-center gap-2 justify-end mt-2">
                <button type="button" aria-label={`Quitar ${p.nombre}`} className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center hover:bg-blue-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg" onClick={() => handleCantidad(idx, cantidades[idx] - 1)}>-</button>
                <span className="w-8 text-center font-bold text-lg">{cantidades[idx]}</span>
                <button type="button" aria-label={`Agregar ${p.nombre}`} className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center hover:bg-blue-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg" onClick={() => handleCantidad(idx, cantidades[idx] + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 text-base text-blue-700 text-center font-semibold">Total: <span className="font-bold">${total.toLocaleString('es-MX')}</span></div>
      </div>
      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-feedback text-fuchsia-700 text-center text-base" role="alert">{error}</motion.div>}
      <div className="flex gap-4 mt-4">
        <WowButton type="submit" loading={saving} aria-label="Guardar cambios del festejo">{saving ? 'Guardando...' : 'Guardar cambios'}</WowButton>
        <button type="button" className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-all focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2" onClick={onCancel} aria-label="Cancelar edición de festejo">Cancelar</button>
      </div>
    </form>
  );
}

export default function MisFestejos() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [festejos, setFestejos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [festejosError, setFestejosError] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error: userError }) => {
      if (userError || !user) setError('No se pudo obtener el usuario.');
      else setUser(user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setFestejosError(null);
    supabase.from('festejos').select('*').eq('user_id', user.id).order('fecha_tentativa', { ascending: false }).then(({ data, error }) => {
      if (error) setFestejosError(error.message);
      else setFestejos(data || []);
      setLoading(false);
    });
  }, [user]);

  async function handleDeleteFestejo(id) {
    // Confirmación personalizada premium
    const confirmed = await new Promise(resolve => {
      if (window.confirm('¿Seguro que quieres eliminar este festejo? Esta acción no se puede deshacer.')) resolve(true);
      else resolve(false);
    });
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('festejos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setFestejos(festejos.filter(f => f.id !== id));
    } catch (err) {
      setError('No se pudo eliminar el festejo. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveEdit = (updatedFestejo) => {
    setFestejos(festejos.map(f => f.id === updatedFestejo.id ? updatedFestejo : f));
    setEditId(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fffbe0] to-[#ffd6d6] overflow-hidden pt-6 sm:pt-10">
      <div className="flex justify-center mt-6 mb-4">
        <img src="/logo.png" alt="Logo CRWapp" className="h-16 w-auto drop-shadow-lg rounded-xl" style={{ objectFit: 'contain' }} />
      </div>
      <main className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10 flex flex-col items-center justify-center">
        <div className="w-full">
          {/* Icono temático para mis festejos */}
          <div className="flex flex-col items-center mb-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-100 to-pink-100 shadow-lg mb-2 animate-bounce-slow">
              {/* Ícono de calendario bicolor */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="#f472b6" strokeWidth="2"/>
                <path stroke="#facc15" strokeWidth="2" strokeLinecap="round" d="M16 3v4M8 3v4M3 9h18"/>
              </svg>
            </span>
            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-pink-400 via-yellow-400 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-md animate-gradient-x">
              Mis festejos de {getDisplayName(user, profile)}
            </h2>
          </div>
          {/* Mensaje premium claro y sin redundancias */}
          <div className="flex flex-col items-center mb-4">
            <p className="text-center text-gray-600 text-base font-medium bg-white/70 px-4 py-2 rounded-xl shadow border border-fuchsia-100 animate-fadein">
              Aquí puedes ver y editar tus eventos guardados.
            </p>
          </div>
          {loading && <div className="text-center text-gray-500">Cargando festejos...</div>}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-feedback text-fuchsia-700 text-center text-base mt-4"
              role="alert"
            >
              {error}
            </motion.div>
          )}
          {festejosError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-feedback text-fuchsia-700 text-center text-base mt-4"
              role="alert"
            >
              {festejosError}
            </motion.div>
          )}
          {!loading && !error && !festejosError && (
            festejos.length === 0 ? (
              <div className="empty-state flex flex-col items-center gap-4 py-8">
                <span className="empty-state-icon text-5xl" role="img" aria-label="Sin festejos">🥳</span>
                <div className="mb-2 text-lg text-gray-600 text-center font-medium">¡Aún no tienes festejos!<br/>Crea tu primer evento y comienza a celebrar.</div>
                <WowButton onClick={() => window.location.href = '/crear-fiesta'} className="w-full max-w-xs text-base py-3 mt-2 rounded-xl shadow-lg bg-gradient-to-r from-spring-400 to-pink-400 hover:from-pink-400 hover:to-spring-400 transition-all" aria-label="Crear mi primer festejo">
                  Crear mi primer festejo
                </WowButton>
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {festejos.filter(r => new Date(r.fecha_tentativa) >= new Date()).map((festejo) => (
                    <motion.li
                      key={festejo.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/60 backdrop-blur-lg rounded-xl p-4 shadow-md flex flex-col gap-2 border border-blue-100 premium-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg text-blue-900">{festejo.nombre_festejo || 'Festejo sin título'}</div>
                          <div className="text-sm text-gray-500">{formatFechaDisplay(festejo.fecha_tentativa)}</div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {editId === festejo.id ? null : (
                            <div className="flex gap-2">
                              <button
                                className="px-4 py-2 rounded-xl bg-blue-100 text-blue-800 font-bold shadow hover:bg-blue-200 transition-all focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                                onClick={() => setEditId(festejo.id)}
                                aria-label="Editar festejo"
                              >
                                Editar
                              </button>
                              <button
                                className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold shadow hover:bg-red-200 transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                                onClick={() => handleDeleteFestejo(festejo.id)}
                                aria-label="Eliminar festejo"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {editId === festejo.id ? (
                        <EditFestejoForm festejo={festejo} onCancel={() => setEditId(null)} onSave={handleSaveEdit} />
                      ) : (
                        <>
                          {festejo.notas && (
                            <div className="text-sm text-gray-700 mt-1">{festejo.notas}</div>
                          )}
                          {Array.isArray(festejo.paquetes_cantidades) && festejo.paquetes_cantidades.some(c=>c>0) && (() => {
                            const total = festejo.paquetes_cantidades.reduce((acc, cant, idx) => {
                              const paquete = paquetesDisponibles[idx];
                              if (!paquete || typeof paquete.precio !== 'number') return acc;
                              return acc + cant * paquete.precio;
                            }, 0);
                            return (
                              <div className="mt-2 mb-1 p-2 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900">
                                <div className="font-semibold mb-1">Paquetes reservados:</div>
                                <ul className="list-disc ml-5">
                                  {festejo.paquetes_cantidades.map((cant, idx) => (
                                    cant > 0 ? (
                                      <li key={idx}>
                                        {paquetesDisponibles[idx]?.nombre || `Paquete ${idx+1}`}: <span className="font-bold">{cant}</span>
                                      </li>
                                    ) : null
                                  ))}
                                </ul>
                                <div className="mt-2 font-bold text-right text-green-700">Total a pagar: ${total.toLocaleString('es-MX')} MXN</div>
                              </div>
                            );
                          })()}
                          <div className="flex gap-4 text-xs text-gray-400 mt-2">
                            {/* Estado y botón de pago */}
                            <div className="mt-2 flex flex-col gap-1 items-stretch">
                              {festejo.estado === 'pendiente_pago' ? (
                                <button className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-3 py-2 rounded-xl shadow hover:scale-105 transition-all text-sm flex items-center justify-center gap-2" disabled>
                                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" stroke="#6366f1" strokeWidth="2"/><path stroke="#6366f1" strokeWidth="2" strokeLinecap="round" d="M16 3v4M8 3v4M3 9h18"/></svg>
                                  ¿Deseas pagar tu paquete? <span className="ml-2 text-xs font-semibold">(Próximamente)</span>
                                </button>
                              ) : (
                                <>
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">Pagado</span>
                                  <span className="block text-blue-700 text-xs font-semibold mt-1 text-center">¿Necesitas más paquetes? Puedes adquirirlos dentro de tu espacio en el apartado <span className="underline">Paquetes</span>.</span>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.li>
                  ))}
                </ul>
                <h2 className="mt-10 mb-3 text-xl font-bold text-blue-700">Historial de Festejos</h2>
                <ul className="space-y-2">
                  {festejos.filter(r => new Date(r.fecha_tentativa) < new Date()).map((festejo) => (
                    <li key={festejo.id} className="bg-white/40 rounded-lg p-3 text-gray-500 border border-gray-100 premium-shadow">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{festejo.nombre_festejo || 'Festejo sin título'}</span>
                        <span className="text-xs">{formatFechaDisplay(festejo.fecha_tentativa)}</span>
                      </div>
                      <div className="text-xs mt-1">Festejo pasado</div>
                    </li>
                  ))}
                </ul>
              </>
            )
          )}
          <div className="fixed bottom-5 right-5 z-50">
            <BotonHome />
          </div>
        </div>
      </main>
    </div>
  );
}
