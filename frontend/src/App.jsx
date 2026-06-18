import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { FullPageSpinner } from './components/Spinner'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './views/Login'
import Register from './views/Register'
import Dashboard from './views/Dashboard'
import NoteEditor from './views/NoteEditor'

// Si ya hay sesion, /login y /register redirigen al panel.
function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <FullPageSpinner label="Cargando…" />
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/new"
        element={
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
