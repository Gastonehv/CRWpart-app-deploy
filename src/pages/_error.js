// Página de error personalizada para Next.js
export default function Error({ statusCode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white/90">
      <h1 className="text-5xl font-extrabold text-aqua-500 mb-4 font-display">
        {statusCode ? `Error ${statusCode}` : 'Error inesperado'}
      </h1>
      <p className="text-lg text-gray-600 mb-8 font-light text-center max-w-md">
        {statusCode === 404
          ? 'La página que buscas no existe o fue movida.'
          : 'Ocurrió un problema inesperado. Puedes intentar recargar la página o volver al inicio.'}
      </p>
      <a href="/" className="px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-aqua-200"
        style={{
          background: 'linear-gradient(90deg, #22d3ee 0%, #f9a8d4 100%)',
          color: '#155e75',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: '0 2px 16px 0 #a5f3fc33',
          letterSpacing: '0.04em',
          opacity: 1
        }}>
        Ir al inicio
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
