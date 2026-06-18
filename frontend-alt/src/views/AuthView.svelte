<script>
  import { login, register } from '../lib/stores.js';
  import { theme, toggleTheme } from '../lib/theme.js';

  let mode = 'login'; // 'login' | 'register'
  let email = '';
  let password = '';
  let error = '';
  let busy = false;

  $: title = mode === 'login' ? 'Bienvenido de vuelta' : 'Empieza tu diario';
  $: cta = mode === 'login' ? 'Entrar' : 'Crear cuenta';

  function switchMode() {
    mode = mode === 'login' ? 'register' : 'login';
    error = '';
  }

  async function handleSubmit() {
    error = '';
    if (!email.trim() || !password) {
      error = 'Escribe tu correo y contrasena.';
      return;
    }
    busy = true;
    try {
      if (mode === 'login') await login(email.trim(), password);
      else await register(email.trim(), password);
    } catch (e) {
      error = e.message || 'Algo salio mal.';
    } finally {
      busy = false;
    }
  }
</script>

<div class="auth-wrap">
  <button
    class="btn btn-ghost theme-toggle"
    on:click={toggleTheme}
    aria-label="Cambiar tema"
    title="Cambiar tema"
  >
    {$theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
  </button>

  <main class="card" aria-labelledby="auth-title">
    <div class="brand">
      <span class="brand-mark">N</span>
      <p class="brand-kicker">El Cuaderno</p>
    </div>

    <h1 id="auth-title" class="serif">{title}</h1>
    <p class="muted lede">
      Un espacio calido para tus ideas. Escribe, etiqueta y vuelve cuando quieras.
    </p>

    <form on:submit|preventDefault={handleSubmit} novalidate>
      <div class="field">
        <label for="email">Correo</label>
        <input
          id="email"
          type="email"
          autocomplete="email"
          bind:value={email}
          placeholder="tu@correo.com"
          required
        />
      </div>

      <div class="field">
        <label for="password">Contrasena</label>
        <input
          id="password"
          type="password"
          autocomplete={mode === 'login' ? 'current-password' : 'new-password'}
          bind:value={password}
          placeholder="********"
          required
        />
      </div>

      {#if error}
        <p class="error" role="alert">{error}</p>
      {/if}

      <button class="btn btn-primary block" type="submit" disabled={busy}>
        {busy ? 'Un momento...' : cta}
      </button>
    </form>

    <p class="switch muted">
      {mode === 'login' ? 'No tienes cuenta?' : 'Ya tienes cuenta?'}
      <button class="link-btn" type="button" on:click={switchMode}>
        {mode === 'login' ? 'Registrate' : 'Inicia sesion'}
      </button>
    </p>
  </main>
</div>

<style>
  .auth-wrap {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem 1.25rem;
    position: relative;
  }
  .theme-toggle {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    font-size: 0.85rem;
  }
  .card {
    width: 100%;
    max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2.25rem;
    box-shadow: var(--shadow);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 1.5rem;
  }
  .brand-mark {
    font-family: var(--serif);
    font-size: 1.5rem;
    color: var(--accent);
    width: 42px;
    height: 42px;
    display: grid;
    place-content: center;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg-soft);
  }
  .brand-kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    color: var(--text-mute);
  }
  h1 {
    margin: 0 0 0.35rem;
    font-size: 1.9rem;
  }
  .lede {
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
  }
  .field {
    margin-bottom: 1rem;
  }
  .block {
    width: 100%;
    margin-top: 0.5rem;
  }
  .error {
    color: var(--danger);
    font-size: 0.9rem;
    margin: 0 0 0.75rem;
  }
  .switch {
    text-align: center;
    margin: 1.5rem 0 0;
    font-size: 0.9rem;
  }
  .link-btn {
    background: none;
    border: none;
    color: var(--accent);
    font-weight: 600;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
</style>
