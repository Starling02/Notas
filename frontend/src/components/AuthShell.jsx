// Layout split-screen para Login/Register: panel de marca + tarjeta de formulario.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth__aside" aria-hidden="true">
        <div className="auth__brand">
          <span className="brand-mark">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <rect width="32" height="32" rx="8" fill="#fff" opacity="0.16" />
              <path
                d="M9 8.5h11a3 3 0 0 1 3 3V20l-5 5H12a3 3 0 0 1-3-3V8.5Z"
                fill="#fff"
              />
              <path d="M18 25v-3a2 2 0 0 1 2-2h3l-5 5Z" fill="#C7D2FE" />
            </svg>
          </span>
          <span className="brand-name">Notas</span>
        </div>
        <div className="auth__pitch">
          <h2>Tus ideas, ordenadas y siempre a mano.</h2>
          <p>
            Captura notas, organiza con etiquetas y colores, fija lo importante y
            encuentralo todo al instante.
          </p>
        </div>
        <ul className="auth__features">
          <li>Busqueda en vivo</li>
          <li>Etiquetas y colores</li>
          <li>Markdown basico</li>
        </ul>
      </aside>

      <main className="auth__main">
        <div className="auth__card">
          <header className="auth__header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </header>
          {children}
        </div>
      </main>
    </div>
  )
}
