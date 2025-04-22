import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AnimatedBackground from '../components/AnimatedBackground';
import { motion } from 'framer-motion';
import WowButton from '../components/WowButton';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getDisplayName } from '../lib/getDisplayName';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    const fetchReservas = async () => {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha', { ascending: false });
      setReservas(data || []);
    };
    fetchProfile();
    fetchReservas();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white">
        <AnimatedBackground />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 text-center">
          <h2 className="text-2xl font-bold text-aqua-700 mb-4">No has iniciado sesión</h2>
          <Link href="/auth/login" className="text-aqua-600 underline">Iniciar sesión</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-spring-50 to-aqua-100">
      <div className="flex justify-center mt-6 mb-4">
        <img src="/logo.png" alt="Logo CRWapp" className="h-16 w-auto drop-shadow-lg rounded-xl" style={{ objectFit: 'contain' }} />
      </div>
      <div className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl font-extrabold text-center mb-2 text-spring-500 font-display">
          Hola, {getDisplayName(user, profile) ? (
            <span className="text-spring-500 font-bold">{getDisplayName(user, profile)}</span>
          ) : <span className="text-gray-400 italic">(usuario)</span>} 👋
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8 text-center text-gray-600">
          <div className="text-lg">Este es tu espacio para crear recuerdos épicos.<br />¿Listo para armar tu próximo festejo?</div>
        </motion.div>
        <div className="premium-divider" />
        <section className="space-y-4 mt-6">
          {/* Título premium uniforme con icono home/dashboard */}
          <div className="flex flex-col items-center mb-6 mt-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-fuchsia-200 shadow-lg mb-2 animate-bounce-slow">
              {/* Ícono Home/Dashboard */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10.75L12 4l9 6.75V19a2 2 0 01-2 2H5a2 2 0 01-2-2V10.75z"/><path stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/></svg>
            </span>
            <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-md animate-gradient-x font-display">
              Dashboard
            </h2>
          </div>
          {/* Botón destacado para crear fiesta, siempre visible */}
          <Link href="/crear-fiesta" passHref legacyBehavior>
            <a className="block w-full py-5 rounded-2xl premium-btn text-xl shadow-lg hover:scale-105 transition-all text-center border border-aqua-200 mb-4 focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2" aria-label="Crear nueva fiesta o celebración">
              🎉 ¿Quieres organizar tu celebración?
              <div className="text-base font-normal text-gray-600 mt-2">Crea tu propia celebración exclusiva con CRW Party y hazla épica, ¡aunque seas invitado! ¡Haz que tu festejo sea inolvidable!</div>
            </a>
          </Link>
          {/* BOTÓN PANEL DE ADMINISTRACIÓN SOLO SI ES ADMIN */}
          {profile?.rol === 'admin' && (
            <Link href="/admin" passHref legacyBehavior>
              <a className="block w-full py-3 rounded-2xl bg-yellow-100 text-yellow-800 font-bold text-lg shadow-lg hover:scale-105 transition-all text-center border border-yellow-200 mb-4 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2" aria-label="Ir al panel de administración">
                👑 Panel de administración
              </a>
            </Link>
          )}
          {/* Aquí van las demás ActionCards y secciones del dashboard */}
          <section className="mb-10 grid grid-cols-1 gap-5">
            <ActionCard icon="🎵" title="Seleccionar música" description="Elige la playlist perfecta y deja que la vibra musical marque el ritmo de la noche." onClick={() => router.push('/musica')} aria-label="Seleccionar música" />
            <ActionCard icon="🎁" title="Paquetes" description="Compra, consulta y gestiona tus paquetes para tus festejos." onClick={() => router.push('/paquetes')} aria-label="Paquetes" />
            <ActionCard icon="📅" title="Mis Festejos" description="Revisa, gestiona y asegura tus celebraciones. Todo bajo control, sin estrés." onClick={() => router.push('/mis-festejos')} aria-label="Mis Festejos" />
            <ActionCard icon="🧑‍🤝‍🧑" title="Invitados" description="Gestiona tu lista de invitados y confirma su asistencia." onClick={() => router.push('/invitados')} aria-label="Invitados" />
            <ActionCard icon="👤" title="Perfil" description="Edita tus datos personales y preferencias." onClick={() => router.push('/profile')} aria-label="Perfil" />
            <ActionCard icon="📜" title="Reglamentación" description="Consulta las normas y términos legales de uso de la plataforma." onClick={() => router.push('/reglamentacion')} aria-label="Reglamentación" />
          </section>
          <button
            className="mt-6 w-full py-2 rounded-xl premium-btn font-bold text-lg shadow hover:scale-105 transition-all focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2"
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
          >
            Cerrar sesión
          </button>
        </section>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl bg-white/70 shadow-md border border-aqua-50 hover:bg-aqua-50 transition-all text-left focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2"
      style={{backdropFilter:'blur(2px)'}}
      aria-label={props['aria-label'] || title}
      tabIndex={0}
    >
      <span className="text-3xl">{icon}</span>
      <span>
        <div className="font-bold text-gray-700 text-lg mb-1">{title}</div>
        <div className="text-gray-500 text-sm">{description}</div>
      </span>
    </button>
  );
}
