import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function Header() {
  const { isAuthenticated, isAdmin, username, logout } = useAuth()

  return (
    <header className="site-header" role="banner">
      <div className="container">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <polygon points="16,2 30,28 2,28" />
            </svg>
            Tourenberichte
          </Link>

          <nav className="site-header__nav" aria-label="Hauptnavigation">
            <Link to="/">Touren</Link>
            <Link to="/news">News</Link>
            <Link to="/statistiken">Statistiken</Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/tours" className="site-header__nav-admin">
                    Admin
                  </Link>
                )}
                <span className="site-header__user">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <circle cx="8" cy="5" r="3.5" />
                    <path d="M1 14c0-3.866 3.134-7 7-7s7 3.134 7 7" />
                  </svg>
                  {username}
                </span>
                <button className="site-header__logout" onClick={logout}>
                  Abmelden
                </button>
              </>
            ) : (
              <Link to="/anmelden" className="site-header__login">
                Anmelden
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
