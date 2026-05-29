import { type ChangeEvent } from 'react'
import type { Difficulty, TourType } from '../../types'
import { DIFFICULTIES_BY_TYPE, TOUR_TYPE_LABELS, difficultyLabel } from '../../types'
import { useRegions } from '../../hooks/useTours'

interface FilterState {
  type:       TourType | ''
  difficulty: Difficulty | ''
  region:     string
  q:          string
}

interface Props {
  value:    FilterState
  onChange: (next: FilterState) => void
}

export function TourFilter({ value, onChange }: Props) {
  const { data: regions } = useRegions()

  function handle(field: keyof FilterState) {
    return (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const next = { ...value, [field]: e.target.value }
      // Clear difficulty when tour type changes
      if (field === 'type') next.difficulty = ''
      onChange(next)
    }
  }

  const availableDifficulties = value.type
    ? DIFFICULTIES_BY_TYPE[value.type as TourType]
    : []

  return (
    <section className="filter-bar" aria-label="Touren filtern">
      <div className="filter-bar__field filter-bar__search">
        <label htmlFor="filter-q" className="filter-bar__label">Suche</label>
        <input
          id="filter-q"
          type="search"
          className="form-input"
          placeholder="Tourname suchen…"
          value={value.q}
          onChange={handle('q')}
        />
      </div>

      <div className="filter-bar__field">
        <label htmlFor="filter-type" className="filter-bar__label">Tourenart</label>
        <select id="filter-type" className="form-select" value={value.type} onChange={handle('type')}>
          <option value="">Alle</option>
          {(Object.keys(TOUR_TYPE_LABELS) as TourType[]).map(t => (
            <option key={t} value={t}>{TOUR_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label htmlFor="filter-diff" className="filter-bar__label">Schwierigkeit</label>
        <select
          id="filter-diff"
          className="form-select"
          value={value.difficulty}
          onChange={handle('difficulty')}
          disabled={!value.type}
        >
          <option value="">Alle</option>
          {availableDifficulties.map(d => (
            <option key={d} value={d}>{difficultyLabel(d)}</option>
          ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label htmlFor="filter-region" className="filter-bar__label">Region</label>
        <select id="filter-region" className="form-select" value={value.region} onChange={handle('region')}>
          <option value="">Alle Regionen</option>
          {regions?.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
    </section>
  )
}
