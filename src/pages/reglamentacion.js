// Página de Reglamentación

import BotonHome from '../components/BotonHome';

export default function Reglamentacion() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-6 sm:pt-10">
      <main className="w-full max-w-xs mx-auto bg-white/90 rounded-3xl shadow-2xl px-4 py-8 mb-10">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 flex items-center justify-center w-28 h-28 relative">
            <img src="/logo.png" alt="CRW party logo" className="w-20 h-20 object-contain" style={{ zIndex: 2, background: 'none', boxShadow: 'none' }} />
          </div>
          <span className="text-6xl mb-4">📜</span>
          <h2 className="text-3xl font-extrabold text-gray-700 mb-2 text-center font-display">Reglamentación</h2>
          <p className="text-lg text-gray-500 mb-6 text-center max-w-sm">
            Aquí puedes consultar las normas y términos legales de uso de la plataforma.
          </p>
        </div>
        {/* Botón flotante premium discreto y homogéneo */}
        <BotonHome />
        <section className="w-full bg-white rounded-xl p-4 shadow border border-gray-100">
          <h3 className="text-xl font-bold text-aqua-700 mb-2">Reglamento y Términos Legales</h3>
          <div className="text-gray-600 text-base mb-2">
            <strong>Condiciones de Uso:</strong>
            <ul className="list-disc pl-5 mb-2">
              <li>El uso de la plataforma implica la aceptación total de este reglamento y de los términos y condiciones publicados.</li>
              <li>Está prohibido el uso de lenguaje ofensivo, discriminatorio o que atente contra la moral y las buenas costumbres.</li>
              <li>La organización se reserva el derecho de admisión y permanencia en los eventos.</li>
              <li>Los usuarios son responsables de la veracidad de la información proporcionada al crear festejos o invitar participantes.</li>
              <li>Queda estrictamente prohibido el uso de la plataforma para fines ilícitos o contrarios a la ley.</li>
              <li>El incumplimiento de estas normas puede derivar en la suspensión o cancelación de la cuenta, sin derecho a reembolso.</li>
            </ul>
            <strong>Política de Privacidad:</strong>
            <ul className="list-disc pl-5 mb-2">
              <li>La información personal de los usuarios será tratada conforme a las leyes de protección de datos vigentes.</li>
              <li>No compartiremos tus datos con terceros sin tu consentimiento expreso, salvo obligación legal.</li>
              <li>Puedes consultar el aviso de privacidad completo en <a href="https://crwapp.com/aviso-privacidad" className="text-aqua-700 underline" target="_blank" rel="noopener noreferrer">este enlace</a>.</li>
            </ul>
            <strong>Responsabilidad y Buenas Prácticas:</strong>
            <ul className="list-disc pl-5 mb-2">
              <li>Los organizadores de festejos deben garantizar un ambiente seguro y respetuoso para todos los participantes.</li>
              <li>Está prohibido el ingreso de sustancias ilegales o peligrosas a los eventos organizados mediante la plataforma.</li>
              <li>Cualquier conducta inapropiada podrá ser sancionada conforme a este reglamento y a la legislación aplicable.</li>
            </ul>
            <strong>Actualización de Normas:</strong>
            <ul className="list-disc pl-5">
              <li>La plataforma podrá modificar este reglamento en cualquier momento. Los cambios serán notificados oportunamente a los usuarios.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
