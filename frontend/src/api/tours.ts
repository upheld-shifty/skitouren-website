import { api } from './client'
import type { Page, Photo, TourDetail, TourSummary, TourWritePayload, GpxFile, Region, Stats } from '../types'

export const toursApi = {
  list: (params: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') q.set(k, String(v))
    })
    return api.get<Page<TourSummary>>(`/tours?${q}`)
  },

  get: (slug: string) =>
    api.get<TourDetail>(`/tours/${slug}`),

  regions: () =>
    api.get<Region[]>('/regions'),

  stats: () =>
    api.get<Stats>('/stats'),
}

export const adminApi = {
  listTours: (params?: { published?: boolean; page?: number; size?: number }) => {
    const q = new URLSearchParams()
    if (params?.published !== undefined) q.set('published', String(params.published))
    if (params?.page      !== undefined) q.set('page', String(params.page))
    if (params?.size      !== undefined) q.set('size', String(params.size))
    return api.get<Page<TourSummary>>(`/admin/tours?${q}`)
  },

  getTour: (id: number) =>
    api.get<TourDetail>(`/admin/tours/${id}`),

  createTour: (payload: TourWritePayload) =>
    api.post<TourDetail>('/admin/tours', payload),

  updateTour: (id: number, payload: TourWritePayload) =>
    api.put<TourDetail>(`/admin/tours/${id}`, payload),

  deleteTour: (id: number) =>
    api.delete<void>(`/admin/tours/${id}`),

  publish: (id: number) =>
    api.patch<TourDetail>(`/admin/tours/${id}/publish`),

  unpublish: (id: number) =>
    api.patch<TourDetail>(`/admin/tours/${id}/unpublish`),

  uploadPhotos: (tourId: number, files: File[]) => {
    const form = new FormData()
    files.forEach(f => form.append('files', f))
    return api.upload<Photo[]>(`/admin/tours/${tourId}/photos`, form)
  },

  deletePhoto: (photoId: number) =>
    api.delete<void>(`/admin/photos/${photoId}`),

  setCover: (photoId: number) =>
    api.patch<Photo>(`/admin/photos/${photoId}/cover`),

  reorderPhotos: (updates: { id: number; sortOrder: number }[]) =>
    api.put<void>('/admin/photos/reorder', updates),

  uploadGpx: (tourId: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.upload<GpxFile>(`/admin/tours/${tourId}/gpx`, form)
  },

  deleteGpx: (tourId: number) =>
    api.delete<void>(`/admin/tours/${tourId}/gpx`),
}
