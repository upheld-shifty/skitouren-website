import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" aria-label="Admin-Navigation">
        <NavLink to="/admin/tours" className="admin-sidebar__logo">
          Tourenberichte
        </NavLink>
        <nav className="admin-sidebar__nav">
          <NavLink
            to="/admin/tours"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Touren
          </NavLink>
          <NavLink
            to="/admin/news"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            News
          </NavLink>
          <button
            onClick={logout}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 'var(--font-size-sm)',
              marginTop: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Abmelden
          </button>
        </nav>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
