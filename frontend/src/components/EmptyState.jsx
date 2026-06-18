// Estado vacio amable con CTA.
export default function EmptyState({ filtered, onNewNote, onClearFilters }) {
  if (filtered) {
    return (
      <div className="empty-state" role="status">
        <div className="empty-state__art" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="84" height="84">
            <circle cx="28" cy="28" r="18" fill="none" stroke="#C7D2FE" strokeWidth="4" />
            <path d="M41 41 56 56" stroke="#A5B4FC" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <h2>Sin resultados</h2>
        <p>No encontramos notas con esos filtros. Prueba con otra busqueda o etiqueta.</p>
        <button type="button" className="btn btn--secondary" onClick={onClearFilters}>
          Limpiar filtros
        </button>
      </div>
    )
  }

  return (
    <div className="empty-state" role="status">
      <div className="empty-state__art" aria-hidden="true">
        <svg viewBox="0 0 80 80" width="96" height="96">
          <rect x="16" y="12" width="40" height="52" rx="6" fill="#EEF0FF" stroke="#C7D2FE" strokeWidth="3" />
          <rect x="24" y="24" width="24" height="4" rx="2" fill="#A5B4FC" />
          <rect x="24" y="34" width="18" height="4" rx="2" fill="#C7D2FE" />
          <circle cx="56" cy="56" r="14" fill="#6366F1" />
          <path d="M56 50v12M50 56h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h2>Tu lienzo esta en blanco</h2>
      <p>Crea tu primera nota y empieza a capturar ideas, listas y recordatorios.</p>
      <button type="button" className="btn btn--primary" onClick={onNewNote}>
        Crear mi primera nota
      </button>
    </div>
  )
}
