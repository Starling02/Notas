<script>
  import { allTags, activeTag, loadNotes } from '../lib/stores.js';

  function select(tag) {
    activeTag.set($activeTag === tag ? '' : tag);
    loadNotes();
  }
</script>

{#if $allTags.length}
  <div class="tagbar" role="group" aria-label="Filtrar por etiqueta">
    <button
      class="chip"
      class:active={$activeTag === ''}
      on:click={() => select('')}
      aria-pressed={$activeTag === ''}
    >
      Todas
    </button>
    {#each $allTags as tag}
      <button
        class="chip"
        class:active={$activeTag === tag}
        on:click={() => select(tag)}
        aria-pressed={$activeTag === tag}
      >
        #{tag}
      </button>
    {/each}
  </div>
{/if}

<style>
  .tagbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0 0.5rem;
  }
  .chip {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-soft);
    border-radius: 999px;
    padding: 0.3rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.15s;
  }
  .chip:hover {
    border-color: var(--accent-deep);
    color: var(--text);
  }
  .chip.active {
    background: var(--accent-glow);
    border-color: var(--accent);
    color: var(--accent-strong);
  }
</style>
