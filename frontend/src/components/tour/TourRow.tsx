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

export function TourRow({ tour }: Props) {
  return (
    <article>
      <Link to={`/tour/${tour.slug}`} className="tour-row">
        {/* Type + difficulty */}
        <div className="tour-row__badges">
          <span className="type-badge">{TOUR_TYPE_LABELS[tour.tourType]}</span>
          <DifficultyBadge difficulty={tour.difficulty} />
        </div>

        {/* Title + region */}
        <div className="tour-row__main">
          <h2 className="tour-row__title">{tour.title}</h2>
          {tour.region && (
            <span className="tour-row__region">{tour.region.name}</span>
          )}
        </div>

        {/* Stats */}
        <dl className="tour-row__stats">
          {tour.elevationUp != null && (
            <div className="tour-row__stat">
              <dt>↑</dt>
              <dd>{tour.elevationUp.toLocaleString('de-CH')} m</dd>
            </div>
          )}
          {tour.distanceKm != null && (
            <div className="tour-row__stat">
              <dt>Distanz</dt>
              <dd>{tour.distanceKm} km</dd>
            </div>
          )}
          {tour.durationMin != null && (
            <div className="tour-row__stat">
              <dt>Zeit</dt>
              <dd>{formatDuration(tour.durationMin)}</dd>
            </div>
          )}
        </dl>

        {/* Date */}
        {tour.tourDate && (
          <time className="tour-row__date" dateTime={tour.tourDate}>
            {new Date(tour.tourDate).toLocaleDateString('de-CH', {
              day: '2-digit', month: '2-digit', year: 'numeric',
            })}
          </time>
        )}
      </Link>
    </article>
  )
}
