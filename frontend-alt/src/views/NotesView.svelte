<script>
  import { onMount } from 'svelte';
  import {
    user,
    logout,
    loadNotes,
    loadingNotes,
    notesError,
    searchQuery,
    activeTag,
    sortedNotes,
  } from '../lib/stores.js';
  import { theme, toggleTheme } from '../lib/theme.js';
  import NoteCard from '../components/NoteCard.svelte';
  import NoteEditor from '../components/NoteEditor.svelte';
  import TagFilter from '../components/TagFilter.svelte';
  import EmptyState from '../components/EmptyState.svelte';

  let editorOpen = false;
  let editing = null;
  let searchTimer;

  onMount(() => {
    loadNotes();
  });

  function openNew() {
    editing = null;
    editorOpen = true;
  }

  function openEdit(e) {
    editing = e.detail;
    editorOpen = true;
  }

  function closeEditor() {
    editorOpen = false;
    editing = null;
  }

  // Busqueda con debounce -> golpea ?q= en el backend.
  function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadNotes(), 280);
  }

  $: filtered = !!($searchQuery || $activeTag);
  $: pinnedCount = $sortedNotes.filter((n) => n.pinned).length;
</script>

<header class="topbar">
  <div class="shell topbar-inner">
    <div class="brand">
      <span class="brand-mark">N</span>
      <div>
        <p class="brand-kicker">El Cuaderno</p>
        <p class="brand-user muted">{$user?.email || ''}</p>
      </div>
    </div>
    <div class="top-actions">
      <button class="btn btn-ghost" on:click={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
        {$theme === 'dark' ? 'Claro' : 'Oscuro'}
      </button>
      <button class="btn btn-ghost" on:click={logout}>Salir</button>
    </div>
  </div>
</header>

<main class="shell">
  <section class="hero">
    <h1 class="serif">Tu diario de notas</h1>
    <p class="muted">
      {$sortedNotes.length}
      {$sortedNotes.length === 1 ? 'nota' : 'notas'}{pinnedCount ? ` - ${pinnedCount} fijada${pinnedCount === 1 ? '' : 's'}` : ''}
    </p>
  </section>

  <div class="toolbar">
    <div class="search">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
      <label class="sr-only" for="search">Buscar notas</label>
      <input
        id="search"
        type="search"
        placeholder="Buscar en tus notas..."
        bind:value={$searchQuery}
        on:input={onSearchInput}
      />
    </div>
    <button class="btn btn-primary new-btn" on:click={openNew}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
      Nueva nota
    </button>
  </div>

  <TagFilter />

  {#if $notesError}
    <p class="banner error" role="alert">{$notesError}</p>
  {/if}

  {#if $loadingNotes && !$sortedNotes.length}
    <div class="skeletons" aria-hidden="true">
      {#each Array(3) as _}
        <div class="skel"></div>
      {/each}
    </div>
  {:else if !$sortedNotes.length}
    <EmptyState {filtered} onCreate={openNew} />
  {:else}
    <div class="feed">
      {#each $sortedNotes as note (note.id)}
        <NoteCard {note} on:edit={openEdit} />
      {/each}
    </div>
  {/if}
</main>

{#if editorOpen}
  <NoteEditor note={editing} on:close={closeEditor} />
{/if}

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-soft);
  }
  .topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.9rem;
    padding-bottom: 0.9rem;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }
  .brand-mark {
    font-family: var(--serif);
    font-size: 1.25rem;
    color: var(--accent);
    width: 38px;
    height: 38px;
    display: grid;
    place-content: center;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--surface);
  }
  .brand-kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.7rem;
    color: var(--text-mute);
  }
  .brand-user {
    margin: 0;
    font-size: 0.82rem;
  }
  .top-actions {
    display: flex;
    gap: 0.4rem;
  }
  .hero {
    padding: 2.5rem 0 1.25rem;
  }
  .hero h1 {
    margin: 0 0 0.25rem;
    font-size: 2.6rem;
  }
  .hero p {
    margin: 0;
  }
  .toolbar {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  .search {
    position: relative;
    flex: 1;
    color: var(--text-mute);
  }
  .search svg {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .search input {
    padding-left: 2.4rem;
  }
  .new-btn {
    flex-shrink: 0;
  }
  .feed {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.25rem;
  }
  .banner {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    margin-top: 1rem;
  }
  .banner.error {
    background: rgba(217, 105, 79, 0.12);
    border: 1px solid rgba(217, 105, 79, 0.4);
    color: var(--danger);
  }
  .skeletons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.25rem;
  }
  .skel {
    height: 120px;
    border-radius: var(--radius);
    background: linear-gradient(90deg, var(--surface), var(--surface-2), var(--surface));
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @media (max-width: 540px) {
    .hero h1 { font-size: 2rem; }
    .toolbar { flex-direction: column; align-items: stretch; }
    .new-btn { width: 100%; }
  }
</style>
