import Link from 'next/link';

export default function BotonHome({ className = '', style = {} }) {
  return (
    <Link href="/dashboard" legacyBehavior>
      <a
        className={`fixed bottom-6 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow border-2 border-fuchsia-200 transition-all text-sm bg-gradient-to-r from-fuchsia-100 to-cyan-100 text-fuchsia-700 drop-shadow focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 ${className}`}
        style={{
          boxShadow: '0 2px 8px #A78BFA22, 0 1px 4px #22d3ee22',
          backdropFilter: 'blur(2px)',
          ...style,
        }}
        aria-label="Ir a mi espacio"
        tabIndex={0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-7 9 7M4.5 10.5v7.5A1.5 1.5 0 006 19.5h12a1.5 1.5 0 001.5-1.5v-7.5" />
        </svg>
        Ir a mi espacio
      </a>
    </Link>
  );
}
