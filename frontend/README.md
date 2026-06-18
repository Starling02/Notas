# Notas — Frontend (Version A)

Frontend principal de la app de notas. React 18 + Vite + React Router, CSS
moderno escrito a mano (sin librerias de UI), JavaScript puro.

## Requisitos

- Node.js 18+ (probado con Node 24)
- npm 9+

## Puesta en marcha

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en http://localhost:5173

## Variable de entorno

La URL del backend se configura con `VITE_API_URL`. La capa API agrega el
sufijo `/api` automaticamente, asi que apunta solo al origen del backend.

| Variable       | Default                 | Descripcion                    |
| -------------- | ----------------------- | ------------------------------ |
| `VITE_API_URL` | `http://localhost:8000` | Origen del backend (sin `/api`) |

Crea un archivo `.env` (puedes copiar `.env.example`):

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8000
```

## Scripts

| Script            | Accion                                            |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo en el puerto 5173          |
| `npm run build`   | Build de produccion en `dist/`                    |
| `npm run preview` | Sirve el build de produccion para verificarlo     |

## Contrato de API esperado

Todo bajo `/api`, autenticacion con `Authorization: Bearer <token>`.

- `POST /api/auth/register` `{email,password}` -> `{access_token, user}`
- `POST /api/auth/login` `{email,password}` -> `{access_token, user}`
- `GET /api/auth/me` -> `user`
- `GET /api/notes` (acepta `?q=` y `?tag=`)
- `POST /api/notes`
- `GET /api/notes/{id}`
- `PUT /api/notes/{id}`
- `DELETE /api/notes/{id}`

Forma de la nota:

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "tags": ["string"],
  "color": "default | amber | rose | emerald | sky | violet | slate",
  "pinned": false,
  "created_at": "ISO",
  "updated_at": "ISO"
}
```

## Funcionalidades

- Login y registro con validacion y manejo de errores.
- Token en `localStorage`, restauracion de sesion via `/auth/me`, rutas
  protegidas, logout, e interceptor de `401` que cierra sesion automaticamente.
- Dashboard con sidebar de etiquetas, busqueda en vivo (`?q=` con debounce),
  grid de tarjetas, seccion de notas fijadas, y estado vacio con CTA.
- Editor de notas: titulo, contenido con markdown basico (toggle de vista
  previa), selector de color, etiquetas como chips, toggle de fijar, guardado
  con estado y atajo `Ctrl/Cmd + S`, y borrado con confirmacion.
- Toasts de feedback para todas las acciones.

## Diseno y accesibilidad

- Paleta acento indigo (`#6366F1`), fondos neutros, soporte de modo oscuro
  automatico, esquinas redondeadas, sombras suaves y transiciones sutiles.
- Responsive: en movil la sidebar se vuelve un drawer y el grid pasa a una
  columna.
- Accesibilidad: labels en todos los inputs, roles ARIA (radiogroup, alertdialog,
  status), foco visible, navegacion por teclado y `prefers-reduced-motion`.

## Estructura

```
src/
  api/        client.js (fetch + token + 401), auth.js, notes.js
  components/  AuthShell, Sidebar, Topbar, NoteCard, EmptyState,
               TagInput, ColorPicker, ConfirmDialog, Toast, Spinner,
               ProtectedRoute
  context/     AuthContext, ToastContext
  lib/         colors.js, format.js, markdown.js
  views/       Login, Register, Dashboard, NoteEditor
  styles/      global.css
  App.jsx, main.jsx
```
