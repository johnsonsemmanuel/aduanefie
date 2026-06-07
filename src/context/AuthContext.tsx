import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { AppUserRole } from '@/types'
import { authApi } from '@/lib/api'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: AppUserRole
  avatar?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = 'aduanefie_token'
const USER_KEY = 'aduanefie_user'

function mapUser(u: { id: string; name: string; email: string; role: string; avatar?: string }): AuthUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role as AppUserRole, avatar: u.avatar }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try { return JSON.parse(stored) as AuthUser } catch { return null }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi.me()
      .then((u) => {
        const mapped = mapUser(u)
        setUser(mapped)
        localStorage.setItem(USER_KEY, JSON.stringify(mapped))
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  }, [user])

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const res = await authApi.login(email, password)
    localStorage.setItem(TOKEN_KEY, res.token)
    const mapped = mapUser(res.user)
    setUser(mapped)
    return mapped
  }, [])

  const register = useCallback(async (data: { name: string; email: string; password: string; role?: string }): Promise<AuthUser> => {
    const res = await authApi.register(data)
    localStorage.setItem(TOKEN_KEY, res.token)
    const mapped = mapUser(res.user)
    setUser(mapped)
    return mapped
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
