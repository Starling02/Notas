import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'notas-theme'
const ThemeContext = createContext(null)

// Lee la eleccion guardada ('light' | 'dark') o null si el usuario aun no eligio
// (en ese caso se sigue la preferencia del sistema via media query en el CSS).
function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function systemPrefersDark() {
  return typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStored) // 'light' | 'dark' | null (auto)

  // Aplica el atributo en <html> y persiste la eleccion.
  useEffect(() => {
    const root = document.documentElement
    if (theme === null) {
      root.removeAttribute('data-theme')
      try { localStorage.removeItem(STORAGE_KEY) } catch {}
    } else {
      root.setAttribute('data-theme', theme)
      try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
    }
  }, [theme])

  // Si esta en modo automatico, refleja los cambios del sistema en vivo.
  const [systemDark, setSystemDark] = useState(systemPrefersDark)
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Tema efectivo actual (resuelve el modo automatico).
  const resolved = theme ?? (systemDark ? 'dark' : 'light')

  const toggleTheme = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved])

  const value = useMemo(
    () => ({ theme, resolved, isDark: resolved === 'dark', toggleTheme, setTheme }),
    [theme, resolved, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
