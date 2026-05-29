import { useQuery } from '@tanstack/react-query'
import { toursApi } from '../api/tours'
import type { Difficulty, TourType } from '../types'

interface TourFilters {
  type?:       TourType
  difficulty?: Difficulty
  region?:     number
  q?:          string
  page?:       number
}

export function useTours(filters: TourFilters = {}) {
  const params: Record<string, string | number | undefined> = {
    page: filters.page ?? 0,
    size: 20,
    type:       filters.type,
    difficulty: filters.difficulty,
    region:     filters.region,
    q:          filters.q,
  }
  return useQuery({
    queryKey: ['tours', params],
    queryFn:  () => toursApi.list(params),
  })
}

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn:  toursApi.regions,
    staleTime: Infinity,
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn:  toursApi.stats,
    staleTime: 60_000,
  })
}
