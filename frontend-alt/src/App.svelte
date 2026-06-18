<script>
  import { onMount } from 'svelte';
  import { user, authReady, bootstrapSession } from './lib/stores.js';
  import AuthView from './views/AuthView.svelte';
  import NotesView from './views/NotesView.svelte';

  onMount(() => {
    bootstrapSession();
  });
</script>

{#if !$authReady}
  <div class="boot" role="status" aria-live="polite">
    <span class="boot-mark">N</span>
    <p class="muted">Cargando tu diario...</p>
  </div>
{:else if $user}
  <NotesView />
{:else}
  <AuthView />
{/if}

<style>
  .boot {
    min-height: 100vh;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 0.75rem;
    text-align: center;
  }
  .boot-mark {
    font-family: var(--serif);
    font-size: 2.5rem;
    color: var(--accent);
    width: 64px;
    height: 64px;
    display: grid;
    place-content: center;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--surface);
  }
</style>
