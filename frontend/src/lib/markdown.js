// Renderizador de markdown basico, sin dependencias. Devuelve HTML seguro:
// primero escapa TODO el texto, luego aplica un subconjunto de markdown.
// Soporta: # headings, **bold**, *italic*, `code`, - listas, > citas, enlaces y saltos.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(text) {
  let t = text
  // codigo en linea (antes que el resto para no formatear su interior)
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
  // negrita
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // italica
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  // enlaces [texto](url) — solo http/https
  t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  return t
}

export function renderMarkdown(src) {
  if (!src) return ''
  const lines = escapeHtml(src).split(/\r?\n/)
  const out = []
  let inList = false

  const closeList = () => {
    if (inList) {
      out.push('</ul>')
      inList = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (/^#{1,6}\s+/.test(line)) {
      closeList()
      const level = line.match(/^#+/)[0].length
      const content = inline(line.replace(/^#+\s+/, ''))
      out.push(`<h${level}>${content}</h${level}>`)
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`)
      continue
    }
    if (/^>\s?/.test(line)) {
      closeList()
      out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`)
      continue
    }
    if (line === '') {
      closeList()
      continue
    }
    closeList()
    out.push(`<p>${inline(line)}</p>`)
  }
  closeList()
  return out.join('\n')
}
