import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AnimatedBackground from '../components/AnimatedBackground';
import WowButton from '../components/WowButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getDisplayName } from '../lib/getDisplayName';
import { PAQUETES } from '../components/PaqueteSelector';

// Usar solo los paquetes demo premium para edición
const paquetes = PAQUETES;

export default function EditarFestejo() {
  const [festejos, setFestejos] = useState([]);
  const [selectedFestejo, setSelectedFestejo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchFestejos() {
      setLoading(true);
      const sessionResult = await supabase.auth.getSession();
      const userObj = sessionResult?.data?.session?.user;
      setUser(userObj);
      console.log('DEBUG user:', userObj);
      if (!userObj) {
        setFeedback('Debes iniciar sesión.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('festejos')
        .select('*')
        .eq('user_id', userObj.id)
        .order('fecha_tentativa', { ascending: true });
      console.log('DEBUG festejos:', data, error);
      if (error) {
        setFeedback('Error al buscar tus festejos: ' + error.message);
      } else if (!data || data.length === 0) {
        setFeedback('No tienes ningún festejo creado aún.');
        setFestejos([]);
      } else {
        setFestejos(data);
        setFeedback('');
      }
      setLoading(false);
    }
    fetchFestejos();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
      if (error) {
        console.error(error);
      } else {
        setProfile(data[0]);
      }
    }
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (selectedFestejo) {
      setSavedSnapshot({
        nombre_festejo: selectedFestejo.nombre_festejo || '',
        fecha_tentativa: selectedFestejo.fecha_tentativa || '',
        paquete: selectedFestejo.paquete || '',
        notas: selectedFestejo.notas || '',
      });
    }
  }, [selectedFestejo?.id]);

  const handleSelectFestejo = (festejo) => {
    setSelectedFestejo(festejo);
    setFeedback('');
  };

  const handleChange = e => {
    setSelectedFestejo({ ...selectedFestejo, [e.target.name]: e.target.value });
  };

  const isModified = selectedFestejo && savedSnapshot && (
    selectedFestejo.nombre_festejo !== savedSnapshot.nombre_festejo ||
    selectedFestejo.fecha_tentativa !== savedSnapshot.fecha_tentativa ||
    selectedFestejo.paquete !== savedSnapshot.paquete ||
    (selectedFestejo.notas || '') !== (savedSnapshot.notas || '')
  );

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) {
      setFeedback('Debes iniciar sesión.');
      setLoading(false);
      return;
    }
    console.log('DEBUG update:', {
      id: selectedFestejo.id,
      nombre_festejo: selectedFestejo.nombre_festejo,
      fecha_tentativa: selectedFestejo.fecha_tentativa,
      paquete: selectedFestejo.paquete,
      notas: selectedFestejo.notas,
    });
    const { error, data } = await supabase
      .from('festejos')
      .update({
        nombre_festejo: selectedFestejo.nombre_festejo,
        fecha_tentativa: selectedFestejo.fecha_tentativa,
        paquete: selectedFestejo.paquete,
        notas: selectedFestejo.notas,
        updated_at: new Date(),
      })
      .eq('id', selectedFestejo.id)
      .select();
    console.log('DEBUG resultado update:', data, error);
    setLoading(false);
    if (error) {
      setFeedback('Error al guardar la edición: ' + error.message);
      return;
    }
    setFeedback('¡Festejo actualizado con éxito!');
    // Mantener los datos cargados del festejo editado
    // No limpiar selectedFestejo para permitir ediciones sucesivas
    // Opcional: actualizar el snapshot para que isModified vuelva a false
    setSavedSnapshot({
      nombre_festejo: selectedFestejo.nombre_festejo,
      fecha_tentativa: selectedFestejo.fecha_tentativa,
      paquete: selectedFestejo.paquete,
      notas: selectedFestejo.notas,
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden bg-white">
      <AnimatedBackground />
      <main className="z-10 w-full max-w-md mx-auto px-4 py-8 glass-card premium-shadow">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Editar Festejo de {getDisplayName(user, profile) ? (
            <span className="text-spring-500 font-bold">{getDisplayName(user, profile)}</span>
          ) : <span className="text-gray-400 italic">(usuario)</span>}
        </h1>
        <div className="premium-divider" />
        {/* Icono temático para editar festejo */}
        <div className="flex flex-col items-center mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-100 to-fuchsia-200 shadow-lg mb-2 animate-bounce-slow">
            {/* Ícono de edición/lápiz */}
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M16.862 5.487a2.066 2.066 0 0 1 2.921 2.921l-9.5 9.5a2 2 0 0 1-.878.513l-3.5 1a1 1 0 0 1-1.237-1.237l1-3.5a2 2 0 0 1 .513-.878l9.5-9.5Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          {/* Mostrar de quién es el festejo, SIEMPRE usando getDisplayName(user, profile) */}
          {getDisplayName(user, profile) && (
            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-md animate-gradient-x">
              Editar festejo de <span className="text-pink-500">{getDisplayName(user, profile)}</span>
            </h2>
          )}
        </div>
        {/* Mensaje premium sin redundancia */}
        <div className="flex flex-col items-center mb-4">
          <p className="text-center text-gray-600 text-base font-medium bg-white/70 px-4 py-2 rounded-xl shadow border border-fuchsia-100 animate-fadein">
            Modifica los datos de tu evento premium.
          </p>
        </div>
        {festejos.length === 0 && (
          <div className="text-gray-500 text-center font-semibold">No tienes ningún festejo creado aún.</div>
        )}
        {festejos.length === 1 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl drop-shadow">{paquetes.find(p => p.nombre === festejos[0].paquete)?.icono || '🎉'}</span>
              <span className="font-bold text-xl text-gray-800 bg-gradient-to-r from-aqua-500 to-aqua-700 bg-clip-text text-transparent drop-shadow">{festejos[0].nombre_festejo || 'Sin nombre'}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del festejo</label>
              <input name="nombre_festejo" value={festejos[0].nombre_festejo} onChange={e => setFestejos([{ ...festejos[0], nombre_festejo: e.target.value }])} required className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha tentativa</label>
              <input type="date" name="fecha_tentativa" value={festejos[0].fecha_tentativa} onChange={e => setFestejos([{ ...festejos[0], fecha_tentativa: e.target.value }])} required className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paquete</label>
              <select
                name="paquete"
                value={festejos[0].paquete || ''}
                onChange={e => setFestejos([{ ...festejos[0], paquete: e.target.value }])}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md"
              >
                <option value="" disabled>Selecciona un paquete</option>
                {paquetes.map(p => (
                  <option key={p.nombre} value={p.nombre}>{p.icono} {p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas o peticiones especiales</label>
              <textarea name="notas" value={festejos[0].notas || ''} onChange={e => setFestejos([{ ...festejos[0], notas: e.target.value }])} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md" rows={3} />
            </div>
            {feedback && <div className={`mb-4 text-center text-sm font-semibold ${feedback.startsWith('¡Festejo actualizado') ? 'text-aqua-700' : 'text-red-500'}`}>{feedback}</div>}
            <WowButton type="submit" style={{
              background: 'linear-gradient(90deg, #eafaf6 0%, #22d3ee 100%)',
              color: '#155e75',
              fontWeight: 600,
              fontSize: '1.1rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 16px 0 #e0f7fa',
              letterSpacing: '0.02em',
              padding: '0.85em 0',
              transition: 'all 0.16s cubic-bezier(.4,0,.2,1)',
            }}>Guardar edición</WowButton>
          </form>
        )}
        {festejos.length > 1 && (
          <ul className="divide-y divide-aqua-100 rounded-2xl shadow bg-white/95">
            {festejos.map(f => (
              <li key={f.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 cursor-pointer hover:bg-aqua-100/60 transition-all ${selectedFestejo?.id === f.id ? 'bg-aqua-50 ring-2 ring-aqua-400 shadow-lg' : ''}`}
                onClick={() => handleSelectFestejo(f)}>
                <div>
                  <div className="font-bold text-lg text-gray-700 flex items-center gap-2">
                    <span className="text-2xl drop-shadow">{paquetes.find(p => p.nombre === f.paquete)?.icono || '🎉'}</span>
                    <span className="bg-gradient-to-r from-aqua-600 to-aqua-400 bg-clip-text text-transparent">{f.nombre_festejo || 'Sin nombre'}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Fecha: <span className="font-semibold text-aqua-700">{f.fecha_tentativa || 'Sin fecha'}</span></div>
                  <div className="text-xs text-gray-500">Paquete: <span className="font-semibold text-aqua-600">{f.paquete || 'Sin paquete'}</span></div>
                  {f.notas && <div className="text-xs text-aqua-400 italic mt-1">“{f.notas}”</div>}
                </div>
                <div className="ml-0 md:ml-4 mt-2 md:mt-0">
                  <button className="px-3 py-1 rounded-xl bg-white/80 border border-gray-200 text-gray-800 font-semibold shadow hover:bg-aqua-200 hover:text-aqua-900 transition-all text-xs focus:outline-none focus:ring-2 focus:ring-aqua-400 focus:ring-offset-2" onClick={e => { e.stopPropagation(); handleSelectFestejo(f); }}>Editar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {selectedFestejo && festejos.length > 1 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl drop-shadow">{paquetes.find(p => p.nombre === selectedFestejo.paquete)?.icono || '🎉'}</span>
              <span className="font-bold text-xl text-gray-800 bg-gradient-to-r from-aqua-500 to-aqua-700 bg-clip-text text-transparent drop-shadow">{selectedFestejo.nombre_festejo || 'Sin nombre'}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del festejo</label>
              <input name="nombre_festejo" value={selectedFestejo.nombre_festejo} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha tentativa</label>
              <input type="date" name="fecha_tentativa" value={selectedFestejo.fecha_tentativa} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paquete</label>
              <select
                name="paquete"
                value={selectedFestejo.paquete || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md"
              >
                <option value="" disabled>Selecciona un paquete</option>
                {paquetes.map(p => (
                  <option key={p.nombre} value={p.nombre}>{p.icono} {p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas o peticiones especiales</label>
              <textarea name="notas" value={selectedFestejo.notas || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none shadow-md" rows={3} />
            </div>
            {feedback && <div className={`mb-4 text-center text-sm font-semibold ${feedback.startsWith('¡Festejo actualizado') ? 'text-aqua-700' : 'text-red-500'}`}>{feedback}</div>}
            <WowButton type="submit" disabled={loading || !isModified} style={{
              background: 'linear-gradient(90deg, #eafaf6 0%, #22d3ee 100%)',
              color: '#155e75',
              fontWeight: 600,
              fontSize: '1.1rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 16px 0 #e0f7fa',
              letterSpacing: '0.02em',
              padding: '0.85em 0',
              transition: 'all 0.16s cubic-bezier(.4,0,.2,1)',
              opacity: loading || !isModified ? 0.7 : 1,
            }}>
              {loading ? 'Guardando...' : 'Guardar edición'}
            </WowButton>
          </form>
        )}
        <div className="mt-8 text-center">
          <Link href="/dashboard" passHref legacyBehavior>
            <a className="text-aqua-600 underline">Volver al dashboard</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
