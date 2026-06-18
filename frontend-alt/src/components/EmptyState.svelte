<script>
  export let filtered = false; // true si el vacio es por busqueda/filtro
  export let onCreate = () => {};
</script>

<div class="empty">
  <div class="empty-art" aria-hidden="true">
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M14 4v6h6" />
      <path d="M8 13h7M8 17h5" />
    </svg>
  </div>
  {#if filtered}
    <h2 class="serif">Nada por aqui</h2>
    <p class="muted">Ninguna nota coincide con tu busqueda o filtro.</p>
  {:else}
    <h2 class="serif">Tu cuaderno esta en blanco</h2>
    <p class="muted">La primera pagina siempre es la mas dificil. Empieza con una idea pequena.</p>
    <button class="btn btn-primary" on:click={onCreate}>Escribir mi primera nota</button>
  {/if}
</div>

<style>
  .empty {
    text-align: center;
    padding: 4rem 1rem;
    display: grid;
    justify-items: center;
    gap: 0.5rem;
  }
  .empty-art {
    color: var(--accent);
    opacity: 0.7;
    margin-bottom: 0.5rem;
  }
  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    margin: 0 0 1rem;
    max-width: 36ch;
  }
</style>
