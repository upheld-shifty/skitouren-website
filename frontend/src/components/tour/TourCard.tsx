import { Link } from 'react-router-dom'
import type { TourSummary } from '../../types'
import { TOUR_TYPE_LABELS } from '../../types'
import { DifficultyBadge } from './DifficultyBadge'

interface Props {
  tour: TourSummary
}

function formatDuration(min: number | null): string {
  if (!min) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function TourCard({ tour }: Props) {
  return (
    <article>
      <Link to={`/tour/${tour.slug}`} className="tour-card">
        <div className="tour-card__image">
          {tour.coverPhotoUrl ? (
            <img src={tour.coverPhotoUrl} alt={tour.title} loading="lazy" />
          ) : (
            <div className="tour-card__image--empty" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 36 L16 20 L26 30 L34 18 L42 36 Z" />
                <circle cx="34" cy="14" r="4" />
              </svg>
            </div>
          )}
        </div>
        <div className="tour-card__body">
          <div className="tour-card__meta">
            <span className="type-badge">{TOUR_TYPE_LABELS[tour.tourType]}</span>
            <DifficultyBadge difficulty={tour.difficulty} />
            {tour.region && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {tour.region.name}
              </span>
            )}
          </div>
          <h2 className="tour-card__title">{tour.title}</h2>
          <dl className="tour-card__stats">
            {tour.elevationUp != null && (
              <div className="stat">
                <dt className="stat__label">Aufstieg</dt>
                <dd className="stat__value">↑ {tour.elevationUp} m</dd>
              </div>
            )}
            {tour.distanceKm != null && (
              <div className="stat">
                <dt className="stat__label">Distanz</dt>
                <dd className="stat__value">{tour.distanceKm} km</dd>
              </div>
            )}
            {tour.durationMin != null && (
              <div className="stat">
                <dt className="stat__label">Zeit</dt>
                <dd className="stat__value">{formatDuration(tour.durationMin)}</dd>
              </div>
            )}
            {tour.tourDate && (
              <div className="stat">
                <dt className="stat__label">Datum</dt>
                <dd className="stat__value">
                  {new Date(tour.tourDate).toLocaleDateString('de-CH', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                  })}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </Link>
    </article>
  )
}
