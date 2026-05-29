import { useQuery } from '@tanstack/react-query'
import { toursApi } from '../api/tours'

export function useTourDetail(slug: string) {
  return useQuery({
    queryKey: ['tour', slug],
    queryFn:  () => toursApi.get(slug),
    enabled:  Boolean(slug),
  })
}
