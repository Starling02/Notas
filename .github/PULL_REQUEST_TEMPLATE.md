# Pull Request

## 📝 Descripción

<!-- ¿Qué hace esta PR y por qué? Explica el contexto. -->

## 🔗 Issues relacionados

<!-- Vincula los issues. Ej: Closes #123, Relates to #456 -->
Closes #

## 🧩 Tipo de cambio

<!-- Marca lo que aplique. -->

- [ ] ✨ `feat` — nueva funcionalidad
- [ ] 🐛 `fix` — corrección de bug
- [ ] 📚 `docs` — documentación
- [ ] ♻️ `refactor` — refactor sin cambio de comportamiento
- [ ] ⚡ `perf` — mejora de rendimiento
- [ ] ✅ `test` — añade/ajusta tests
- [ ] 🔧 `chore` / `build` / `ci` — mantenimiento o infraestructura
- [ ] 💥 Breaking change

## 🎯 Componente(s) afectado(s)

- [ ] `backend` (FastAPI)
- [ ] `frontend` (React — Versión A)
- [ ] `frontend-alt` (Svelte — Versión B)
- [ ] `docs`
- [ ] `.github` / CI

## 🖼️ Capturas (si hay cambios de UI)

<!-- Antes / después. Si aplica, muestra ambas versiones (A y B). -->

## ✅ Cómo se ha probado

<!-- Describe los pasos y comandos usados para verificar. -->

```bash
# backend
pytest

# frontend / frontend-alt
npm run build
```

## ☑️ Checklist

- [ ] El título de la PR sigue [Conventional Commits](https://www.conventionalcommits.org/).
- [ ] La rama parte de `develop` (o de `main` si es `hotfix/*`).
- [ ] Los tests pasan localmente.
- [ ] El build de los frontends afectados pasa sin errores.
- [ ] He añadido/actualizado tests cuando aplica.
- [ ] He actualizado la documentación cuando aplica.
- [ ] No incluyo secretos ni archivos `.env` (solo `.env.example`).
- [ ] He revisado mi propio diff.
