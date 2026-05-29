import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../api/tours'
import { TourForm } from '../../components/admin/TourForm'
import { PhotoUploader } from '../../components/admin/PhotoUploader'
import { GpxUploader } from '../../components/admin/GpxUploader'
import type { GpxFile, Photo, TourWritePayload } from '../../types'

type Tab = 'info' | 'photos' | 'gpx'

export function AdminTourEditPage() {
  const { id } = useParams<{ id: string }>()
  const tourId = Number(id)
  const qc = useQueryClient()

  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: tour, isLoading } = useQuery({
    queryKey: ['admin', 'tour', tourId],
    queryFn:  () => adminApi.getTour(tourId),
    enabled:  Boolean(tourId),
  })

  const [photos, setPhotos] = useState<Photo[]>([])
  const [gpxFile, setGpxFile] = useState<GpxFile | null>(null)

  // Sync local state from query data on first load
  const [synced, setSynced] = useState(false)
  if (tour && !synced) {
    setPhotos(tour.photos)
    setGpxFile(tour.gpxFile)
    setSynced(true)
  }

  async function handleSave(payload: TourWritePayload) {
    setFormLoading(true)
    setFormError(null)
    try {
      await adminApi.updateTour(tourId, payload)
      qc.invalidateQueries({ queryKey: ['admin', 'tours'] })
      qc.invalidateQueries({ queryKey: ['admin', 'tour', tourId] })
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Fehler beim Speichern')
    } finally {
      setFormLoading(false)
    }
  }

  async function handlePublish() {
    if (!tour) return
    if (tour.published) {
      await adminApi.unpublish(tourId)
    } else {
      await adminApi.publish(tourId)
    }
    qc.invalidateQueries({ queryKey: ['admin', 'tour', tourId] })
    qc.invalidateQueries({ queryKey: ['admin', 'tours'] })
  }

  if (isLoading || !tour) {
    return <div className="loading-center"><span className="spinner" /></div>
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <nav style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            <Link to="/admin/tours">Touren</Link> / {tour.title}
          </nav>
          <h1>{tour.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {tour.published ? (
            <>
              <a href={`/tour/${tour.slug}`} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
                Ansicht ↗
              </a>
              <button className="btn btn--secondary" onClick={handlePublish}>Zurückziehen</button>
            </>
          ) : (
            <button className="btn btn--primary" onClick={handlePublish}>Veröffentlichen</button>
          )}
        </div>
      </div>

      <div className="tabs" role="tablist">
        {(['info', 'photos', 'gpx'] as Tab[]).map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={activeTab === t}
            className={`tab ${activeTab === t ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'info'   ? 'Informationen' :
             t === 'photos' ? `Fotos (${photos.length})` :
             `GPX${gpxFile ? ' ✓' : ''}`}
          </button>
        ))}
      </div>

      <div role="tabpanel" style={{ maxWidth: '800px' }}>
        {activeTab === 'info' && (
          <TourForm
            initial={tour}
            onSubmit={handleSave}
            loading={formLoading}
            error={formError}
          />
        )}
        {activeTab === 'photos' && (
          <PhotoUploader
            tourId={tourId}
            photos={photos}
            onUpdate={setPhotos}
          />
        )}
        {activeTab === 'gpx' && (
          <GpxUploader
            tourId={tourId}
            gpxFile={gpxFile}
            onUpdate={setGpxFile}
          />
        )}
      </div>
    </div>
  )
}
