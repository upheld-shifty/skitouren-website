import { useQuery } from '@tanstack/react-query'

export interface ElevationPoint {
  distanceKm: number
  elevationM: number
}

export interface GpxData {
  coordinates: [number, number][]
  elevation: ElevationPoint[]
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function parseGpx(url: string): Promise<GpxData> {
  const text = await fetch(url).then(r => {
    if (!r.ok) throw new Error('GPX fetch failed')
    return r.text()
  })
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  const trkpts = Array.from(doc.querySelectorAll('trkpt'))

  const coordinates: [number, number][] = []
  const elevation: ElevationPoint[] = []
  let cumDist = 0

  trkpts.forEach((pt, i) => {
    const lat = parseFloat(pt.getAttribute('lat') ?? '0')
    const lon = parseFloat(pt.getAttribute('lon') ?? '0')
    const ele = parseFloat(pt.querySelector('ele')?.textContent ?? '0')

    if (i > 0) {
      const prev = trkpts[i - 1]
      cumDist += haversineKm(
        parseFloat(prev.getAttribute('lat') ?? '0'),
        parseFloat(prev.getAttribute('lon') ?? '0'),
        lat, lon,
      )
    }

    coordinates.push([lat, lon])
    elevation.push({ distanceKm: parseFloat(cumDist.toFixed(3)), elevationM: ele })
  })

  return { coordinates, elevation }
}

export function useGpxData(url: string | null | undefined) {
  return useQuery({
    queryKey: ['gpx', url],
    queryFn:  () => parseGpx(url!),
    enabled:  Boolean(url),
    staleTime: Infinity,
    retry: false,
  })
}
