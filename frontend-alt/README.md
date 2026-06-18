# Notas - Frontend Version B (Svelte)

Segunda versión del frontend de la app de notas, pensada para una comparación
A/B de diseño y stack frente a la **Versión A (React)**. Consume **exactamente el
mismo backend**.

## Stack

- **Svelte 4** + **Vite 5** (sin framework de routing: enrutado por estado de sesión).
- Sin dependencias de runtime: el bundle es solo Svelte compilado.
- CSS plano con variables (tokens de tema), sin librería de UI.

## Diferenciación de diseño (vs Versión A)

| Aspecto      | Versión A (React)       | Versión B (esta)                          |
| ------------ | ----------------------- | ----------------------------------------- |
| Estética     | Índigo, app/dashboard   | Editorial cálida tipo "diario"            |
| Acento       | Índigo                  | Ámbar/ember + esmeralda (etiquetas)       |
| Tipografía   | Sans                    | Serif (Fraunces) en títulos + Inter texto |
| Layout       | Sidebar + grid          | Columna única centrada (feed/diario)      |
| Tema         | Claro                   | **Oscuro por defecto** (toggle a claro)   |
| Fondo        | Plano                   | Carbón cálido + halo radial ámbar         |

## Requisitos

- Node 18+ y npm.
- El backend corriendo (por defecto en `http://localhost:8000`).

## Configuración

```bash
cp .env.example .env   # opcional; por defecto usa http://localhost:8000
```

Variable disponible:

- `VITE_API_URL` — URL base del backend. Las rutas cuelgan de `/api`.

## Uso

```bash
npm install
npm run dev      # http://localhost:5174  (puerto distinto al de la Versión A)
npm run build    # genera dist/
npm run preview  # sirve dist/ en :5174
```

## Contrato de API consumido

- `POST /api/auth/register` `{email,password}` → `{access_token, user}`
- `POST /api/auth/login` `{email,password}` → `{access_token, user}`
- `GET /api/auth/me`
- `GET /api/notes` (`?q=`, `?tag=`), `POST /api/notes`
- `GET/PUT/DELETE /api/notes/{id}`
- Nota: `{id,title,content,tags[],color,pinned,created_at,updated_at}`

Auth por **Bearer token** guardado en `localStorage` (`notas_token`). Ruta
protegida: si no hay sesión válida se muestra el login.

## Estructura

```
src/
  App.svelte              # raíz: decide login vs notas según sesión
  main.js                 # bootstrap
  lib/
    api.js                # cliente HTTP (mismo contrato que Versión A)
    stores.js             # estado de sesión y notas (Svelte stores)
    theme.js              # tema claro/oscuro persistido
  views/
    AuthView.svelte       # login / registro
    NotesView.svelte      # feed de notas + búsqueda + filtro
  components/
    NoteCard.svelte       # tarjeta de nota (fijar/borrar/editar)
    NoteEditor.svelte     # modal crear/editar (título, contenido, tags, color, pin)
    TagFilter.svelte      # chips de etiquetas (filtro ?tag=)
    EmptyState.svelte     # estado vacío
  styles/global.css       # tokens de tema y estilos base
```
