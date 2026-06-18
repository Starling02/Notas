import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthShell from '../components/AuthShell'
import Spinner from '../components/Spinner'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!email) e.email = 'El correo es obligatorio.'
    else if (!EMAIL_RE.test(email)) e.email = 'Introduce un correo valido.'
    if (!password) e.password = 'La contrasena es obligatoria.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      toast.success('Sesion iniciada. Bienvenido de vuelta.')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'No se pudo iniciar sesion.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Bienvenido de vuelta"
      subtitle="Inicia sesion para acceder a tus notas."
    >
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-email">Correo electronico</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-err' : undefined}
            placeholder="tu@correo.com"
          />
          {errors.email && (
            <p id="login-email-err" className="field__error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="login-password">Contrasena</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-err' : undefined}
            placeholder="••••••••"
          />
          {errors.password && (
            <p id="login-password-err" className="field__error" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? <Spinner size={18} label="Entrando" /> : 'Iniciar sesion'}
        </button>
      </form>

      <p className="auth-switch">
        ¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link>
      </p>
    </AuthShell>
  )
}
