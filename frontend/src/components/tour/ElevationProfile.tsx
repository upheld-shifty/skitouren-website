import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import type { ElevationPoint } from '../../hooks/useGpxData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

interface Props {
  points: ElevationPoint[]
}

// Downsample to at most maxPts points to keep the chart responsive
function downsample(points: ElevationPoint[], maxPts: number): ElevationPoint[] {
  if (points.length <= maxPts) return points
  const step = points.length / maxPts
  return Array.from({ length: maxPts }, (_, i) => points[Math.round(i * step)])
}

export function ElevationProfile({ points }: Props) {
  const sampled = downsample(points, 300)

  const data = {
    labels: sampled.map(p => p.distanceKm.toFixed(1)),
    datasets: [{
      data:            sampled.map(p => p.elevationM),
      borderColor:     '#1E3A5F',
      backgroundColor: 'rgba(30,58,95,0.12)',
      borderWidth:     2,
      fill:            true,
      pointRadius:     0,
      tension:         0.3,
    }],
  }

  const options = {
    responsive:          true,
    maintainAspectRatio: true,
    animation:           false as const,
    plugins: { legend: { display: false }, tooltip: {
      callbacks: {
        title: (items: { label: string }[]) => `${items[0].label} km`,
        label: (item: { raw: unknown }) => `${item.raw} m`,
      },
    }},
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          callback: (_: unknown, i: number) =>
            i % Math.ceil(sampled.length / 8) === 0
              ? `${sampled[i]?.distanceKm.toFixed(1)} km`
              : null,
        },
        grid: { display: false },
      },
      y: {
        ticks: { callback: (v: unknown) => `${v} m` },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  }

  return <Line data={data} options={options} />
}
