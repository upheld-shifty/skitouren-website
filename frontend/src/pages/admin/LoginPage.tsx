import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ApiError } from '../../api/client'

export function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const role = await login(username, password)
      navigate(role === 'ADMIN' ? '/admin/tours' : '/')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Benutzername oder Passwort falsch.')
      } else {
        setError('Anmeldung fehlgeschlagen. Bitte erneut versuchen.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 'var(--space-6)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true"
               style={{ margin: '0 auto var(--space-4)', display: 'block' }}>
            <polygon points="16,2 30,28 2,28" fill="var(--color-brand)" />
          </svg>
          <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Anmelden</h1>
        </div>

        {error && (
          <div className="notice notice--error" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Benutzername</label>
            <input
              id="username"
              type="text"
              className="form-input"
              autoComplete="username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Passwort</label>
            <input
              id="password"
              type="password"
              className="form-input"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--lg"
                  disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? 'Anmelden…' : 'Anmelden'}
          </button>
        </form>

        <p style={{
          marginTop: 'var(--space-6)',
          textAlign: 'center',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
        }}>
          Noch kein Konto?{' '}
          <Link to="/registrieren" style={{ color: 'var(--color-brand)', fontWeight: 500 }}>
            Jetzt registrieren →
          </Link>
        </p>
      </div>
    </div>
  )
}
