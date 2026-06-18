import { api } from './client'

// CRUD de notas. Nota: {id,title,content,tags[],color,pinned,created_at,updated_at}
export const notesApi = {
  list: ({ q, tag } = {}) => api.get('/notes', { params: { q, tag } }),
  get: (id) => api.get(`/notes/${id}`),
  create: (note) => api.post('/notes', note),
  update: (id, note) => api.put(`/notes/${id}`, note),
  remove: (id) => api.delete(`/notes/${id}`)
}
