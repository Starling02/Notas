import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/auth'
import { getToken, setToken, onUnauthorized } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // sesion en proceso de restaurar

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Registra el handler global de 401 una sola vez.
  useEffect(() => {
    onUnauthorized(() => logout())
  }, [logout])

  // Al montar: si hay token, intenta restaurar la sesion con /auth/me.
  useEffect(() => {
    let active = true
    async function restore() {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const me = await authApi.me()
        if (active) setUser(me)
      } catch {
        if (active) setToken(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    restore()
    return () => {
      active = false
    }
  }, [])

  const handleAuthResponse = useCallback((resp) => {
    setToken(resp.access_token)
    setUser(resp.user)
    return resp.user
  }, [])

  const login = useCallback(
    async (credentials) => {
      const resp = await authApi.login(credentials)
      return handleAuthResponse(resp)
    },
    [handleAuthResponse]
  )

  const register = useCallback(
    async (credentials) => {
      const resp = await authApi.register(credentials)
      return handleAuthResponse(resp)
    },
    [handleAuthResponse]
  )

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
