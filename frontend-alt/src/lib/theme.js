import { writable } from 'svelte/store';

const KEY = 'notas_theme';
const initial = localStorage.getItem(KEY) || 'dark'; // oscuro por defecto

export const theme = writable(initial);

theme.subscribe((value) => {
  document.documentElement.setAttribute('data-theme', value);
  localStorage.setItem(KEY, value);
});

export function toggleTheme() {
  theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}
