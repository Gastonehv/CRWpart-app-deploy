import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import WowButton from '../components/WowButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { getDisplayName } from '../lib/getDisplayName';
import BotonHome from '../components/BotonHome';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    apodo: '',
    whatsapp: '',
    red_social_favorita: '',
    usuario_red: '',
    gusto_musical: '',
    otro_gusto: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [profileError, setProfileError] = useState(null);
  const router = useRouter();

  // Detectar cambios en el formulario para habilitar/deshabilitar el botón
  const [isDirty, setIsDirty] = useState(false);
  const initialFormRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setProfileError(null);
    const fetchAndEnsureProfile = async () => {
      try {
        console.log('User ID:', user.id);
        // 1. Intenta obtener el perfil (todas las filas con ese id)
        const { data: rows, error: selectError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        console.log('Rows encontrados:', rows);
        if (selectError) {
          setProfileError('Error consultando tu perfil: ' + selectError.message);
          setLoading(false);
          return;
        }
        if (rows && rows.length > 0) {
          // Si hay uno o más, usa el primero (debe ser único)
          const data = rows[0];
          setProfile(data);
          setForm({
            apodo: data?.apodo || '',
            whatsapp: data?.whatsapp ? String(data.whatsapp) : '',
            red_social_favorita: data?.red_social_favorita || '',
            usuario_red: data?.usuario_red || '',
            gusto_musical: data?.gusto_musical || '',
            otro_gusto: data?.otro_gusto || '',
          });
          setLoading(false);
          return;
        }
        // Si no existe, créalo
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, nombre: '' });
        if (insertError) {
          setProfileError('No se pudo crear tu perfil automáticamente: ' + insertError.message);
          setLoading(false);
          return;
        }
        // Consulta el perfil recién creado
        const { data: newRows, error: newSelectError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        if (newSelectError || !newRows || newRows.length === 0) {
          setProfileError('No se pudo cargar tu perfil tras crearlo.');
          setLoading(false);
          return;
        }
        const data = newRows[0];
        setProfile(data);
        setForm({
          apodo: data?.apodo || '',
          whatsapp: data?.whatsapp ? String(data.whatsapp) : '',
          red_social_favorita: data?.red_social_favorita || '',
          usuario_red: data?.usuario_red || '',
          gusto_musical: data?.gusto_musical || '',
          otro_gusto: data?.otro_gusto || '',
        });
        setLoading(false);
      } catch (err) {
        setProfileError('Error inesperado: ' + (err.message || err.toString()));
        setLoading(false);
      }
    };
    fetchAndEnsureProfile();
  }, [user]);

  // Guardar el estado inicial cuando se cargue el perfil
  useEffect(() => {
    if (profile) {
      const initial = JSON.stringify({
        apodo: profile?.apodo || '',
        whatsapp: profile?.whatsapp ? String(profile.whatsapp) : '',
        red_social_favorita: profile?.red_social_favorita || '',
        usuario_red: profile?.usuario_red || '',
        gusto_musical: profile?.gusto_musical || '',
        otro_gusto: profile?.otro_gusto || '',
      });
      initialFormRef.current = initial;
      setIsDirty(false);
    }
  }, [profile]);

  // Detectar cambios en el form (comparar con el estado inicial)
  useEffect(() => {
    if (!profile) return;
    // El dirty debe ser true si el formulario actual es diferente al inicial
    const current = JSON.stringify({
      apodo: form.apodo,
      whatsapp: form.whatsapp ? String(form.whatsapp) : '',
      red_social_favorita: form.red_social_favorita,
      usuario_red: form.usuario_red,
      gusto_musical: form.gusto_musical,
      otro_gusto: form.otro_gusto,
    });
    const initial = initialFormRef.current;
    // Si el formulario está vacío y el inicial también, dirty = false
    if (current === initial) {
      setIsDirty(false);
    } else {
      setIsDirty(true);
    }
  }, [form.apodo, form.whatsapp, form.red_social_favorita, form.usuario_red, form.gusto_musical, form.otro_gusto, profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      const { error } = await supabase.from('profiles').update({
        apodo: form.apodo,
        whatsapp: form.whatsapp,
        red_social_favorita: form.red_social_favorita,
        usuario_red: form.usuario_red,
        gusto_musical: form.gusto_musical,
        otro_gusto: form.otro_gusto,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);
      if (error) {
        setFeedback('Error al guardar: ' + error.message);
      } else {
        setFeedback('¡Perfil actualizado!');
        // Actualiza el estado inicial para que el botón se desactive
        initialFormRef.current = JSON.stringify({
          apodo: form.apodo,
          whatsapp: form.whatsapp ? String(form.whatsapp) : '',
          red_social_favorita: form.red_social_favorita,
          usuario_red: form.usuario_red,
          gusto_musical: form.gusto_musical,
          otro_gusto: form.otro_gusto,
        });
        // Forzar recalculo del dirty al guardar exitoso
        setTimeout(() => {
          setIsDirty(false);
        }, 0);
      }
      await supabase.from('profile_modifications').insert({
        user_id: user.id,
        modified_at: new Date().toISOString(),
        changes: JSON.stringify(form),
      });
    } catch (err) {
      setFeedback('Error al guardar: ' + (err.message || err.toString()));
    }
    setSaving(false);
  };

  if (profileError) {
    return (
      <div style={{ padding: 24, color: '#b91c1c', background: '#fef2f2', borderRadius: 12, textAlign: 'center', marginTop: 32 }}>
        <b>Error al cargar tu perfil:</b><br />
        {profileError}
        <br />
        <span style={{fontSize: '0.95em', color: '#555'}}>Revisa tu conexión o contacta soporte.<br/>El botón de guardar estará desactivado hasta resolver este error.</span>
      </div>
    );
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-spring-50 to-aqua-100">
        <AnimatedBackground />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 text-center">
          <h2 className="text-2xl font-bold text-aqua-700 mb-4">Cargando perfil...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9e6ff] to-[#d7f8ff] overflow-hidden pt-6 sm:pt-10">
      <main className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10">
        {/* Logotipo perfil: posición y tamaño estandarizados, glow sutil, animación de entrada */}
        <div className="flex flex-col items-center justify-center mb-6 mt-10" style={{ minHeight: '120px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="logo-glow flex items-center justify-center w-28 h-28 rounded-2xl shadow-xl bg-white/90 relative p-0"
            style={{ margin: '0 auto' }}
          >
            <img src="/logo.png" alt="CRW party logo" className="w-[95%] h-[95%] object-contain p-0 m-0" style={{ zIndex: 2 }} />
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_28px_5px_rgba(167,139,250,0.16)] pointer-events-none" style={{ zIndex: 1 }} />
          </motion.div>
        </div>
        <div className="flex flex-col items-center mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-purple-100 to-cyan-100 shadow-lg mb-2 animate-bounce-slow">
            {/* Ícono de perfil bicolor */}
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="9" r="5" stroke="#a78bfa" strokeWidth="2" fill="#f3f4f6"/>
              <path d="M4 21c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </span>
          <h1 className="text-3xl font-extrabold text-center mb-6 text-aqua-700">Editar perfil de {getDisplayName(user) ? (
            <span className="text-spring-500 font-bold">{getDisplayName(user)}</span>
          ) : <span className="text-gray-400 italic">(usuario)</span>}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="apodo">Apodo</label>
          <input id="apodo" name="apodo" value={form.apodo} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-aqua-200 transition-all" autoComplete="nickname" aria-label="Apodo" aria-required="false" />

          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="whatsapp">WhatsApp</label>
          <input id="whatsapp" name="whatsapp" type="tel" value={form.whatsapp} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-aqua-200 transition-all" autoComplete="tel" aria-label="WhatsApp" aria-required="true" />

          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="red_social_favorita">Red social favorita <span className="text-red-500">*</span></label>
          <select id="red_social_favorita" name="red_social_favorita" value={form.red_social_favorita} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-aqua-200 focus:border-aqua-400 transition-all" aria-label="Red social favorita" aria-required="true">
            <option value="">Selecciona una red</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="Facebook">Facebook</option>
            <option value="X">X (Twitter)</option>
            <option value="Snapchat">Snapchat</option>
            <option value="BeReal">BeReal</option>
            <option value="YouTube">YouTube</option>
            <option value="Telegram">Telegram</option>
            <option value="Otra">Otra</option>
          </select>
          <input name="usuario_red" value={form.usuario_red} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-aqua-200 transition-all" placeholder="Usuario o link de tu red social favorita" aria-label="Usuario de red social favorita" aria-required="true" />

          <label className="block text-sm font-medium text-gray-700 mb-1 mt-2" htmlFor="gusto_musical">Gusto musical favorito <span className="text-red-500">*</span></label>
          <select id="gusto_musical" name="gusto_musical" value={form.gusto_musical} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-aqua-200 focus:border-aqua-400 transition-all" aria-label="Gusto musical favorito" aria-required="true">
            <option value="">Selecciona un gusto</option>
            <option value="Reggaetón">Reggaetón</option>
            <option value="Electrónica (EDM)">Electrónica (EDM)</option>
            <option value="Pop">Pop</option>
            <option value="Trap/Urban">Trap/Urban</option>
            <option value="Corridos tumbados">Corridos tumbados</option>
            <option value="Banda/Sierreño">Banda/Sierreño</option>
            <option value="Rock alternativo">Rock alternativo</option>
            <option value="Hip-Hop/Rap">Hip-Hop/Rap</option>
            <option value="Salsa/Cumbia">Salsa/Cumbia</option>
            <option value="K-Pop">K-Pop</option>
            <option value="Otra">Otra</option>
          </select>
          {form.gusto_musical === 'Otra' && (
            <input name="otro_gusto" value={form.otro_gusto} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-aqua-200 transition-all" placeholder="Especifica tu gusto musical" aria-label="Otro gusto musical" aria-required="true" />
          )}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, scale: feedback.includes('Error') ? 1.06 : 1.12 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                className={`premium-feedback mt-4 text-center text-base ${feedback.includes('Error') ? 'text-fuchsia-700' : 'text-green-600'}`}
                role="alert"
              >{feedback}</motion.div>
            )}
          </AnimatePresence>
          <WowButton type="submit" disabled={saving || !isDirty} loading={saving} aria-label="Guardar cambios">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </WowButton>
        </form>
        {/* Eliminar el link redundante de 'Ir a inicio' */}
        {/* <button onClick={() => router.push('/dashboard')} className="text-aqua-700 underline">Ir a inicio</button> */}
      </main>
      <BotonHome />
    </div>
  );
}
