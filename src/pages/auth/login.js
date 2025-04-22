import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import FormInput from '../../components/FormInput';
import WowButton from '../../components/WowButton';
import AnimatedBackground from '../../components/AnimatedBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const validate = () => {
    let errs = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Email inválido';
    if (!form.password) errs.password = 'Contraseña requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFeedback('');
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
        setFeedback('Debes confirmar tu correo antes de ingresar. Revisa tu bandeja de entrada o spam.');
      } else {
        setFeedback(error.message);
      }
    } else {
      setFeedback('¡Bienvenido! Redirigiendo...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-50 to-cyan-50">
      <AnimatedBackground />
      <main className="relative z-10 w-full max-w-sm mx-auto px-4 py-8 glass-card rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-extrabold premium-title mb-6 text-center">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Correo electrónico"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="username"
          />
          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />
          <WowButton type="submit" loading={loading} disabled={loading}>
            Ingresar
          </WowButton>
        </form>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`premium-feedback mt-4 text-center text-base ${feedback.startsWith('¡Bienvenido') ? 'text-green-600' : 'text-fuchsia-700'}`}
            role="alert"
          >
            {feedback}
          </motion.div>
        )}
        <div className="mt-6 text-center">
          <Link href="/auth/register" className="text-aqua-700 underline">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </main>
    </div>
  );
}
