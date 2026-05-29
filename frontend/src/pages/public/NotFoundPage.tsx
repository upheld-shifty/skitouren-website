import { Link } from 'react-router-dom'
import { PageLayout } from '../../components/layout/PageLayout'

export function NotFoundPage() {
  return (
    <PageLayout>
      <div className="container" style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-4)' }}>404</h1>
        <p style={{ marginBottom: 'var(--space-6)' }}>Diese Seite existiert nicht.</p>
        <Link to="/" className="btn btn--primary">Zurück zur Übersicht</Link>
      </div>
    </PageLayout>
  )
}
