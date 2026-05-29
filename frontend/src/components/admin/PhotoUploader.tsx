import { useRef, useState, type DragEvent } from 'react'
import type { Photo } from '../../types'
import { adminApi } from '../../api/tours'

interface Props {
  tourId:  number
  photos:  Photo[]
  onUpdate: (photos: Photo[]) => void
}

export function PhotoUploader({ tourId, photos, onUpdate }: Props) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      const updated = await adminApi.uploadPhotos(tourId, Array.from(files))
      onUpdate(updated)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    upload(e.dataTransfer.files)
  }

  async function deletePhoto(photoId: number) {
    await adminApi.deletePhoto(photoId)
    onUpdate(photos.filter(p => p.id !== photoId))
  }

  async function setCover(photoId: number) {
    const updated = await adminApi.setCover(photoId)
    onUpdate(photos.map(p => ({ ...p, cover: p.id === updated.id })))
  }

  return (
    <div>
      {error && <div className="notice notice--error" role="alert">{error}</div>}

      <div
        className={`upload-zone ${dragging ? 'upload-zone--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Fotos hochladen"
      >
        <svg className="upload-zone__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="4" y="10" width="32" height="24" rx="3" />
          <circle cx="14" cy="20" r="4" />
          <path d="M24 28 L30 20 L36 28" />
        </svg>
        <p className="upload-zone__text">
          {uploading ? 'Hochladen…' : 'Fotos hier ablegen oder klicken zum Auswählen'}
        </p>
        <p className="upload-zone__hint">JPG, PNG, WebP · max. 20 MB pro Foto</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={e => upload(e.target.files)}
          tabIndex={-1}
        />
      </div>

      {photos.length > 0 && (
        <ul className="photo-grid" role="list">
          {photos.map(photo => (
            <li key={photo.id} className={`photo-grid__item ${photo.cover ? 'photo-grid__item--cover' : ''}`}>
              <img src={photo.url} alt={photo.originalName} />
              {photo.cover && (
                <span style={{
                  position: 'absolute', top: 4, left: 4,
                  background: 'var(--color-brand)', color: '#fff',
                  fontSize: '10px', fontWeight: 700, padding: '2px 5px',
                  borderRadius: 'var(--radius-sm)',
                }}>Cover</span>
              )}
              <div className="photo-grid__actions">
                {!photo.cover && (
                  <button onClick={() => setCover(photo.id)} title="Als Cover setzen">★</button>
                )}
                <button
                  onClick={() => deletePhoto(photo.id)}
                  style={{ color: 'var(--color-accent)' }}
                  title="Löschen"
                >✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
