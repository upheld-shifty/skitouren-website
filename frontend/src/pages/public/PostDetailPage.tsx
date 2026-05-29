import { Link, useParams, Navigate } from 'react-router-dom'
import { usePost } from '../../hooks/usePosts'
import { PageLayout } from '../../components/layout/PageLayout'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

/** Renders plain-text content as paragraphs (split on blank lines). */
function PostContent({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())
  return (
    <div className="post-content">
      {paragraphs.map((para, i) => (
        <p key={i}>{para.trim()}</p>
      ))}
    </div>
  )
}

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = usePost(slug ?? '')

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container">
          <div className="loading-center"><span className="spinner" /></div>
        </div>
      </PageLayout>
    )
  }

  if (isError || (!isLoading && !post)) {
    return <Navigate to="/404" replace />
  }

  if (!post) return null

  return (
    <PageLayout>
      <article className="container post-detail">
        {/* Breadcrumb */}
        <nav className="post-detail__breadcrumb" aria-label="Breadcrumb">
          <Link to="/news">← News</Link>
        </nav>

        {/* Header */}
        <header className="post-detail__header">
          <time className="post-detail__date" dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
          <h1 className="post-detail__title">{post.title}</h1>
          {post.summary && (
            <p className="post-detail__summary">{post.summary}</p>
          )}
        </header>

        {/* Cover image */}
        {post.coverImageUrl && (
          <figure className="post-detail__cover">
            <img src={post.coverImageUrl} alt={post.title} />
          </figure>
        )}

        {/* Body */}
        <PostContent text={post.content} />
      </article>
    </PageLayout>
  )
}
