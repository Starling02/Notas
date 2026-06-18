import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthShell from '../components/AuthShell'
import Spinner from '../components/Spinner'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!email) e.email = 'El correo es obligatorio.'
    else if (!EMAIL_RE.test(email)) e.email = 'Introduce un correo valido.'
    if (!password) e.password = 'La contrasena es obligatoria.'
    else if (password.length < 8) e.password = 'Minimo 8 caracteres.'
    if (confirm !== password) e.confirm = 'Las contrasenas no coinciden.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)
    try {
      await register({ email: email.trim(), password })
      toast.success('Cuenta creada. ¡Bienvenido!')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.message || 'No se pudo crear la cuenta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Empieza a organizar tus ideas en segundos.">
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="reg-email">Correo electronico</label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'reg-email-err' : undefined}
            placeholder="tu@correo.com"
          />
          {errors.email && (
            <p id="reg-email-err" className="field__error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="reg-password">Contrasena</label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'reg-password-err' : 'reg-password-hint'}
            placeholder="Minimo 8 caracteres"
          />
          {errors.password ? (
            <p id="reg-password-err" className="field__error" role="alert">
              {errors.password}
            </p>
          ) : (
            <p id="reg-password-hint" className="field__hint">
              Usa al menos 8 caracteres.
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="reg-confirm">Confirmar contrasena</label>
          <input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? 'reg-confirm-err' : undefined}
            placeholder="••••••••"
          />
          {errors.confirm && (
            <p id="reg-confirm-err" className="field__error" role="alert">
              {errors.confirm}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? <Spinner size={18} label="Creando" /> : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth-switch">
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesion</Link>
      </p>
    </AuthShell>
  )
}
