<script>
  import { createEventDispatcher } from 'svelte';
  import { togglePin, deleteNote } from '../lib/stores.js';

  export let note;

  const dispatch = createEventDispatcher();

  let pinBusy = false;

  function formatDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  }

  async function pin(e) {
    e.stopPropagation();
    pinBusy = true;
    try {
      await togglePin(note);
    } finally {
      pinBusy = false;
    }
  }

  async function remove(e) {
    e.stopPropagation();
    if (confirm(`Borrar la nota "${note.title || 'sin titulo'}"?`)) {
      await deleteNote(note.id);
    }
  }

  function edit() {
    dispatch('edit', note);
  }

  // El color de la nota se usa como acento lateral, sin romper el tema.
  $: accent = note.color && note.color !== '#ffffff' ? note.color : 'var(--accent)';
</script>

<article class="note" class:pinned={note.pinned} style={`--note-accent:${accent}`}>
  <button
    class="note-open"
    on:click={edit}
    aria-label={`Editar nota: ${note.title || 'sin titulo'}`}
  ></button>
  <div class="note-head">
    <h3 class="serif">{note.title || 'Sin titulo'}</h3>
    <div class="actions">
      <button
        class="btn btn-icon btn-ghost"
        class:on={note.pinned}
        on:click={pin}
        disabled={pinBusy}
        aria-label={note.pinned ? 'Desfijar nota' : 'Fijar nota'}
        title={note.pinned ? 'Desfijar' : 'Fijar'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 17v5" />
          <path d="M5 9l1.5 5h11L19 9" />
          <path d="M9 9V4h6v5" />
        </svg>
      </button>
      <button
        class="btn btn-icon btn-danger"
        on:click={remove}
        aria-label="Borrar nota"
        title="Borrar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
        </svg>
      </button>
    </div>
  </div>

  {#if note.content}
    <p class="content">{note.content}</p>
  {:else}
    <p class="content muted"><em>Sin contenido</em></p>
  {/if}

  <div class="note-foot">
    <div class="tags">
      {#each note.tags || [] as tag}
        <span class="tag">#{tag}</span>
      {/each}
    </div>
    <time class="date muted">{formatDate(note.updated_at || note.created_at)}</time>
  </div>
</article>

<style>
  .note {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 4px solid var(--note-accent);
    border-radius: var(--radius);
    padding: 1.25rem 1.4rem;
    text-align: left;
    transition: transform 0.1s, border-color 0.15s, box-shadow 0.15s;
  }
  .note:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
  .note.pinned {
    background: linear-gradient(180deg, var(--surface-2), var(--surface));
  }
  /* Boton invisible que cubre la tarjeta: hace toda la nota clickable y
     accesible por teclado sin abusar de roles ARIA en <article>. */
  .note-open {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    z-index: 0;
  }
  .note-open:focus-visible {
    outline: 2px solid var(--accent-strong);
    outline-offset: 2px;
  }
  /* Cabecera y pie por encima del boton para conservar acciones clickables. */
  .note-head,
  .note-foot {
    position: relative;
    z-index: 1;
  }
  .note-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }
  h3 {
    margin: 0;
    font-size: 1.35rem;
    flex: 1;
  }
  .actions {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
  }
  .btn-icon.on {
    color: var(--accent-strong);
  }
  .content {
    margin: 0.6rem 0 1rem;
    color: var(--text-soft);
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .note-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .tag {
    font-size: 0.78rem;
    color: var(--emerald);
    background: rgba(95, 184, 138, 0.1);
    border-radius: 999px;
    padding: 0.15rem 0.6rem;
  }
  .date {
    font-size: 0.78rem;
    font-style: italic;
  }
</style>
