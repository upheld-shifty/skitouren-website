import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  authApi,
  clearAuth,
  getStoredToken,
  getStoredRole,
  getStoredUsername,
  saveAuth,
  type UserRole,
} from '../api/auth'

interface AuthState {
  token:    string | null
  role:     UserRole | null
  username: string | null
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean
  isAdmin:         boolean
  login:    (username: string, password: string) => Promise<UserRole>
  register: (username: string, password: string) => Promise<void>
  logout:   () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readInitialState(): AuthState {
  return {
    token:    getStoredToken(),
    role:     getStoredRole(),
    username: getStoredUsername(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readInitialState)

  async function login(username: string, password: string): Promise<UserRole> {
    const res = await authApi.login(username, password)
    saveAuth(res.token, res.role, username)
    setState({ token: res.token, role: res.role, username })
    return res.role
  }

  async function register(username: string, password: string): Promise<void> {
    const res = await authApi.register(username, password)
    saveAuth(res.token, res.role, username)
    setState({ token: res.token, role: res.role, username })
  }

  function logout() {
    clearAuth()
    setState({ token: null, role: null, username: null })
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      isAuthenticated: state.token !== null,
      isAdmin:         state.role === 'ADMIN',
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
