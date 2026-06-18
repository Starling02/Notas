import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { notesApi } from '../api/notes'
import { useToast } from '../context/ToastContext'
import TagInput from '../components/TagInput'
import ColorPicker from '../components/ColorPicker'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import { FullPageSpinner } from '../components/Spinner'
import { renderMarkdown } from '../lib/markdown'
import { formatRelative } from '../lib/format'

const emptyNote = { title: '', content: '', tags: [], color: 'default', pinned: false }

export default function NoteEditor() {
  const { id } = useParams()
  const isNew = id === 'new' || id === undefined
  const navigate = useNavigate()
  const toast = useToast()

  const [note, setNote] = useState(emptyNote)
  const [baseline, setBaseline] = useState(emptyNote) // ultimo estado guardado
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)

  // Carga de nota existente.
  useEffect(() => {
    if (isNew) return
    let active = true
    setLoading(true)
    notesApi
      .get(id)
      .then((data) => {
        if (!active) return
        const loaded = {
          title: data.title || '',
          content: data.content || '',
          tags: data.tags || [],
          color: data.color || 'default',
          pinned: !!data.pinned
        }
        setNote(loaded)
        setBaseline(loaded)
        setUpdatedAt(data.updated_at || data.created_at || null)
      })
      .catch((err) => {
        toast.error(err.message || 'No se pudo cargar la nota.')
        navigate('/', { replace: true })
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, isNew, navigate, toast])

  const dirty = useMemo(
    () => JSON.stringify(note) !== JSON.stringify(baseline),
    [note, baseline]
  )

  const update = (patch) => setNote((n) => ({ ...n, ...patch }))

  const save = useCallback(async () => {
    if (saving) return
    if (!note.title.trim() && !note.content.trim()) {
      toast.error('La nota necesita al menos un titulo o contenido.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: note.title.trim(),
        content: note.content,
        tags: note.tags,
        color: note.color,
        pinned: note.pinned
      }
      if (isNew) {
        const created = await notesApi.create(payload)
        toast.success('Nota creada.')
        setBaseline(note)
        navigate(`/notes/${created.id}`, { replace: true })
      } else {
        const saved = await notesApi.update(id, payload)
        setBaseline(note)
        setUpdatedAt(saved.updated_at || new Date().toISOString())
        toast.success('Cambios guardados.')
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar la nota.')
    } finally {
      setSaving(false)
    }
  }, [saving, note, isNew, id, navigate, toast])

  // Guardar con Ctrl/Cmd + S.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [save])

  const doDelete = async () => {
    setConfirmDelete(false)
    try {
      await notesApi.remove(id)
      toast.success('Nota eliminada.')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar la nota.')
    }
  }

  const goBack = () => navigate('/')

  if (loading) return <FullPageSpinner label="Cargando nota…" />

  const saveLabel = saving ? 'Guardando…' : isNew ? 'Crear nota' : dirty ? 'Guardar' : 'Guardado'

  return (
    <div className="editor">
      <header className="editor__bar">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={goBack}
          aria-label="Volver al panel"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M12.7 4.3a1 1 0 0 1 0 1.4L8.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0Z"
              fill="currentColor"
            />
          </svg>
          Volver
        </button>

        <div className="editor__bar-right">
          {!isNew && updatedAt && (
            <span className="editor__saved-at">Editada {formatRelative(updatedAt)}</span>
          )}
          <button
            type="button"
            className={`btn btn--ghost btn--icon ${note.pinned ? 'is-active' : ''}`}
            onClick={() => update({ pinned: !note.pinned })}
            aria-pressed={note.pinned}
            aria-label={note.pinned ? 'Desfijar nota' : 'Fijar nota'}
            title={note.pinned ? 'Desfijar' : 'Fijar'}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path
                d="M12.3 2.2a1 1 0 0 1 1.4 0l4.1 4.1a1 1 0 0 1-.5 1.7l-3 .7-3.4 3.4.2 3.1a1 1 0 0 1-1.7.8L6.6 14 3.3 17.3a1 1 0 0 1-1.4-1.4L5.2 12.6 2.9 10.3a1 1 0 0 1 .8-1.7l3.1.2 3.4-3.4.7-3a1 1 0 0 1 .4-.6Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`btn btn--ghost ${showPreview ? 'is-active' : ''}`}
            onClick={() => setShowPreview((p) => !p)}
            aria-pressed={showPreview}
          >
            {showPreview ? 'Editar' : 'Vista previa'}
          </button>
          {!isNew && (
            <button
              type="button"
              className="btn btn--ghost btn--icon btn--danger-ghost"
              onClick={() => setConfirmDelete(true)}
              aria-label="Eliminar nota"
              title="Eliminar"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path
                  d="M8 2h4a1 1 0 0 1 1 1v1h3a1 1 0 1 1 0 2h-1v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6H4a1 1 0 0 1 0-2h3V3a1 1 0 0 1 1-1Zm1 5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm3 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            className="btn btn--primary"
            onClick={save}
            disabled={saving || (!isNew && !dirty)}
          >
            {saving && <Spinner size={16} label="Guardando" />}
            {saveLabel}
          </button>
        </div>
      </header>

      <div className="editor__body">
        <div className="editor__main">
          <input
            type="text"
            className="editor__title"
            placeholder="Titulo de la nota"
            value={note.title}
            onChange={(e) => update({ title: e.target.value })}
            aria-label="Titulo"
          />

          {showPreview ? (
            <div
              className="editor__preview markdown"
              // contenido renderizado a partir de markdown escapado en lib/markdown
              dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) || '<p class="muted">Nada que previsualizar.</p>' }}
            />
          ) : (
            <textarea
              className="editor__content"
              placeholder="Escribe aqui… admite markdown basico (# titulo, **negrita**, - listas, > cita)"
              value={note.content}
              onChange={(e) => update({ content: e.target.value })}
              aria-label="Contenido"
            />
          )}
        </div>

        <aside className="editor__side" aria-label="Propiedades de la nota">
          <div className="editor__group">
            <label className="editor__label" htmlFor="tags">
              Etiquetas
            </label>
            <TagInput id="tags" tags={note.tags} onChange={(tags) => update({ tags })} />
          </div>

          <div className="editor__group">
            <span className="editor__label">Color</span>
            <ColorPicker value={note.color} onChange={(color) => update({ color })} />
          </div>

          <div className="editor__group">
            <label className="switch">
              <input
                type="checkbox"
                checked={note.pinned}
                onChange={(e) => update({ pinned: e.target.checked })}
              />
              <span className="switch__track" aria-hidden="true">
                <span className="switch__thumb" />
              </span>
              <span className="switch__label">Fijar nota</span>
            </label>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar nota"
        message="Esta accion no se puede deshacer. ¿Seguro que quieres eliminar esta nota?"
        confirmLabel="Eliminar"
        danger
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
