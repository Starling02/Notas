<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { createNote, updateNote } from '../lib/stores.js';

  export let note = null; // null => crear nueva

  const dispatch = createEventDispatcher();

  const PALETTE = [
    { name: 'Pergamino', value: '#ffffff' },
    { name: 'Ambar', value: '#e6a23c' },
    { name: 'Esmeralda', value: '#5fb88a' },
    { name: 'Ladrillo', value: '#d9694f' },
    { name: 'Ciruela', value: '#a06bb5' },
    { name: 'Oceano', value: '#5aa6c4' },
  ];

  let title = note?.title || '';
  let content = note?.content || '';
  let color = note?.color || '#ffffff';
  let pinned = note?.pinned || false;
  let tags = [...(note?.tags || [])];
  let tagInput = '';
  let busy = false;
  let error = '';
  let titleEl;

  const isEdit = !!note?.id;

  onMount(async () => {
    await tick();
    titleEl?.focus();
  });

  function addTag() {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) {
      tags = [...tags, t];
    }
    tagInput = '';
  }

  function onTagKey(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      tags = tags.slice(0, -1);
    }
  }

  function removeTag(t) {
    tags = tags.filter((x) => x !== t);
  }

  async function save() {
    error = '';
    if (!title.trim() && !content.trim()) {
      error = 'Escribe al menos un titulo o algo de contenido.';
      return;
    }
    if (tagInput.trim()) addTag();
    busy = true;
    const payload = {
      title: title.trim(),
      content,
      color,
      pinned,
      tags,
    };
    try {
      if (isEdit) await updateNote(note.id, payload);
      else await createNote(payload);
      dispatch('close', { saved: true });
    } catch (e) {
      error = e.message || 'No se pudo guardar.';
    } finally {
      busy = false;
    }
  }

  function close() {
    dispatch('close', { saved: false });
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save();
  }
</script>

<svelte:window on:keydown={onKeydown} />

<div class="overlay">
  <button class="backdrop" on:click={close} aria-label="Cerrar editor" tabindex="-1"></button>
  <div
    class="sheet"
    role="dialog"
    aria-modal="true"
    aria-label={isEdit ? 'Editar nota' : 'Nueva nota'}
  >
    <header class="sheet-head">
      <p class="kicker">{isEdit ? 'Editando' : 'Pagina nueva'}</p>
      <button class="btn btn-ghost btn-icon" on:click={close} aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </header>

    <div class="field">
      <label for="ed-title">Titulo</label>
      <input
        id="ed-title"
        class="title-input"
        bind:this={titleEl}
        bind:value={title}
        placeholder="Dale un nombre a tu nota..."
      />
    </div>

    <div class="field">
      <label for="ed-content">Contenido</label>
      <textarea
        id="ed-content"
        rows="8"
        bind:value={content}
        placeholder="Escribe libremente..."
      ></textarea>
    </div>

    <div class="field">
      <label for="ed-tags">Etiquetas</label>
      <div class="tag-editor">
        {#each tags as t}
          <span class="tag-pill">
            #{t}
            <button type="button" on:click={() => removeTag(t)} aria-label={`Quitar etiqueta ${t}`}>x</button>
          </span>
        {/each}
        <input
          id="ed-tags"
          class="tag-input"
          bind:value={tagInput}
          on:keydown={onTagKey}
          on:blur={addTag}
          placeholder="Anadir etiqueta + Enter"
        />
      </div>
    </div>

    <div class="row">
      <fieldset class="palette">
        <legend>Color</legend>
        {#each PALETTE as c}
          <button
            type="button"
            class="swatch"
            class:active={color === c.value}
            style={`--sw:${c.value}`}
            on:click={() => (color = c.value)}
            aria-label={c.name}
            aria-pressed={color === c.value}
            title={c.name}
          ></button>
        {/each}
      </fieldset>

      <label class="pin-toggle">
        <input type="checkbox" bind:checked={pinned} />
        <span>Fijar arriba</span>
      </label>
    </div>

    {#if error}
      <p class="error" role="alert">{error}</p>
    {/if}

    <footer class="sheet-foot">
      <span class="hint muted">Ctrl/Cmd + Enter para guardar</span>
      <div class="foot-actions">
        <button class="btn btn-ghost" on:click={close}>Cancelar</button>
        <button class="btn btn-primary" on:click={save} disabled={busy}>
          {busy ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear nota'}
        </button>
      </div>
    </footer>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: start center;
    padding: 5vh 1rem 2rem;
    overflow-y: auto;
    z-index: 50;
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 8, 5, 0.6);
    backdrop-filter: blur(3px);
    border: none;
    cursor: default;
    z-index: 0;
  }
  .sheet {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 620px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.75rem;
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.7);
  }
  .sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }
  .kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.72rem;
    color: var(--text-mute);
  }
  .field {
    margin-bottom: 1.1rem;
  }
  .title-input {
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 600;
  }
  textarea {
    resize: vertical;
    line-height: 1.7;
  }
  .tag-editor {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: center;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.5rem;
  }
  .tag-editor:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(95, 184, 138, 0.12);
    color: var(--emerald);
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    font-size: 0.82rem;
  }
  .tag-pill button {
    background: none;
    border: none;
    color: inherit;
    font-size: 0.9rem;
    line-height: 1;
    padding: 0;
    opacity: 0.7;
  }
  .tag-pill button:hover {
    opacity: 1;
  }
  .tag-input {
    flex: 1;
    min-width: 140px;
    border: none;
    background: none;
    padding: 0.2rem;
    box-shadow: none;
  }
  .tag-input:focus {
    box-shadow: none;
    border: none;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .palette {
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .palette legend {
    float: left;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-soft);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-right: 0.5rem;
  }
  .swatch {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--sw);
    border: 2px solid var(--border);
    padding: 0;
  }
  .swatch.active {
    border-color: var(--text);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .pin-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.95rem;
    color: var(--text);
    margin: 0;
    cursor: pointer;
  }
  .pin-toggle input {
    width: auto;
  }
  .error {
    color: var(--danger);
    font-size: 0.9rem;
    margin: 0 0 0.75rem;
  }
  .sheet-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    border-top: 1px solid var(--border-soft);
    padding-top: 1.25rem;
  }
  .hint {
    font-size: 0.8rem;
  }
  .foot-actions {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }
</style>
