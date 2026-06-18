import { useState } from 'react'

// Input de etiquetas como chips. Enter o coma agrega; Backspace en vacio borra la ultima.
export default function TagInput({ tags, onChange, id = 'tags' }) {
  const [draft, setDraft] = useState('')

  const addTag = (value) => {
    const clean = value.trim().replace(/^#/, '')
    if (!clean) return
    if (tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setDraft('')
      return
    }
    onChange([...tags, clean])
    setDraft('')
  }

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(draft)
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="taginput" onClick={() => document.getElementById(id)?.focus()}>
      {tags.map((tag) => (
        <span key={tag} className="chip chip--removable">
          {tag}
          <button
            type="button"
            className="chip__x"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag)
            }}
            aria-label={`Quitar etiqueta ${tag}`}
          >
            <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
              <path
                d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </span>
      ))}
      <input
        id={id}
        type="text"
        className="taginput__field"
        placeholder={tags.length ? 'Agregar…' : 'Escribe y pulsa Enter'}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
        aria-label="Agregar etiqueta"
      />
    </div>
  )
}
