import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../api/tours'
import { TourForm } from '../../components/admin/TourForm'
import type { TourWritePayload } from '../../types'

export function AdminTourCreatePage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(payload: TourWritePayload) {
    setLoading(true)
    setError(null)
    try {
      const tour = await adminApi.createTour(payload)
      qc.invalidateQueries({ queryKey: ['admin', 'tours'] })
      navigate(`/admin/tours/${tour.id}/edit`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Neue Tour erstellen</h1>
      </div>
      <div style={{ maxWidth: '800px' }}>
        <TourForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
