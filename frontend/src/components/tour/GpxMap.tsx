import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { GpxData } from '../../hooks/useGpxData'

// Fix default marker icons broken by Vite's asset hashing
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Props {
  gpxData: GpxData
}

export function GpxMap({ gpxData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || gpxData.coordinates.length === 0) return

    const map = L.map(containerRef.current, { attributionControl: true })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    const polyline = L.polyline(gpxData.coordinates, {
      color:  '#1E3A5F',
      weight: 3,
      opacity: 0.85,
    }).addTo(map)

    const start = gpxData.coordinates[0]
    const end   = gpxData.coordinates[gpxData.coordinates.length - 1]

    L.marker(start).addTo(map)
    L.marker(end).addTo(map)

    map.fitBounds(polyline.getBounds(), { padding: [24, 24] })

    return () => { map.remove() }
  }, [gpxData])

  return (
    <div
      ref={containerRef}
      style={{ height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}
    />
  )
}
