// Spinner pastel minimalista premium
export default function Spinner({ size = 22, className = '' }) {
  return (
    <span
      className={`inline-block align-middle animate-spin ${className}`}
      style={{ width: size, height: size }}
      aria-label="Cargando"
      role="status"
    >
      <svg
        viewBox="0 0 50 50"
        style={{ width: size, height: size }}
        className="text-aqua-400"
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#a5f3fc"
          strokeWidth="6"
          opacity="0.25"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="6"
          strokeDasharray="90 150"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
