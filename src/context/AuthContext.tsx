import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AppUserRole } from '@/types'

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
  login: (email: string) => AuthUser | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'aduanefie_user'

const demoUsers: AuthUser[] = [
  { id: 'u1', name: 'Emmanuel Johnson', email: 'emmanuel@aduanefie.com', role: 'admin' },
  { id: 'u2', name: 'Kwame Asante', email: 'kwame@asantefarms.com', role: 'farmer' },
  { id: 'u3', name: 'Ama Serwaa', email: 'ama@serwaaagro.com', role: 'buyer' },
  { id: 'u4', name: 'Yaw Mensah', email: 'yaw@mensahlogistics.com', role: 'logistics' },
  { id: 'u5', name: 'Nana Osei', email: 'nana@oseicommodities.com', role: 'supplier' },
  { id: 'u6', name: 'Esi Afriyie', email: 'esi@afriyieexports.com', role: 'viewer' },
  { id: 'u7', name: 'Kofi Boateng', email: 'kofi@boatengcoop.com', role: 'farmer' },
  { id: 'u8', name: 'Grace Asare', email: 'grace@aduanefie.com', role: 'supervisor' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { return JSON.parse(stored) as AuthUser } catch { return null }
    }
    return null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = (email: string): AuthUser | null => {
    const found = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (found) {
      setUser(found)
      return found
    }
    return null
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
