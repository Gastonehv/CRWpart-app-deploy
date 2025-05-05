import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AnimatedBackground from '../components/AnimatedBackground';
import { motion } from 'framer-motion';
import WowButton from '../components/WowButton';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getDisplayName } from '../lib/getDisplayName';
import Logo from '../components/Logo';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <AnimatedBackground />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 text-center">
          <h2 className="text-2xl font-bold text-[#a259ff] mb-4">No has iniciado sesión</h2>
          <Link href="/auth/login" className="text-[#a259ff] underline">Iniciar sesión</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Logotipo dashboard: posición y tamaño estandarizados, animación de entrada y glow animado mejorado */}
      <div className="flex flex-col items-center justify-center mb-6 mt-10" style={{ minHeight: '144px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex items-center justify-center w-36 h-36 rounded-2xl relative p-0"
          style={{ margin: '0 auto', background: 'none', boxShadow: 'none' }}
        >
          {/* Glow animado multicolor detrás del logo - versión más intensa y visible */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{
              boxShadow: '0 0 80px 24px #a259ffcc, 0 0 120px 48px #00e0ff88',
              filter: 'blur(8px)',
              opacity: 0.8
            }}
            animate={{
              boxShadow: [
                '0 0 80px 24px #a259ffcc, 0 0 120px 48px #00e0ff88',
                '0 0 100px 36px #00e0ffcc, 0 0 120px 56px #ffe60088',
                '0 0 90px 32px #ffe600cc, 0 0 120px 60px #ff6b0088',
                '0 0 80px 24px #a259ffcc, 0 0 120px 48px #00e0ff88',
              ],
              filter: 'blur(8px)',
              opacity: 1
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
            style={{ zIndex: 1 }}
          />
          <Logo style={{ zIndex: 2, position: 'relative' }} />
        </motion.div>
      </div>
      <div className="w-full max-w-xs mx-auto bg-[#181818] rounded-3xl border border-[#a259ff] shadow-2xl px-4 py-8 mb-8 flex flex-col items-center justify-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl font-extrabold text-center mb-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Hola, {getDisplayName(user, profile) ? (
            <span className="font-bold">{getDisplayName(user, profile)}</span>
          ) : <span className="text-gray-400 italic">(usuario)</span>} <span className="inline-block">👋</span>
        </motion.h2>
        <p className="text-base text-gray-200 text-center mb-4">Este es tu espacio para crear recuerdos épicos.<br />¿Listo para armar tu próximo festejo?</p>
      </div>
      <section className="w-full max-w-xs mx-auto flex flex-col gap-7">
        <div className="flex flex-col items-center mb-4 mt-2">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff6b00] via-[#ffe600] to-[#00e0ff] shadow-lg mb-2 animate-bounce-slow">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#ffe600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10.75L12 4l9 6.75V19a2 2 0 01-2 2H5a2 2 0 01-2-2V10.75z"/><path stroke="#00e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/></svg>
          </span>
          <h2 className="text-2xl font-extrabold text-center mb-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Dashboard</h2>
        </div>
        <Link href="/crear-fiesta" passHref legacyBehavior>
          <a className="block w-full py-5 rounded-2xl text-xl shadow-lg hover:scale-105 transition-all text-center border border-[#00e0ff] mb-4 focus-visible:ring-2 focus-visible:ring-[#00e0ff] focus-visible:ring-offset-2" style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', color: '#fff', fontWeight: 700, letterSpacing: '0.04em', boxShadow: '0 2px 16px 0 #00e0ff33'}} aria-label="Crear nueva fiesta o celebración">
            🎉 ¿Quieres organizar tu celebración?
            <div className="text-base font-normal text-gray-300 mt-2">Crea tu propia celebración exclusiva con CRW Party y hazla épica, ¡aunque seas invitado! ¡Haz que tu festejo sea inolvidable!</div>
          </a>
        </Link>
        {profile?.rol === 'admin' && (
          <Link href="/admin" passHref legacyBehavior>
            <a className="block w-full py-3 rounded-2xl bg-[#181818] text-yellow-300 font-bold text-lg shadow-lg hover:scale-105 transition-all text-center border border-yellow-400 mb-4 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2" aria-label="Ir al panel de administración">
              👑 Panel de administración
            </a>
          </Link>
        )}
        <section className="mb-10 grid grid-cols-1 gap-5">
          <ActionCard icon="🎵" title="Seleccionar música" description="Elige la playlist perfecta y deja que la vibra musical marque el ritmo de la noche." onClick={() => router.push('/musica')} aria-label="Seleccionar música" />
          <ActionCard icon="🎁" title="Paquetes" description="Compra, consulta y gestiona tus paquetes para tus festejos." onClick={() => router.push('/paquetes')} aria-label="Paquetes" />
          <ActionCard icon="📅" title="Mis Festejos" description="Revisa, gestiona y asegura tus celebraciones. Todo bajo control, sin estrés." onClick={() => router.push('/mis-festejos')} aria-label="Mis Festejos" />
          <ActionCard icon="🧑‍🤝‍🧑" title="Invitados" description="Gestiona tu lista de invitados y confirma su asistencia." onClick={() => router.push('/invitados')} aria-label="Invitados" />
          <ActionCard icon="👤" title="Perfil" description="Edita tus datos personales y preferencias." onClick={() => router.push('/profile')} aria-label="Perfil" />
          <ActionCard icon="📜" title="Reglamentación" description="Consulta las normas y términos legales de uso de la plataforma." onClick={() => router.push('/reglamentacion')} aria-label="Reglamentación" />
        </section>
        <button
          className="mt-6 w-full py-2 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all focus-visible:ring-2 focus-visible:ring-[#00e0ff] focus-visible:ring-offset-2"
          style={{background: 'linear-gradient(90deg, #ff6b00, #ffe600, #00e0ff, #a259ff)', color: '#fff', fontWeight: 700, letterSpacing: '0.04em', boxShadow: '0 2px 16px 0 #00e0ff33'}}
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  );
}

function ActionCard({ icon, title, description, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl bg-[#181818] shadow-md border border-[#a259ff] hover:bg-[#a259ff] transition-all text-left focus-visible:ring-2 focus-visible:ring-[#a259ff] focus-visible:ring-offset-2"
      style={{backdropFilter:'blur(2px)'}}
      aria-label={props['aria-label'] || title}
      tabIndex={0}
    >
      <span className="text-3xl text-[#a259ff]">{icon}</span>
      <span>
        <div className="font-bold text-gray-200 text-lg mb-1">{title}</div>
        <div className="text-gray-300 text-sm">{description}</div>
      </span>
    </button>
  );
}
