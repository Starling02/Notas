# 🎨 Diseño — Notas

Este documento reúne los principios de UX, las personas, los flujos de usuario, la descripción de las pantallas del prototipo, el sistema de diseño, las notas de accesibilidad y la estrategia de refinamiento iterativo / A/B entre la **Versión A (React)** y la **Versión B (Svelte)**.

---

## 1. Principios de diseño UX

1. **Simplicidad ante todo.** Capturar una idea no debe costar más de un clic.
2. **El contenido es el héroe.** La interfaz desaparece; las notas destacan.
3. **Velocidad percibida.** Respuestas optimistas, transiciones suaves, sin recargas.
4. **Organización sin fricción.** Etiquetas, colores y fijado opcionales, nunca obligatorios.
5. **Consistencia.** Mismos patrones en ambas versiones para que el A/B mida diseño, no caos.
6. **Accesible por defecto.** Contraste, foco visible y navegación por teclado desde el día uno.

---

## 2. User personas

### 👩‍💼 Marta — Profesional ocupada (32)
- **Necesita:** capturar notas de reuniones rápido y reencontrarlas por etiqueta.
- **Frustración:** apps lentas con demasiados pasos.
- **Valora:** búsqueda instantánea y notas fijadas.

### 🎓 Diego — Estudiante (21)
- **Necesita:** organizar apuntes por materia con colores.
- **Frustración:** perder notas entre el móvil y el portátil.
- **Valora:** sincronización y un estado vacío que lo guíe.

### 🧑‍🎨 Sofía — Creativa freelance (28)
- **Necesita:** un espacio limpio para volcar ideas sin distracciones.
- **Frustración:** interfaces recargadas.
- **Valora:** minimalismo, estética cuidada y modo enfoque.

---

## 3. User flows

### Onboarding y primer uso
```
Inicio → Registro → (auto-login) → Dashboard vacío
        → CTA "Crea tu primera nota" → Editor → Guardar → Dashboard con 1 nota
```

### Crear / editar una nota
```
Dashboard → [+ Nueva nota] → Editor (título, contenido, tags, color, pin)
          → Autoguardado / Guardar → vuelve al Dashboard (lista actualizada)
```

### Buscar y organizar
```
Dashboard → Buscar (título/contenido/etiqueta) → resultados filtrados
          → Fijar / desfijar → reordena (fijadas arriba)
```

### Eliminar
```
Nota → menú ⋯ → Eliminar → confirmación → la nota desaparece (con opción de deshacer)
```

---

## 4. Pantallas del prototipo

> El prototipo de referencia vive en [`docs/design/`](design/) (Pencil).

### 🔐 Login / Registro
- Formulario centrado y minimalista: email, contraseña y un toggle Login/Registro.
- Validación inline y mensajes de error claros.
- Foco automático en el primer campo.

### 🏠 Dashboard
- Cabecera con logo, **buscador** y menú de usuario.
- Sección **Fijadas** (si las hay) y sección **Todas**.
- Notas en **rejilla de tarjetas** tipo masonry; cada tarjeta muestra título, extracto, etiquetas y color.
- Botón flotante **+ Nueva nota**.

### ✏️ Editor
- Vista enfocada: campo de **título** grande y **contenido** amplio.
- Controles secundarios: selector de **color**, **etiquetas** (chips) y **fijar**.
- Autoguardado con indicador de estado ("Guardando…" / "Guardado").

### 🫙 Estado vacío
- Ilustración amable + mensaje motivador ("Aún no tienes notas").
- CTA primario claro: **Crear tu primera nota**.
- Reduce la ansiedad del lienzo en blanco y guía la primera acción.

---

## 5. Sistema de diseño

### Paleta de colores

| Token              | Valor       | Uso                                |
| ------------------ | ----------- | ---------------------------------- |
| `--color-primary`  | `#4F46E5`   | Acciones primarias, foco           |
| `--color-primary-hover` | `#4338CA` | Hover de acciones primarias      |
| `--color-bg`       | `#FFFFFF`   | Fondo (modo claro)                 |
| `--color-bg-alt`   | `#F8FAFC`   | Fondo de paneles/tarjetas          |
| `--color-text`     | `#0F172A`   | Texto principal                    |
| `--color-text-muted` | `#64748B` | Texto secundario                   |
| `--color-border`   | `#E2E8F0`   | Bordes y separadores               |
| `--color-success`  | `#16A34A`   | Éxito / guardado                   |
| `--color-danger`   | `#DC2626`   | Errores / eliminar                 |

**Colores de nota** (para el campo `color`): amarillo `#FFD966`, verde `#A7F3D0`, azul `#BFDBFE`, rosa `#FBCFE8`, gris `#E5E7EB`.

> **Modo oscuro** previsto en el roadmap: mismos tokens semánticos con valores invertidos.

### Tipografía

- **Familia:** `Inter`, con fallback a `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Escala (modular ~1.25):**

| Token        | Tamaño | Uso              |
| ------------ | ------ | ---------------- |
| `--text-xs`  | 12px   | Etiquetas, metadatos |
| `--text-sm`  | 14px   | Texto secundario |
| `--text-base`| 16px   | Cuerpo           |
| `--text-lg`  | 20px   | Subtítulos       |
| `--text-xl`  | 25px   | Títulos de nota  |
| `--text-2xl` | 31px   | Encabezados      |

- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold).
- **Altura de línea:** 1.5 para cuerpo, 1.2 para títulos.

### Espaciado (escala de 4px)

`--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-6: 24px`, `--space-8: 32px`, `--space-12: 48px`.

### Radios y sombras

- Radios: `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 16px`.
- Sombras: `--shadow-sm` (tarjetas), `--shadow-md` (elementos elevados/menús).

### Componentes base

- **Botón** (primario, secundario, fantasma, peligro) con estados hover/active/disabled/focus.
- **Input / Textarea** con label, ayuda y error.
- **Tarjeta de nota** (título, extracto, chips de etiqueta, color, acciones).
- **Chip / Tag** (seleccionable y eliminable).
- **Selector de color** (swatches).
- **Modal de confirmación** (eliminar).
- **Toast** (feedback: guardado, error, deshacer).
- **Estado vacío** reutilizable.

> Ambas versiones deben implementar estos componentes con el **mismo comportamiento y tokens**.

---

## 6. Accesibilidad (WCAG 2.1 AA)

- ✅ **Contraste:** texto normal ≥ 4.5:1 y texto grande ≥ 3:1. La paleta cumple AA.
- ⌨️ **Teclado:** toda acción es operable sin ratón; orden de tabulación lógico.
- 🎯 **Foco visible:** anillo de foco claro (`--color-primary`) en todos los interactivos.
- 🏷️ **Etiquetas y ARIA:** inputs con `<label>`; roles/`aria-*` en modales, toasts y menús.
- 🖼️ **Texto alternativo:** ilustraciones decorativas marcadas como tales (`alt=""`/`aria-hidden`).
- 📐 **Tamaño táctil:** objetivos ≥ 44×44px.
- 🌀 **Movimiento:** respetar `prefers-reduced-motion` para animaciones.
- 📣 **Anuncios:** cambios dinámicos (guardado, errores) en regiones `aria-live`.

---

## 7. Estrategia de refinamiento iterativo y A/B (Versión A vs B)

Construimos **dos implementaciones de la misma UI**:

- **Versión A — React + Vite** (`frontend/`, puerto **5173**).
- **Versión B — Svelte + Vite** (`frontend-alt/`, puerto **5174**).

### Objetivo del experimento
Comparar, sobre el **mismo backend y el mismo sistema de diseño**, cuál ofrece mejor:
- experiencia de usuario (facilidad y satisfacción),
- rendimiento percibido y real (carga, interacción),
- mantenibilidad y velocidad de desarrollo (DX).

### Reglas para una comparación justa
1. **Paridad funcional:** ambas versiones implementan exactamente las mismas pantallas y flujos.
2. **Tokens compartidos:** misma paleta, tipografía y espaciado (sección 5).
3. **Misma API:** sin diferencias de datos entre versiones.
4. **Cambios sincronizados:** un cambio de diseño se aplica a A **y** B antes de medir.

### Cómo se recoge el feedback
- **Cuantitativo:**
  - Core Web Vitals (LCP, INP, CLS) y tamaño de bundle por versión.
  - Métricas de tarea: tiempo para crear la primera nota, tasa de éxito de búsqueda.
  - Asignación de usuarios 50/50 (o despliegue lado a lado en los dos puertos).
- **Cualitativo:**
  - Encuesta corta post-uso (SUS / 1-5 de satisfacción).
  - Tests de usabilidad moderados (5-7 usuarios por versión).
  - Widget de feedback in-app y reporte de issues con la etiqueta `version-a` / `version-b`.

### Ciclo iterativo
```
Diseñar → Implementar en A y B → Medir (cuanti + cuali) → Aprender → Refinar
                ▲                                                  │
                └──────────────────────────────────────────────────┘
```

### Criterios de decisión
Tras 2-3 iteraciones se evalúa con una matriz ponderada (UX 40% · rendimiento 30% · DX 30%). La versión ganadora se promueve como frontend principal; la otra se conserva como referencia o se archiva.

---

## 8. Referencias

- Prototipo Pencil: [`docs/design/`](design/)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [ROADMAP.md](ROADMAP.md)
