import { NOTE_COLORS } from '../lib/colors'

// Selector de color de la nota (radio group accesible).
export default function ColorPicker({ value, onChange }) {
  return (
    <div className="colorpicker" role="radiogroup" aria-label="Color de la nota">
      {NOTE_COLORS.map((c) => {
        const selected = value === c.key
        return (
          <button
            key={c.key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={c.label}
            title={c.label}
            className={`colorpicker__swatch ${selected ? 'is-selected' : ''}`}
            style={{ '--swatch': c.accent }}
            onClick={() => onChange(c.key)}
          >
            {selected && (
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path
                  d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.1-.3Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
