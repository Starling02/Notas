import { useAuth } from '../context/AuthContext'

// Sidebar: marca, accion nueva nota, filtro por etiquetas, usuario + logout.
// En movil es un drawer controlado por `open` / `onClose`.
export default function Sidebar({
  tags,
  activeTag,
  onSelectTag,
  onNewNote,
  open,
  onClose
}) {
  const { user, logout } = useAuth()

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Navegacion">
        <div className="sidebar__brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <rect width="32" height="32" rx="8" fill="#6366F1" />
              <path
                d="M9 8.5h11a3 3 0 0 1 3 3V20l-5 5H12a3 3 0 0 1-3-3V8.5Z"
                fill="#fff"
              />
              <path d="M18 25v-3a2 2 0 0 1 2-2h3l-5 5Z" fill="#C7D2FE" />
            </svg>
          </span>
          <span className="brand-name">Notas</span>
          <button
            type="button"
            className="sidebar__close"
            onClick={onClose}
            aria-label="Cerrar menu"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <path
                d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <button type="button" className="btn btn--primary sidebar__new" onClick={onNewNote}>
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z"
              fill="currentColor"
            />
          </svg>
          Nueva nota
        </button>

        <nav className="sidebar__nav" aria-label="Filtrar por etiqueta">
          <p className="sidebar__heading">Etiquetas</p>
          <ul className="taglist">
            <li>
              <button
                type="button"
                className={`taglist__item ${!activeTag ? 'is-active' : ''}`}
                aria-pressed={!activeTag}
                onClick={() => onSelectTag(null)}
              >
                <span className="taglist__dot taglist__dot--all" aria-hidden="true" />
                Todas las notas
              </button>
            </li>
            {tags.length === 0 && (
              <li className="taglist__empty">Aun no hay etiquetas</li>
            )}
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className={`taglist__item ${activeTag === tag ? 'is-active' : ''}`}
                  aria-pressed={activeTag === tag}
                  onClick={() => onSelectTag(tag)}
                >
                  <span className="taglist__dot" aria-hidden="true" />
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__user">
          <div className="avatar" aria-hidden="true">
            {(user?.email || '?').slice(0, 1).toUpperCase()}
          </div>
          <span className="sidebar__email" title={user?.email}>
            {user?.email}
          </span>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={logout}
            aria-label="Cerrar sesion"
            title="Cerrar sesion"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path
                d="M8 3a1 1 0 0 1 0 2H5v10h3a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3Zm5.3 3.3a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 0 1 0 1.4l-2.5 2.5a1 1 0 0 1-1.4-1.4l.8-.8H9a1 1 0 1 1 0-2h5.1l-.8-.8a1 1 0 0 1 0-1.4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </aside>
    </>
  )
}
