import { useRef, useState } from 'react'
import type { GpxFile } from '../../types'
import { adminApi } from '../../api/tours'

interface Props {
  tourId:   number
  gpxFile:  GpxFile | null
  onUpdate: (gpx: GpxFile | null) => void
}

export function GpxUploader({ tourId, gpxFile, onUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      const result = await adminApi.uploadGpx(tourId, files[0])
      onUpdate(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  async function deleteGpx() {
    await adminApi.deleteGpx(tourId)
    onUpdate(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {error && <div className="notice notice--error" role="alert">{error}</div>}

      {gpxFile ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-4)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
        }}>
          <div>
            <p style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>
              {gpxFile.originalName}
            </p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Hochgeladen {new Date(gpxFile.createdAt).toLocaleDateString('de-CH')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <a href={gpxFile.downloadUrl} download className="btn btn--secondary btn--sm">
              Download
            </a>
            <button className="btn btn--danger btn--sm" onClick={deleteGpx}>
              Löschen
            </button>
          </div>
        </div>
      ) : (
        <div
          className="upload-zone"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="GPX-Datei hochladen"
        >
          <svg className="upload-zone__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M20 6 L20 26 M12 18 L20 26 L28 18" />
            <path d="M6 30 L6 34 L34 34 L34 30" />
          </svg>
          <p className="upload-zone__text">
            {uploading ? 'Hochladen…' : 'GPX-Datei auswählen'}
          </p>
          <p className="upload-zone__hint">Max. 5 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".gpx,application/gpx+xml"
            className="sr-only"
            onChange={e => upload(e.target.files)}
            tabIndex={-1}
          />
        </div>
      )}
    </div>
  )
}
