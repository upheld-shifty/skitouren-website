import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/anmelden" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    // Logged in but not an admin → back to home
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
