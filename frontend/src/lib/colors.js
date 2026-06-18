// Paleta de colores para notas. El valor guardado en `note.color` es la KEY.
// Cada color define un acento y un fondo suave para la tarjeta.
export const NOTE_COLORS = [
  { key: 'default', label: 'Neutro', accent: '#6366F1', soft: '#EEF0FF' },
  { key: 'amber', label: 'Ambar', accent: '#F59E0B', soft: '#FEF6E7' },
  { key: 'rose', label: 'Rosa', accent: '#F43F5E', soft: '#FDECEF' },
  { key: 'emerald', label: 'Verde', accent: '#10B981', soft: '#E7F8F1' },
  { key: 'sky', label: 'Azul', accent: '#0EA5E9', soft: '#E5F4FD' },
  { key: 'violet', label: 'Violeta', accent: '#8B5CF6', soft: '#F1ECFE' },
  { key: 'slate', label: 'Gris', accent: '#64748B', soft: '#EEF1F5' }
]

const MAP = Object.fromEntries(NOTE_COLORS.map((c) => [c.key, c]))

export function colorOf(key) {
  return MAP[key] || MAP.default
}
