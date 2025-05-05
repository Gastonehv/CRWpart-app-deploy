import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AnimatedBackground from '../components/AnimatedBackground';
import WowButton from '../components/WowButton';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getDisplayName } from '../lib/getDisplayName';
import BotonHome from '../components/BotonHome';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [festejos, setFestejos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);
      if (!currentUser) {
        setError('Debes iniciar sesión.');
        setLoading(false);
        return;
      }
      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      setProfile(profileData);
      if (profileError || !profileData || (profileData.rol !== 'admin' && profileData.rol !== 'staff')) {
        setError('Acceso restringido. Solo administradores o staff pueden ver este panel.');
        setLoading(false);
        return;
      }
      // Get all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (usersError) setError('Error al cargar usuarios.');
      else setUsers(usersData);
      // Get all festejos
      const { data: festejosData, error: errorFestejos } = await supabase
        .from('festejos')
        .select('*');
      if (errorFestejos) setError('Error al cargar festejos.');
      else setFestejos(festejosData || []);
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleSomeAdminAction = async () => {
    setSaving(true);
    setFeedback('');
    // ...acción admin...
    // Simulación de éxito/error:
    setTimeout(() => {
      setSaving(false);
      setFeedback('¡Acción realizada correctamente!');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbe0] to-[#f3e8ff] overflow-hidden pt-6 sm:pt-10">
      <AnimatedBackground />
      <main className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10">
        {/* Logo centrado, sin botón aquí */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-2 flex items-center justify-center w-28 h-28 relative">
            <img src="/logo.png" alt="Logo CRWapp" className="w-20 h-20 object-contain" style={{ zIndex: 2, background: 'none', boxShadow: 'none' }} />
          </div>
        </div>
        {/* Icono temático premium para panel de administración */}
        <div className="flex flex-col items-center mb-4 mt-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-200 to-fuchsia-200 shadow-lg mb-2 animate-bounce-slow">
            {/* Ícono de corona/admin */}
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M2 17l2-7 6 6 6-6 2 7" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="4" cy="7" r="2" fill="#fbbf24"/><circle cx="20" cy="7" r="2" fill="#fbbf24"/><circle cx="12" cy="3" r="2" fill="#fbbf24"/></svg>
          </span>
          <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-md animate-gradient-x font-display">
            Panel de administración
          </h2>
        </div>
        {/* Mensaje premium claro y sin redundancias */}
        <div className="flex flex-col items-center mb-4">
          <p className="text-center text-gray-600 text-base font-medium bg-white/70 px-4 py-2 rounded-xl shadow border border-fuchsia-100 animate-fadein">
            Administra usuarios, festejos y la plataforma con privilegios avanzados.
          </p>
        </div>
        {loading && <Spinner />}
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-feedback text-fuchsia-700 text-center text-base mb-4" role="alert">{error}</motion.div>
        )}
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-feedback text-green-600 text-center text-base mb-4" role="alert">{feedback}</motion.div>
        )}
        {!loading && !error && (
          <>
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-2 text-blue-900">Usuarios registrados</h2>
              <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white/60 shadow">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="py-2 px-3 text-left">Nombre</th>
                      <th className="py-2 px-3 text-left">Email</th>
                      <th className="py-2 px-3 text-left">Rol</th>
                      <th className="py-2 px-3 text-left">Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr>
                        <td className="py-4 px-3 text-center text-gray-400 italic" colSpan={4}>
                          No hay usuarios registrados.
                        </td>
                      </tr>
                    )}
                    {users.map(u => (
                      <tr key={u.id} className="border-t border-blue-100 hover:bg-blue-100/30">
                        <td className="py-2 px-3 font-medium text-blue-900">{u.apodo || u.nombre || u.nombres || u.email?.split('@')[0] || <span className="text-gray-400 italic">Sin nombre</span>}</td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3 text-blue-700">{u.rol || 'usuario'}</td>
                        <td className="py-2 px-3 text-gray-400">{u.created_at ? new Date(u.created_at).toLocaleDateString() : (u.updated_at ? new Date(u.updated_at).toLocaleDateString() : <span className="italic text-gray-300">Sin fecha</span>)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2 text-blue-900">Festejos creados</h2>
              <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white/60 shadow">
                <table className="w-full text-xs sm:text-sm border-separate border-spacing-y-1">
                  <thead>
                    <tr className="text-blue-900/80">
                      <th className="py-2 px-3 text-left">Evento</th>
                      <th className="py-2 px-3 text-left">Usuario</th>
                      <th className="py-2 px-3 text-left">Fecha</th>
                      <th className="py-2 px-3 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {festejos.map(f => (
                      <tr key={f.id} className="border-t border-blue-100 hover:bg-blue-100/30">
                        <td className="py-2 px-3 font-medium text-blue-900">{f.titulo || f.nombre_festejo || 'Sin título'}</td>
                        <td className="py-2 px-3">{getDisplayName(users.find(u => u.id === f.user_id) || {})}</td>
                        <td className="py-2 px-3">{f.fecha ? new Date(f.fecha).toLocaleString() : (f.fecha_tentativa ? new Date(f.fecha_tentativa).toLocaleString() : 'Sin fecha')}</td>
                        <td className="py-2 px-3">
                          {/* Estado de pago como círculo elegante */}
                          {f.estado === 'pendiente_pago' && (
                            <span className="inline-flex items-center gap-1" aria-label="Pendiente de pago">
                              <span className="w-4 h-4 rounded-full bg-red-400 border border-red-400 shadow-sm inline-block"></span>
                            </span>
                          )}
                          {(f.estado === 'activo' || f.estado === 'pagado') && (
                            <span className="inline-flex items-center gap-1" aria-label={f.estado === 'pagado' ? 'Pagado' : 'Activo'}>
                              <span className="w-4 h-4 rounded-full bg-green-400 border border-green-400 shadow-sm inline-block"></span>
                            </span>
                          )}
                          {f.estado === 'cancelado' && (
                            <span className="inline-flex items-center gap-1" aria-label="Cancelado">
                              <span className="w-4 h-4 rounded-full bg-red-200 border border-red-400 shadow-sm inline-block"></span>
                            </span>
                          )}
                          {!['pendiente_pago','activo','pagado','cancelado'].includes(f.estado) && (
                            <span className="inline-flex items-center gap-1" aria-label={f.estado || 'Sin estado'}>
                              <span className="w-4 h-4 rounded-full bg-gray-300 border border-gray-400 shadow-sm inline-block"></span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        <WowButton loading={saving} disabled={saving} onClick={handleSomeAdminAction}>Acción admin demo</WowButton>
      </main>
      {/* Botón flotante premium de ir al inicio */}
      <BotonHome className="fixed bottom-6 right-6 z-50 animate-float shadow-xl" />
    </div>
  );
}
