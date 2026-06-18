import { api } from './client'

// Endpoints de autenticacion.
export const authApi = {
  register: ({ email, password }) =>
    api.post('/auth/register', { email, password }, { auth: false }),

  login: ({ email, password }) =>
    api.post('/auth/login', { email, password }, { auth: false }),

  me: () => api.get('/auth/me')
}
