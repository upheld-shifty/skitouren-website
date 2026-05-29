import { api } from './client'

export type UserRole = 'ADMIN' | 'USER'

export interface AuthResponse {
  token:     string
  expiresAt: string
  role:      UserRole
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),

  register: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, password }),
}

// ── localStorage helpers ──────────────────────────────────────────────────

const KEYS = { token: 'auth_token', role: 'auth_role', username: 'auth_username' }

export function saveAuth(token: string, role: UserRole, username: string): void {
  localStorage.setItem(KEYS.token,    token)
  localStorage.setItem(KEYS.role,     role)
  localStorage.setItem(KEYS.username, username)
}

export function clearAuth(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}

export function getStoredToken():    string | null   { return localStorage.getItem(KEYS.token) }
export function getStoredRole():     UserRole | null { return localStorage.getItem(KEYS.role) as UserRole | null }
export function getStoredUsername(): string | null   { return localStorage.getItem(KEYS.username) }

// Keep old name so existing imports don't break (used in api/client.ts)
export const saveToken    = (t: string) => localStorage.setItem(KEYS.token, t)
export const clearToken   = clearAuth
export const getStoredToken2 = getStoredToken
