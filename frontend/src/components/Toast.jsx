// Pila de toasts. Renderizada por ToastProvider; recibe lista + onDismiss.

const ICONS = {
  success: (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.1-.3Z"
        fill="currentColor"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm0 9.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"
        fill="currentColor"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM11 14a1 1 0 0 1-2 0v-4a1 1 0 1 1 2 0v4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" role="region" aria-label="Notificaciones" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`} role="status">
          <span className="toast__icon">{ICONS[t.type] || ICONS.info}</span>
          <span className="toast__msg">{t.message}</span>
          <button
            type="button"
            className="toast__close"
            onClick={() => onDismiss(t.id)}
            aria-label="Cerrar notificacion"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
