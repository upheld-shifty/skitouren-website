import { useStats } from '../../hooks/useTours'
import { PageLayout } from '../../components/layout/PageLayout'
import { TOUR_TYPE_LABELS } from '../../types'
import type { TourType } from '../../types'

// ── Tour-type icons (simple SVG paths) ─────────────────────────────────────
const TYPE_ICONS: Record<TourType, string> = {
  WANDERUNG:    'M4 20 L10 8 L16 14 L20 6',
  SKITOUR:      'M6 18 L12 4 L18 18 M9 13 h6',
  KLETTERSTEIG: 'M12 3 L12 21 M8 7 L16 7 M8 15 L16 15',
  HOCHTOUR:     'M4 21 L12 3 L20 21 M8 14 h8',
  SCHNEESCHUH:  'M12 4 L12 20 M6 10 L18 10 M6 14 L18 14',
}

function StatBox({ value, label, unit }: { value: string; label: string; unit?: string }) {
  return (
    <div className="stats-box">
      <span className="stats-box__value">
        {value}
        {unit && <span className="stats-box__unit">{unit}</span>}
      </span>
      <span className="stats-box__label">{label}</span>
    </div>
  )
}

function fmt(n: number, decimals = 0) {
  return n.toLocaleString('de-CH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function StatsPage() {
  const { data, isLoading, isError } = useStats()

  return (
    <PageLayout>
      <div className="container">
        <header className="page-hero">
          <h1 className="page-hero__title">Statistiken</h1>
          <p className="page-hero__subtitle">Alle publizierten Touren im Überblick</p>
        </header>

        {isLoading && (
          <div className="loading-center" aria-live="polite">
            <span className="spinner" />
          </div>
        )}

        {isError && (
          <div className="notice notice--error" role="alert">
            Statistiken konnten nicht geladen werden.
          </div>
        )}

        {data && (
          <>
            {/* ── Totals ───────────────────────────────────────────────── */}
            <section className="stats-grid" aria-label="Gesamtstatistiken">
              <StatBox value={fmt(data.totalTours)}         label="Touren" />
              <StatBox value={fmt(data.totalKm, 1)}         label="Kilometer" unit=" km" />
              <StatBox value={fmt(data.totalElevationUp)}   label="Höhenmeter aufwärts" unit=" m" />
              <StatBox value={fmt(data.totalDurationHours)} label="Stunden unterwegs" unit=" h" />
            </section>

            {/* ── By type ──────────────────────────────────────────────── */}
            {data.byType.length > 0 && (
              <section className="page-section" aria-label="Nach Tourenart">
                <h2 className="stats-section-title">Nach Tourenart</h2>
                <ul className="type-stats-grid" role="list">
                  {data.byType.map(ts => (
                    <li key={ts.tourType} className="type-stat-card">
                      <div className="type-stat-card__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                             strokeLinecap="round" strokeLinejoin="round">
                          <path d={TYPE_ICONS[ts.tourType as TourType]} />
                        </svg>
                      </div>
                      <strong className="type-stat-card__type">
                        {TOUR_TYPE_LABELS[ts.tourType as TourType]}
                      </strong>
                      <dl className="type-stat-card__numbers">
                        <div>
                          <dt>Touren</dt>
                          <dd>{ts.count}</dd>
                        </div>
                        {ts.km > 0 && (
                          <div>
                            <dt>Distanz</dt>
                            <dd>{fmt(ts.km, 1)} km</dd>
                          </div>
                        )}
                      </dl>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
