import { useState } from 'react'
import type { Difficulty, TourType } from '../../types'
import { useTours } from '../../hooks/useTours'
import { usePageMeta } from '../../hooks/usePageMeta'
import { TourCard } from '../../components/tour/TourCard'
import { TourRow } from '../../components/tour/TourRow'
import { TourFilter } from '../../components/tour/TourFilter'
import { PageLayout } from '../../components/layout/PageLayout'
import { TourCardSkeleton, TourRowSkeleton } from '../../components/skeletons/TourCardSkeleton'

type ViewMode = 'grid' | 'list'

interface FilterState {
  type:       TourType | ''
  difficulty: Difficulty | ''
  region:     string
  q:          string
}

function readViewMode(): ViewMode {
  try { return (localStorage.getItem('tour-view') as ViewMode) ?? 'grid' }
  catch { return 'grid' }
}

// ── Icons ──────────────────────────────────────────────────────────────────
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
         strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <line x1="1" y1="4"  x2="15" y2="4" />
      <line x1="1" y1="8"  x2="15" y2="8" />
      <line x1="1" y1="12" x2="15" y2="12" />
    </svg>
  )
}

export function HomePage() {
  usePageMeta(undefined, 'Schweizer Tourenberichte — Wanderungen, Skitouren, Klettersteige und Hochtouren')

  const [filters, setFilters] = useState<FilterState>({
    type: '', difficulty: '', region: '', q: '',
  })
  const [page, setPage]     = useState(0)
  const [view, setView]     = useState<ViewMode>(readViewMode)

  const { data, isLoading, isError } = useTours({
    type:       filters.type       || undefined,
    difficulty: filters.difficulty || undefined,
    region:     filters.region ? Number(filters.region) : undefined,
    q:          filters.q || undefined,
    page,
  })

  function handleFilterChange(next: FilterState) {
    setFilters(next)
    setPage(0)
  }

  function handleView(v: ViewMode) {
    setView(v)
    try { localStorage.setItem('tour-view', v) } catch { /* ignore */ }
  }

  return (
    <PageLayout>
      <div className="container">
        <header className="page-hero">
          <h1 className="page-hero__title">Tourenberichte</h1>
          <p className="page-hero__subtitle">
            Wanderungen, Skitouren, Klettersteige und Hochtouren in der Schweiz
          </p>
        </header>

        <TourFilter value={filters} onChange={handleFilterChange} />

        {/* ── Results header: count + view toggle ───────────────────────── */}
        {data && (
          <div className="results-bar">
            <p className="results-bar__count" aria-live="polite">
              {data.totalElements === 0
                ? 'Keine Touren gefunden'
                : `${data.totalElements} Tour${data.totalElements !== 1 ? 'en' : ''}`}
            </p>
            <div className="view-toggle" role="group" aria-label="Ansicht wählen">
              <button
                className={`view-toggle__btn${view === 'grid' ? ' view-toggle__btn--active' : ''}`}
                onClick={() => handleView('grid')}
                aria-pressed={view === 'grid'}
                title="Rasteransicht"
              >
                <GridIcon />
              </button>
              <button
                className={`view-toggle__btn${view === 'list' ? ' view-toggle__btn--active' : ''}`}
                onClick={() => handleView('list')}
                aria-pressed={view === 'list'}
                title="Listenansicht"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        )}

        {isLoading && view === 'grid' && (
          <ul className="tour-grid" role="list" aria-label="Touren werden geladen" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}><TourCardSkeleton /></li>
            ))}
          </ul>
        )}

        {isLoading && view === 'list' && (
          <ul className="tour-list" role="list" aria-label="Touren werden geladen" aria-busy="true"
              style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} style={i > 0 ? { borderTop: '1px solid var(--color-border)' } : {}}>
                <TourRowSkeleton />
              </li>
            ))}
          </ul>
        )}

        {isError && (
          <div className="notice notice--error" role="alert">
            Touren konnten nicht geladen werden. Bitte Seite neu laden.
          </div>
        )}

        {data && data.content.length > 0 && (
          <>
            <section aria-label="Tourenliste">
              {view === 'grid' ? (
                <ul className="tour-grid" role="list">
                  {data.content.map(tour => (
                    <li key={tour.id}><TourCard tour={tour} /></li>
                  ))}
                </ul>
              ) : (
                <ul className="tour-list" role="list">
                  {data.content.map(tour => (
                    <li key={tour.id}><TourRow tour={tour} /></li>
                  ))}
                </ul>
              )}
            </section>

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
