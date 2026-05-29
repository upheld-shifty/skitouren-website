import { Link, useParams } from 'react-router-dom'
import { useTourDetail } from '../../hooks/useTourDetail'
import { PageLayout } from '../../components/layout/PageLayout'
import { DifficultyBadge } from '../../components/tour/DifficultyBadge'
import { PhotoGallery } from '../../components/tour/PhotoGallery'
import { TOUR_TYPE_LABELS, difficultyLabel } from '../../types'

function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  return m > 0 ? `${h} h ${m} min` : `${h} h`
}

export function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: tour, isLoading, isError } = useTourDetail(slug ?? '')

  if (isLoading) {
    return (
      <PageLayout>
        <div className="loading-center"><span className="spinner" /></div>
      </PageLayout>
    )
  }

  if (isError || !tour) {
    return (
      <PageLayout>
        <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
          <div className="notice notice--error">Tour nicht gefunden.</div>
          <Link to="/" className="btn btn--secondary" style={{ marginTop: 'var(--space-4)' }}>
            ← Zurück zur Übersicht
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container">
        <nav aria-label="Breadcrumb" style={{ padding: 'var(--space-6) 0 0' }}>
          <Link to="/" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            ← Alle Touren
          </Link>
        </nav>

        <article>
          {/* Hero photo */}
          {(() => {
            const cover = tour.photos.find(p => p.cover) ?? tour.photos[0]
            return cover ? (
              <figure style={{
                margin: 'var(--space-6) 0',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                maxHeight: '480px',
              }}>
                <img
                  src={cover.url}
                  alt={tour.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </figure>
            ) : null
          })()}

          {/* Title + meta */}
          <header style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
              <span className="type-badge">{TOUR_TYPE_LABELS[tour.tourType]}</span>
              <DifficultyBadge difficulty={tour.difficulty} />
              {tour.region && (
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                  {tour.region.name}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 700, letterSpacing: '-0.03em' }}>
              {tour.title}
            </h1>
            {tour.tourDate && (
              <time
                dateTime={tour.tourDate}
                style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)', display: 'block' }}
              >
                {new Date(tour.tourDate).toLocaleDateString('de-CH', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </time>
            )}
          </header>

          {/* Stats grid */}
          <dl className="tour-stats" style={{ marginBottom: 'var(--space-8)' }}>
            {tour.elevationUp != null && (
              <div className="tour-stats__item">
                <dd className="tour-stats__value">↑ {tour.elevationUp} m</dd>
                <dt className="tour-stats__label">Aufstieg</dt>
              </div>
            )}
            {tour.elevationDown != null && (
              <div className="tour-stats__item">
                <dd className="tour-stats__value">↓ {tour.elevationDown} m</dd>
                <dt className="tour-stats__label">Abstieg</dt>
              </div>
            )}
            {tour.distanceKm != null && (
              <div className="tour-stats__item">
                <dd className="tour-stats__value">{tour.distanceKm} km</dd>
                <dt className="tour-stats__label">Distanz</dt>
              </div>
            )}
            {tour.durationMin != null && (
              <div className="tour-stats__item">
                <dd className="tour-stats__value">{formatDuration(tour.durationMin)}</dd>
                <dt className="tour-stats__label">Dauer</dt>
              </div>
            )}
            <div className="tour-stats__item">
              <dd className="tour-stats__value">{difficultyLabel(tour.difficulty)}</dd>
              <dt className="tour-stats__label">Schwierigkeit</dt>
            </div>
            {tour.startLocation && (
              <div className="tour-stats__item">
                <dd className="tour-stats__value" style={{ fontSize: 'var(--font-size-base)' }}>
                  {tour.startLocation}
                </dd>
                <dt className="tour-stats__label">Start</dt>
              </div>
            )}
            {tour.endLocation && (
              <div className="tour-stats__item">
                <dd className="tour-stats__value" style={{ fontSize: 'var(--font-size-base)' }}>
                  {tour.endLocation}
                </dd>
                <dt className="tour-stats__label">Ziel</dt>
              </div>
            )}
            {tour.bestSeason && (
              <div className="tour-stats__item">
                <dd className="tour-stats__value" style={{ fontSize: 'var(--font-size-base)' }}>
                  {tour.bestSeason}
                </dd>
                <dt className="tour-stats__label">Saison</dt>
              </div>
            )}
          </dl>

          {/* GPX download */}
          {tour.gpxFile && (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <a href={tour.gpxFile.downloadUrl} download className="btn btn--secondary">
                GPX herunterladen
              </a>
            </div>
          )}

          {/* Summary */}
          {tour.summary && (
            <section style={{ marginBottom: 'var(--space-8)' }}>
              <p style={{
                fontSize: 'var(--font-size-lg)',
                lineHeight: 'var(--line-height-relaxed)',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                borderLeft: '3px solid var(--color-brand)',
                paddingLeft: 'var(--space-5)',
              }}>
                {tour.summary}
              </p>
            </section>
          )}

          {/* Description */}
          {tour.description && (
            <section style={{ marginBottom: 'var(--space-10)' }}>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Tourenbericht</h2>
              <div style={{
                lineHeight: 'var(--line-height-relaxed)',
                color: 'var(--color-text-secondary)',
                whiteSpace: 'pre-wrap',
              }}>
                {tour.description}
              </div>
            </section>
          )}

          {/* Photo gallery */}
          {tour.photos.length > 1 && (
            <section style={{ marginBottom: 'var(--space-10)' }}>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Fotos</h2>
              <PhotoGallery photos={tour.photos} />
            </section>
          )}
        </article>
      </div>
    </PageLayout>
  )
}
