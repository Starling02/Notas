// API client: fetch wrapper con interceptor de token Bearer y manejo de 401.
// Base configurable via VITE_API_URL (default http://localhost:8000). Todo bajo /api.

const RAW_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// Normaliza: quita slash final y asegura sufijo /api
const ORIGIN = RAW_BASE.replace(/\/+$/, '')
export const API_BASE = ORIGIN.endsWith('/api') ? ORIGIN : `${ORIGIN}/api`

const TOKEN_KEY = 'notas.token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// Callback que registra el AuthContext para reaccionar a un 401 (forzar logout).
let unauthorizedHandler = null
export function onUnauthorized(handler) {
  unauthorizedHandler = handler
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function buildQuery(params) {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.append(k, v)
  })
  const s = usp.toString()
  return s ? `?${s}` : ''
}

async function request(method, path, { body, params, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE}${path}${buildQuery(params)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch (networkErr) {
    throw new ApiError(
      'No se pudo conectar con el servidor. Revisa tu conexion.',
      0,
      null
    )
  }

  // Interceptor 401: token invalido o expirado -> logout global.
  if (res.status === 401) {
    if (auth && unauthorizedHandler) unauthorizedHandler()
    throw new ApiError('No autorizado. Inicia sesion de nuevo.', 401, null)
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message || data.error)) ||
      `Error ${res.status}`
    // FastAPI suele devolver detail como array de objetos {msg}
    const friendly = Array.isArray(message)
      ? message.map((m) => m.msg || JSON.stringify(m)).join(', ')
      : message
    throw new ApiError(friendly, res.status, data)
  }

  return data
}

export const api = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...opts, body }),
  put: (path, body, opts) => request('PUT', path, { ...opts, body }),
  delete: (path, opts) => request('DELETE', path, opts)
}
