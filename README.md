<div align="center">

# 📝 Notas

**Una aplicación de notas moderna, rápida y minimalista.**

Crea, organiza y busca tus ideas con etiquetas, colores y notas fijadas. Construida como un monorepo con un backend en FastAPI y **dos frontends** intercambiables (React y Svelte) para experimentación A/B.

<!-- Badges placeholder: reemplaza OWNER/REPO cuando el repositorio esté publicado -->
[![CI](https://github.com/OWNER/notas/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/notas/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![Node 20+](https://img.shields.io/badge/node-20+-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

</div>

---

## 📸 Captura de pantalla

<!-- Screenshot placeholder: añade aquí una imagen real cuando la UI esté lista -->
<div align="center">

> _Reemplaza este bloque por una captura real:_
> `![Notas — Dashboard](docs/design/screenshot.png)`

```
┌──────────────────────────────────────────────────────────┐
│  📝 Notas              🔍 Buscar…            👤 usuario ▾  │
├──────────────────────────────────────────────────────────┤
│  📌 Fijadas                                                │
│  ┌────────────┐  ┌────────────┐                           │
│  │ Reunión    │  │ Ideas app  │                           │
│  │ #trabajo   │  │ #personal  │                           │
│  └────────────┘  └────────────┘                           │
│  Todas                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ Compras    │  │ Receta     │  │ Libros     │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└──────────────────────────────────────────────────────────┘
```

</div>

---

## ✨ Características

- 🔐 **Autenticación JWT** — registro e inicio de sesión seguros.
- 🗒️ **CRUD de notas** — crea, lee, edita y elimina notas.
- 🏷️ **Etiquetas y colores** — organiza visualmente tu información.
- 📌 **Notas fijadas** — mantén lo importante siempre a la vista.
- 🔍 **Búsqueda** — encuentra notas por título, contenido o etiqueta.
- 🧪 **Dos frontends** — la misma API consumida por React (Versión A) y Svelte (Versión B) para pruebas A/B.

---

## 🧱 Stack tecnológico

| Capa            | Tecnología                          | Detalle                                   |
| --------------- | ----------------------------------- | ----------------------------------------- |
| **Backend**     | FastAPI + Uvicorn                   | API REST bajo `/api`                      |
| **Base de datos** | SQLite                            | Persistencia ligera, ideal para MVP       |
| **Auth**        | JWT (Bearer)                        | Tokens firmados, contraseñas con hash     |
| **Frontend A**  | React + Vite                        | Puerto `5173`                             |
| **Frontend B**  | Svelte + Vite                       | Puerto `5174`                             |
| **Diseño**      | Pencil (prototipo)                  | `docs/design/`                            |
| **CI**          | GitHub Actions                      | Tests del backend + build de ambos fronts |

---

## 🗂️ Estructura del monorepo

```
notas/
├── backend/                 # API FastAPI + SQLite + JWT (REST bajo /api)
├── frontend/                # Versión A — React + Vite (puerto 5173)
├── frontend-alt/            # Versión B — Svelte + Vite (puerto 5174)
├── docs/                    # Documentación del proyecto
│   ├── ARCHITECTURE.md      # Arquitectura, modelo de datos, ADRs
│   ├── DESIGN.md            # Diseño UX, sistema de diseño, A/B testing
│   ├── ROADMAP.md           # Fases del producto (MVP, v1, v2)
│   └── design/              # Prototipo Pencil
├── .github/                 # Plantillas de issues/PR, workflows, dependabot
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/ci.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── README.md                # Este archivo
├── CONTRIBUTING.md          # Guía de contribución
├── LICENSE                  # Licencia MIT
├── .gitignore
└── .editorconfig
```

---

## 🚀 Quickstart

> **Requisitos previos:** Python 3.11+, Node.js 20+ y `git`.

Clona el repositorio:

```bash
git clone https://github.com/OWNER/notas.git
cd notas
```

### 1) Backend (FastAPI · puerto 8000)

```bash
cd backend
python -m venv .venv
# Linux/macOS:
source .venv/bin/activate
# Windows (PowerShell):
# .venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env          # ajusta SECRET_KEY y demás variables

uvicorn app.main:app --reload --port 8000
```

La API queda disponible en `http://localhost:8000/api` y la documentación interactiva (Swagger UI) en `http://localhost:8000/docs`.

### 2) Frontend A — React (puerto 5173)

```bash
cd frontend
npm install
cp .env.example .env          # define VITE_API_URL=http://localhost:8000/api
npm run dev
```

Abre `http://localhost:5173`.

### 3) Frontend B — Svelte (puerto 5174)

```bash
cd frontend-alt
npm install
cp .env.example .env          # define VITE_API_URL=http://localhost:8000/api
npm run dev -- --port 5174
```

Abre `http://localhost:5174`.

> 💡 Ambos frontends apuntan al **mismo** backend. Puedes correr los tres simultáneamente para comparar las versiones A y B.

---

## 🔌 Resumen de la API

| Método   | Endpoint              | Descripción                       | Auth |
| -------- | --------------------- | --------------------------------- | :--: |
| `POST`   | `/api/auth/register`  | Registrar un nuevo usuario        |  No  |
| `POST`   | `/api/auth/login`     | Iniciar sesión y obtener token    |  No  |
| `GET`    | `/api/auth/me`        | Datos del usuario autenticado     |  Sí  |
| `GET`    | `/api/notes`          | Listar notas del usuario          |  Sí  |
| `POST`   | `/api/notes`          | Crear una nota                    |  Sí  |
| `GET`    | `/api/notes/{id}`     | Obtener una nota                  |  Sí  |
| `PUT`    | `/api/notes/{id}`     | Actualizar una nota               |  Sí  |
| `DELETE` | `/api/notes/{id}`     | Eliminar una nota                 |  Sí  |

**Modelo `Nota`:** `{ id, title, content, tags[], color, pinned, created_at, updated_at }`

Más detalle en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 📚 Documentación

- 🏛️ [Arquitectura](docs/ARCHITECTURE.md) — diseño técnico, modelo de datos y ADRs.
- 🎨 [Diseño](docs/DESIGN.md) — UX, sistema de diseño y estrategia A/B.
- 🗺️ [Roadmap](docs/ROADMAP.md) — fases y features planificadas.
- 🤝 [Contribuir](CONTRIBUTING.md) — flujo de trabajo, commits y PRs.

---

## 📄 Licencia

Distribuido bajo la licencia [MIT](./LICENSE). © 2026 Notas.
