import ThemeToggle from './ThemeToggle'

// Barra superior del dashboard: boton de menu (movil), busqueda en vivo, contador.
export default function Topbar({ query, onQueryChange, onOpenMenu, count, activeTag }) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="btn btn--ghost btn--icon topbar__menu"
        onClick={onOpenMenu}
        aria-label="Abrir menu"
      >
        <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true">
          <path
            d="M3 5h14a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2Zm0 4h14a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2Zm0 4h14a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div className="search">
        <svg className="search__icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M9 3a6 6 0 1 0 3.7 10.7l3.3 3.3a1 1 0 0 0 1.4-1.4l-3.3-3.3A6 6 0 0 0 9 3Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
            fill="currentColor"
          />
        </svg>
        <input
          type="search"
          className="search__input"
          placeholder="Buscar notas…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Buscar notas"
        />
        {query && (
          <button
            type="button"
            className="search__clear"
            onClick={() => onQueryChange('')}
            aria-label="Limpiar busqueda"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="topbar__meta" aria-live="polite">
        {activeTag && <span className="chip chip--accent">#{activeTag}</span>}
        <span className="topbar__count">
          {count} {count === 1 ? 'nota' : 'notas'}
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}
