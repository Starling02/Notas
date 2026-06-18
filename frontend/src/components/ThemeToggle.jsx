import { useTheme } from '../context/ThemeContext'

// Boton para alternar entre tema claro y oscuro. Muestra sol/luna segun el
// tema efectivo actual.
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      className="btn btn--ghost btn--icon"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
    >
      {isDark ? (
        // Sol
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M10 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm7-5a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 10a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm10.07-4.95a1 1 0 0 1 0 1.41l-.7.71a1 1 0 1 1-1.42-1.42l.71-.7a1 1 0 0 1 1.41 0ZM6.76 13.24a1 1 0 0 1 0 1.42l-.71.7a1 1 0 0 1-1.41-1.41l.7-.71a1 1 0 0 1 1.42 0Zm8.31 1.41a1 1 0 0 1-1.41 0l-.71-.7a1 1 0 0 1 1.42-1.42l.7.71a1 1 0 0 1 0 1.41ZM6.76 6.76a1 1 0 0 1-1.42 0l-.7-.71A1 1 0 0 1 6.05 4.64l.71.7a1 1 0 0 1 0 1.42Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        // Luna
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M17 12.3A7 7 0 0 1 7.7 3a1 1 0 0 0-1.3-1.2 8.5 8.5 0 1 0 11.8 11.8A1 1 0 0 0 17 12.3Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  )
}
