import { useState, type FormEvent } from 'react'
import type { PostDetail, PostWritePayload } from '../../types'

interface Props {
  initial?: PostDetail
  onSubmit: (payload: PostWritePayload) => void
  loading:  boolean
  error:    string | null
}

export function PostForm({ initial, onSubmit, loading, error }: Props) {
  const [title,   setTitle]   = useState(initial?.title   ?? '')
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [content, setContent] = useState(initial?.content ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ title: title.trim(), summary: summary.trim(), content: content.trim() })
  }

  const isValid = title.trim().length > 0 && content.trim().length > 0

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

        {/* Title */}
        <div className="form-group">
          <label className="form-label form-label--required" htmlFor="post-title">Titel</label>
          <input
            id="post-title"
            type="text"
            className="form-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titel des Beitrags"
            required
          />
        </div>

        {/* Summary */}
        <div className="form-group">
          <label className="form-label" htmlFor="post-summary">Zusammenfassung</label>
          <textarea
            id="post-summary"
            className="form-textarea"
            rows={3}
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Kurze Beschreibung, die in der Übersicht erscheint…"
            style={{ minHeight: 80 }}
          />
          <span className="form-hint">Optional · wird in der News-Übersicht angezeigt</span>
        </div>

        {/* Content */}
        <div className="form-group">
          <label className="form-label form-label--required" htmlFor="post-content">Inhalt</label>
          <textarea
            id="post-content"
            className="form-textarea"
            rows={18}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Text des Beitrags…&#10;&#10;Eine Leerzeile zwischen Abschnitten erzeugt einen neuen Absatz."
            style={{ minHeight: 360, fontFamily: 'inherit', lineHeight: 1.7 }}
            required
          />
          <span className="form-hint">Zwei Leerzeilen = neuer Absatz</span>
        </div>

        {error && (
          <div className="notice notice--error" role="alert">{error}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading || !isValid}
          >
            {loading ? 'Wird gespeichert…' : 'Speichern'}
          </button>
        </div>

      </div>
    </form>
  )
}
