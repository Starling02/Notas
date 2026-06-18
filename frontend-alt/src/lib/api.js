// Capa de acceso al backend. Mismo contrato que la Version A (React).
// Base configurable via VITE_API_URL, todas las rutas cuelgan de /api, auth Bearer.

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const API = `${BASE}/api`;

const TOKEN_KEY = 'notas_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new ApiError('No se pudo conectar con el servidor.', 0);
  }

  if (res.status === 401) {
    clearToken();
    throw new ApiError('Sesion expirada. Inicia sesion de nuevo.', 401);
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const msg = extractError(data) || `Error ${res.status}`;
    throw new ApiError(msg, res.status);
  }
  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractError(data) {
  if (!data) return null;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
  }
  if (typeof data.message === 'string') return data.message;
  return null;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// --- Auth ---
export const auth = {
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: { email, password }, auth: false }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => request('/auth/me'),
};

// --- Notes ---
export const notes = {
  list: ({ q, tag } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (tag) params.set('tag', tag);
    const qs = params.toString();
    return request(`/notes${qs ? `?${qs}` : ''}`);
  },
  get: (id) => request(`/notes/${id}`),
  create: (note) => request('/notes', { method: 'POST', body: note }),
  update: (id, note) => request(`/notes/${id}`, { method: 'PUT', body: note }),
  remove: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
};
