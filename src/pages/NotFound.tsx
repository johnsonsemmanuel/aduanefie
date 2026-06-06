import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-primary">404</span>
      </div>
      <h2 className="text-base font-bold text-text-primary mb-1">Page Not Found</h2>
      <p className="text-xs text-text-secondary mb-4 max-w-xs">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
    </div>
  )
}
