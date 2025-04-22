import AnimatedBackground from '../components/AnimatedBackground';
import Logo from '../components/Logo';
import WowButton from '../components/WowButton';
import Link from 'next/link';

export default function LandingAgencia() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-x-hidden">
      <AnimatedBackground />
      <main className="w-full max-w-2xl mx-auto px-4 pt-10 pb-16 flex flex-col items-center z-10">
        {/* Logo y branding principal */}
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="mt-4 text-4xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent text-center drop-shadow-lg">Tu Agencia de Inteligencia & Apps Premium</h1>
          <p className="mt-2 text-lg text-gray-600 text-center max-w-md">Creamos experiencias digitales de alto impacto, impulsadas por inteligencia artificial, diseño Apple-like y tecnología de vanguardia.</p>
        </div>
        {/* Sección de servicios */}
        <section className="w-full mb-10">
          <h2 className="text-2xl font-bold text-fuchsia-700 mb-3 text-center">¿Qué hacemos?</h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            <li className="bg-white/90 rounded-3xl shadow-2xl px-4 py-8 flex flex-col items-center">
              <span className="text-3xl mb-2">🤖</span>
              <span className="font-semibold text-lg mb-1">Apps a Medida</span>
              <span className="text-gray-500 text-sm text-center">Desarrollo de aplicaciones web/mobile premium, con integración de IA y experiencia Apple-like.</span>
            </li>
            <li className="bg-white/90 rounded-3xl shadow-2xl px-4 py-8 flex flex-col items-center">
              <span className="text-3xl mb-2">🧠</span>
              <span className="font-semibold text-lg mb-1">Inteligencia Artificial</span>
              <span className="text-gray-500 text-sm text-center">Soluciones de IA generativa, asistentes inteligentes y automatización para tu negocio.</span>
            </li>
            <li className="bg-white/90 rounded-3xl shadow-2xl px-4 py-8 flex flex-col items-center">
              <span className="text-3xl mb-2">🎨</span>
              <span className="font-semibold text-lg mb-1">UX/UI & Auditoría</span>
              <span className="text-gray-500 text-sm text-center">Diseño, auditoría y perfeccionamiento de experiencia premium, inspirado en el estándar Apple.</span>
            </li>
            <li className="bg-white/90 rounded-3xl shadow-2xl px-4 py-8 flex flex-col items-center">
              <span className="text-3xl mb-2">🚀</span>
              <span className="font-semibold text-lg mb-1">Consultoría & Estrategia</span>
              <span className="text-gray-500 text-sm text-center">Acompañamiento experto para digitalizar, innovar y escalar tu negocio.</span>
            </li>
          </ul>
        </section>
        {/* Demo visual / caso de éxito */}
        <section className="w-full mb-10">
          <h2 className="text-2xl font-bold text-cyan-700 mb-3 text-center">Caso de Éxito</h2>
          <div className="bg-white/80 rounded-3xl shadow-xl px-4 py-6 flex flex-col items-center">
            <img src="/logo.png" alt="Demo App" className="h-16 w-16 rounded-xl shadow mb-3" />
            <p className="text-gray-600 text-center mb-2">Nuestra app de eventos premium: experiencia Apple-like, multimedia, integración IA y Supabase, 100% responsive y lista para escalar.</p>
            <div className="flex gap-3 mt-2">
              <Link href="/" passHref legacyBehavior><a className="text-fuchsia-600 underline text-sm">Ver demo</a></Link>
              <Link href="/dashboard" passHref legacyBehavior><a className="text-cyan-600 underline text-sm">Entrar a la app</a></Link>
            </div>
          </div>
        </section>
        {/* Testimonios (placeholder) */}
        <section className="w-full mb-10">
          <h2 className="text-2xl font-bold text-fuchsia-700 mb-3 text-center">Lo que dicen de nosotros</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/90 rounded-3xl shadow-xl px-4 py-6 flex flex-col items-center">
              <span className="text-xl font-semibold text-gray-700 mb-1">“Experiencia premium real, superó mis expectativas.”</span>
              <span className="text-sm text-gray-400">— Cliente demo</span>
            </div>
            <div className="bg-white/90 rounded-3xl shadow-xl px-4 py-6 flex flex-col items-center">
              <span className="text-xl font-semibold text-gray-700 mb-1">“La integración de IA y el diseño Apple-like marcan la diferencia.”</span>
              <span className="text-sm text-gray-400">— Usuario piloto</span>
            </div>
          </div>
        </section>
        {/* CTA final */}
        <section className="w-full flex flex-col items-center mt-8">
          <h2 className="text-2xl font-bold text-cyan-700 mb-4 text-center">¿Listo para llevar tu proyecto al siguiente nivel?</h2>
          <Link href="mailto:contacto@tuagencia.com" passHref legacyBehavior>
            <a>
              <WowButton style={{minWidth:'220px'}}>Solicita una demo</WowButton>
            </a>
          </Link>
        </section>
      </main>
    </div>
  );
}
