import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import WowButton from '../../components/WowButton';
import AnimatedBackground from '../../components/AnimatedBackground';
import Spinner from '../../components/Spinner';

export default function Invitacion() {
  const router = useRouter();
  const { id } = router.query;
  const [invitado, setInvitado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    whatsapp: '',
    red_social: '',
    usuario_red: '',
    email: '',
    asistencia: '',
  });
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('invitados')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('Invitación no encontrada.');
        } else {
          setInvitado(data);
          setForm(f => ({
            ...f,
            nombre: data.nombre || '',
            whatsapp: data.whatsapp || '',
            red_social: '',
            usuario_red: '',
            email: data.email || '',
            asistencia: data.estado === 'Confirmado' ? 'si' : '',
          }));
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGuardado(false);
    const { error: updateError } = await supabase
      .from('invitados')
      .update({
        nombre: form.nombre,
        whatsapp: form.whatsapp,
        red_social: form.red_social,
        usuario_red: form.usuario_red,
        email: form.email,
        estado: form.asistencia === 'si' ? 'Confirmado' : 'Pendiente',
      })
      .eq('id', id);
    setLoading(false);
    if (updateError) {
      setError('No se pudo guardar tu confirmación.');
    } else {
      setGuardado(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-yellow-50">
      <AnimatedBackground />
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 glass-card rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-extrabold premium-title mb-6 text-center">Confirmar asistencia</h1>
        {loading && <Spinner />}
        {error && (
          <div className="premium-feedback text-fuchsia-700 text-center text-base mb-4" role="alert">{error}</div>
        )}
        {guardado && (
          <div className="premium-feedback text-green-600 text-center text-base mb-4" role="alert">¡Tu confirmación fue registrada!</div>
        )}
        {!loading && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre">Nombre</label>
              <input name="nombre" id="nombre" value={form.nombre} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300" autoComplete="name" aria-label="Nombre del invitado" aria-required="true" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="whatsapp">WhatsApp</label>
              <input name="whatsapp" id="whatsapp" value={form.whatsapp} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300" autoComplete="tel" placeholder="Ej: 5512345678" aria-label="WhatsApp del invitado" aria-required="true" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="red_social">Red social favorita <span className="text-red-500">*</span></label>
              <select name="red_social" id="red_social" value={form.red_social} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Red social favorita" aria-required="true">
                <option value="">Selecciona una opción</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="X">X (Twitter)</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Snapchat">Snapchat</option>
                <option value="BeReal">BeReal</option>
                <option value="YouTube">YouTube</option>
                <option value="Telegram">Telegram</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="usuario_red">Usuario o link de tu red social favorita <span className="text-red-500">*</span></label>
              <input name="usuario_red" id="usuario_red" value={form.usuario_red} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Ej: @usuario o https://instagram.com/usuario" aria-label="Usuario o link de red social favorita" aria-required="true" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email <span className="text-gray-400">(opcional)</span></label>
              <input name="email" id="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300" autoComplete="email" aria-label="Correo electrónico (opcional)" aria-required="false" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="asistencia">¿Vas a asistir?</label>
              <select name="asistencia" id="asistencia" value={form.asistencia} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="¿Vas a asistir?" aria-required="true">
                <option value="">Selecciona una opción</option>
                <option value="si">¡Sí, confirmo asistencia!</option>
                <option value="no">No podré asistir</option>
              </select>
            </div>
            <WowButton loading={loading} disabled={loading} aria-label="Guardar respuesta de confirmación de asistencia">Guardar respuesta</WowButton>
          </form>
        )}
      </main>
    </div>
  );
}
