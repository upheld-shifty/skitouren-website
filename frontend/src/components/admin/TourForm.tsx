import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Difficulty, TourDetail, TourType, TourWritePayload } from '../../types'
import { DIFFICULTIES_BY_TYPE, TOUR_TYPE_LABELS, difficultyLabel } from '../../types'
import { useRegions } from '../../hooks/useTours'

interface Props {
  initial?: TourDetail
  onSubmit: (payload: TourWritePayload) => Promise<void>
  loading:  boolean
  error:    string | null
}

const EMPTY: TourWritePayload = {
  title:         '',
  tourType:      'WANDERUNG',
  difficulty:    'T1',
  regionId:      null,
  summary:       '',
  description:   '',
  elevationUp:   null,
  elevationDown: null,
  distanceKm:    null,
  durationMin:   null,
  startLocation: '',
  endLocation:   '',
  bestSeason:    '',
  tourDate:      null,
}

export function TourForm({ initial, onSubmit, loading, error }: Props) {
  const { data: regions } = useRegions()
  const [form, setForm] = useState<TourWritePayload>(() => {
    if (!initial) return EMPTY
    return {
      title:         initial.title,
      tourType:      initial.tourType,
      difficulty:    initial.difficulty,
      regionId:      initial.region?.id ?? null,
      summary:       initial.summary ?? '',
      description:   initial.description ?? '',
      elevationUp:   initial.elevationUp ?? null,
      elevationDown: initial.elevationDown ?? null,
      distanceKm:    initial.distanceKm ?? null,
      durationMin:   initial.durationMin ?? null,
      startLocation: initial.startLocation ?? '',
      endLocation:   initial.endLocation ?? '',
      bestSeason:    initial.bestSeason ?? '',
      tourDate:      initial.tourDate ?? null,
    }
  })

  function setField<K extends keyof TourWritePayload>(key: K, value: TourWritePayload[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value === '' ? null : value }))
  }

  function handleTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const type = e.target.value as TourType
    const firstDiff = DIFFICULTIES_BY_TYPE[type][0]
    setForm(f => ({ ...f, tourType: type, difficulty: firstDiff }))
  }

  function handleNumberChange(name: keyof TourWritePayload) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setField(name, val === '' ? null : (Number(val) as TourWritePayload[typeof name]))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  const difficulties = DIFFICULTIES_BY_TYPE[form.tourType]

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="notice notice--error" role="alert">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label form-label--required">Titel</label>
          <input id="title" name="title" className="form-input" required
            value={form.title} onChange={handleChange} />
        </div>

        {/* Type + Difficulty + Region */}
        <div className="form-grid form-grid--3">
          <div className="form-group">
            <label htmlFor="tourType" className="form-label form-label--required">Tourenart</label>
            <select id="tourType" name="tourType" className="form-select" value={form.tourType} onChange={handleTypeChange}>
              {(Object.keys(TOUR_TYPE_LABELS) as TourType[]).map(t => (
                <option key={t} value={t}>{TOUR_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="difficulty" className="form-label form-label--required">Schwierigkeit</label>
            <select id="difficulty" name="difficulty" className="form-select" value={form.difficulty}
              onChange={e => setField('difficulty', e.target.value as Difficulty)}>
              {difficulties.map(d => (
                <option key={d} value={d}>{difficultyLabel(d)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="regionId" className="form-label">Region</label>
            <select id="regionId" name="regionId" className="form-select"
              value={form.regionId ?? ''}
              onChange={e => setField('regionId', e.target.value ? Number(e.target.value) : null)}>
              <option value="">— keine —</option>
              {regions?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="form-grid form-grid--3">
          <div className="form-group">
            <label htmlFor="elevationUp" className="form-label">Aufstieg (m)</label>
            <input id="elevationUp" type="number" min="0" className="form-input"
              value={form.elevationUp ?? ''} onChange={handleNumberChange('elevationUp')} />
          </div>
          <div className="form-group">
            <label htmlFor="elevationDown" className="form-label">Abstieg (m)</label>
            <input id="elevationDown" type="number" min="0" className="form-input"
              value={form.elevationDown ?? ''} onChange={handleNumberChange('elevationDown')} />
          </div>
          <div className="form-group">
            <label htmlFor="distanceKm" className="form-label">Distanz (km)</label>
            <input id="distanceKm" type="number" min="0" step="0.1" className="form-input"
              value={form.distanceKm ?? ''} onChange={handleNumberChange('distanceKm')} />
          </div>
          <div className="form-group">
            <label htmlFor="durationMin" className="form-label">Dauer (Minuten)</label>
            <input id="durationMin" type="number" min="0" className="form-input"
              value={form.durationMin ?? ''} onChange={handleNumberChange('durationMin')} />
          </div>
          <div className="form-group">
            <label htmlFor="tourDate" className="form-label">Datum</label>
            <input id="tourDate" type="date" name="tourDate" className="form-input"
              value={form.tourDate ?? ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bestSeason" className="form-label">Beste Saison</label>
            <input id="bestSeason" name="bestSeason" className="form-input" placeholder="z.B. Juni – Oktober"
              value={form.bestSeason ?? ''} onChange={handleChange} />
          </div>
        </div>

        {/* Locations */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="startLocation" className="form-label">Startpunkt</label>
            <input id="startLocation" name="startLocation" className="form-input"
              value={form.startLocation ?? ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="endLocation" className="form-label">Endpunkt</label>
            <input id="endLocation" name="endLocation" className="form-input"
              value={form.endLocation ?? ''} onChange={handleChange} />
          </div>
        </div>

        {/* Summary + Description */}
        <div className="form-group">
          <label htmlFor="summary" className="form-label">Kurzbeschreibung</label>
          <textarea id="summary" name="summary" className="form-textarea" rows={3}
            value={form.summary ?? ''} onChange={handleChange} />
          <span className="form-hint">Kurze Zusammenfassung für die Tourenliste</span>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Tourenbericht</label>
          <textarea id="description" name="description" className="form-textarea" rows={12}
            value={form.description ?? ''} onChange={handleChange}
            placeholder="Detaillierter Tourenbericht…" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
            {loading ? 'Speichern…' : 'Speichern'}
          </button>
        </div>
      </div>
    </form>
  )
}
