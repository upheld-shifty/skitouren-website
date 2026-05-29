import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { adminPostsApi } from '../../api/posts'
import type { PostWritePayload } from '../../types'
import { PostForm } from '../../components/admin/PostForm'

export function AdminPostCreatePage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(payload: PostWritePayload) {
    setLoading(true)
    setError(null)
    try {
      const post = await adminPostsApi.create(payload)
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] })
      navigate(`/admin/news/${post.id}/edit`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Erstellen')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <nav style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            <Link to="/admin/news">News</Link> / Neuer Beitrag
          </nav>
          <h1>Neuer Beitrag</h1>
        </div>
      </div>
      <div style={{ maxWidth: 800 }}>
        <PostForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
