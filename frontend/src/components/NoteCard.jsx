import { colorOf } from '../lib/colors'
import { formatRelative } from '../lib/format'

// Tarjeta de nota en el grid. Click (o Enter/Space) abre el editor.
function preview(content) {
  if (!content) return ''
  // quita marcas markdown simples para el preview
  const plain = content
    .replace(/[#>*`_-]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim()
  return plain.length > 180 ? `${plain.slice(0, 180)}…` : plain
}

export default function NoteCard({ note, onOpen }) {
  const c = colorOf(note.color)
  const previewText = preview(note.content)

  return (
    <article
      className="note-card"
      style={{ '--note-accent': c.accent, '--note-soft': c.soft }}
      tabIndex={0}
      role="button"
      aria-label={`Abrir nota: ${note.title || 'Sin titulo'}`}
      onClick={() => onOpen(note.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(note.id)
        }
      }}
    >
      <span className="note-card__bar" aria-hidden="true" />
      <div className="note-card__head">
        <h3 className="note-card__title">{note.title || 'Sin titulo'}</h3>
        {note.pinned && (
          <span className="note-card__pin" title="Fijada" aria-label="Fijada">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M12.3 2.2a1 1 0 0 1 1.4 0l4.1 4.1a1 1 0 0 1-.5 1.7l-3 .7-3.4 3.4.2 3.1a1 1 0 0 1-1.7.8L6.6 14 3.3 17.3a1 1 0 0 1-1.4-1.4L5.2 12.6 2.9 10.3a1 1 0 0 1 .8-1.7l3.1.2 3.4-3.4.7-3a1 1 0 0 1 .4-.6Z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}
      </div>

      {previewText ? (
        <p className="note-card__preview">{previewText}</p>
      ) : (
        <p className="note-card__preview note-card__preview--empty">Sin contenido</p>
      )}

      <div className="note-card__foot">
        <div className="note-card__tags">
          {(note.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="chip chip--sm">
              {tag}
            </span>
          ))}
          {note.tags && note.tags.length > 3 && (
            <span className="chip chip--sm chip--more">+{note.tags.length - 3}</span>
          )}
        </div>
        <time className="note-card__date" dateTime={note.updated_at || note.created_at}>
          {formatRelative(note.updated_at || note.created_at)}
        </time>
      </div>
    </article>
  )
}
