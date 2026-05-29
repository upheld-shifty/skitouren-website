import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminPostsApi } from '../../api/posts'
import type { PostWritePayload } from '../../types'
import { PostForm } from '../../components/admin/PostForm'

export function AdminPostEditPage() {
  const { id }   = useParams<{ id: string }>()
  const postId   = Number(id)
  const qc       = useQueryClient()

  const [formLoading, setFormLoading] = useState(false)
  const [formError,   setFormError]   = useState<string | null>(null)
  const [coverLoading, setCoverLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: post, isLoading } = useQuery({
    queryKey: ['admin', 'post', postId],
    queryFn:  () => adminPostsApi.get(postId),
    enabled:  Boolean(postId),
  })

  function invalidate() {
    qc.invalidateQueries({ queryKey: ['admin', 'post', postId] })
    qc.invalidateQueries({ queryKey: ['admin', 'posts'] })
    qc.invalidateQueries({ queryKey: ['posts'] })
  }

  async function handleSave(payload: PostWritePayload) {
    setFormLoading(true)
    setFormError(null)
    try {
      await adminPostsApi.update(postId, payload)
      invalidate()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Fehler beim Speichern')
    } finally {
      setFormLoading(false)
    }
  }

  async function handlePublish() {
    if (!post) return
    post.published ? await adminPostsApi.unpublish(postId) : await adminPostsApi.publish(postId)
    invalidate()
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverLoading(true)
    try {
      await adminPostsApi.uploadCover(postId, file)
      invalidate()
    } finally {
      setCoverLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleCoverDelete() {
    if (!confirm('Titelbild entfernen?')) return
    await adminPostsApi.deleteCover(postId)
    invalidate()
  }

  if (isLoading || !post) {
    return <div className="loading-center"><span className="spinner" /></div>
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <nav style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            <Link to="/admin/news">News</Link> / {post.title}
          </nav>
          <h1>{post.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {post.published ? (
            <>
              <a href={`/news/${post.slug}`} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
                Ansicht ↗
              </a>
              <button className="btn btn--secondary" onClick={handlePublish}>Zurückziehen</button>
            </>
          ) : (
            <button className="btn btn--primary" onClick={handlePublish}>Veröffentlichen</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* ── Cover image ─────────────────────────────────────────────── */}
        <section>
          <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
            Titelbild
          </h2>
          {post.coverImageUrl ? (
            <div className="post-cover-editor">
              <img src={post.coverImageUrl} alt="Titelbild" className="post-cover-editor__preview" />
              <div className="post-cover-editor__actions">
                <label className="btn btn--secondary btn--sm" style={{ cursor: 'pointer' }}>
                  {coverLoading ? 'Wird hochgeladen…' : 'Bild ersetzen'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverUpload}
                    style={{ display: 'none' }}
                    disabled={coverLoading}
                  />
                </label>
                <button className="btn btn--danger btn--sm" onClick={handleCoverDelete}>
                  Entfernen
                </button>
              </div>
            </div>
          ) : (
            <label className={`upload-zone${coverLoading ? ' upload-zone--active' : ''}`}
                   style={{ cursor: 'pointer', display: 'block' }}>
              <div className="upload-zone__icon" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="8" width="32" height="24" rx="3" />
                  <circle cx="14" cy="16" r="3" />
                  <path d="M4 28 L12 20 L20 27 L27 19 L36 28" />
                </svg>
              </div>
              <p className="upload-zone__text">
                {coverLoading ? 'Wird hochgeladen…' : 'Titelbild hochladen'}
              </p>
              <p className="upload-zone__hint">JPG, PNG oder WebP · max. 20 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
                disabled={coverLoading}
              />
            </label>
          )}
        </section>

        {/* ── Post form ───────────────────────────────────────────────── */}
        <PostForm
          initial={post}
          onSubmit={handleSave}
          loading={formLoading}
          error={formError}
        />
      </div>
    </div>
  )
}
