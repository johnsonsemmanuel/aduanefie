import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { hasAccess, type OSModuleId } from '@/config/permissions'

const pathToModule: Record<string, OSModuleId> = {
  '/dashboard': 'dashboard',
  '/marketplace': 'trade-engine',
  '/trade-desk': 'trade-engine',
  '/market-intel': 'market-intel',
  '/business': 'business',
  '/procurement': 'procurement',
  '/logistics': 'logistics',
  '/finance': 'finance',
  '/exports': 'export',
  '/cooperative': 'cooperative',
  '/ai': 'ai',
  '/developer': 'developer',
  '/admin': 'admin',
  '/profile': 'profile',
  '/more': 'profile',
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [searchParams] = useSearchParams()

  if (!isAuthenticated) {
    const currentPath = window.location.pathname
    const redirect = searchParams.get('redirect') || currentPath
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />
  }

  const requiredModule = pathToModule[window.location.pathname]
  if (requiredModule && user && !hasAccess(user.role, requiredModule)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
