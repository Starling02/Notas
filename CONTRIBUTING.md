# 🤝 Guía de contribución — Notas

¡Gracias por tu interés en contribuir a **Notas**! Este documento describe cómo trabajamos: la estrategia de ramas, las convenciones de commits, el proceso de pull request y cómo correr pruebas y linters.

> Al contribuir aceptas que tu código se distribuya bajo la licencia [MIT](./LICENSE) del proyecto.

---

## 📋 Tabla de contenidos

- [Código de conducta](#-código-de-conducta)
- [Antes de empezar](#-antes-de-empezar)
- [Estrategia de ramificación](#-estrategia-de-ramificación-git-flow-simplificado)
- [Conventional Commits](#-conventional-commits)
- [Proceso de Pull Request](#-proceso-de-pull-request)
- [Tests y linting](#-tests-y-linting)
- [Code review](#-code-review)

---

## 🌟 Código de conducta

Sé respetuoso, constructivo y empático. Asume buena intención y enfoca la crítica en el código, no en las personas.

---

## 🧰 Antes de empezar

1. Haz un *fork* (o crea una rama si tienes acceso de escritura).
2. Sigue el [Quickstart del README](./README.md#-quickstart) para levantar el entorno.
3. Revisa el [Roadmap](docs/ROADMAP.md) y los issues abiertos para evitar trabajo duplicado.

---

## 🌳 Estrategia de ramificación (Git Flow simplificado)

Usamos un **Git Flow simplificado** con dos ramas de larga vida y ramas temporales por tarea.

### Ramas de larga vida

| Rama      | Propósito                                              | Protegida |
| --------- | ----------------------------------------------------- | :-------: |
| `main`    | Código en producción. Siempre estable y desplegable.  |   ✅ Sí   |
| `develop` | Integración de las próximas features. Base de trabajo. |  ✅ Sí*   |

> `main` está **protegida**: no se permite push directo. Solo entra código vía PR aprobado y con CI en verde. `develop` también requiere PR.

### Ramas temporales

| Prefijo      | Nace de    | Se fusiona en        | Uso                                          |
| ------------ | ---------- | -------------------- | -------------------------------------------- |
| `feature/*`  | `develop`  | `develop`            | Nueva funcionalidad. Ej: `feature/note-tags` |
| `fix/*`      | `develop`  | `develop`            | Corrección no urgente. Ej: `fix/login-error` |
| `release/*`  | `develop`  | `main` **y** `develop` | Preparación de versión. Ej: `release/1.0.0` |
| `hotfix/*`   | `main`     | `main` **y** `develop` | Corrección urgente en producción. Ej: `hotfix/jwt-expiry` |

### Flujo típico

```bash
# 1. Sitúate en develop actualizado
git checkout develop
git pull origin develop

# 2. Crea tu rama
git checkout -b feature/note-search

# 3. Trabaja y commitea siguiendo Conventional Commits
git add .
git commit -m "feat(notes): añade búsqueda por título y etiqueta"

# 4. Sube y abre un PR contra develop
git push -u origin feature/note-search
```

### Diagrama

```
main      ───●───────────────────●──────────────●─────►   (producción)
              \                  / \            /
release        \           ●────●   \          /
                \         /          \        /
develop   ──●────●───●───●────●───────●──────●─────────►   (integración)
             \         \        \
feature       ●──●──●   ●──●     ●──●
```

---

## ✍️ Conventional Commits

Seguimos la especificación [Conventional Commits](https://www.conventionalcommits.org/). El formato es:

```
<tipo>(<ámbito opcional>): <descripción en imperativo y minúscula>

[cuerpo opcional]

[footer opcional]
```

### Tipos permitidos

| Tipo       | Cuándo usarlo                                              | Ejemplo                                                      |
| ---------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| `feat`     | Nueva funcionalidad para el usuario                       | `feat(auth): añade endpoint de registro`                    |
| `fix`      | Corrección de un bug                                      | `fix(notes): corrige fecha updated_at al editar`            |
| `docs`     | Solo documentación                                        | `docs(readme): actualiza guía de quickstart`                |
| `style`    | Formato, espacios, comas (sin cambios de lógica)          | `style(frontend): aplica prettier`                          |
| `refactor` | Cambio de código que no corrige bug ni añade feature      | `refactor(api): extrae dependencia get_current_user`        |
| `perf`     | Mejora de rendimiento                                     | `perf(notes): añade índice por user_id`                     |
| `test`     | Añadir o corregir tests                                   | `test(auth): cubre login con credenciales inválidas`        |
| `build`    | Cambios en build o dependencias                           | `build(deps): actualiza fastapi a 0.110`                    |
| `ci`       | Cambios en la configuración de CI                         | `ci: añade job de build para frontend-alt`                  |
| `chore`    | Tareas de mantenimiento sin impacto en src/test           | `chore: actualiza .gitignore`                               |
| `revert`   | Revierte un commit previo                                 | `revert: feat(auth) añade endpoint de registro`             |

### Ámbitos sugeridos

`auth`, `notes`, `api`, `db`, `backend`, `frontend`, `frontend-alt`, `docs`, `ci`, `deps`.

### Breaking changes

Indícalos con `!` tras el tipo/ámbito **y** un footer `BREAKING CHANGE:`:

```
feat(api)!: cambia el formato de respuesta de /api/notes

BREAKING CHANGE: ahora /api/notes devuelve { items, total } en lugar de un array.
```

---

## 🔀 Proceso de Pull Request

1. **Una PR = un objetivo.** Mantén los cambios enfocados y pequeños.
2. Asegúrate de que **CI esté en verde** (tests + builds).
3. Rellena la [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md) por completo.
4. Vincula los issues relacionados con `Closes #123`.
5. Mantén el historial limpio; preferimos **squash merge** hacia `develop`.
6. El título de la PR debe seguir Conventional Commits (alimenta el changelog).
7. Necesitas **al menos 1 aprobación** y CI verde para fusionar.

---

## 🧪 Tests y linting

### Backend (Python)

```bash
cd backend
source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1

# Tests
pytest

# Tests con cobertura
pytest --cov=app --cov-report=term-missing

# Lint y formato (si están configurados)
ruff check .
ruff format --check .
```

### Frontend A (React) y Frontend B (Svelte)

```bash
# En frontend/  o  frontend-alt/
npm ci
npm run lint        # ESLint
npm run build       # build de producción (debe pasar sin errores)
npm test            # si hay suite de tests
```

> ✅ **Regla de oro:** no abras una PR si los tests o el build fallan localmente.

---

## 👀 Code review

Como **autor**:
- Auto-revisa el diff antes de pedir review.
- Describe el *qué* y el *por qué* en la descripción.
- Responde cada comentario (resuelto o con justificación).

Como **revisor**:
- Revisa correctness, legibilidad, tests y seguridad.
- Distingue entre bloqueante (`must`) y sugerencia (`nit`).
- Aprueba solo cuando estarías cómodo manteniendo ese código.

¡Gracias por contribuir! 💜
