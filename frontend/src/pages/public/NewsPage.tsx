import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePosts } from '../../hooks/usePosts'
import { PageLayout } from '../../components/layout/PageLayout'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export function NewsPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = usePosts(page)

  return (
    <PageLayout>
      <div className="container">
        <header className="page-hero">
          <h1 className="page-hero__title">News</h1>
          <p className="page-hero__subtitle">Berichte, Gedanken und Neuigkeiten</p>
        </header>

        {isLoading && (
          <div className="loading-center" aria-live="polite">
            <span className="spinner" />
          </div>
        )}

        {isError && (
          <div className="notice notice--error" role="alert">
            Beiträge konnten nicht geladen werden.
          </div>
        )}

        {data && data.content.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-12) 0', textAlign: 'center' }}>
            Noch keine Beiträge veröffentlicht.
          </p>
        )}

        {data && data.content.length > 0 && (
          <>
            <ul className="post-list" role="list">
              {data.content.map(post => (
                <li key={post.id}>
                  <article className="post-card">
                    {post.coverImageUrl && (
                      <Link to={`/news/${post.slug}`} className="post-card__image-link" tabIndex={-1} aria-hidden="true">
                        <div className="post-card__image">
                          <img src={post.coverImageUrl} alt="" loading="lazy" />
                        </div>
                      </Link>
                    )}
                    <div className="post-card__body">
                      <time className="post-card__date" dateTime={post.createdAt}>
                        {formatDate(post.createdAt)}
                      </time>
                      <h2 className="post-card__title">
                        <Link to={`/news/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.summary && (
                        <p className="post-card__summary">{post.summary}</p>
                      )}
                      <Link to={`/news/${post.slug}`} className="post-card__readmore">
                        Weiterlesen →
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {data.totalPages > 1 && (
              <nav className="pagination" aria-label="Seitennavigation">
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 0}
                >← Zurück</button>
                <span className="pagination__info">
                  Seite {page + 1} von {data.totalPages}
                </span>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data.totalPages - 1}
                >Weiter →</button>
              </nav>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
