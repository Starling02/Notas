export default function Spinner({ size = 20, label = 'Cargando' }) {
  return (
    <span
      className="spinner"
      role="status"
      aria-label={label}
      style={{ width: size, height: size }}
    />
  )
}

// Pantalla completa centrada (para restaurar sesion, etc.)
export function FullPageSpinner({ label = 'Cargando…' }) {
  return (
    <div className="fullpage-spinner">
      <Spinner size={32} label={label} />
      <p>{label}</p>
    </div>
  )
}
