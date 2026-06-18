# 🗺️ Roadmap — Notas

Plan de evolución del producto por fases. Las fechas son orientativas; el alcance puede ajustarse según el feedback del experimento A/B (ver [DESIGN.md](DESIGN.md)).

> Leyenda: ✅ hecho · 🚧 en progreso · 🔜 planificado · 💡 en estudio

---

## 🎯 Fase 0 — Fundaciones (infraestructura)

- 🚧 Monorepo con `backend/`, `frontend/`, `frontend-alt/`, `docs/`.
- ✅ Documentación profesional (README, ARCHITECTURE, DESIGN, ROADMAP).
- ✅ Estructura de GitHub (plantillas de issues/PR, CI, dependabot).
- 🔜 Pipeline CI verde (tests del backend + build de ambos frontends).

---

## 🚀 Fase 1 — MVP

> **Objetivo:** una persona puede registrarse, crear notas y gestionarlas. Producto usable de punta a punta.

### Backend
- 🔜 Autenticación JWT: `register`, `login`, `me`.
- 🔜 CRUD de notas: `GET/POST /api/notes`, `GET/PUT/DELETE /api/notes/{id}`.
- 🔜 Persistencia en SQLite y ownership por usuario.
- 🔜 Tests con `pytest`.

### Frontend (A y B)
- 🔜 Pantallas: Login/Registro, Dashboard, Editor, Estado vacío.
- 🔜 Manejo de sesión (almacenar y enviar el JWT).
- 🔜 CRUD de notas conectado a la API.
- 🔜 Sistema de diseño base (tokens compartidos).

**Criterio de salida del MVP:** flujo completo registro → crear → editar → eliminar funcionando en ambas versiones.

---

## 🌟 Fase 2 — v1 (producto pulido)

> **Objetivo:** organización, búsqueda y una experiencia accesible y refinada.

- 🔜 **Búsqueda** por título, contenido y etiqueta.
- 🔜 **Etiquetas (tags):** crear, filtrar y gestionar.
- 🔜 **Colores y notas fijadas** con ordenación (fijadas arriba).
- 🔜 **Accesibilidad WCAG AA** verificada (teclado, contraste, ARIA).
- 🔜 **Feedback in-app** (toasts, deshacer eliminación).
- 🔜 **Endurecimiento de seguridad:** rate limiting en auth, CORS estricto, HTTPS.
- 🔜 **Resultados del experimento A/B** y selección del frontend principal.

---

## 🔮 Fase 3 — v2 (escala y colaboración)

> **Objetivo:** multidispositivo, sin conexión y trabajo en equipo.

- 🔜 **Sincronización** multidispositivo (servidor como fuente de verdad, `updated_at`).
- 🔜 **Offline / PWA:** caché local + cola de cambios y reconciliación al reconectar.
- 💡 **Colaboración:** notas compartidas y permisos; edición en tiempo real (WebSockets/CRDT) como evolución.
- 🔜 **Exportar / importar:** Markdown, JSON y PDF.
- 🔜 **Refresh tokens + revocación** de sesiones.
- 🔜 **Migración a PostgreSQL** (de SQLite) para mayor concurrencia.
- 💡 **Modo oscuro** y temas.
- 💡 **Adjuntos** (imágenes/archivos) en las notas.
- 💡 **Recordatorios** y notificaciones.

---

## 📌 Resumen por feature

| Feature                      | MVP | v1 | v2 |
| ---------------------------- | :-: | :-: | :-: |
| Autenticación (JWT)          | ✅  |    |    |
| CRUD de notas                | ✅  |    |    |
| Etiquetas                    |     | ✅ |    |
| Colores + fijado             |     | ✅ |    |
| Búsqueda                     |     | ✅ |    |
| Accesibilidad AA             |     | ✅ |    |
| Rate limiting / HTTPS        |     | ✅ |    |
| Sincronización               |     |    | ✅ |
| Offline / PWA                |     |    | ✅ |
| Colaboración                 |     |    | ✅ |
| Exportar / importar          |     |    | ✅ |
| Migración a PostgreSQL       |     |    | ✅ |

---

## 🤝 Cómo influir en el roadmap

¿Te falta una feature? Abre un [feature request](.github/ISSUE_TEMPLATE/feature_request.md) y participa en la discusión. Ver [CONTRIBUTING.md](../CONTRIBUTING.md).
