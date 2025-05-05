import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import FormInput from '../../components/FormInput';
import WowButton from '../../components/WowButton';
import AnimatedBackground from '../../components/AnimatedBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const years = Array.from({ length: 61 }, (_, i) => 2010 - i); // 2010 a 1950

export default function Register() {
  const router = useRouter();
  const { type } = router.query;
  const [form, setForm] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dia: '',
    mes: '',
    anio: '',
    apodo: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Redirección automática si falta el parámetro type
  useEffect(() => {
    if (typeof type === 'undefined' || (type !== 'festejado' && type !== 'invitado')) {
      router.replace('/auth/register-type');
    }
  }, [type, router]);

  useEffect(() => {
    if (typeof type === 'undefined') return;
    setForm((prev) => ({ ...prev, tipo: type }));
  }, [type]);

  const validate = () => {
    let errs = {};
    if (!form.nombres.trim()) errs.nombres = 'Nombres requeridos';
    if (!form.apellidoPaterno.trim()) errs.apellidoPaterno = 'Apellido paterno requerido';
    if (!form.apellidoMaterno.trim()) errs.apellidoMaterno = 'Apellido materno requerido';
    if (!form.dia || !form.mes || !form.anio) errs.fechaNacimiento = 'Fecha de nacimiento requerida';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Email inválido';
    if (!/^\d{10}$/.test(form.whatsapp)) errs.whatsapp = 'WhatsApp debe tener 10 dígitos';
    if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateInvitado = () => {
    let errs = {};
    if (!form.nombres.trim()) errs.nombres = 'Nombre requerido';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Email inválido';
    if (!/^\d{10}$/.test(form.whatsapp)) errs.whatsapp = 'WhatsApp debe tener 10 dígitos';
    if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'festejado') {
      if (!validate()) return;
    } else if (type === 'invitado') {
      if (!validateInvitado()) return;
    }
    setLoading(true);
    setFeedback('');
    let userData = {
      nombres: form.nombres,
      email: form.email,
      password: form.password,
    };
    if (type === 'festejado') {
      // Festejado: datos completos
      const fechaNacimiento = `${form.anio}-${String(months.indexOf(form.mes) + 1).padStart(2, '0')}-${String(form.dia).padStart(2, '0')}`;
      userData = {
        ...userData,
        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno,
        fechaNacimiento,
        apodo: form.apodo,
        whatsapp: form.whatsapp,
      };
    }
    // 1. Crear usuario en Supabase Auth
    let data = null, error = null;
    try {
      ({ data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: userData,
        },
      }));
      if (error) {
        setLoading(false);
        setFeedback('Error de registro: ' + error.message);
        console.error('Supabase signUp error:', error);
        return;
      }
      if (!data?.user) {
        setLoading(false);
        setFeedback('No se pudo crear el usuario. Intenta de nuevo o contacta soporte.');
        return;
      }
    } catch (err) {
      setLoading(false);
      setFeedback('Error inesperado: ' + (err.message || err.toString()));
      console.error('Excepción en signUp:', err);
      return;
    }
    // 2. Crear perfil en la tabla profiles
    const userId = data?.user?.id || data?.session?.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: userId,
          nombre: form.nombres,
          apodo: form.apodo,
          whatsapp: form.whatsapp,
          tipo: type,
        },
      ]);
      if (profileError) {
        setFeedback('Error al guardar perfil: ' + profileError.message);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setSuccess(true);
    setFeedback('¡Registro exitoso! Si no recibes el correo de confirmación revisa tu bandeja de SPAM o contacta soporte.');
    // Log para depuración
    console.log('Registro exitoso. Data Supabase:', data);
  };

  if (typeof type === 'undefined' || (type !== 'festejado' && type !== 'invitado')) {
    return null; // Prevent flash before redirect
  }

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <main className="z-10 w-full max-w-md mx-auto px-4 py-8">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl font-extrabold text-spring-500 dark:text-summer-300 mb-6 text-center font-display">
          {type === 'festejado' ? 'Crear cuenta (festejado/a)' : 'Crear cuenta (invitado/a)'}
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <FormInput label="Nombres" name="nombres" type="text" value={form.nombres} onChange={handleChange} error={errors.nombres} autoComplete="given-name" aria-required="true" />
          {type === 'festejado' && (
            <>
              <FormInput label="Apellido paterno" name="apellidoPaterno" type="text" value={form.apellidoPaterno} onChange={handleChange} error={errors.apellidoPaterno} autoComplete="family-name" aria-required="true" />
              <FormInput label="Apellido materno" name="apellidoMaterno" type="text" value={form.apellidoMaterno} onChange={handleChange} error={errors.apellidoMaterno} autoComplete="additional-name" aria-required="true" />
              <div>
                <label className="block text-sm font-medium text-spring-700 dark:text-summer-200 mb-1" htmlFor="fecha-nacimiento-selects">Fecha de nacimiento</label>
                <div className="flex gap-2" id="fecha-nacimiento-selects">
                  <select name="dia" value={form.dia} onChange={handleChange} className="border rounded px-2 py-1 focus:ring-2 focus:ring-aqua-200 focus:border-aqua-400 transition-all" required aria-label="Día de nacimiento">
                    <option value="">Día</option>
                    {days.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select name="mes" value={form.mes} onChange={handleChange} className="border rounded px-2 py-1 focus:ring-2 focus:ring-aqua-200 focus:border-aqua-400 transition-all" required aria-label="Mes de nacimiento">
                    <option value="">Mes</option>
                    {months.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select name="anio" value={form.anio} onChange={handleChange} className="border rounded px-2 py-1 focus:ring-2 focus:ring-aqua-200 focus:border-aqua-400 transition-all" required aria-label="Año de nacimiento">
                    <option value="">Año</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {errors.fechaNacimiento && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-feedback text-fuchsia-700 mt-1 text-xs" role="alert">{errors.fechaNacimiento}</motion.div>}
              </div>
              <FormInput label="Apodo (opcional)" name="apodo" type="text" value={form.apodo} onChange={handleChange} error={errors.apodo} autoComplete="nickname" optional aria-required="false" />
              <FormInput label="WhatsApp" name="whatsapp" type="tel" value={form.whatsapp} onChange={handleChange} error={errors.whatsapp} autoComplete="tel" aria-required="true" />
            </>
          )}
          <FormInput label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" aria-required="true" />
          <FormInput label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" aria-required="true" />
          <FormInput label="Corrobora contraseña" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" aria-required="true" />
          <WowButton type="submit" disabled={loading || success} loading={loading} aria-label="Registrarse">{loading ? 'Registrando...' : 'Registrarse'}</WowButton>
        </form>
        {feedback && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`premium-feedback mt-4 text-center text-base ${success ? 'text-green-600' : 'text-fuchsia-700'}`} role="alert">{feedback}</motion.div>}
        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-spring-600 dark:text-summer-200 underline">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </main>
    </div>
  );
}
