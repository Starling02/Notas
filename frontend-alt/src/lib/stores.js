import { writable, derived } from 'svelte/store';
import { auth, notes as notesApi, getToken, setToken, clearToken } from './api.js';

// --- Sesion ---
export const user = writable(null);
export const authReady = writable(false); // true cuando ya verificamos el token inicial

export async function bootstrapSession() {
  const token = getToken();
  if (!token) {
    authReady.set(true);
    return;
  }
  try {
    const me = await auth.me();
    user.set(me);
  } catch {
    clearToken();
    user.set(null);
  } finally {
    authReady.set(true);
  }
}

export async function login(email, password) {
  const data = await auth.login(email, password);
  setToken(data.access_token);
  user.set(data.user);
}

export async function register(email, password) {
  const data = await auth.register(email, password);
  setToken(data.access_token);
  user.set(data.user);
}

export function logout() {
  clearToken();
  user.set(null);
  notesList.set([]);
}

// --- Notas ---
export const notesList = writable([]);
export const loadingNotes = writable(false);
export const notesError = writable(null);

// Filtros
export const searchQuery = writable('');
export const activeTag = writable('');

export async function loadNotes() {
  loadingNotes.set(true);
  notesError.set(null);
  let q, tag;
  searchQuery.subscribe((v) => (q = v))();
  activeTag.subscribe((v) => (tag = v))();
  try {
    const data = await notesApi.list({ q, tag });
    notesList.set(Array.isArray(data) ? data : []);
  } catch (e) {
    notesError.set(e.message);
  } finally {
    loadingNotes.set(false);
  }
}

export async function createNote(note) {
  const created = await notesApi.create(note);
  await loadNotes();
  return created;
}

export async function updateNote(id, note) {
  const updated = await notesApi.update(id, note);
  await loadNotes();
  return updated;
}

export async function deleteNote(id) {
  await notesApi.remove(id);
  notesList.update((list) => list.filter((n) => n.id !== id));
}

export async function togglePin(note) {
  await notesApi.update(note.id, { ...note, pinned: !note.pinned });
  await loadNotes();
}

// Etiquetas unicas derivadas de las notas cargadas, ordenadas.
export const allTags = derived(notesList, ($notes) => {
  const set = new Set();
  for (const n of $notes) {
    for (const t of n.tags || []) set.add(t);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
});

// Notas ordenadas: fijadas primero, luego por updated_at desc.
export const sortedNotes = derived(notesList, ($notes) => {
  return [...$notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    const ta = new Date(a.updated_at || a.created_at || 0).getTime();
    const tb = new Date(b.updated_at || b.created_at || 0).getTime();
    return tb - ta;
  });
});
