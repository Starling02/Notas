import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { notesApi } from '../api/notes'
import { useToast } from '../context/ToastContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTag = searchParams.get('tag') || null
  const urlQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(urlQuery) // valor del input (inmediato)
  const [notes, setNotes] = useState([])
  const [allTags, setAllTags] = useState([]) // universo de etiquetas (sin filtrar)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Carga de notas filtradas por q/tag.
  const fetchNotes = useCallback(
    async (q, tag) => {
      setLoading(true)
      try {
        const data = await notesApi.list({ q, tag })
        setNotes(Array.isArray(data) ? data : data.items || [])
      } catch (err) {
        toast.error(err.message || 'No se pudieron cargar las notas.')
        setNotes([])
      } finally {
        setLoading(false)
      }
    },
    [toast]
  )

  // Universo de etiquetas: se calcula con una carga sin filtros, una vez al montar
  // y tras cambios (creacion/borrado) via refreshTags.
  const refreshTags = useCallback(async () => {
    try {
      const data = await notesApi.list({})
      const list = Array.isArray(data) ? data : data.items || []
      const set = new Set()
      list.forEach((n) => (n.tags || []).forEach((t) => set.add(t)))
      setAllTags([...set].sort((a, b) => a.localeCompare(b)))
    } catch {
      /* silencioso: el filtro de etiquetas es secundario */
    }
  }, [])

  useEffect(() => {
    refreshTags()
  }, [refreshTags])

  // Debounce de la busqueda en vivo: sincroniza input -> URL (?q=).
  const debounceRef = useRef(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (query) next.set('q', query)
      else next.delete('q')
      setSearchParams(next, { replace: true })
    }, 300)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Cuando cambian los parametros efectivos de URL, recarga.
  useEffect(() => {
    fetchNotes(urlQuery, activeTag)
  }, [urlQuery, activeTag, fetchNotes])

  const selectTag = (tag) => {
    const next = new URLSearchParams(searchParams)
    if (tag) next.set('tag', tag)
    else next.delete('tag')
    setSearchParams(next, { replace: true })
    setSidebarOpen(false)
  }

  const newNote = () => navigate('/notes/new')
  const openNote = (id) => navigate(`/notes/${id}`)

  const clearFilters = () => {
    setQuery('')
    setSearchParams({}, { replace: true })
  }

  // Orden: fijadas primero, luego por updated_at desc.
  const ordered = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1
      const da = new Date(a.updated_at || a.created_at || 0).getTime()
      const db = new Date(b.updated_at || b.created_at || 0).getTime()
      return db - da
    })
  }, [notes])

  const pinned = ordered.filter((n) => n.pinned)
  const others = ordered.filter((n) => !n.pinned)
  const hasFilters = !!urlQuery || !!activeTag

  return (
    <div className="layout">
      <Sidebar
        tags={allTags}
        activeTag={activeTag}
        onSelectTag={selectTag}
        onNewNote={newNote}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="layout__main">
        <Topbar
          query={query}
          onQueryChange={setQuery}
          onOpenMenu={() => setSidebarOpen(true)}
          count={ordered.length}
          activeTag={activeTag}
        />

        <main className="content" aria-busy={loading}>
          {loading ? (
            <div className="content__loading">
              <Spinner size={28} />
            </div>
          ) : ordered.length === 0 ? (
            <EmptyState
              filtered={hasFilters}
              onNewNote={newNote}
              onClearFilters={clearFilters}
            />
          ) : (
            <>
              {pinned.length > 0 && (
                <section className="notes-section">
                  <h2 className="notes-section__title">Fijadas</h2>
                  <div className="notes-grid">
                    {pinned.map((n) => (
                      <NoteCard key={n.id} note={n} onOpen={openNote} />
                    ))}
                  </div>
                </section>
              )}
              <section className="notes-section">
                {pinned.length > 0 && others.length > 0 && (
                  <h2 className="notes-section__title">Otras</h2>
                )}
                <div className="notes-grid">
                  {others.map((n) => (
                    <NoteCard key={n.id} note={n} onOpen={openNote} />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
