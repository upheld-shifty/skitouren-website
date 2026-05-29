import { api } from './client'
import type { Page, PostDetail, PostSummary, PostWritePayload } from '../types'

export const postsApi = {
  list: (page = 0, size = 12) =>
    api.get<Page<PostSummary>>(`/posts?page=${page}&size=${size}`),

  get: (slug: string) =>
    api.get<PostDetail>(`/posts/${slug}`),
}

export const adminPostsApi = {
  list: (page = 0, size = 50) =>
    api.get<Page<PostSummary>>(`/admin/posts?page=${page}&size=${size}`),

  get: (id: number) =>
    api.get<PostDetail>(`/admin/posts/${id}`),

  create: (payload: PostWritePayload) =>
    api.post<PostDetail>('/admin/posts', payload),

  update: (id: number, payload: PostWritePayload) =>
    api.put<PostDetail>(`/admin/posts/${id}`, payload),

  delete: (id: number) =>
    api.delete<void>(`/admin/posts/${id}`),

  publish: (id: number) =>
    api.patch<PostDetail>(`/admin/posts/${id}/publish`),

  unpublish: (id: number) =>
    api.patch<PostDetail>(`/admin/posts/${id}/unpublish`),

  uploadCover: (id: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.upload<PostDetail>(`/admin/posts/${id}/cover`, form)
  },

  deleteCover: (id: number) =>
    api.delete<PostDetail>(`/admin/posts/${id}/cover`),
}
