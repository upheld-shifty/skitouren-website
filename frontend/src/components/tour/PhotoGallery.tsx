import { useState } from 'react'
import type { Photo } from '../../types'

interface Props {
  photos: Photo[]
}

export function PhotoGallery({ photos }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  if (photos.length === 0) return null

  function close()  { setLightboxIdx(null) }
  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setLightboxIdx(i => (i != null ? (i - 1 + photos.length) % photos.length : 0))
  }
  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setLightboxIdx(i => (i != null ? (i + 1) % photos.length : 0))
  }

  return (
    <>
      <ul className="photo-gallery" role="list">
        {photos.map((photo, idx) => (
          <li key={photo.id}>
            <button
              className="photo-gallery__item"
              onClick={() => setLightboxIdx(idx)}
              aria-label={`Foto ${idx + 1} vergrössern`}
            >
              <img src={photo.url} alt={photo.caption ?? `Foto ${idx + 1}`} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      {lightboxIdx !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Foto-Vollansicht"
          onClick={close}
        >
          <button className="lightbox__close" onClick={close} aria-label="Schliessen">×</button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="Vorheriges Foto">‹</button>
          <img
            className="lightbox__img"
            src={photos[lightboxIdx].url}
            alt={photos[lightboxIdx].caption ?? `Foto ${lightboxIdx + 1}`}
            onClick={e => e.stopPropagation()}
          />
          <button className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Nächstes Foto">›</button>
        </div>
      )}
    </>
  )
}
