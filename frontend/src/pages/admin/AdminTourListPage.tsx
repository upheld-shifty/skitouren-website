import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/tours'
import { TOUR_TYPE_LABELS } from '../../types'
import { DifficultyBadge } from '../../components/tour/DifficultyBadge'

export function AdminTourListPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tours'],
    queryFn:  () => adminApi.listTours({ size: 100 }),
  })

  const publishMut = useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      published ? adminApi.unpublish(id) : adminApi.publish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tours'] }),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteTour(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tours'] }),
  })

  function handleDelete(id: number, title: string) {
    if (!confirm(`Tour «${title}» wirklich löschen?`)) return
    deleteMut.mutate(id)
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Touren</h1>
        <Link to="/admin/tours/new" className="btn btn--primary">+ Neue Tour</Link>
      </div>

      {isLoading && (
        <div className="loading-center"><span className="spinner" /></div>
      )}

      {data && (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Art</th>
                <th>Schwierigkeit</th>
                <th>Datum</th>
                <th>Status</th>
                <th style={{ width: 1, whiteSpace: 'nowrap' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map(tour => (
                <tr key={tour.id}>
                  <td>
                    <Link to={`/admin/tours/${tour.id}/edit`} style={{ fontWeight: 500 }}>
                      {tour.title}
                    </Link>
                    {tour.region && (
                      <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        {tour.region.name}
                      </span>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className="type-badge">{TOUR_TYPE_LABELS[tour.tourType]}</span>
                  </td>
                  <td><DifficultyBadge difficulty={tour.difficulty} /></td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {tour.tourDate
                      ? new Date(tour.tourDate).toLocaleDateString('de-CH')
                      : '—'}
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${tour.published ? 'published' : 'draft'}`}>
                      {tour.published ? '● Veröffentlicht' : '○ Entwurf'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Link to={`/admin/tours/${tour.id}/edit`} className="btn btn--ghost btn--sm">
                        Bearbeiten
                      </Link>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => publishMut.mutate({ id: tour.id, published: tour.published })}
                      >
                        {tour.published ? 'Zurückziehen' : 'Veröffentlichen'}
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleDelete(tour.id, tour.title)}
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.content.length === 0 && (
        <p style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-8) 0' }}>
          Noch keine Touren. <Link to="/admin/tours/new">Erste Tour erstellen →</Link>
        </p>
      )}
    </div>
  )
}
