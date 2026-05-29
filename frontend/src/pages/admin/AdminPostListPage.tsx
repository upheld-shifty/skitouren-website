import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminPostsApi } from '../../api/posts'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-CH')
}

export function AdminPostListPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'posts'],
    queryFn:  () => adminPostsApi.list(),
  })

  const publishMut = useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      published ? adminPostsApi.unpublish(id) : adminPostsApi.publish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => adminPostsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  })

  function handleDelete(id: number, title: string) {
    if (!confirm(`Beitrag «${title}» wirklich löschen?`)) return
    deleteMut.mutate(id)
  }

  return (
    <div>
      <div className="admin-header">
        <h1>News</h1>
        <Link to="/admin/news/new" className="btn btn--primary">+ Neuer Beitrag</Link>
      </div>

      {isLoading && (
        <div className="loading-center"><span className="spinner" /></div>
      )}

      {data && data.content.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Erstellt</th>
                <th>Status</th>
                <th style={{ width: 1, whiteSpace: 'nowrap' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map(post => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/admin/news/${post.id}/edit`} style={{ fontWeight: 500 }}>
                      {post.title}
                    </Link>
                    {post.summary && (
                      <span style={{
                        display: 'block',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-muted)',
                        marginTop: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 400,
                      }}>
                        {post.summary}
                      </span>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {formatDate(post.createdAt)}
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${post.published ? 'published' : 'draft'}`}>
                      {post.published ? '● Veröffentlicht' : '○ Entwurf'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Link to={`/admin/news/${post.id}/edit`} className="btn btn--ghost btn--sm">
                        Bearbeiten
                      </Link>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => publishMut.mutate({ id: post.id, published: post.published })}
                      >
                        {post.published ? 'Zurückziehen' : 'Veröffentlichen'}
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleDelete(post.id, post.title)}
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
          Noch keine Beiträge. <Link to="/admin/news/new">Ersten Beitrag erstellen →</Link>
        </p>
      )}
    </div>
  )
}
