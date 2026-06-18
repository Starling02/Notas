# Notes API (Backend)

Backend de una app de notas construido con **FastAPI + SQLAlchemy + SQLite + JWT**.

## Requisitos

- Python 3.10+

## Arranque rapido

```bash
# 1. Crear y activar entorno virtual
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# Windows (cmd)
.venv\Scripts\activate.bat
# Linux / macOS
source .venv/bin/activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Configurar variables de entorno (opcional, hay fallbacks de dev)
cp .env.example .env   # en Windows: copy .env.example .env

# 4. Levantar el servidor
uvicorn app.main:app --reload
```

El servidor queda en `http://127.0.0.1:8000`. Documentacion interactiva en `http://127.0.0.1:8000/docs`.

## Variables de entorno

| Variable | Descripcion | Default dev |
|---|---|---|
| `SECRET_KEY` | Clave para firmar JWT | clave de desarrollo |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Validez del token | `1440` |
| `DATABASE_URL` | Conexion SQLAlchemy | `sqlite:///./notes.db` |

## Endpoints (prefijo `/api`)

Autenticacion con header `Authorization: Bearer <token>`.

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/auth/register` | Registro `{email, password}` -> `{access_token, token_type, user}` |
| POST | `/api/auth/login` | Login `{email, password}` -> `{access_token, token_type, user}` |
| GET | `/api/auth/me` | Usuario actual `{id, email}` |
| GET | `/api/notes` | Lista notas del usuario (`?q=` busqueda, `?tag=` filtro) |
| POST | `/api/notes` | Crea nota `{title, content, tags, color, pinned}` |
| GET | `/api/notes/{id}` | Obtiene una nota |
| PUT | `/api/notes/{id}` | Actualiza parcial |
| DELETE | `/api/notes/{id}` | Borra (204) |

Las notas pertenecen al usuario autenticado; acceder a notas ajenas devuelve **404**.

## Tests

```bash
pytest
```

Los tests usan una base SQLite en archivo temporal independiente (no tocan `notes.db`).

## CORS

Habilitado para `http://localhost:5173` (Vite) y `http://localhost:3000`.
