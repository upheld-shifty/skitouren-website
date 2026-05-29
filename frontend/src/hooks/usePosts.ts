import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../api/posts'

export function usePosts(page = 0) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn:  () => postsApi.list(page),
  })
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn:  () => postsApi.get(slug),
    enabled:  Boolean(slug),
  })
}
